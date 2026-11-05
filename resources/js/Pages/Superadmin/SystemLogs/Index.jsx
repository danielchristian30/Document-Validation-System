import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Head } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

const initialLogs = [
    {
        id: 1,
        log_name: 'authentication',
        description: 'Pengguna berhasil masuk ke dashboard Admin.',
        event: 'login',
        subject_type: null,
        subject_id: null,
        causer_type: 'App\\Models\\User',
        causer_id: 12,
        causer_name: 'admin.operasional',
        causer_role: 'Admin',
        properties: {
            ip: '192.0.2.91',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/156.0.0.0',
            method: 'POST',
            route: 'login',
        },
        created_at: '2026-10-27T09:12:00',
        updated_at: '2026-10-27T09:12:00',
    },
    {
        id: 2,
        log_name: 'user-management',
        description: 'Memperbarui informasi profil pengguna.',
        event: 'updated',
        subject_type: 'App\\Models\\User',
        subject_id: 104,
        causer_type: 'App\\Models\\User',
        causer_id: 28,
        causer_name: 'pegawai.operasional',
        causer_role: 'Pegawai',
        properties: {
            ip: '192.0.2.44',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/156.0.0.0',
            method: 'PUT',
            route: 'profile.update',
            attributes: { name: 'Pegawai Operasional' },
            old: { name: 'Pegawai Operasional Lama' },
        },
        created_at: '2026-10-27T08:58:00',
        updated_at: '2026-10-27T08:58:00',
    },
    {
        id: 3,
        log_name: 'user-management',
        description: 'Membuat akun pegawai baru.',
        event: 'created',
        subject_type: 'App\\Models\\User',
        subject_id: 118,
        causer_type: 'App\\Models\\User',
        causer_id: 12,
        causer_name: 'admin.operasional',
        causer_role: 'Admin',
        properties: {
            ip: '192.0.2.91',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/156.0.0.0',
            method: 'POST',
            route: 'admin.users.store',
            attributes: { role: 'employee', is_active: true },
        },
        created_at: '2026-10-27T08:42:00',
        updated_at: '2026-10-27T08:42:00',
    },
    {
        id: 4,
        log_name: 'security',
        description: 'Permintaan akses ditolak karena hak akses tidak mencukupi.',
        event: 'access_denied',
        subject_type: null,
        subject_id: null,
        causer_type: 'App\\Models\\User',
        causer_id: 28,
        causer_name: 'pegawai.operasional',
        causer_role: 'Pegawai',
        properties: {
            ip: '203.0.113.57',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/156.0.0.0',
            method: 'GET',
            route: 'superadmin.users.index',
            reason: 'Forbidden: role tidak diizinkan',
        },
        created_at: '2026-10-27T08:31:00',
        updated_at: '2026-10-27T08:31:00',
    },
    {
        id: 5,
        log_name: 'user-management',
        description: 'Memperbarui status akun pengguna.',
        event: 'updated',
        subject_type: 'App\\Models\\User',
        subject_id: 87,
        causer_type: 'App\\Models\\User',
        causer_id: 12,
        causer_name: 'admin.operasional',
        causer_role: 'Admin',
        properties: {
            ip: '192.0.2.91',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/156.0.0.0',
            method: 'PATCH',
            route: 'admin.users.status',
            attributes: { is_active: false },
            old: { is_active: true },
        },
        created_at: '2026-10-26T16:24:00',
        updated_at: '2026-10-26T16:24:00',
    },
    {
        id: 6,
        log_name: 'default',
        description: 'Membuka halaman daftar dokumen untuk pemeriksaan.',
        event: 'viewed',
        subject_type: 'App\\Models\\Document',
        subject_id: 182,
        causer_type: 'App\\Models\\User',
        causer_id: 31,
        causer_name: 'pegawai.layanan',
        causer_role: 'Pegawai',
        properties: {
            ip: '198.51.100.62',
            user_agent: 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/156.0.0.0 Mobile Safari/537.36',
            method: 'GET',
            route: 'admin.documents.index',
            document_reference: 'SV-2026-0182',
        },
        created_at: '2026-10-26T14:10:00',
        updated_at: '2026-10-26T14:10:00',
    },
    {
        id: 7,
        log_name: 'security',
        description: 'Menambahkan alamat IP ke daftar blokir.',
        event: 'blocked',
        subject_type: 'App\\Models\\BlockedIp',
        subject_id: 7,
        causer_type: 'App\\Models\\User',
        causer_id: 12,
        causer_name: 'admin.operasional',
        causer_role: 'Admin',
        properties: {
            ip: '192.0.2.91',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/156.0.0.0',
            method: 'POST',
            route: 'admin.ip-blocklist.store',
            blocked_ip: '203.0.113.18',
            reason: 'Percobaan akses berulang',
        },
        created_at: '2026-10-26T11:46:00',
        updated_at: '2026-10-26T11:46:00',
    },
    {
        id: 8,
        log_name: 'authentication',
        description: 'Pengguna berhasil masuk ke dashboard Pegawai.',
        event: 'login',
        subject_type: null,
        subject_id: null,
        causer_type: 'App\\Models\\User',
        causer_id: 31,
        causer_name: 'pegawai.layanan',
        causer_role: 'Pegawai',
        properties: {
            ip: '198.51.100.62',
            user_agent: 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/156.0.0.0 Mobile Safari/537.36',
            method: 'POST',
            route: 'login',
        },
        created_at: '2026-10-25T15:33:00',
        updated_at: '2026-10-25T15:33:00',
    },
    {
        id: 9,
        log_name: 'default',
        description: 'Memperbarui data profil akun.',
        event: 'updated',
        subject_type: 'App\\Models\\User',
        subject_id: 31,
        causer_type: 'App\\Models\\User',
        causer_id: 31,
        causer_name: 'pegawai.layanan',
        causer_role: 'Pegawai',
        properties: {
            ip: '198.51.100.62',
            user_agent: 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/156.0.0.0 Mobile Safari/537.36',
            method: 'PATCH',
            route: 'profile.update',
            attributes: { bidang: 'Pelayanan' },
            old: { bidang: 'Administrasi' },
        },
        created_at: '2026-10-25T09:05:00',
        updated_at: '2026-10-25T09:05:00',
    },
];

const logNameOptions = [
    { value: 'Semua Log', label: 'Semua Log' },
    { value: 'default', label: 'default' },
    { value: 'authentication', label: 'authentication' },
    { value: 'user-management', label: 'user-management' },
    { value: 'security', label: 'security' },
];

const roleOptions = ['Semua Role', 'Admin', 'Pegawai'];
const itemsPerPage = 8;

function formatDateTime(value) {
    if (!value) return '-';

    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    });
}

function formatDate(value) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function EventBadge({ event }) {
    const normalizedEvent = event || '—';
    const isRiskEvent = ['access_denied', 'blocked', 'login_failed'].includes(normalizedEvent);

    return (
        <span className={`inline-flex rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold ${isRiskEvent ? 'bg-[#FCEBEC] text-[#8B0F14]' : 'bg-[#F3F4F6] text-[#525252]'}`}>
            {normalizedEvent}
        </span>
    );
}

function SummaryIcon({ type }) {
    const common = {
        className: 'h-5 w-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    };

    if (type === 'today') {
        return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    }

    if (type === 'admin') {
        return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    }

    if (type === 'employee') {
        return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    }

    return <svg {...common}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}

function DetailIcon() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 11v5m0-8h.01" />
        </svg>
    );
}

export default function SystemLogsIndex() {
    const [logs] = useState(initialLogs);
    const [search, setSearch] = useState('');
    const [logNameFilter, setLogNameFilter] = useState('Semua Log');
    const [roleFilter, setRoleFilter] = useState('Semua Role');
    const [dateFilter, setDateFilter] = useState('Semua Waktu');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLog, setSelectedLog] = useState(null);
    const [toast, setToast] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(() => setToast(null), 4500);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const todayKey = formatDate(new Date());

    const filteredLogs = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

        return logs.filter((log) => {
            const searchableValues = [
                log.id,
                log.log_name,
                log.description,
                log.event,
                log.subject_type,
                log.subject_id,
                log.causer_type,
                log.causer_id,
                log.causer_name,
                log.causer_role,
                log.properties?.ip,
                log.properties?.user_agent,
                log.properties?.method,
                log.properties?.route,
                JSON.stringify(log.properties || {}),
            ];

            const matchesSearch = searchableValues.some((value) =>
                String(value ?? '').toLowerCase().includes(keyword)
            );
            const matchesLogName = logNameFilter === 'Semua Log' || log.log_name === logNameFilter;
            const matchesRole = roleFilter === 'Semua Role' || log.causer_role === roleFilter;
            const logTime = new Date(log.created_at).getTime();
            const matchesDate = dateFilter === 'Semua Waktu'
                || (dateFilter === 'Hari Ini' && formatDate(log.created_at) === todayKey)
                || (dateFilter === '7 Hari Terakhir' && logTime >= sevenDaysAgo && logTime <= now);

            return matchesSearch && matchesLogName && matchesRole && matchesDate;
        });
    }, [logs, search, logNameFilter, roleFilter, dateFilter, todayKey]);

    const todayCount = logs.filter((log) => formatDate(log.created_at) === todayKey).length;
    const adminCount = logs.filter((log) => log.causer_role === 'Admin').length;
    const employeeCount = logs.filter((log) => log.causer_role === 'Pegawai').length;
    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, logNameFilter, roleFilter, dateFilter]);

    const resetFilters = () => {
        setSearch('');
        setLogNameFilter('Semua Log');
        setRoleFilter('Semua Role');
        setDateFilter('Semua Waktu');
        setCurrentPage(1);
    };

    const exportCSV = () => {
        if (filteredLogs.length === 0) {
            setToast({ id: Date.now(), type: 'error', message: 'Tidak ada data log yang dapat diekspor berdasarkan filter saat ini.' });
            return;
        }

        const headers = [
            'ID', 'Log Name', 'Description', 'Event', 'Subject Type', 'Subject ID',
            'Causer Type', 'Causer ID', 'Causer Name', 'Causer Role', 'IP',
            'User Agent', 'HTTP Method', 'Route', 'Properties', 'Batch UUID', 'Created At', 'Updated At',
        ];
        const rows = filteredLogs.map((log) => [
            log.id,
            log.log_name,
            log.description,
            log.event,
            log.subject_type,
            log.subject_id,
            log.causer_type,
            log.causer_id,
            log.causer_name,
            log.causer_role,
            log.properties?.ip,
            log.properties?.user_agent,
            log.properties?.method,
            log.properties?.route,
            JSON.stringify(log.properties || {}),
            log.batch_uuid,
            log.created_at,
            log.updated_at,
        ]);
        const escapeCSV = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\r\n');
        const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `sivalden-system-logs-demo-${todayKey}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        setToast({ id: Date.now(), type: 'success', message: `${filteredLogs.length} data log demo diekspor ke CSV.` });
    };

    return (
        <div className="min-h-full w-full min-w-0 space-y-5 sm:space-y-6">
            <Head title="System Logs - SIVALDEN" />

            {/* HEADER PAGE */}
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                        System Logs
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7F8C8D]">
                        Telusuri catatan aktivitas Admin dan Pegawai, termasuk waktu, event, pelaku, alamat IP, user agent, dan properties dari activity log.
                    </p>
                </div>
            </div>

            {/* STATISTIC CARDS */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
                    <div className="flex items-start justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">Total Log Tersedia</p>
                        <span className="rounded-xl bg-[#FCEBEC] p-2.5 text-[#8B0F14] transition-transform duration-200 group-hover:scale-110"><SummaryIcon type="total" /></span>
                    </div>
                    <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{logs.length.toLocaleString('id-ID')}</p>
                    <p className="mt-1 text-xs text-[#7F8C8D]">Data contoh activity log</p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
                    <div className="flex items-start justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">Aktivitas Hari Ini</p>
                        <span className="rounded-xl bg-[#FFF4E5] p-2.5 text-[#B7791F] transition-transform duration-200 group-hover:scale-110"><SummaryIcon type="today" /></span>
                    </div>
                    <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{todayCount}</p>
                    <p className="mt-1 text-xs text-[#7F8C8D]">Berdasarkan created_at</p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
                    <div className="flex items-start justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">Aktivitas Admin</p>
                        <span className="rounded-xl bg-[#E6F4EA] p-2.5 text-[#1E8E3E] transition-transform duration-200 group-hover:scale-110"><SummaryIcon type="admin" /></span>
                    </div>
                    <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#1E8E3E] sm:mt-3 sm:text-3xl">{adminCount}</p>
                    <p className="mt-1 text-xs text-[#7F8C8D]">Catatan oleh role Admin</p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
                    <div className="flex items-start justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">Aktivitas Pegawai</p>
                        <span className="rounded-xl bg-[#FCEBEC] p-2.5 text-[#8B0F14] transition-transform duration-200 group-hover:scale-110"><SummaryIcon type="employee" /></span>
                    </div>
                    <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{employeeCount}</p>
                    <p className="mt-1 text-xs text-[#7F8C8D]">Catatan oleh role Pegawai</p>
                </div>
            </div>

            {/* CARD MANAJEMEN TABEL */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                {/* TAB SWITCHER, SEARCH BAR, & ACTION BUTTON */}
                <div className="flex min-w-0 flex-col gap-4 border-b border-[#E5E7EB] p-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                    <div className="grid min-w-0 grid-cols-2 gap-2 min-[480px]:flex min-[480px]:flex-wrap min-[480px]:items-center">
                        <select
                            value={logNameFilter}
                            onChange={(event) => setLogNameFilter(event.target.value)}
                            className="w-full rounded-[8px] border border-[#E5E7EB] bg-[#F5F5F5] px-3 py-2 text-xs font-bold text-[#262626] focus:border-[#8B0F14] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0F14] min-[480px]:w-auto"
                        >
                            {logNameOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="w-full rounded-[8px] border border-[#E5E7EB] bg-[#F5F5F5] px-3 py-2 text-xs font-bold text-[#262626] focus:border-[#8B0F14] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0F14] min-[480px]:w-auto"
                        >
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(event) => setDateFilter(event.target.value)}
                            className="w-full rounded-[8px] border border-[#E5E7EB] bg-[#F5F5F5] px-3 py-2 text-xs font-bold text-[#262626] focus:border-[#8B0F14] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8B0F14] min-[480px]:w-auto"
                        >
                            <option>Semua Waktu</option>
                            <option>Hari Ini</option>
                            <option>7 Hari Terakhir</option>
                        </select>

                        {(logNameFilter !== 'Semua Log' || roleFilter !== 'Semua Role' || dateFilter !== 'Semua Waktu' || search !== '') && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="col-span-2 w-full rounded-[8px] px-3 py-2 text-center text-xs font-bold text-[#8B0F14] transition hover:bg-[#FCEBEC] min-[480px]:col-span-1 min-[480px]:w-auto"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="relative w-full min-w-0 lg:flex-1 lg:max-w-md">
                        <input
                            type="text"
                            placeholder="Cari deskripsi, user, IP, user agent..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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

                    <button
                        type="button"
                        onClick={exportCSV}
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 lg:w-auto"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
                        </svg>
                        Ekspor CSV
                    </button>
                </div>

                {/* MOBILE CARDS */}
                <div className="divide-y divide-[#E5E7EB] md:hidden">
                    {paginatedLogs.length > 0 ? (
                        paginatedLogs.map((log) => (
                            <article key={log.id} className="space-y-3 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="inline-flex max-w-full break-all rounded-md bg-[#F3F4F6] px-2.5 py-1 font-mono text-[10px] font-medium text-[#525252]">{log.log_name || 'default'}</span>
                                    <EventBadge event={log.event} />
                                </div>
                                <div>
                                    <p className="break-words font-montserrat text-sm font-bold text-[#262626]">{log.description}</p>
                                    <p className="mt-1 text-[10px] text-[#7F8C8D]">ID: {log.id} · Subject ID: {log.subject_id ?? '—'}</p>
                                </div>
                                <dl className="grid grid-cols-2 gap-3 rounded-lg bg-[#F9FAFB] p-3 text-xs">
                                    <div className="min-w-0">
                                        <dt className="text-[10px] text-[#7F8C8D]">Waktu</dt>
                                        <dd className="mt-1 break-words text-[11px] leading-4 text-[#525252]">{formatDateTime(log.created_at)}</dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-[10px] text-[#7F8C8D]">Pelaku</dt>
                                        <dd className="mt-1 break-words text-[11px] font-semibold text-[#262626]">{log.causer_name || '—'}</dd>
                                        <dd className="mt-0.5 break-words text-[10px] text-[#7F8C8D]">{log.causer_role || '—'}</dd>
                                    </div>
                                    <div className="col-span-2 min-w-0">
                                        <dt className="text-[10px] text-[#7F8C8D]">IP Address</dt>
                                        <dd className="mt-1 break-all font-mono text-[11px] text-[#262626]">{log.properties?.ip || '—'}</dd>
                                    </div>
                                </dl>
                                <button
                                    type="button"
                                    onClick={() => setSelectedLog(log)}
                                    className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#626262] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
                                >
                                    <DetailIcon /> Lihat detail
                                </button>
                            </article>
                        ))
                    ) : (
                        <div className="px-4 py-10 text-center">
                            <p className="text-sm font-semibold text-[#262626]">Tidak ada log ditemukan</p>
                            <p className="mt-1 text-xs text-[#7F8C8D]">Ubah kata kunci atau reset filter untuk melihat data lainnya.</p>
                        </div>
                    )}
                </div>

                {/* DESKTOP/TABLET TABLE */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px] text-left text-xs font-dmsans">
                        <thead className="bg-[#F5F5F5] font-montserrat text-[11px] font-bold uppercase tracking-wider text-[#7F8C8D]">
                            <tr>
                                <th className="px-6 py-3.5">DateTime</th>
                                <th className="px-6 py-3.5">Log Name</th>
                                <th className="px-6 py-3.5">Description</th>
                                <th className="px-6 py-3.5">Causer</th>
                                <th className="px-6 py-3.5">IP Address</th>
                                <th className="px-6 py-3.5">User Agent</th>
                                <th className="px-6 py-3.5">Event</th>
                                <th className="px-6 py-3.5 text-right">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB] bg-white">
                            {paginatedLogs.length > 0 ? (
                                paginatedLogs.map((log) => (
                                    <tr key={log.id} className="transition hover:bg-[#FCEBEC]/20">
                                        <td className="whitespace-nowrap px-6 py-4 font-mono text-[#7F8C8D]">{formatDateTime(log.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-md bg-[#F3F4F6] px-2.5 py-1 font-mono text-[10px] font-medium text-[#525252]">
                                                {log.log_name || 'default'}
                                            </span>
                                        </td>
                                        <td className="min-w-[200px] px-6 py-4">
                                            <p className="font-montserrat font-bold text-[#262626]">{log.description}</p>
                                            <p className="mt-0.5 text-[11px] text-[#7F8C8D]">ID: {log.id} · Subject ID: {log.subject_id ?? '—'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-montserrat font-bold text-[#262626]">{log.causer_name || '—'}</p>
                                            <p className="text-[11px] text-[#7F8C8D]">{log.causer_role} · ID {log.causer_id ?? '—'}</p>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-mono text-[#525252]">{log.properties?.ip || '—'}</td>
                                        <td className="max-w-[200px] px-6 py-4 text-[#7F8C8D]">
                                            <span className="block truncate" title={log.properties?.user_agent || 'Tidak tersedia'}>
                                                {log.properties?.user_agent || 'Tidak tersedia'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4"><EventBadge event={log.event} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLog(log)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5]"
                                            >
                                                <DetailIcon /> Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[#7F8C8D]">
                                        Tidak ada log ditemukan.
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
                            {filteredLogs.length === 0 ? 0 : startIndex + 1}
                        </span>{' '}
                        hingga{' '}
                        <span className="font-semibold text-[#262626]">
                            {Math.min(startIndex + itemsPerPage, filteredLogs.length)}
                        </span>{' '}
                        dari <span className="font-semibold text-[#262626]">{filteredLogs.length}</span> log
                    </p>

                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:justify-end">
                            <span className="px-1 text-xs text-[#7F8C8D] sm:hidden">Halaman {safePage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={safePage === 1}
                                className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Sebelumnya
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`hidden h-8 min-w-[32px] rounded-lg text-xs font-semibold transition sm:inline-flex sm:items-center sm:justify-center ${
                                        safePage === page
                                            ? 'bg-[#8B0F14] text-white shadow-sm'
                                            : 'border border-[#E5E7EB] bg-white text-[#262626] hover:bg-[#F5F5F5]'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={safePage === totalPages}
                                className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-xs text-[#7F8C8D] shadow-sm">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 11v5m0-8h.01" /></svg>
                <p>Mode demo frontend. Field <span className="font-mono">id</span>, <span className="font-mono">log_name</span>, <span className="font-mono">description</span>, <span className="font-mono">event</span>, <span className="font-mono">subject</span>, <span className="font-mono">causer</span>, <span className="font-mono">properties</span>, <span className="font-mono">created_at</span>, dan <span className="font-mono">updated_at</span> mengikuti struktur umum Spatie Activity Log. IP dan user agent pada contoh disimpan di properties.</p>
            </div>

            {/* DETAIL MODAL */}
            {selectedLog && (
                <div
                    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm sm:items-center sm:p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setSelectedLog(null);
                    }}
                >
                    <div className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-7">
                        <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
                            <div className="pr-4">
                                <h2 className="font-montserrat text-lg font-bold text-[#262626]">Detail Activity Log</h2>
                                <p className="mt-1 text-xs leading-5 text-[#7F8C8D]">Field log, actor, subject, timestamp, dan metadata request.</p>
                            </div>
                            <button type="button" onClick={() => setSelectedLog(null)} aria-label="Tutup detail" className="rounded-lg p-1.5 text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="mt-5 rounded-xl bg-[#F8F9FA] p-4 border border-[#E5E7EB]/60">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#7F8C8D]">Description</p>
                                    <p className="mt-1 text-sm font-bold text-[#262626]">{selectedLog.description}</p>
                                </div>
                                <EventBadge event={selectedLog.event} />
                            </div>
                            <p className="mt-3 text-xs text-[#626262]">Log Name: <span className="font-mono font-semibold">{selectedLog.log_name || 'default'}</span></p>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-[#E5E7EB] p-4">
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">Informasi Activity Log</h3>
                                <dl className="space-y-3 text-xs">
                                    {[
                                        ['ID', selectedLog.id],
                                        ['Event', selectedLog.event || '—'],
                                        ['Subject Type', selectedLog.subject_type || '—'],
                                        ['Subject ID', selectedLog.subject_id ?? '—'],
                                        ['Causer Type', selectedLog.causer_type || '—'],
                                        ['Causer ID', selectedLog.causer_id ?? '—'],
                                        ['Batch UUID', selectedLog.batch_uuid || '—'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex flex-col gap-1">
                                            <dt className="text-[#7F8C8D]">{label}</dt>
                                            <dd className="break-all font-medium text-[#262626]">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                            <div className="rounded-xl border border-[#E5E7EB] p-4">
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">Pengguna dan Request</h3>
                                <dl className="space-y-3 text-xs">
                                    {[
                                        ['Causer', selectedLog.causer_name || '—'],
                                        ['Role', selectedLog.causer_role || '—'],
                                        ['IP Address', selectedLog.properties?.ip || '—'],
                                        ['HTTP Method', selectedLog.properties?.method || '—'],
                                        ['Route', selectedLog.properties?.route || '—'],
                                        ['User Agent', selectedLog.properties?.user_agent || '—'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex flex-col gap-1">
                                            <dt className="text-[#7F8C8D]">{label}</dt>
                                            <dd className={`break-words font-medium text-[#262626] ${label === 'IP Address' ? 'font-mono' : ''}`}>{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-[#E5E7EB] p-4">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">Timestamp</h3>
                            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                                <div><p className="text-[#7F8C8D]">Created At</p><p className="mt-1 font-medium text-[#262626]">{formatDateTime(selectedLog.created_at)}</p></div>
                                <div><p className="text-[#7F8C8D]">Updated At</p><p className="mt-1 font-medium text-[#262626]">{formatDateTime(selectedLog.updated_at)}</p></div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-[#E5E7EB] p-4">
                            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">Properties (JSON)</h3>
                            <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#F9FAFB] p-3 font-mono text-[11px] leading-5 text-[#525252]">{JSON.stringify(selectedLog.properties || {}, null, 2)}</pre>
                        </div>

                        <div className="mt-5 flex justify-end border-t border-[#E5E7EB] pt-4">
                            <button type="button" onClick={() => setSelectedLog(null)} className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-5 py-2 text-xs font-semibold text-[#262626] shadow-sm hover:bg-[#F5F5F5] transition sm:w-auto">Tutup</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST ALERT */}
            {mounted && toast && createPortal(
                <>
                    <style>{`
                        @keyframes sivalden-logs-toast-progress {
                            from { width: 100%; }
                            to { width: 0%; }
                        }
                    `}</style>
                    <div
                        key={toast.id}
                        role={toast.type === 'error' ? 'alert' : 'status'}
                        aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                        className={`fixed left-1/2 top-4 z-[10000] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-lg border border-[#E5E7EB] border-l-4 bg-white shadow-md ${toast.type === 'error' ? 'border-l-[#D92020]' : 'border-l-[#1E8E3E]'}`}
                    >
                        <div className="flex items-center gap-2.5 px-3.5 py-3">
                            <div className={toast.type === 'error' ? 'shrink-0 text-[#D92020]' : 'shrink-0 text-[#1E8E3E]'}>
                                {toast.type === 'error' ? (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ) : (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                )}
                            </div>
                            <div className="min-w-0 flex-1 text-sm leading-snug text-[#262626]">
                                <span className="mr-1.5 font-semibold">{toast.type === 'error' ? 'Gagal.' : 'Berhasil.'}</span>
                                <span className="break-words text-[#525252]">{toast.message}</span>
                            </div>
                            <button type="button" onClick={() => setToast(null)} aria-label="Tutup notifikasi" className="shrink-0 rounded p-1 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#262626]">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="h-0.5 w-full overflow-hidden bg-[#F3F4F6]">
                            <div className={`h-full ${toast.type === 'error' ? 'bg-[#D92020]' : 'bg-[#1E8E3E]'}`} style={{ animation: 'sivalden-logs-toast-progress 4500ms linear forwards' }} />
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}

SystemLogsIndex.layout = (page) => <SuperadminLayout>{page}</SuperadminLayout>;