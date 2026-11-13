import React, { useEffect, useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon, PageHeader } from '@/Components/AdminUI';
import CreateEditModal from './CreateEdit';

const createSeedEmployees = (bidang) => [
    {
        name: 'Ni Made Puspita',
        email: 'made.puspita@denpasarkota.go.id',
        status: 'Aktif',
        bidang,
    },
    {
        name: 'I Putu Aditya',
        email: 'putu.aditya@denpasarkota.go.id',
        status: 'Aktif',
        bidang,
    },
    {
        name: 'Ni Luh Sari',
        email: 'luh.sari@denpasarkota.go.id',
        status: 'Aktif',
        bidang,
    },
    {
        name: 'I Made Wira',
        email: 'made.wira@denpasarkota.go.id',
        status: 'Nonaktif',
        bidang,
    },
    {
        name: 'Komang Pradnya',
        email: 'komang.pradnya@denpasarkota.go.id',
        status: 'Aktif',
        bidang,
    },
];

const getEmployeeKey = (employee) => employee?.uuid || employee?.email;

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

function EmployeeAvatar({ name, size = 'normal' }) {
    const initials = (name || 'Pegawai')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-[#8B0F14] font-montserrat font-bold text-white ${
                size === 'small' ? 'h-9 w-9 text-xs' : 'h-10 w-10 text-sm'
            }`}
        >
            {initials}
        </div>
    );
}

function EmployeeStatus({ status }) {
    const isActive = status === 'Aktif';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                isActive ? 'bg-[#1E8E3E]/10 text-[#1E8E3E]' : 'bg-[#D92020]/10 text-[#D92020]'
            }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#1E8E3E]' : 'bg-[#D92020]'}`} />
            {status}
        </span>
    );
}

function StatCard({ label, value, detail, icon, tone = 'maroon' }) {
    const iconTone = {
        maroon: 'bg-[#FCEBEC] text-[#8B0F14]',
        green: 'bg-[#EAF6EE] text-[#1E8E3E]',
        red: 'bg-[#FDECEC] text-[#D92020]',
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">{label}</p>
                <span className={`rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-110 ${iconTone[tone]}`}>
                    <Icon name={icon} size={19} />
                </span>
            </div>
            <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-[#7F8C8D]">{detail}</p>
        </div>
    );
}

function ActionButton({ employee, onClick }) {
    return (
        <button
            type="button"
            aria-label={`Aksi untuk ${employee.name}`}
            onClick={onClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
        >
            <ThreeDotsIcon />
        </button>
    );
}

export default function EmployeesIndex() {
    const { auth } = usePage().props;
    const bidang = auth?.user?.bidang || auth?.user?.division || 'Bidang Statistik';

    const [employees, setEmployees] = useState(() => createSeedEmployees(bidang));
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('active');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [notice, setNotice] = useState('');

    const activeEmployees = employees.filter((employee) => employee.status === 'Aktif');
    const inactiveEmployees = employees.filter((employee) => employee.status === 'Nonaktif');
    const currentEmployees = activeTab === 'active' ? activeEmployees : inactiveEmployees;

    const filteredEmployees = useMemo(() => {
        const keyword = searchQuery.trim().toLowerCase();

        return currentEmployees.filter((employee) => {
            if (!keyword) return true;

            return [employee.name, employee.email, employee.bidang]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword));
        });
    }, [currentEmployees, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    useEffect(() => {
        const handleScroll = () => setActiveDropdown(null);
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const closeDropdown = () => setActiveDropdown(null);

    const toggleDropdown = (key, event) => {
        event.stopPropagation();

        if (activeDropdown === key) {
            closeDropdown();
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        setDropdownPos({
            top: Math.min(rect.bottom + 4, Math.max(12, window.innerHeight - 170)),
            left: Math.min(Math.max(16, rect.right - 192), Math.max(16, window.innerWidth - 208)),
        });
        setActiveDropdown(key);
    };

    const openAddModal = () => {
        setSelectedEmployee(null);
        setShowFormModal(true);
        closeDropdown();
    };

    const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setShowFormModal(true);
        closeDropdown();
    };

    const openDetailModal = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailModal(true);
        closeDropdown();
    };

    const openStatusModal = (employee) => {
        setSelectedEmployee(employee);
        setShowStatusModal(true);
        closeDropdown();
    };

    const handleSaveEmployee = (formData) => {
        if (selectedEmployee) {
            const targetKey = getEmployeeKey(selectedEmployee);
            setEmployees((previous) =>
                previous.map((employee) =>
                    getEmployeeKey(employee) === targetKey
                        ? { ...employee, ...formData }
                        : employee
                )
            );
            setNotice('Data pegawai diperbarui pada tampilan demo.');
        } else {
            const newEmployee = {
                uuid: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
                ...formData,
                status: 'Aktif',
                bidang,
            };

            setEmployees((previous) => [newEmployee, ...previous]);
            setNotice('Pegawai ditambahkan pada tampilan demo.');
            setActiveTab('active');
        }

        setShowFormModal(false);
        setSelectedEmployee(null);
    };

    const handleConfirmStatus = () => {
        if (!selectedEmployee) return;

        const targetKey = getEmployeeKey(selectedEmployee);
        const nextStatus = selectedEmployee.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        setEmployees((previous) =>
            previous.map((employee) =>
                getEmployeeKey(employee) === targetKey
                    ? { ...employee, status: nextStatus }
                    : employee
            )
        );
        setNotice(
            nextStatus === 'Nonaktif'
                ? 'Status pegawai berhasil diubah menjadi nonaktif pada tampilan demo.'
                : 'Status pegawai berhasil diaktifkan kembali pada tampilan demo.'
        );
        setShowStatusModal(false);
        setSelectedEmployee(null);
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pegawai - SIVALDEN" />

            <div
                onClick={closeDropdown}
                className="min-h-full w-full min-w-0 space-y-5 sm:space-y-6"
            >
                {/* PAGE HEADER */}
                <PageHeader
                    title="Manajemen Pegawai"
                    description={`Kelola akun pegawai yang berada dalam ${bidang}, pantau status akses, dan perbarui informasi pegawai.`}
                />

                {/* NOTICE */}
                {notice && (
                    <div
                        role="status"
                        className="flex items-center gap-2.5 rounded-lg border border-[#E5E7EB] border-l-4 border-l-[#1E8E3E] bg-white px-4 py-3 text-xs text-[#525252] shadow-sm"
                    >
                        <Icon name="check" size={15} className="shrink-0 text-[#1E8E3E]" />
                        <span className="min-w-0 flex-1">{notice}</span>
                        <button
                            type="button"
                            aria-label="Tutup notifikasi"
                            onClick={() => setNotice('')}
                            className="rounded p-1 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#262626]"
                        >
                            <Icon name="x" size={14} />
                        </button>
                    </div>
                )}

                {/* STATISTIC CARDS */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                    <StatCard
                        label="Total Pegawai"
                        value={employees.length}
                        detail={`Terdaftar pada ${bidang}`}
                        icon="users"
                    />
                    <StatCard
                        label="Pegawai Aktif"
                        value={activeEmployees.length}
                        detail="Dapat mengakses sistem"
                        icon="check"
                        tone="green"
                    />
                    <div className="col-span-2 lg:col-span-1">
                        <StatCard
                            label="Pegawai Nonaktif"
                            value={inactiveEmployees.length}
                            detail="Akses sedang dinonaktifkan"
                            icon="user-x"
                            tone="red"
                        />
                    </div>
                </div>

                {/* EMPLOYEE TABLE CARD */}
                <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                    {/* FILTER, SEARCH, & TOMBOL TAMBAH PEGAWAI */}
                    <div className="flex min-w-0 flex-col gap-4 border-b border-[#E5E7EB] p-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                        {/* SISI KIRI: TAB SWITCHER */}
                        <div className="grid min-w-0 grid-cols-2 gap-2 min-[480px]:flex">
                            <button
                                type="button"
                                onClick={() => setActiveTab('active')}
                                className={`flex w-full items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-bold transition min-[480px]:w-auto min-[480px]:px-4 ${
                                    activeTab === 'active'
                                        ? 'bg-[#1E8E3E] text-white shadow-sm'
                                        : 'bg-[#F5F5F5] text-[#7F8C8D] hover:bg-[#E5E7EB] hover:text-[#262626]'
                                }`}
                            >
                                <span>Pegawai Aktif</span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#262626]'}`}>
                                    {activeEmployees.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('inactive')}
                                className={`flex w-full items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-bold transition min-[480px]:w-auto min-[480px]:px-4 ${
                                    activeTab === 'inactive'
                                        ? 'bg-[#D92020] text-white shadow-sm'
                                        : 'bg-[#F5F5F5] text-[#7F8C8D] hover:bg-[#E5E7EB] hover:text-[#262626]'
                                }`}
                            >
                                <span>Pegawai Nonaktif</span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === 'inactive' ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#262626]'}`}>
                                    {inactiveEmployees.length}
                                </span>
                            </button>
                        </div>

                        {/* SISI KANAN: SEARCH BAR & TOMBOL TAMBAH PEGAWAI */}
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                            <div className="relative w-full min-w-0 sm:w-64 lg:w-72">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Cari nama, email ..."
                                    className="w-full rounded-[8px] border border-[#E5E7EB] bg-[#F5F5F5] py-2 pl-9 pr-3 text-xs text-[#262626] outline-none transition focus:border-[#8B0F14] focus:bg-white focus:ring-1 focus:ring-[#8B0F14]"
                                />
                                <svg className="absolute left-3 top-2.5 h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 sm:w-auto"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Pegawai
                            </button>
                        </div>
                    </div>

                    {/* MOBILE EMPLOYEE CARDS */}
                    <div className="divide-y divide-[#E5E7EB] md:hidden">
                        {paginatedEmployees.length > 0 ? (
                            paginatedEmployees.map((employee) => {
                                const rowKey = getEmployeeKey(employee);
                                return (
                                    <article key={rowKey} className="space-y-3 p-4">
                                        <div className="flex min-w-0 items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <EmployeeAvatar name={employee.name} />
                                                <div className="min-w-0">
                                                    <p className="break-words font-montserrat text-sm font-bold text-[#262626]">
                                                        {employee.name}
                                                    </p>
                                                    <p className="mt-0.5 break-all text-[11px] text-[#7F8C8D]">
                                                        {employee.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <ActionButton
                                                employee={employee}
                                                onClick={(event) => toggleDropdown(rowKey, event)}
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex max-w-full break-words rounded-md bg-[#F5F5F5] px-2.5 py-1 text-[10px] font-medium uppercase text-[#262626]">
                                                {employee.bidang || bidang}
                                            </span>
                                        </div>

                                        <dl className="grid grid-cols-2 gap-3 rounded-lg bg-[#F9FAFB] p-3 text-xs">
                                            <div className="min-w-0">
                                                <dt className="text-[10px] text-[#7F8C8D]">Status</dt>
                                                <dd className="mt-1"><EmployeeStatus status={employee.status} /></dd>
                                            </div>
                                        </dl>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="px-4 py-10 text-center">
                                <p className="text-sm font-semibold text-[#262626]">Tidak ada data pegawai</p>
                                <p className="mt-1 text-xs text-[#7F8C8D]">Coba ubah kata kunci atau tab yang dipilih.</p>
                            </div>
                        )}
                    </div>

                    {/* DESKTOP / TABLET TABLE */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[760px] text-left text-xs font-dmsans">
                            <thead className="bg-[#F5F5F5] font-montserrat text-[11px] font-bold uppercase tracking-wider text-[#7F8C8D]">
                                <tr>
                                    <th className="px-6 py-3.5">Nama Pegawai</th>
                                    <th className="px-6 py-3.5">Bidang</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB] bg-white">
                                {paginatedEmployees.length > 0 ? (
                                    paginatedEmployees.map((employee) => {
                                        const rowKey = getEmployeeKey(employee);
                                        return (
                                            <tr key={rowKey} className="transition hover:bg-[#FCEBEC]/20">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <EmployeeAvatar name={employee.name} size="small" />
                                                        <div className="min-w-0">
                                                            <p className="font-montserrat font-bold text-[#262626]">{employee.name}</p>
                                                            <p className="mt-0.5 text-[11px] text-[#7F8C8D]">{employee.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex max-w-[180px] rounded-md bg-[#F5F5F5] px-2.5 py-1 text-[10px] font-medium uppercase text-[#262626]">
                                                        {employee.bidang || bidang}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4"><EmployeeStatus status={employee.status} /></td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end">
                                                        <ActionButton
                                                            employee={employee}
                                                            onClick={(event) => toggleDropdown(rowKey, event)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center">
                                            <p className="text-sm font-semibold text-[#262626]">Tidak ada data pegawai ditemukan.</p>
                                            <p className="mt-1 text-xs text-[#7F8C8D]">Coba ubah kata kunci atau tab yang dipilih.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs text-[#7F8C8D]">
                            Menampilkan{' '}
                            <span className="font-semibold text-[#262626]">{filteredEmployees.length === 0 ? 0 : startIndex + 1}</span>{' '}
                            hingga{' '}
                            <span className="font-semibold text-[#262626]">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span>{' '}
                            dari <span className="font-semibold text-[#262626]">{filteredEmployees.length}</span> pegawai
                        </p>

                        {totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:justify-end">
                                <span className="px-1 text-xs text-[#7F8C8D] sm:hidden">Halaman {currentPage} / {totalPages}</span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 1))}
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
                                    onClick={() => setCurrentPage((previous) => Math.min(previous + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* THREE-DOT ACTION MENU */}
                {activeDropdown && (
                    <div
                        style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                        onClick={(event) => event.stopPropagation()}
                        className="fixed z-[200] w-48 rounded-[8px] border border-[#E5E7EB] bg-white py-1 text-left shadow-xl"
                    >
                        {(() => {
                            const employee = employees.find((item) => getEmployeeKey(item) === activeDropdown);
                            if (!employee) return null;

                            return (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => openDetailModal(employee)}
                                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]"
                                    >
                                        <svg className="h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Lihat Profil
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(employee)}
                                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]"
                                    >
                                        <svg className="h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Pegawai
                                    </button>
                                    <hr className="my-1 border-[#E5E7EB]" />
                                    {employee.status === 'Aktif' ? (
                                        <button
                                            type="button"
                                            onClick={() => openStatusModal(employee)}
                                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#D92020] transition hover:bg-[#D92020]/10"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                            Nonaktifkan Pegawai
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => openStatusModal(employee)}
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

            {/* MODAL FORM CREATE & EDIT (DARI KOMPONEN TERPISAH) */}
            <CreateEditModal
                show={showFormModal}
                onClose={() => setShowFormModal(false)}
                employee={selectedEmployee}
                bidang={bidang}
                onSave={handleSaveEmployee}
            />

            {/* EMPLOYEE DETAIL MODAL */}
            {showDetailModal && selectedEmployee && (
                <div
                    className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setShowDetailModal(false);
                    }}
                >
                    <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                        <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
                            <div>
                                <h2 className="font-montserrat text-lg font-bold text-[#262626]">Detail Pegawai</h2>
                                <p className="mt-1 text-xs text-[#7F8C8D]">Informasi akun pegawai pada unit kerja Anda.</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Tutup detail"
                                onClick={() => setShowDetailModal(false)}
                                className="rounded-lg p-1 text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
                            >
                                <Icon name="x" size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center py-5 text-center">
                            <EmployeeAvatar name={selectedEmployee.name} />
                            <h3 className="mt-3 font-montserrat text-base font-bold text-[#262626]">{selectedEmployee.name}</h3>
                            <p className="mt-1 break-all text-xs text-[#7F8C8D]">{selectedEmployee.email}</p>
                            <div className="mt-3"><EmployeeStatus status={selectedEmployee.status} /></div>
                        </div>

                        <dl className="divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB]">
                            <div className="flex items-start justify-between gap-4 px-3.5 py-3 text-xs">
                                <dt className="shrink-0 text-[#7F8C8D]">Bidang</dt>
                                <dd className="text-right font-semibold text-[#262626]">{selectedEmployee.bidang || bidang}</dd>
                            </div>
                        </dl>

                        <div className="mt-5 flex justify-end border-t border-[#E5E7EB] pt-4">
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(false)}
                                className="rounded-lg bg-[#8B0F14] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6B0A0F]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ACTIVATE / DEACTIVATE CONFIRMATION MODAL */}
            {showStatusModal && selectedEmployee && (
                <div
                    className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setShowStatusModal(false);
                    }}
                >
                    <div className="my-auto w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FDECEC] text-[#D92020]">
                            <Icon name={selectedEmployee.status === 'Aktif' ? 'alert' : 'check'} size={20} />
                        </div>
                        <h2 className="mt-4 font-montserrat text-lg font-bold text-[#262626]">
                            {selectedEmployee.status === 'Aktif' ? 'Nonaktifkan Pegawai?' : 'Aktifkan Kembali Pegawai?'}
                        </h2>
                        <p className="mt-2 text-xs leading-5 text-[#7F8C8D]">
                            {selectedEmployee.status === 'Aktif'
                                ? `Akun ${selectedEmployee.name} akan ditandai nonaktif pada tampilan demo.`
                                : `Akun ${selectedEmployee.name} akan ditandai aktif kembali pada tampilan demo.`}
                        </p>
                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setShowStatusModal(false)}
                                className="rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-xs font-semibold text-[#525252] transition hover:bg-[#F5F5F5]"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmStatus}
                                className={`rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition ${
                                    selectedEmployee.status === 'Aktif'
                                        ? 'bg-[#D92020] hover:bg-[#B91C1C]'
                                        : 'bg-[#1E8E3E] hover:bg-[#166534]'
                                }`}
                            >
                                {selectedEmployee.status === 'Aktif' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}