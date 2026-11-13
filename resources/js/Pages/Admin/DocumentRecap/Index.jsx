import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { EmptyState, Icon, PageHeader, PanelHeader, SearchField, StatCard, StatusBadge } from '@/Components/AdminUI';

// Dummy data rekapitulasi berdasarkan periode
const RECAP_DATA = {
  '30hari': {
    total: 248,
    valid: 232,
    revoked: 16,
    trend: [
      ['Minggu 1', 34],
      ['Minggu 2', 48],
      ['Minggu 3', 57],
      ['Minggu 4', 62],
      ['Minggu 5', 47],
    ],
    cats: [
      ['Laporan Statistik', 92],
      ['Data Sektoral', 68],
      ['Profil Wilayah', 51],
      ['Dokumen Lainnya', 37],
    ],
  },
  '3bulan': {
    total: 684,
    valid: 650,
    revoked: 34,
    trend: [
      ['Agu', 186],
      ['Sep', 224],
      ['Okt', 274],
    ],
    cats: [
      ['Laporan Statistik', 251],
      ['Data Sektoral', 187],
      ['Profil Wilayah', 142],
      ['Dokumen Lainnya', 104],
    ],
  },
  tahun: {
    total: 2480,
    valid: 2382,
    revoked: 98,
    trend: [
      ['Jun', 302],
      ['Jul', 344],
      ['Agu', 376],
      ['Sep', 402],
      ['Okt', 498],
      ['Nov', 558],
    ],
    cats: [
      ['Laporan Statistik', 912],
      ['Data Sektoral', 684],
      ['Profil Wilayah', 526],
      ['Dokumen Lainnya', 358],
    ],
  },
};

// Seed Log Aktivitas Dokumen
const INITIAL_LOGS = [
  { id: 1, code: 'DOC-2026-0148', document: 'Surat Keterangan Domisili', category: 'Surat Keterangan', actor: 'Ni Made Puspita', action: 'Dokumen ditandatangani', date: '28 Okt 2026, 09.42', status: 'Terverifikasi' },
  { id: 2, code: 'DOC-2026-0147', document: 'Surat Permohonan Informasi', category: 'Surat Permohonan', actor: 'I Putu Aditya', action: 'Dokumen diunggah', date: '28 Okt 2026, 09.15', status: 'Menunggu Verifikasi' },
  { id: 3, code: 'DOC-2026-0146', document: 'Surat Rekomendasi Usaha', category: 'Surat Rekomendasi', actor: 'Ni Luh Sari', action: 'Kategori diperbarui', date: '28 Okt 2026, 08.58', status: 'Valid' },
  { id: 4, code: 'DOC-2026-0145', document: 'Surat Pengantar RT/RW', category: 'Surat Pengantar', actor: 'I Made Wira', action: 'Dokumen diperiksa', date: '27 Okt 2026, 16.35', status: 'Menunggu Verifikasi' },
  { id: 5, code: 'DOC-2026-0144', document: 'Surat Keterangan Usaha', category: 'Surat Keterangan', actor: 'Ni Made Puspita', action: 'Dokumen diverifikasi', date: '27 Okt 2026, 15.20', status: 'Terverifikasi' },
  { id: 6, code: 'DOC-2026-0143', document: 'Surat Keterangan Tidak Mampu', category: 'Surat Keterangan', actor: 'I Kadek Mahendra', action: 'Dokumen diterbitkan', date: '27 Okt 2026, 13.04', status: 'Valid' },
  { id: 7, code: 'DOC-2026-0142', document: 'Surat Rekomendasi Kegiatan', category: 'Surat Rekomendasi', actor: 'Komang Pradnya', action: 'Dokumen dicabut', date: '27 Okt 2026, 11.45', status: 'Dicabut' },
  { id: 8, code: 'DOC-2026-0141', document: 'Laporan Rekapitulasi Data Sektoral', category: 'Data Sektoral', actor: 'I Putu Aditya', action: 'Dokumen diunggah', date: '26 Okt 2026, 14.10', status: 'Valid' },
  { id: 9, code: 'DOC-2026-0140', document: 'Surat Izin Penelitian Sektor TIK', category: 'Surat Permohonan', actor: 'Ni Made Puspita', action: 'Dokumen diverifikasi', date: '26 Okt 2026, 11.20', status: 'Terverifikasi' },
  { id: 10, code: 'DOC-2026-0139', document: 'Profil Wilayah Denpasar Barat', category: 'Profil Wilayah', actor: 'Ni Luh Sari', action: 'Dokumen diterbitkan', date: '25 Okt 2026, 16.45', status: 'Valid' },
  { id: 11, code: 'DOC-2026-0138', document: 'Surat Permohonan Walidata', category: 'Surat Permohonan', actor: 'I Made Wira', action: 'Dokumen diunggah', date: '25 Okt 2026, 10.30', status: 'Menunggu Verifikasi' },
  { id: 12, code: 'DOC-2026-0137', document: 'Berita Acara Statistik Sektoral', category: 'Data Sektoral', actor: 'I Putu Aditya', action: 'Dokumen dicabut', date: '24 Okt 2026, 09.15', status: 'Dicabut' },
];

export default function DocumentRecapIndex() {
  const { props } = usePage();
  const bidang =
    props.auth?.user?.bidang ||
    props.auth?.user?.division ||
    'Bidang Statistik';

  const [period, setPeriod] = useState('30hari');
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);

  // State Log Aktivitas, Search, Paginasi, & Refresh
  const [logs] = useState(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup toast otomatis setelah 4.5 detik (Kecuali tipe loading)
  useEffect(() => {
    if (!toast || toast.type === 'loading') return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const d = RECAP_DATA[period];
  const pct = (n) => `${((n / d.total) * 100).toFixed(1).replace('.', ',')}%`;
  const maxTrend = Math.max(...d.trend.map((x) => x[1]));
  const maxCat = Math.max(...d.cats.map((x) => x[1]));

  // Logika Filter & Paginasi Aktivitas
  const filteredLogs = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      if (!keyword) return true;
      return [log.code, log.document, log.category, log.actor, log.action]
        .some((val) => val.toLowerCase().includes(keyword));
    });
  }, [logs, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handler Refresh dengan Toast Konsisten
  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    setToast({
      id: Date.now(),
      type: 'loading',
      message: 'Sedang memuat ulang log aktivitas dokumen...',
    });

    setTimeout(() => {
      setIsRefreshing(false);
      setToast({
        id: Date.now(),
        type: 'success',
        message: 'Log aktivitas dokumen berhasil diperbarui.',
      });
    }, 600);
  };

  const handlePrint = () => {
    setToast({
      id: Date.now(),
      type: 'success',
      message: 'Pilih printer "Save as PDF" pada dialog cetak untuk menyimpan rekap.',
    });
    window.print();
  };

  const statusItems = [
    ['Valid', d.valid, 'bg-[#1E8E3E]', 'Dokumen sah dan terverifikasi.'],
    ['Dicabut', d.revoked, 'bg-[#D92020]', 'Dokumen dinyatakan tidak berlaku.'],
  ];

  return (
    <AdminLayout>
      <Head title="Rekapitulasi Dokumen - SIVALDEN" />

      {/* TOAST ALERT SYSTEM (SAMAKAN DENGAN SUPERADMIN USERS) */}
      {mounted && toast && createPortal(
        <>
          <style>{`
            @keyframes sivalden-toast-progress {
              from { width: 100%; }
              to { width: 0%; }
            }
            @keyframes sivalden-toast-loading {
              from { transform: translateX(-110%); }
              to { transform: translateX(280%); }
            }
          `}</style>

          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            className={`fixed left-1/2 top-4 z-[10000] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-lg border border-[#E5E7EB] border-l-4 bg-white shadow-md ${
              toast.type === 'error'
                ? 'border-l-[#D92020]'
                : toast.type === 'loading'
                  ? 'border-l-[#8B0F14]'
                  : 'border-l-[#1E8E3E]'
            }`}
          >
            <div className="flex items-center gap-2.5 px-3.5 py-3">
              <div className={`shrink-0 ${
                toast.type === 'error'
                  ? 'text-[#D92020]'
                  : toast.type === 'loading'
                    ? 'text-[#8B0F14]'
                    : 'text-[#1E8E3E]'
              }`}>
                {toast.type === 'loading' ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="9" strokeWidth="3" />
                    <path className="opacity-75" strokeLinecap="round" strokeWidth="3" d="M21 12a9 9 0 00-9-9" />
                  </svg>
                ) : toast.type === 'error' ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="min-w-0 flex-1 text-sm leading-snug text-[#262626]">
                <span className="mr-1.5 font-semibold">
                  {toast.type === 'error'
                    ? 'Gagal.'
                    : toast.type === 'loading'
                      ? 'Memproses.'
                      : 'Berhasil.'}
                </span>
                <span className="break-words text-[#525252]">{toast.message}</span>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Tutup notifikasi"
                className="shrink-0 rounded p-1 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#262626]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-0.5 w-full overflow-hidden bg-[#F3F4F6]">
              {toast.type === 'loading' ? (
                <div
                  className="h-full w-2/5 bg-[#8B0F14]"
                  style={{ animation: 'sivalden-toast-loading 1.2s ease-in-out infinite' }}
                />
              ) : (
                <div
                  className={`h-full ${toast.type === 'error' ? 'bg-[#D92020]' : 'bg-[#1E8E3E]'}`}
                  style={{ animation: 'sivalden-toast-progress 4500ms linear forwards' }}
                />
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Header */}
      <PageHeader
        title="Rekapitulasi Dokumen"
        description={`Ringkasan rekapitulasi dan log aktivitas dokumen yang dikelola ${bidang}.`}
        action={
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#8B0F14] bg-white px-5 py-2.5 text-xs font-semibold text-[#8B0F14] hover:bg-[#FCEBEC] sm:w-auto"
          >
            <Icon name="download" size={15} />
            Cetak Rekap
          </button>
        }
      />

      {/* Filter Periode */}
      <section className="mb-5 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-[#262626]">Periode Rekapitulasi</p>
          <p className="mt-1 text-[10px] text-[#7F8C8D]">
            Pilih rentang waktu untuk melihat ringkasan rekapitulasi.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <span className="text-[#7F8C8D]">Periode</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="min-w-[170px] rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#262626] outline-none focus:border-[#8B0F14]"
          >
            <option value="30hari">30 Hari Terakhir</option>
            <option value="3bulan">3 Bulan Terakhir</option>
            <option value="tahun">Tahun 2026</option>
          </select>
        </label>
      </section>

      {/* Metric Cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="Total Dokumen"
          value={d.total.toLocaleString('id-ID')}
          detail="Dokumen pada periode"
          icon="document"
          tone="maroon"
        />
        <StatCard
          label="Dokumen Valid"
          value={d.valid.toLocaleString('id-ID')}
          detail={`${pct(d.valid)} dari total`}
          icon="check"
          tone="green"
        />
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Dokumen Dicabut"
            value={d.revoked.toLocaleString('id-ID')}
            detail={`${pct(d.revoked)} dari total`}
            icon="shield"
            tone="red"
          />
        </div>
      </section>

      {/* 1 BARIS GRID: TREN DOKUMEN, KOMPOSISI STATUS, REKAP PER KATEGORI */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 1. Bar Chart Tren */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <PanelHeader
            title="Tren Dokumen"
            subtitle="Jumlah dokumen masuk pada rentang waktu."
          />
          <div className="mt-6 flex h-44 items-end gap-2 border-b border-l border-[#E5E7EB] px-2 pb-2 pl-3">
            {d.trend.map(([label, value]) => (
              <div
                key={label}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span className="text-[9px] font-semibold text-[#525252]">
                  {value}
                </span>
                <div
                  className="flex w-full max-w-10 items-end"
                  style={{ height: `${Math.max((value / maxTrend) * 78, 5)}%` }}
                >
                  <div className="h-full w-full rounded-t-md bg-[#8B0F14]" />
                </div>
                <span className="truncate text-center text-[9px] text-[#7F8C8D]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Breakdown Status */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <div>
            <PanelHeader
              title="Komposisi Status"
              subtitle="Perbandingan status dokumen pada periode."
            />

            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-[#F5F5F5]">
              <div
                className="bg-[#1E8E3E]"
                style={{ width: `${pct(d.valid)}` }}
              />
              <div
                className="bg-[#D92020]"
                style={{ width: `${pct(d.revoked)}` }}
              />
            </div>

            <div className="mt-5 space-y-4">
              {statusItems.map(([label, value, color, desc]) => (
                <div key={label}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#262626]">
                      <i className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      {label}
                    </span>
                    <b className="text-xs text-[#262626]">
                      {value.toLocaleString('id-ID')}{' '}
                      <span className="font-normal text-[#7F8C8D]">
                        ({pct(value)})
                      </span>
                    </b>
                  </div>
                  <p className="ml-4 mt-1 text-[10px] text-[#7F8C8D]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Progress per Kategori */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <div>
            <PanelHeader
              title="Rekap Kategori"
              subtitle="Jumlah dokumen berdasarkan kelompok."
            />
            <div className="mt-5 space-y-3.5">
              {d.cats.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="truncate text-xs text-[#525252]">{label}</span>
                    <b className="text-xs text-[#262626]">{value.toLocaleString('id-ID')}</b>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F1F2F3]">
                    <div
                      className="h-full rounded-full bg-[#8B0F14]"
                      style={{ width: `${(value / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOG AKTIVITAS DOKUMEN DENGAN REFRESH & PAGINASI */}
      <section className="mt-6 min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {/* HEADER TABEL: SEARCH & REFRESH BUTTON */}
        <div className="flex flex-col gap-3 p-4 border-b border-[#E5E7EB] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <PanelHeader
            title="Aktivitas Dokumen Terbaru"
            subtitle="Jejak aktivitas dokumen terkini dalam sistem."
          />
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari aktivitas..."
              />
            </div>
            <button
              type="button"
              onClick={handleRefreshLogs}
              disabled={isRefreshing}
              title="Refresh Log Aktivitas"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#7F8C8D] shadow-sm transition hover:bg-[#F5F5F5] hover:text-[#262626] disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#8B0F14]' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="divide-y divide-[#E5E7EB] md:hidden">
          {paginatedLogs.length ? (
            paginatedLogs.map((log) => (
              <article key={log.id} className="space-y-2.5 p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]">
                    <Icon name="document" size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-xs font-bold text-[#262626]">{log.document}</p>
                    <p className="mt-0.5 break-all font-mono text-[10px] text-[#7F8C8D]">{log.code}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F1F2] pt-2">
                  <span className="text-[11px] font-semibold text-[#525252]">{log.action}</span>
                  <StatusBadge status={log.status} />
                </div>
                <p className="text-[10px] text-[#9CA3AF]">
                  {log.actor} · {log.date}
                </p>
              </article>
            ))
          ) : (
            <EmptyState title="Aktivitas tidak ditemukan" />
          )}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-[#F9FAFB] font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]">
              <tr>
                <th className="px-5 py-3">Dokumen</th>
                <th className="px-5 py-3">Aktivitas</th>
                <th className="px-5 py-3">Pelaksana</th>
                <th className="px-5 py-3">Waktu</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedLogs.length ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="transition hover:bg-[#FCEBEC]/20">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-[#262626]">{log.document}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-[#7F8C8D]">
                        {log.code} · {log.category}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-[#525252]">{log.action}</td>
                    <td className="px-5 py-3.5 text-[#525252]">{log.actor}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[10px] text-[#7F8C8D]">
                      {log.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={log.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="Aktivitas tidak ditemukan" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* NAVIGASI PAGINASI (PAGES) */}
        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-[#7F8C8D]">
            Menampilkan{' '}
            <span className="font-semibold text-[#262626]">{filteredLogs.length === 0 ? 0 : startIndex + 1}</span>{' '}
            hingga{' '}
            <span className="font-semibold text-[#262626]">{Math.min(startIndex + itemsPerPage, filteredLogs.length)}</span>{' '}
            dari <span className="font-semibold text-[#262626]">{filteredLogs.length}</span> aktivitas
          </p>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:justify-end">
              <span className="px-1 text-xs text-[#7F8C8D] sm:hidden">Halaman {currentPage} / {totalPages}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`hidden h-8 min-w-[32px] rounded-lg text-xs font-semibold transition sm:inline-flex sm:items-center sm:justify-center ${
                    currentPage === page
                      ? 'bg-[#8B0F14] text-white shadow-sm'
                      : 'border border-[#E5E7EB] bg-white text-[#262626] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Info / Disclaimer */}
      <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[10px] leading-5 text-[#7F8C8D]">
        <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-[#8B0F14]" />
        <p>
          Angka dan riwayat pada halaman ini merupakan data demonstrasi. Integrasi backend
          harus menghitung rekap berdasarkan dokumen milik bidang yang sedang terhubung.
        </p>
      </div>
    </AdminLayout>
  );
}