import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

export default function UsersIndex({ users = [] }) { // <-- Berikan default value [] di sini
    // State Tab, Search, & Dropdown Menu
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'inactive'
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    // State Paginasi (Maksimal 10 Data Per Halaman)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Amankan pemfilteran dengan memastikan `users` adalah array
    const safeUsers = Array.isArray(users) ? users : [];
    const activeUsers = safeUsers.filter((u) => u.is_active === 1 || u.is_active === true);
    const inactiveUsers = safeUsers.filter((u) => u.is_active === 0 || u.is_active === false);

    // Reset ke Halaman 1 saat ganti Tab atau melakukan Pencarian
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    // Tutup dropdown otomatis saat window di-scroll
    useEffect(() => {
        const handleScroll = () => setActiveDropdown(null);
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    // Toggle Dropdown 3 Titik
    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        if (activeDropdown === id) {
            setActiveDropdown(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(16, rect.right - 192),
            });
            setActiveDropdown(id);
        }
    };

    // Close Dropdown saat klik di luar
    const closeDropdown = () => setActiveDropdown(null);

    // Action Handlers
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

        router.delete(route('superadmin.users.destroy', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
            },
        });
    };

    // Filtered Users berdasarkan Search Query
    const currentList = activeTab === 'active' ? activeUsers : inactiveUsers;
    const filteredUsers = currentList.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.bidang && u.bidang.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Hitung Slicing Paginasi
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div onClick={closeDropdown} className="min-h-full space-y-6">
            <Head title="Manajemen Pengguna - SIVALDEN" />

            {/* HEADER PAGE & TOMBOL TAMBAH */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="rounded-full bg-[#FCEBEC] px-3.5 py-1 text-xs font-semibold text-[#8B0F14]">
                        Modul Superadmin
                    </span>
                    <h1 className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                        Manajemen Pengguna
                    </h1>
                    <p className="mt-1 text-sm text-[#7F8C8D]">
                        Kelola akun Admin dan Pegawai operasional berdasarkan peran dan bidang, pantau hak akses, serta nonaktifkan akun terindikasi retas.
                    </p>
                </div>

                <Link
                    href="/superadmin/users/create"
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 shrink-0"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah User Baru
                </Link>
            </div>

            {/* CARD MANAJEMEN TABEL */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                {/* TAB SWITCHER & SEARCH BAR */}
                <div className="flex flex-col gap-4 border-b border-[#E5E7EB] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex items-center gap-2 rounded-[8px] px-4 py-2 text-xs font-bold transition ${
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
                            className={`flex items-center gap-2 rounded-[8px] px-4 py-2 text-xs font-bold transition ${
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

                    {/* Search Input Box */}
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Cari nama, email, role, atau bidang..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-[8px] border border-[#E5E7EB] bg-[#F5F5F5] pl-9 pr-4 py-2 text-xs text-[#262626] focus:border-[#8B0F14] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
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

                {/* TABEL DATA PENGGUNA */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-dmsans">
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
                        <div className="flex items-center gap-1.5">
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
                                    className={`h-8 min-w-[32px] rounded-lg text-xs font-semibold transition ${
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

                                <Link
                                    href={`/superadmin/users/${u.id}/edit`}
                                    className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]"
                                >
                                    <svg className="h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profil
                                </Link>

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

            {/* MODAL DETAIL PROFIL */}
            {showDetailModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity">
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all sm:p-7"
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
                            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                                <span className="text-[#7F8C8D]">Nama Lengkap:</span>
                                <span className="font-semibold text-[#262626]">{selectedUser.name}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                                <span className="text-[#7F8C8D]">Email:</span>
                                <span className="font-medium text-[#262626]">{selectedUser.email}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                                <span className="text-[#7F8C8D]">Role (Peran):</span>
                                <span className="font-bold text-[#8B0F14] uppercase">{selectedUser.role}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                                <span className="text-[#7F8C8D]">Bidang:</span>
                                <span className="font-semibold text-[#262626] uppercase">{selectedUser.bidang || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                                <span className="text-[#7F8C8D]">Status Akun:</span>
                                <span className={`font-bold ${selectedUser.is_active ? 'text-[#1E8E3E]' : 'text-[#D92020]'}`}>
                                    {selectedUser.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[#7F8C8D]">Waktu Dibuat:</span>
                                <span className="font-mono text-[#262626]">{new Date(selectedUser.created_at).toLocaleString('id-ID')}</span>
                            </div>
                            {!selectedUser.is_active && selectedUser.deactivated_at && (
                                <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2.5">
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
                </div>
            )}

            {/* MODAL KONFIRMASI */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity">
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all sm:p-7"
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

                        <div className="mt-6 flex justify-end gap-3 border-t border-[#E5E7EB] pt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#262626] hover:bg-[#F5F5F5] transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDeactivate}
                                className={`rounded-[8px] px-4 py-2 text-xs font-semibold text-white transition ${selectedUser.is_active ? 'bg-[#D92020] hover:bg-[#B51A1A]' : 'bg-[#1E8E3E] hover:bg-[#166E2E]'}`}
                            >
                                {selectedUser.is_active ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

UsersIndex.layout = (page) => <SuperadminLayout>{page}</SuperadminLayout>;