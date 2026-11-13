import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  EmptyState,
  Icon,
  PageHeader,
  PanelHeader,
  SearchField,
  StatusBadge,
} from '@/Components/AdminUI';
import CreateEditModal from './CreateEdit';

// Seed Kategori Dokumen Demo
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Laporan Statistik Sektoral', description: 'Dokumen rekapitulasi data statistik tingkat dinas & kota.', total_documents: 92, is_active: true, created_at: '2026-01-15' },
  { id: 2, name: 'Data Sektoral Kominfo', description: 'Surat dan laporan sektoral bidang teknologi & informasi.', total_documents: 68, is_active: true, created_at: '2026-02-01' },
  { id: 3, name: 'Profil Wilayah & Demografi', description: 'Profil kecamatan, kelurahan, dan agregat kependudukan.', total_documents: 51, is_active: true, created_at: '2026-02-10' },
  { id: 4, name: 'Surat Rekomendasi TIK', description: 'Rekomendasi teknis infrastruktur perangkat daerah.', total_documents: 37, is_active: true, created_at: '2026-03-05' },
  { id: 5, name: 'Surat Keterangan Domisili Usaha', description: 'Berkas permohonan keterangan lokasi & izin operasional.', total_documents: 14, is_active: false, created_at: '2026-03-20' },
  { id: 6, name: 'Berita Acara Walidata', description: 'Dokumen serah terima data statistik antar-bidang.', total_documents: 28, is_active: true, created_at: '2026-04-12' },
  { id: 7, name: 'Dokumen Perizinan Media', description: 'Kategori perizinan publikasi & liputan media daerah.', total_documents: 9, is_active: false, created_at: '2026-05-02' },
];

// Seed Dokumen untuk Fitur Revoke & Kelola Status Dokumen
function seedDocs(bidang) {
  return [
    { id: 1, name: 'Laporan Statistik Kependudukan Triwulan III', category: 'Laporan Statistik Sektoral', owner: 'Ni Made Puspita', date: '5 Nov 2026', status: 'Valid', reason: '', bidang },
    { id: 2, name: 'Data Perkembangan Ekonomi Daerah', category: 'Data Sektoral Kominfo', owner: 'I Putu Aditya', date: '4 Nov 2026', status: 'Terverifikasi', reason: '', bidang },
    { id: 3, name: 'Laporan Indikator Pembangunan', category: 'Laporan Statistik Sektoral', owner: 'Ni Luh Sari', date: '3 Nov 2026', status: 'Dicabut', reason: 'Data pendukung perlu dikoreksi.', bidang },
    { id: 4, name: 'Rekapitulasi Data Sektoral', category: 'Data Sektoral Kominfo', owner: 'I Made Wira', date: '2 Nov 2026', status: 'Menunggu Verifikasi', reason: '', bidang },
    { id: 5, name: 'Profil Statistik Wilayah', category: 'Profil Wilayah & Demografi', owner: 'Komang Pradnya', date: '1 Nov 2026', status: 'Valid', reason: '', bidang },
  ];
}

function ThreeDotsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  );
}

function StatCard({ label, value, detail, icon, tone = 'maroon' }) {
  const iconTone = {
    maroon: 'bg-[#FCEBEC] text-[#8B0F14]',
    green: 'bg-[#EAF6EE] text-[#1E8E3E]',
    red: 'bg-[#FDECEC] text-[#D92020]',
    gold: 'bg-[#FEF6E7] text-[#D97706]',
    amber: 'bg-[#FEF6E7] text-[#D97706]',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">{label}</p>
        <span className={`shrink-0 rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-110 ${iconTone[tone] || iconTone.maroon}`}>
          <Icon name={icon} size={19} />
        </span>
      </div>
      <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-[#7F8C8D]">{detail}</p>
    </div>
  );
}

function ActionButton({ category, onClick }) {
  return (
    <button
      type="button"
      aria-label={`Aksi untuk ${category.name}`}
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
    >
      <ThreeDotsIcon />
    </button>
  );
}

export default function DocumentManagementIndex() {
  const { props } = usePage();
  const bidang = props.auth?.user?.bidang || props.auth?.user?.division || 'Bidang Statistik';

  // State Halaman Utama (Main Tab: 'categories' | 'documents')
  const [mainTab, setMainTab] = useState('categories');

  // State Data Kategori
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [catActiveTab, setCatActiveTab] = useState('all'); // all | active | inactive
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [catCurrentPage, setCatCurrentPage] = useState(1);

  // State Data Dokumen (Revoke / Status)
  const [docs, setDocs] = useState(() => seedDocs(bidang));
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docStatusFilter, setDocStatusFilter] = useState('Semua');
  const [docCurrentPage, setDocCurrentPage] = useState(1);
  const [selectedRevokeDoc, setSelectedRevokeDoc] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');

  // State Dropdown Aksi Titik Tiga
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Toast & Modal State
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!toast || toast.type === 'loading') return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handleScroll = () => setActiveDropdown(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const closeDropdown = () => setActiveDropdown(null);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();

    if (activeDropdown === id) {
      closeDropdown();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: Math.min(rect.bottom + 4, Math.max(12, window.innerHeight - 130)),
      left: Math.min(Math.max(16, rect.right - 192), Math.max(16, window.innerWidth - 208)),
    });
    setActiveDropdown(id);
  };

  // --- LOGIKA FILTER & PAGINASI KATEGORI ---
  const filteredCategories = useMemo(() => {
    const keyword = catSearchQuery.trim().toLowerCase();
    return categories.filter((cat) => {
      if (catActiveTab === 'active' && !cat.is_active) return false;
      if (catActiveTab === 'inactive' && cat.is_active) return false;
      if (!keyword) return true;
      return (
        cat.name.toLowerCase().includes(keyword) ||
        (cat.description && cat.description.toLowerCase().includes(keyword))
      );
    });
  }, [categories, catActiveTab, catSearchQuery]);

  const catTotalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const catStartIndex = (catCurrentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(catStartIndex, catStartIndex + itemsPerPage);

  useEffect(() => {
    setCatCurrentPage(1);
  }, [catSearchQuery, catActiveTab]);

  // --- LOGIKA FILTER & PAGINASI DOKUMEN ---
  const filteredDocs = useMemo(() => {
    const keyword = docSearchQuery.trim().toLowerCase();
    return docs.filter((d) => {
      const matchStatus = docStatusFilter === 'Semua' || d.status === docStatusFilter;
      const matchSearch = [d.name, d.category, d.owner].some((val) =>
        val.toLowerCase().includes(keyword)
      );
      return matchStatus && matchSearch;
    });
  }, [docs, docStatusFilter, docSearchQuery]);

  const docTotalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
  const docStartIndex = (docCurrentPage - 1) * itemsPerPage;
  const paginatedDocs = filteredDocs.slice(docStartIndex, docStartIndex + itemsPerPage);

  useEffect(() => {
    setDocCurrentPage(1);
  }, [docSearchQuery, docStatusFilter]);

  // --- METRIK / CARDS ---
  const catStats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.is_active).length;
    const totalDocs = categories.reduce((acc, curr) => acc + curr.total_documents, 0);
    return { total, active, totalDocs };
  }, [categories]);

  const docStats = useMemo(() => {
    const valid = docs.filter((d) => ['Valid', 'Terverifikasi'].includes(d.status)).length;
    const revoked = docs.filter((d) => d.status === 'Dicabut').length;
    const pending = docs.filter((d) => d.status === 'Menunggu Verifikasi').length;
    return { valid, revoked, pending, total: docs.length };
  }, [docs]);

  // --- HANDLERS KATEGORI ---
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
    closeDropdown();
  };

  const handleEditCategory = (cat) => {
    setSelectedCategory(cat);
    setShowCategoryModal(true);
    closeDropdown();
  };

  const handleToggleCategoryStatus = (cat) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === cat.id ? { ...item, is_active: !item.is_active } : item))
    );
    setToast({
      id: Date.now(),
      type: 'success',
      message: `Status kategori "${cat.name}" diubah menjadi ${!cat.is_active ? 'Aktif' : 'Nonaktif'}.`,
    });
    closeDropdown();
  };

  const handleSaveCategory = (formData) => {
    if (selectedCategory) {
      setCategories((prev) =>
        prev.map((item) => (item.id === selectedCategory.id ? { ...item, ...formData } : item))
      );
      setToast({ id: Date.now(), type: 'success', message: `Kategori "${formData.name}" berhasil diperbarui.` });
    } else {
      const newCat = {
        id: Date.now(),
        ...formData,
        total_documents: 0,
        created_at: new Date().toISOString().split('T')[0],
      };
      setCategories((prev) => [newCat, ...prev]);
      setToast({ id: Date.now(), type: 'success', message: `Kategori baru "${formData.name}" berhasil ditambahkan.` });
    }
  };

  // --- HANDLER REVOKE DOKUMEN ---
  const handleConfirmRevoke = (e) => {
    e.preventDefault();
    if (!selectedRevokeDoc || revokeReason.trim().length < 5) return;

    setDocs((old) =>
      old.map((d) =>
        d.id === selectedRevokeDoc.id
          ? { ...d, status: 'Dicabut', reason: revokeReason.trim() }
          : d
      )
    );

    setToast({
      id: Date.now(),
      type: 'success',
      message: `Dokumen "${selectedRevokeDoc.name}" berhasil dicabut (status: Dicabut).`,
    });

    setSelectedRevokeDoc(null);
    setRevokeReason('');
  };

  return (
    <AdminLayout>
      <Head title="Manajemen Dokumen - SIVALDEN" />

      <div onClick={closeDropdown} className="min-h-full w-full min-w-0">
        {/* TOAST NOTIFICATION SYSTEM (PORTAL) */}
        {mounted && toast && createPortal(
          <>
            <style>{`
              @keyframes sivalden-toast-progress { from { width: 100%; } to { width: 0%; } }
              @keyframes sivalden-toast-loading { from { transform: translateX(-110%); } to { transform: translateX(280%); } }
            `}</style>
            <div
              key={toast.id}
              className={`fixed left-1/2 top-4 z-[10000] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-lg border border-[#E5E7EB] border-l-4 bg-white shadow-md ${
                toast.type === 'error' ? 'border-l-[#D92020]' : toast.type === 'loading' ? 'border-l-[#8B0F14]' : 'border-l-[#1E8E3E]'
              }`}
            >
              <div className="flex items-center gap-2.5 px-3.5 py-3">
                <div className={`shrink-0 ${toast.type === 'error' ? 'text-[#D92020]' : toast.type === 'loading' ? 'text-[#8B0F14]' : 'text-[#1E8E3E]'}`}>
                  {toast.type === 'loading' ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="9" strokeWidth="3" />
                      <path className="opacity-75" strokeLinecap="round" strokeWidth="3" d="M21 12a9 9 0 00-9-9" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1 text-sm leading-snug text-[#262626]">
                  <span className="mr-1.5 font-semibold">{toast.type === 'loading' ? 'Memproses.' : 'Berhasil.'}</span>
                  <span className="break-words text-[#525252]">{toast.message}</span>
                </div>
                <button type="button" onClick={() => setToast(null)} className="shrink-0 rounded p-1 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#262626]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-0.5 w-full overflow-hidden bg-[#F3F4F6]">
                {toast.type === 'loading' ? (
                  <div className="h-full w-2/5 bg-[#8B0F14]" style={{ animation: 'sivalden-toast-loading 1.2s ease-in-out infinite' }} />
                ) : (
                  <div className={`h-full ${toast.type === 'error' ? 'bg-[#D92020]' : 'bg-[#1E8E3E]'}`} style={{ animation: 'sivalden-toast-progress 4500ms linear forwards' }} />
                )}
              </div>
            </div>
          </>,
          document.body
        )}

        {/* HEADER PAGE */}
        <PageHeader
          title="Manajemen Dokumen & Kategori"
          description={`Kelola kelompok kategori, syarat verifikasi, serta peninjauan & pencabutan status dokumen pada ${bidang}.`}
        />

        {/* TAB SWITCHER DUA MODUL (MINIMALISIR SCROLL & MENINGKATKAN UX) */}
        <div className="mb-5 flex border-b border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => {
              setMainTab('categories');
              closeDropdown();
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
              mainTab === 'categories'
                ? 'border-[#8B0F14] text-[#8B0F14]'
                : 'border-transparent text-[#7F8C8D] hover:text-[#262626]'
            }`}
          >
            <Icon name="document" size={16} />
            Kategori Dokumen ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setMainTab('documents');
              closeDropdown();
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
              mainTab === 'documents'
                ? 'border-[#8B0F14] text-[#8B0F14]'
                : 'border-transparent text-[#7F8C8D] hover:text-[#262626]'
            }`}
          >
            <Icon name="shield" size={16} />
            Cabut Dokumen ({docs.length})
          </button>
        </div>

        {/* STATISTIK CARDS DINAMIS SESUAI TAB AKTIF */}
        {mainTab === 'categories' ? (
          <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            <StatCard
              label="Total Kategori"
              value={catStats.total.toLocaleString('id-ID')}
              detail="Kelompok dokumen"
              icon="document"
              tone="maroon"
            />
            <StatCard
              label="Kategori Aktif"
              value={catStats.active.toLocaleString('id-ID')}
              detail="Dapat digunakan"
              icon="check"
              tone="green"
            />
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                label="Dokumen Terkait"
                value={catStats.totalDocs.toLocaleString('id-ID')}
                detail="Dokumen terbit"
                icon="document"
                tone="gold"
              />
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            <StatCard
              label="Dokumen Sah"
              value={docStats.valid}
              detail="Valid atau terverifikasi"
              icon="check"
              tone="green"
            />
            <StatCard
              label="Dokumen Dicabut"
              value={docStats.revoked}
              detail="Tidak lagi berlaku"
              icon="shield"
              tone="red"
            />
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                label="Menunggu Verifikasi"
                value={docStats.pending}
                detail="Belum dapat dicabut"
                icon="clock"
                tone="amber"
              />
            </div>
          </section>
        )}

        {/* CONTAINER TABEL KATEGORI */}
        {mainTab === 'categories' && (
          <section className="mt-6 min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            {/* TOOLBAR: TAB FILTER, SEARCH, & TOMBOL TAMBAH KATEGORI */}
            <div className="flex min-w-0 flex-col gap-4 border-b border-[#E5E7EB] p-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
              {/* SISI KIRI: TAB FILTER STATUS */}
              <div className="flex items-center gap-1.5 rounded-lg bg-[#F5F5F5] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCatActiveTab('all')}
                  className={`rounded-md px-3 py-1.5 font-bold transition ${catActiveTab === 'all' ? 'bg-white text-[#8B0F14] shadow-sm' : 'text-[#7F8C8D] hover:text-[#262626]'}`}
                >
                  Semua ({categories.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCatActiveTab('active')}
                  className={`rounded-md px-3 py-1.5 font-bold transition ${catActiveTab === 'active' ? 'bg-white text-[#1E8E3E] shadow-sm' : 'text-[#7F8C8D] hover:text-[#262626]'}`}
                >
                  Aktif ({catStats.active})
                </button>
                <button
                  type="button"
                  onClick={() => setCatActiveTab('inactive')}
                  className={`rounded-md px-3 py-1.5 font-bold transition ${catActiveTab === 'inactive' ? 'bg-white text-[#D92020] shadow-sm' : 'text-[#7F8C8D] hover:text-[#262626]'}`}
                >
                  Nonaktif ({categories.length - catStats.active})
                </button>
              </div>

              {/* SISI KANAN: SEARCH BAR & TOMBOL TAMBAH KATEGORI BARU */}
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <div className="w-full min-w-0 sm:w-64">
                    <SearchField value={catSearchQuery} onChange={setCatSearchQuery} placeholder="Cari nama / deskripsi..." />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 sm:w-auto"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Kategori Baru
                </button>
              </div>
            </div>

            {/* MOBILE VIEW KATEGORI */}
            <div className="divide-y divide-[#E5E7EB] md:hidden">
              {paginatedCategories.length ? (
                paginatedCategories.map((cat) => (
                  <article key={cat.id} className="space-y-3 p-4">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="mt-1 font-montserrat text-xs font-bold text-[#262626] break-words">{cat.name}</h4>
                      </div>
                      <ActionButton
                        category={cat}
                        onClick={(event) => toggleDropdown(cat.id, event)}
                      />
                    </div>
                    <p className="text-[11px] text-[#525252] leading-relaxed">{cat.description || '-'}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F1F2] pt-2 text-[10px]">
                      <span className="text-[#7F8C8D]">Dokumen Terkait: <b className="text-[#262626]">{cat.total_documents}</b></span>
                      <span className={`font-semibold ${cat.is_active ? 'text-[#1E8E3E]' : 'text-[#D92020]'}`}>
                        {cat.is_active ? '● Aktif' : '● Nonaktif'}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState title="Kategori dokumen tidak ditemukan" />
              )}
            </div>

            {/* DESKTOP TABLE KATEGORI */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[780px] text-left text-xs">
                <thead className="bg-[#F9FAFB] font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]">
                  <tr>
                    <th className="px-5 py-3.5">Kategori</th>
                    <th className="px-5 py-3.5">Deskripsi</th>
                    <th className="px-5 py-3.5">Dokumen Terkait</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {paginatedCategories.length ? (
                    paginatedCategories.map((cat) => (
                      <tr key={cat.id} className="transition hover:bg-[#FCEBEC]/20">
                        <td className="px-5 py-4">
                          <p className="mt-1 font-semibold text-[#262626]">{cat.name}</p>
                        </td>
                        <td className="px-5 py-4 text-[#525252] max-w-xs leading-relaxed">
                          {cat.description || '-'}
                        </td>
                        <td className="px-5 py-4">
                          <b className="text-[#262626] font-mono">{cat.total_documents}</b>{' '}
                          <span className="text-[10px] text-[#7F8C8D]">berkas</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            cat.is_active ? 'bg-[#1E8E3E]/10 text-[#1E8E3E]' : 'bg-[#D92020]/10 text-[#D92020]'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cat.is_active ? 'bg-[#1E8E3E]' : 'bg-[#D92020]'}`} />
                            {cat.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end">
                            <ActionButton
                              category={cat}
                              onClick={(event) => toggleDropdown(cat.id, event)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState title="Kategori dokumen tidak ditemukan" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINASI KATEGORI */}
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-[#7F8C8D]">
                Menampilkan <span className="font-semibold text-[#262626]">{filteredCategories.length === 0 ? 0 : catStartIndex + 1}</span> hingga{' '}
                <span className="font-semibold text-[#262626]">{Math.min(catStartIndex + itemsPerPage, filteredCategories.length)}</span> dari{' '}
                <span className="font-semibold text-[#262626]">{filteredCategories.length}</span> kategori
              </p>

              {catTotalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setCatCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={catCurrentPage === 1}
                    className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>

                  {Array.from({ length: catTotalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCatCurrentPage(page)}
                      className={`hidden h-8 min-w-[32px] rounded-lg text-xs font-semibold transition sm:inline-flex sm:items-center sm:justify-center ${
                        catCurrentPage === page ? 'bg-[#8B0F14] text-white shadow-sm' : 'border border-[#E5E7EB] bg-white text-[#262626] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCatCurrentPage((prev) => Math.min(prev + 1, catTotalPages))}
                    disabled={catCurrentPage === catTotalPages}
                    className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CONTAINER TABEL DOKUMEN & REVOKE */}
        {mainTab === 'documents' && (
          <section className="mt-6 min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="space-y-4 p-4 sm:p-5">
              <PanelHeader
                title="Daftar Dokumen & Revoke"
                subtitle={`Ruang lingkup: ${bidang}. Revoke tersedia untuk dokumen berstatus Valid atau Terverifikasi.`}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SearchField
                  value={docSearchQuery}
                  onChange={setDocSearchQuery}
                  placeholder="Cari nama dokumen, kategori, atau pegawai..."
                />
                <select
                  value={docStatusFilter}
                  onChange={(e) => setDocStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#262626] outline-none focus:border-[#8B0F14]"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Valid">Valid</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Dicabut">Dicabut</option>
                </select>
              </div>
            </div>

            {/* MOBILE VIEW DOKUMEN */}
            <div className="divide-y divide-[#E5E7EB] md:hidden">
              {paginatedDocs.length ? (
                paginatedDocs.map((d) => (
                  <article key={d.id} className="space-y-3 p-4">
                    <div className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]">
                        <Icon name="document" size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-[#262626]">{d.name}</p>
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
                        Alasan Pencabutan: {d.reason}
                      </p>
                    )}

                    {['Valid', 'Terverifikasi'].includes(d.status) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRevokeDoc(d);
                          setRevokeReason('');
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

            {/* DESKTOP TABLE DOKUMEN */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]">
                  <tr>
                    <th className="px-5 py-3.5">Dokumen</th>
                    <th className="px-5 py-3.5">Pengupload</th>
                    <th className="px-5 py-3.5">Tanggal Terbit</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {paginatedDocs.length ? (
                    paginatedDocs.map((d) => (
                      <tr key={d.id} className="transition hover:bg-[#FCEBEC]/20">
                        <td className="px-5 py-4">
                          <b className="text-[#262626]">{d.name}</b>
                          <p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">
                            {d.category}
                          </p>
                          {d.reason && (
                            <p className="mt-1 text-[10px] text-[#D92020]">
                              Alasan Pencabutan: {d.reason}
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
                                setSelectedRevokeDoc(d);
                                setRevokeReason('');
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

            {/* PAGINASI DOKUMEN */}
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-[#7F8C8D]">
                Menampilkan <span className="font-semibold text-[#262626]">{filteredDocs.length === 0 ? 0 : docStartIndex + 1}</span> hingga{' '}
                <span className="font-semibold text-[#262626]">{Math.min(docStartIndex + itemsPerPage, filteredDocs.length)}</span> dari{' '}
                <span className="font-semibold text-[#262626]">{filteredDocs.length}</span> dokumen
              </p>

              {docTotalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setDocCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={docCurrentPage === 1}
                    className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>

                  {Array.from({ length: docTotalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setDocCurrentPage(page)}
                      className={`hidden h-8 min-w-[32px] rounded-lg text-xs font-semibold transition sm:inline-flex sm:items-center sm:justify-center ${
                        docCurrentPage === page ? 'bg-[#8B0F14] text-white shadow-sm' : 'border border-[#E5E7EB] bg-white text-[#262626] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setDocCurrentPage((prev) => Math.min(prev + 1, docTotalPages))}
                    disabled={docCurrentPage === docTotalPages}
                    className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* THREE-DOT ACTION MENU */}
        {activeDropdown && (
          <div
            style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
            onClick={(event) => event.stopPropagation()}
            className="fixed z-[200] w-48 rounded-[8px] border border-[#E5E7EB] bg-white py-1 text-left shadow-xl"
          >
            {(() => {
              const category = categories.find((item) => item.id === activeDropdown);
              if (!category) return null;

              return (
                <>
                  <button
                    type="button"
                    onClick={() => handleEditCategory(category)}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]"
                  >
                    <svg className="h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Kategori
                  </button>
                  <hr className="my-1 border-[#E5E7EB]" />
                  {category.is_active ? (
                    <button
                      type="button"
                      onClick={() => handleToggleCategoryStatus(category)}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#D92020] transition hover:bg-[#D92020]/10"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Nonaktifkan Dokumen
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleCategoryStatus(category)}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1E8E3E] transition hover:bg-[#1E8E3E]/10"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Aktifkan Kembali
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* FORM MODAL KATEGORI */}
      <CreateEditModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* MODAL REVOKE DOKUMEN */}
      {selectedRevokeDoc && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedRevokeDoc(null);
          }}
        >
          <form
            onSubmit={handleConfirmRevoke}
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start gap-3 border-b border-[#E5E7EB] pb-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#D92020]">
                <Icon name="shield" size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-montserrat text-lg font-bold text-[#262626]">
                  Konfirmasi Revoke Dokumen
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#7F8C8D]">
                  Dokumen akan ditandai tidak berlaku (Dicabut) pada sistem.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRevokeDoc(null)}
                className="text-[#7F8C8D] hover:text-[#262626]"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-[#F9FAFB] p-3.5">
              <p className="text-sm font-bold text-[#262626]">{selectedRevokeDoc.name}</p>
              <p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">
                {selectedRevokeDoc.category}
              </p>
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold text-[#262626]">
                Alasan Pencabutan <span className="text-[#D92020]">*</span>
              </span>
              <textarea
                required
                minLength={5}
                rows={4}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Jelaskan alasan mengapa dokumen ini perlu dicabut..."
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs text-[#262626] outline-none transition focus:border-[#8B0F14]"
              />
            </label>

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedRevokeDoc(null)}
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