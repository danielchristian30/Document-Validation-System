import React, { useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  EmptyState,
  Icon,
  PageHeader,
  PanelHeader,
  SearchField,
  StatCard,
  StatusBadge,
} from '@/Components/AdminUI';

// Seed Data Dokumen Demo
function seedDocs(bidang) {
  return [
    {
      id: 1,
      code: 'DOC-2026-0218',
      name: 'Laporan Statistik Kependudukan Triwulan III',
      category: 'Laporan Statistik',
      owner: 'Ni Made Puspita',
      date: '5 Nov 2026',
      status: 'Valid',
      reason: '',
      bidang,
    },
    {
      id: 2,
      code: 'DOC-2026-0217',
      name: 'Data Perkembangan Ekonomi Daerah',
      category: 'Data Sektoral',
      owner: 'I Putu Aditya',
      date: '4 Nov 2026',
      status: 'Terverifikasi',
      reason: '',
      bidang,
    },
    {
      id: 3,
      code: 'DOC-2026-0216',
      name: 'Laporan Indikator Pembangunan',
      category: 'Laporan Statistik',
      owner: 'Ni Luh Sari',
      date: '3 Nov 2026',
      status: 'Dicabut',
      reason: 'Data pendukung perlu dikoreksi.',
      bidang,
    },
    {
      id: 4,
      code: 'DOC-2026-0215',
      name: 'Rekapitulasi Data Sektoral',
      category: 'Data Sektoral',
      owner: 'I Made Wira',
      date: '2 Nov 2026',
      status: 'Menunggu Verifikasi',
      reason: '',
      bidang,
    },
    {
      id: 5,
      code: 'DOC-2026-0214',
      name: 'Profil Statistik Wilayah',
      category: 'Profil Wilayah',
      owner: 'Komang Pradnya',
      date: '1 Nov 2026',
      status: 'Valid',
      reason: '',
      bidang,
    },
  ];
}

export default function DocumentRevokeIndex() {
  const { props } = usePage();
  const bidang =
    props.auth?.user?.bidang ||
    props.auth?.user?.division ||
    'Bidang Statistik';

  // State
  const [docs, setDocs] = useState(() => seedDocs(bidang));
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Semua');
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');

  // Perhitungan Statistik
  const valid = docs.filter((d) => ['Valid', 'Terverifikasi'].includes(d.status)).length;
  const revoked = docs.filter((d) => d.status === 'Dicabut').length;
  const pending = docs.filter((d) => d.status === 'Menunggu Verifikasi').length;

  // Logika Filter Dokumen
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return docs.filter((d) => {
      const matchStatus = status === 'Semua' || d.status === status;
      const matchSearch = [d.code, d.name, d.category, d.owner].some((val) =>
        val.toLowerCase().includes(keyword)
      );
      return matchStatus && matchSearch;
    });
  }, [docs, status, query]);

  // Handler Konfirmasi Revoke
  const handleConfirmRevoke = (e) => {
    e.preventDefault();
    if (!selected || reason.trim().length < 5) return;

    setDocs((old) =>
      old.map((d) =>
        d.id === selected.id
          ? { ...d, status: 'Dicabut', reason: reason.trim() }
          : d
      )
    );

    setSelected(null);
    setReason('');
    setNotice(
      'Dokumen ditandai Dicabut pada tampilan demo. Perubahan belum tersimpan ke server.'
    );
  };

  return (
    <AdminLayout>
      <Head title="Revoke Dokumen - SIVALDEN" />

      {/* Page Header */}
      <PageHeader
        title="Revoke Dokumen"
        description={`Tinjau dan cabut dokumen yang diterbitkan oleh pegawai ${bidang}. Setiap pencabutan wajib memiliki alasan yang jelas.`}
      />

      {/* Notice Banner */}
      {notice && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-lg border border-[#E7C4C7] bg-white px-4 py-3 text-xs text-[#525252]"
        >
          <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-[#8B0F14]" />
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="text-[#7F8C8D] hover:text-[#262626]"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Dokumen Sah"
          value={valid}
          detail="Valid atau terverifikasi"
          icon="check"
          tone="green"
        />
        <StatCard
          label="Dokumen Dicabut"
          value={revoked}
          detail="Tidak lagi berlaku"
          icon="shield"
          tone="red"
        />
        <div className="col-span-2 sm:col-span-1">
          <StatCard
            label="Menunggu Verifikasi"
            value={pending}
            detail="Belum dapat dicabut"
            icon="clock"
            tone="amber"
          />
        </div>
      </section>

      {/* Main Container */}
      <section className="mt-6 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {/* Header Panel & Filter */}
        <div className="space-y-4 p-4 sm:p-5">
          <PanelHeader
            title="Daftar Dokumen"
            subtitle={`Ruang lingkup: ${bidang}. Revoke tersedia untuk dokumen berstatus Valid atau Terverifikasi.`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Cari nama dokumen, kode, atau pegawai..."
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#262626] outline-none focus:border-[#8B0F14]"
            >
              <option value="Semua">Semua</option>
              <option value="Valid">Valid</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Dicabut">Dicabut</option>
            </select>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="divide-y divide-[#E5E7EB] md:hidden">
          {filtered.length ? (
            filtered.map((d) => (
              <article key={d.id} className="space-y-3 p-4">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]">
                    <Icon name="document" size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-bold text-[#262626]">{d.name}</p>
                    <p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">{d.code}</p>
                    <p className="mt-1 text-[10px] text-[#7F8C8D]">
                      {d.category} · {d.owner}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={d.status} />
                  <span className="text-[10px] text-[#9CA3AF]">{d.date}</span>
                </div>

                {d.reason && (
                  <p className="rounded-lg bg-[#FDECEC]/60 p-2.5 text-[11px] text-[#8F2020]">
                    Alasan: {d.reason}
                  </p>
                )}

                {['Valid', 'Terverifikasi'].includes(d.status) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(d);
                      setReason('');
                    }}
                    className="w-full rounded-lg border border-[#D92020]/30 px-3 py-2.5 text-xs font-semibold text-[#D92020] transition hover:bg-[#FDECEC]"
                  >
                    Revoke Dokumen
                  </button>
                )}
              </article>
            ))
          ) : (
            <EmptyState title="Dokumen tidak ditemukan" />
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]">
              <tr>
                <th className="px-5 py-3.5">Dokumen</th>
                <th className="px-5 py-3.5">Pemilik</th>
                <th className="px-5 py-3.5">Tanggal Terbit</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.length ? (
                filtered.map((d) => (
                  <tr key={d.id} className="transition hover:bg-[#FCEBEC]/20">
                    <td className="px-5 py-4">
                      <b className="text-[#262626]">{d.name}</b>
                      <p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">
                        {d.code} · {d.category}
                      </p>
                      {d.reason && (
                        <p className="mt-1 text-[10px] text-[#D92020]">
                          Alasan: {d.reason}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#525252]">{d.owner}</td>
                    <td className="px-5 py-4 text-[10px] text-[#7F8C8D]">{d.date}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {['Valid', 'Terverifikasi'].includes(d.status) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(d);
                            setReason('');
                          }}
                          className="rounded-lg border border-[#D92020]/30 px-3 py-2 text-[10px] font-semibold text-[#D92020] transition hover:bg-[#FDECEC]"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#9CA3AF]">
                          Tidak tersedia
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="Dokumen tidak ditemukan" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="border-t border-[#E5E7EB] px-4 py-3 text-[10px] text-[#7F8C8D]">
          Menampilkan {filtered.length} dari {docs.length} dokumen · Data demonstrasi
        </div>
      </section>

      {/* Modal Konfirmasi Revoke */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <form
            onSubmit={handleConfirmRevoke}
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            {/* Modal Header */}
            <div className="flex items-start gap-3 border-b border-[#E5E7EB] pb-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#D92020]">
                <Icon name="shield" size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-montserrat text-lg font-bold text-[#262626]">
                  Konfirmasi Revoke
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#7F8C8D]">
                  Dokumen akan ditandai tidak berlaku pada daftar ini.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-[#7F8C8D] hover:text-[#262626]"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            {/* Document Details Card */}
            <div className="mt-4 rounded-lg bg-[#F9FAFB] p-3.5">
              <p className="text-sm font-bold text-[#262626]">{selected.name}</p>
              <p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">
                {selected.code}
              </p>
            </div>

            {/* Reason Form Field */}
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold text-[#262626]">
                Alasan pencabutan <span className="text-[#D92020]">*</span>
              </span>
              <textarea
                required
                minLength={5}
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan alasan dokumen perlu dicabut..."
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs text-[#262626] outline-none transition focus:border-[#8B0F14]"
              />
            </label>

            <p className="mt-2 text-[10px] text-[#7F8C8D]">
              Tindakan ini hanya mengubah state browser, belum tersimpan ke server.
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-xs font-semibold text-[#262626] transition hover:bg-[#F5F5F5]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#D92020] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#B51A1A]"
              >
                Konfirmasi Revoke
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}