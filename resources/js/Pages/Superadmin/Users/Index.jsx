import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Head, router, usePage } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';
import CreateEditModal from './CreateEdit';

export default function UsersIndex({ 
    users = [],
    rolesList = [],
    bidangList = [],
}) {
    // State Tab, Search, & Dropdown Menu
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    // State Paginasi
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State Modal & Mount Check
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Flash message dari Laravel yang dibagikan melalui HandleInertiaRequests.
    const { flash, auth } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Buat toast ketika ada flash error atau success baru dari backend.
    useEffect(() => {
        const message = flash?.error || flash?.success;

        if (!message) return;

        setToast({
            id: Date.now(),
            type: flash?.error ? 'error' : 'success',
            message,
        });
    }, [flash?.error, flash?.success]);

    // Tutup otomatis setelah 4,5 detik.
    useEffect(() => {
        // Toast loading tetap terlihat sampai server memberikan respons.
        if (!toast || toast.type === 'loading') return;

        const timer = window.setTimeout(() => {
            setToast(null);
        }, 4500);

        return () => window.clearTimeout(timer);
    }, [toast]);

    const safeUsers = Array.isArray(users) ? users : [];
    const activeUsers = safeUsers.filter((u) => u.is_active === 1 || u.is_active === true);
    const inactiveUsers = safeUsers.filter((u) => u.is_active === 0 || u.is_active === false);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    useEffect(() => {
        const handleScroll = () => setActiveDropdown(null);
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        if (activeDropdown === id) {
            setActiveDropdown(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: Math.min(rect.bottom + 4, Math.max(12, window.innerHeight - 240)),
                left: Math.min(Math.max(16, rect.right - 192), Math.max(16, window.innerWidth - 208)),
            });
            setActiveDropdown(id);
        }
    };

    const closeDropdown = () => setActiveDropdown(null);

    const handleCreateUser = () => {
        setSelectedUser(null);
        setShowFormModal(true);
        closeDropdown();
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowFormModal(true);
        closeDropdown();
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setShowDetailModal(true);
        closeDropdown();
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
        closeDropdown();
    };

    const handleConfirmDeactivate = () => {
        if (!selectedUser) return;

        // Validasi lokal untuk menampilkan alert tanpa menunggu request ke server.
        // Backend tetap wajib memvalidasi aturan yang sama untuk keamanan.
        if (String(auth?.user?.id) === String(selectedUser.id)) {
            setToast({
                id: Date.now(),
                type: 'error',
                message: 'Anda tidak dapat menonaktifkan akun sendiri.',
            });
            setShowDeleteModal(false);
            setSelectedUser(null);
            return;
        }

        if (selectedUser.role === 'superadmin') {
            setToast({
                id: Date.now(),
                type: 'error',
                message: 'Akun Superadmin tidak bisa dinonaktifkan.',
            });
            setShowDeleteModal(false);
            setSelectedUser(null);
            return;
        }

        // Operasi yang memang diizinkan tetap menunggu konfirmasi backend.
        // Toast loading langsung muncul agar pengguna tahu proses dimulai.
        setToast({
            id: Date.now(),
            type: 'loading',
            message: selectedUser.is_active
                ? `Sedang menonaktifkan akun ${selectedUser.name}...`
                : `Sedang mengaktifkan kembali akun ${selectedUser.name}...`,
        });

        router.delete(route('superadmin.users.destroy', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
            },
            onError: () => {
                setToast({
                    id: Date.now(),
                    type: 'error',
                    message: 'Permintaan gagal diproses. Periksa kembali koneksi dan data pengguna.',
                });
            },
        });
    };

    const currentList = activeTab === 'active' ? activeUsers : inactiveUsers;
    const filteredUsers = currentList.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.bidang && u.bidang.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div onClick={closeDropdown} className="min-h-full w-full min-w-0 space-y-5 sm:space-y-6">
            <Head title="Manajemen Pengguna - SIVALDEN" />

            {/* TOAST ALERT: sederhana, ringkas, dan berada di tengah atas */}
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

            {/* HEADER PAGE & TOMBOL TAMBAH */}
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="rounded-full bg-[#FCEBEC] px-3.5 py-1 text-xs font-semibold text-[#8B0F14]">
                        Modul Superadmin
                    </span>
                    <h1 className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                        Manajemen Pengguna
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7F8C8D]">
                        Kelola akun Admin dan Pegawai operasional berdasarkan peran dan bidang, pantau hak akses, serta nonaktifkan akun terindikasi retas.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreateUser}
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 sm:w-auto"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah User Baru
                </button>
            </div>

            {/* CARD MANAJEMEN TABEL */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                {/* TAB SWITCHER & SEARCH BAR */}
                <div className="flex min-w-0 flex-col gap-4 border-b border-[#E5E7EB] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="grid min-w-0 grid-cols-2 gap-2 min-[480px]:flex">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex w-full items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-bold transition min-[480px]:w-auto min-[480px]:px-4 ${
                                activeTab === 'active'
                                    ? 'bg-[#1E8E3E] text-white shadow-sm'
                                    : 'bg-[#F5F5F5] text-[#7F8C8D] hover:bg-[#E5E7EB] hover:text-[#262626]'
                            }`}
                        >
                            <span>Pengguna Aktif</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] ${
                                    activeTab === 'active'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-[#E5E7EB] text-[#262626]'
                                }`}
                            >
                                {activeUsers.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('inactive')}
                            className={`flex w-full items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-bold transition min-[480px]:w-auto min-[480px]:px-4 ${
                                activeTab === 'inactive'
                                    ? 'bg-[#D92020] text-white shadow-sm'
                                    : 'bg-[#F5F5F5] text-[#7F8C8D] hover:bg-[#E5E7EB] hover:text-[#262626]'
                            }`}
                        >
                            <span>Pengguna Nonaktif</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] ${
                                    activeTab === 'inactive'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-[#E5E7EB] text-[#262626]'
                                }`}
                            >
                                {inactiveUsers.length}
                            </span>
                        </button>
                    </div>

                    <div className="relative w-full min-w-0 sm:w-80 sm:shrink-0">
                        <input
                            type="text"
                            placeholder="Cari nama, email, role, atau bidang..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-[8px] border border-[#E5E7EB] bg-[#F5F5F5] py-2 pl-9 pr-3 text-xs text-[#262626] focus:border-[#8B0F14] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-4 w-4 text-[#7F8C8D]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* MOBILE USER CARDS: lebih nyaman daripada tabel lebar pada layar kecil */}
                <div className="divide-y divide-[#E5E7EB] md:hidden">
                    {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((u) => (
                            <article key={u.id} className="space-y-3 p-4">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B0F14] font-montserrat font-bold text-white">
                                            {u.name ? u.name.charAt(0) : 'U'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="break-words font-montserrat text-sm font-bold text-[#262626]">{u.name}</p>
                                            <p className="mt-0.5 break-all text-[11px] text-[#7F8C8D]">{u.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label={`Aksi untuk ${u.name}`}
                                        onClick={(e) => toggleDropdown(u.id, e)}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex max-w-full break-words rounded-md bg-[#8B0F14]/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-[#8B0F14]">{u.role}</span>
                                    <span className="inline-flex max-w-full break-words rounded-md bg-[#F5F5F5] px-2.5 py-1 text-[10px] font-medium uppercase text-[#262626]">{u.bidang || '-'}</span>
                                </div>

                                <dl className="grid grid-cols-2 gap-3 rounded-lg bg-[#F9FAFB] p-3 text-xs">
                                    <div className="min-w-0">
                                        <dt className="text-[10px] text-[#7F8C8D]">Status</dt>
                                        <dd className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${u.is_active ? 'bg-[#1E8E3E]/10 text-[#1E8E3E]' : 'bg-[#D92020]/10 text-[#D92020]'}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? 'bg-[#1E8E3E]' : 'bg-[#D92020]'}`} />
                                            {u.is_active ? 'Aktif' : 'Nonaktif'}
                                        </dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-[10px] text-[#7F8C8D]">{activeTab === 'active' ? 'Waktu Dibuat' : 'Waktu Dinonaktifkan'}</dt>
                                        <dd className="mt-1 break-words text-[11px] leading-4 text-[#525252]">
                                            {activeTab === 'active'
                                                ? (u.created_at ? new Date(u.created_at).toLocaleString('id-ID') : '-')
                                                : (u.deactivated_at ? new Date(u.deactivated_at).toLocaleString('id-ID') : '-')}
                                        </dd>
                                    </div>
                                </dl>
                            </article>
                        ))
                    ) : (
                        <div className="px-4 py-10 text-center">
                            <p className="text-sm font-semibold text-[#262626]">Tidak ada data pengguna</p>
                            <p className="mt-1 text-xs text-[#7F8C8D]">Coba ubah kata kunci atau tab yang dipilih.</p>
                        </div>
                    )}
                </div>

                {/* DESKTOP/TABLET TABLE */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px] text-left text-xs font-dmsans">
                        <thead className="bg-[#F5F5F5] font-montserrat text-[11px] font-bold uppercase tracking-wider text-[#7F8C8D]">
                            <tr>
                                <th className="px-6 py-3.5">Nama</th>
                                <th className="px-6 py-3.5">Role</th>
                                <th className="px-6 py-3.5">Bidang</th>
                                {activeTab === 'active' ? (
                                    <>
                                        <th className="px-6 py-3.5">Waktu Dibuat</th>
                                        <th className="px-6 py-3.5">Status</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5">Waktu Dinonaktifkan</th>
                                    </>
                                )}
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB] bg-white">
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((u) => (
                                    <tr key={u.id} className="transition hover:bg-[#FCEBEC]/20">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8B0F14] font-montserrat font-bold text-white">
                                                    {u.name ? u.name.charAt(0) : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-montserrat font-bold text-[#262626]">
                                                        {u.name}
                                                    </p>
                                                    <p className="text-[11px] text-[#7F8C8D]">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#262626]">
                                            <span className="inline-flex items-center rounded-md bg-[#8B0F14]/10 px-2.5 py-1 text-xs font-semibold text-[#8B0F14] uppercase">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#262626]">
                                            <span className="inline-flex items-center rounded-md bg-[#F5F5F5] px-2.5 py-1 text-xs text-[#262626] uppercase">
                                                {u.bidang || '-'}
                                            </span>
                                        </td>
                                        {activeTab === 'active' ? (
                                            <>
                                                <td className="px-6 py-4 font-mono text-[#7F8C8D]">
                                                    {new Date(u.created_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1E8E3E]/10 px-2.5 py-1 text-[11px] font-semibold text-[#1E8E3E]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#1E8E3E]" />
                                                        Aktif
                                                    </span>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D92020]/10 px-2.5 py-1 text-[11px] font-semibold text-[#D92020]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D92020]" />
                                                        Nonaktif
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-[#7F8C8D]">
                                                    {u.deactivated_at ? new Date(u.deactivated_at).toLocaleString('id-ID') : '-'}
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => toggleDropdown(u.id, e)}
                                                className="rounded-lg p-1.5 text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[#7F8C8D]">
                                        Tidak ada data pengguna ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINASI */}
                <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[#7F8C8D]">
                        Menampilkan{' '}
                        <span className="font-semibold text-[#262626]">
                            {filteredUsers.length === 0 ? 0 : startIndex + 1}
                        </span>{' '}
                        hingga{' '}
                        <span className="font-semibold text-[#262626]">
                            {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                        </span>{' '}
                        dari <span className="font-semibold text-[#262626]">{filteredUsers.length}</span> pengguna
                    </p>

                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:justify-end">
                            <span className="px-1 text-xs text-[#7F8C8D] sm:hidden">Halaman {currentPage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Sebelumnya
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
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
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* DROPDOWN MENU ACTION */}
            {activeDropdown && (
                <div
                    style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                    className="fixed z-50 w-48 rounded-[8px] border border-[#E5E7EB] bg-white py-1 shadow-xl text-left"
                >
                    {(() => {
                        const u = currentList.find((item) => item.id === activeDropdown);
                        if (!u) return null;
                        return (
                            <>
                                <button
                                    onClick={() => handleViewProfile(u)}
                                    className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]"
                                >
                                    <svg className="h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Lihat Profil
                                </button>

                                <button
                                    onClick={() => handleEditUser(u)}
                                    className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]"
                                >
                                    <svg className="h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profil
                                </button>

                                <hr className="my-1 border-[#E5E7EB]" />

                                {u.is_active ? (
                                    <button
                                        onClick={() => handleDeleteClick(u)}
                                        className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#D92020] transition hover:bg-[#D92020]/10"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        Nonaktifkan Akun
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleDeleteClick(u)}
                                        className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1E8E3E] transition hover:bg-[#1E8E3E]/10"
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

            {/* MODAL FORM CREATE & EDIT */}
            <CreateEditModal
                show={showFormModal}
                onClose={() => setShowFormModal(false)}
                user={selectedUser}
                rolesList={rolesList}
                bidangList={bidangList}
            />

            {/* MODAL DETAIL PROFIL (PORTAL LENGKAP) */}
            {mounted && showDetailModal && selectedUser && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
                    <div
                        className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-2xl transition-all sm:max-h-[calc(100dvh-2rem)] sm:p-7"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="absolute right-5 top-5 rounded-lg p-1 text-[#7F8C8D] hover:bg-[#F5F5F5] hover:text-[#262626]"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8B0F14] font-montserrat text-lg font-bold text-white shadow-sm">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-montserrat text-lg font-bold text-[#262626]">
                                    {selectedUser.name}
                                </h3>
                                <p className="text-xs text-[#7F8C8D]">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 rounded-xl bg-[#F8F9FA] p-4 text-xs border border-[#E5E7EB]/60">
                            <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-2.5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[#7F8C8D]">Nama Lengkap:</span>
                                <span className="font-semibold text-[#262626]">{selectedUser.name}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-2.5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[#7F8C8D]">Email:</span>
                                <span className="break-all font-medium text-[#262626] sm:text-right">{selectedUser.email}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-2.5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[#7F8C8D]">Role (Peran):</span>
                                <span className="font-bold text-[#8B0F14] uppercase">{selectedUser.role}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-2.5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[#7F8C8D]">Bidang:</span>
                                <span className="font-semibold text-[#262626] uppercase">{selectedUser.bidang || '-'}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-[#E5E7EB] pb-2.5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[#7F8C8D]">Status Akun:</span>
                                <span className={`font-bold ${selectedUser.is_active ? 'text-[#1E8E3E]' : 'text-[#D92020]'}`}>
                                    {selectedUser.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[#7F8C8D]">Waktu Dibuat:</span>
                                <span className="font-mono text-[#262626]">{new Date(selectedUser.created_at).toLocaleString('id-ID')}</span>
                            </div>
                            {!selectedUser.is_active && selectedUser.deactivated_at && (
                                <div className="flex flex-col gap-1 border-t border-[#E5E7EB] pt-2.5 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-[#7F8C8D]">Dinonaktifkan Pada:</span>
                                    <span className="font-mono font-semibold text-[#D92020]">{new Date(selectedUser.deactivated_at).toLocaleString('id-ID')}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="rounded-[8px] border border-[#E5E7EB] bg-white px-5 py-2 text-xs font-semibold text-[#262626] shadow-sm hover:bg-[#F5F5F5] transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL KONFIRMASI (PORTAL LENGKAP) */}
            {mounted && showDeleteModal && selectedUser && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
                    <div
                        className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-2xl transition-all sm:max-h-[calc(100dvh-2rem)] sm:p-7"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${selectedUser.is_active ? 'bg-[#D92020]/10 text-[#D92020]' : 'bg-[#1E8E3E]/10 text-[#1E8E3E]'}`}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-montserrat text-lg font-bold text-[#262626]">
                                    {selectedUser.is_active ? 'Nonaktifkan Akun Pengguna?' : 'Aktifkan Kembali Akun?'}
                                </h3>
                                <p className="mt-1 text-xs text-[#7F8C8D]">
                                    {selectedUser.is_active
                                        ? `Akun ${selectedUser.name} akan dinonaktifkan. Pengguna tidak akan dapat mengakses sistem SIVALDEN.`
                                        : `Akun ${selectedUser.name} akan diaktifkan kembali dan dapat mengakses sistem.`}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end sm:gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#262626] transition hover:bg-[#F5F5F5] sm:w-auto"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDeactivate}
                                className={`w-full rounded-[8px] px-4 py-2.5 text-xs font-semibold text-white transition sm:w-auto ${selectedUser.is_active ? 'bg-[#D92020] hover:bg-[#B51A1A]' : 'bg-[#1E8E3E] hover:bg-[#166E2E]'}`}
                            >
                                {selectedUser.is_active ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

UsersIndex.layout = (page) => <SuperadminLayout>{page}</SuperadminLayout>;
