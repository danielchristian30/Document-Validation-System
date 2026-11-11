import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, router } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

const LOGS_URL = '/superadmin/system-logs';

const logNameOptions = [
    { value: 'Semua Log', label: 'Semua Log' },
    { value: 'default', label: 'default' },
    { value: 'authentication', label: 'authentication' },
    { value: 'user-management', label: 'user-management' },
    { value: 'security', label: 'security' },
];

const roleOptions = [
    'Semua Role',
    'Superadmin',
    'Admin',
    'Pegawai',
];

const perPageOptions = [10, 25, 50, 100];

function formatDateTime(value) {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    });
}

function EventBadge({ event }) {
    const normalizedEvent = event || '—';

    const isRiskEvent = [
        'access_denied',
        'blocked',
        'login_failed',
    ].includes(normalizedEvent);

    return (
        <span
            className={`inline-flex rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold ${
                isRiskEvent
                    ? 'bg-[#FCEBEC] text-[#8B0F14]'
                    : 'bg-[#F3F4F6] text-[#525252]'
            }`}
        >
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
        return (
            <svg {...common}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </svg>
        );
    }

    if (type === 'admin') {
        return (
            <svg {...common}>
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0114 0v2" />
            </svg>
        );
    }

    if (type === 'employee') {
        return (
            <svg {...common}>
                <circle cx="9" cy="8" r="3.5" />
                <path d="M2.5 20v-1.5a6.5 6.5 0 0111-4.6M16 11a3 3 0 100-6m2 9a5 5 0 013.5 4.8V20" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <path d="M4 5h16v14H4z" />
            <path d="M8 9h8M8 13h8M8 17h4" />
        </svg>
    );
}

function DetailIcon() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
        >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 11v5m0-8h.01" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <circle cx="11" cy="11" r="7" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16 16 4 4"
            />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
            />
        </svg>
    );
}

function LoadingIcon() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

function EmptyState() {
    return (
        <div className="px-4 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F9FAFB] text-[#9CA3AF]">
                <SearchIcon />
            </div>

            <p className="mt-3 text-sm font-semibold text-[#262626]">
                Tidak ada log ditemukan
            </p>

            <p className="mt-1 text-xs text-[#7F8C8D]">
                Ubah kata kunci atau reset filter untuk melihat data lainnya.
            </p>
        </div>
    );
}

function DetailField({ label, value, mono = false }) {
    return (
        <div className="flex min-w-0 flex-col gap-1">
            <dt className="text-[#7F8C8D]">{label}</dt>

            <dd
                className={`break-words font-medium text-[#262626] ${
                    mono ? 'font-mono' : ''
                }`}
            >
                {value ?? '—'}
            </dd>
        </div>
    );
}

export default function SystemLogsIndex({
    logs,
    stats,
    filters,
}) {
    // Data pagination dari Laravel.
    const paginatedLogs = logs?.data ?? [];

    const currentPage = logs?.current_page ?? 1;
    const lastPage = logs?.last_page ?? 1;
    const totalLogs = logs?.total ?? 0;

    // State filter.
    const [search, setSearch] = useState(
        filters?.search ?? ''
    );

    const [logNameFilter, setLogNameFilter] = useState(
        filters?.log_name ?? 'Semua Log'
    );

    const [roleFilter, setRoleFilter] = useState(
        filters?.role ?? 'Semua Role'
    );

    const [dateFilter, setDateFilter] = useState(
        filters?.date ?? 'Semua Waktu'
    );

    const [perPage, setPerPage] = useState(
        Number(filters?.per_page ?? 10)
    );

    // State UI.
    const [selectedLog, setSelectedLog] = useState(null);
    const [toast, setToast] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Menyimpan keyword terakhir yang sudah dikirim ke server.
    // Perbandingan dilakukan setelah trim agar spasi tambahan tidak memicu request baru.
    const lastRequestedSearch = useRef((filters?.search ?? '').trim());

    // Menyimpan timer debounce agar dapat dibatalkan oleh input/filter lain.
    const debounceTimer = useRef(null);

    // Mount.
    useEffect(() => {
        setMounted(true);
    }, []);

    // Toast notification.
    useEffect(() => {
        if (!toast) return undefined;

        const timer = window.setTimeout(() => {
            setToast(null);
        }, 4500);

        return () => window.clearTimeout(timer);
    }, [toast]);

    // Sinkronisasi filter dengan props Laravel.
    useEffect(() => {
        setSearch(filters?.search ?? '');
        setLogNameFilter(filters?.log_name ?? 'Semua Log');
        setRoleFilter(filters?.role ?? 'Semua Role');
        setDateFilter(filters?.date ?? 'Semua Waktu');
        setPerPage(Number(filters?.per_page ?? 10));
    }, [
        filters?.search,
        filters?.log_name,
        filters?.role,
        filters?.date,
        filters?.per_page,
    ]);

    // Helper fungsi terpusat untuk melakukan request data ke backend (Inertia)
    const fetchLogs = (overrides = {}) => {
        router.get(
            LOGS_URL,
            {
                search: (overrides.search !== undefined ? overrides.search : search).trim() || null,
                log_name: (overrides.log_name !== undefined ? overrides.log_name : logNameFilter) === 'Semua Log' ? null : (overrides.log_name !== undefined ? overrides.log_name : logNameFilter),
                role: (overrides.role !== undefined ? overrides.role : roleFilter) === 'Semua Role' ? null : (overrides.role !== undefined ? overrides.role : roleFilter),
                date: overrides.date !== undefined ? overrides.date : dateFilter,
                per_page: overrides.per_page !== undefined ? overrides.per_page : perPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['logs', 'stats', 'filters'],
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Debounce search: request hanya dikirim jika keyword yang sudah dinormalisasi berubah.
    useEffect(() => {
        const normalizedSearch = search.trim();

        // Contoh: 'admin' dan 'admin ' dianggap keyword yang sama.
        if (normalizedSearch === lastRequestedSearch.current) {
            return undefined;
        }

        // Batalkan timer sebelumnya setiap kali user mengetik lagi.
        if (debounceTimer.current) {
            window.clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = window.setTimeout(() => {
            lastRequestedSearch.current = normalizedSearch;
            fetchLogs({ search: normalizedSearch });
            debounceTimer.current = null;
        }, 400);

        return () => {
            if (debounceTimer.current) {
                window.clearTimeout(debounceTimer.current);
                debounceTimer.current = null;
            }
        };
    }, [search]);

    // Pastikan timer dibersihkan ketika komponen dilepas.
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                window.clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    // Dropdown dan jumlah data langsung melakukan request tanpa debounce.
    const handleDropdownChange = (key, value) => {
        // Cegah timer search yang masih menunggu mengirim request tambahan.
        if (debounceTimer.current) {
            window.clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }

        // Search saat ini ikut dipertahankan dalam request dropdown.
        lastRequestedSearch.current = search.trim();

        if (key === 'log_name') setLogNameFilter(value);
        if (key === 'role') setRoleFilter(value);
        if (key === 'date') setDateFilter(value);
        if (key === 'per_page') setPerPage(value);

        fetchLogs({ [key]: value });
    };

    // Navigasi halaman server-side.
    const changePage = (url) => {
        if (!url || isLoading) return;

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only: ['logs', 'stats', 'filters'],

            onStart: () => setIsLoading(true),

            onFinish: () => setIsLoading(false),
        });
    };

    // Reset filter.
    const resetFilters = () => {
        // Batalkan debounce agar tidak ada request search setelah reset.
        if (debounceTimer.current) {
            window.clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }

        lastRequestedSearch.current = '';

        setSearch('');
        setLogNameFilter('Semua Log');
        setRoleFilter('Semua Role');
        setDateFilter('Semua Waktu');
        setPerPage(10);

        // Langsung fetch data awal bersih.
        router.get(
            LOGS_URL,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['logs', 'stats', 'filters'],
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Format jumlah data.
    const formatNumber = (value) => {
        return Number(value ?? 0).toLocaleString('id-ID');
    };

    // Export CSV untuk halaman yang sedang ditampilkan.
    const exportCSV = () => {
        if (paginatedLogs.length === 0) {
            setToast({
                id: Date.now(),
                type: 'error',
                message: 'Tidak ada data log pada halaman ini.',
            });

            return;
        }

        const headers = [
            'ID',
            'Log Name',
            'Description',
            'Event',
            'Subject Type',
            'Subject ID',
            'Causer Type',
            'Causer ID',
            'Causer Name',
            'Causer Role',
            'IP',
            'User Agent',
            'HTTP Method',
            'Route',
            'Properties',
            'Batch UUID',
            'Created At',
            'Updated At',
        ];

        const rows = paginatedLogs.map((log) => [
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

        const escapeCSV = (value) => {
            return `"${String(value ?? '').replace(/"/g, '""')}"`;
        };

        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCSV).join(','))
            .join('\r\n');

        const blob = new Blob(
            ['\uFEFF', csv],
            { type: 'text/csv;charset=utf-8;' }
        );

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = `sivalden-system-logs-page-${currentPage}-${new Date().toISOString().slice(0, 10)}.csv`;

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);

        setToast({
            id: Date.now(),
            type: 'success',
            message: `${paginatedLogs.length} data log pada halaman ini berhasil diekspor.`,
        });
    };

    return (
        <SuperadminLayout>
            <Head title="System Logs" />

            <div className="w-full min-w-0 space-y-5 sm:space-y-7">

                {/* Header */}
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="rounded-full bg-[#FCEBEC] px-3.5 py-1 text-xs font-semibold text-[#8B0F14]">
                            Modul Audit
                        </span>

                        <h1 className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                            System Logs
                        </h1>

                        <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7F8C8D]">
                            Telusuri catatan aktivitas Sistem,
                            termasuk waktu, event, pelaku, alamat IP,
                            user agent, dan properties dari activity log.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={exportCSV}
                        disabled={paginatedLogs.length === 0 || isLoading}
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#262626] shadow-sm transition hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#8B0F14] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
                            />
                        </svg>

                        Ekspor CSV
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

                    {/* Total logs */}
                    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6 last:odd:col-span-2 xl:last:odd:col-span-1">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-xs font-medium text-[#7F8C8D]">
                                Total Log Tersedia
                            </p>

                            <span className="rounded-lg bg-[#FCEBEC] p-2 text-[#8B0F14]">
                                <SummaryIcon type="total" />
                            </span>
                        </div>

                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">
                            {formatNumber(stats?.total)}
                        </p>

                        <p className="mt-1 text-xs text-[#7F8C8D]">
                            Seluruh riwayat aktivitas
                        </p>
                    </div>

                    {/* Today */}
                    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6 last:odd:col-span-2 xl:last:odd:col-span-1">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-xs font-medium text-[#7F8C8D]">
                                Aktivitas Hari Ini
                            </p>

                            <span className="rounded-lg bg-[#FFF4E5] p-2 text-[#B7791F]">
                                <SummaryIcon type="today" />
                            </span>
                        </div>

                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">
                            {formatNumber(stats?.today)}
                        </p>

                        <p className="mt-1 text-xs text-[#7F8C8D]">
                            Berdasarkan created_at
                        </p>
                    </div>

                    {/* Admin */}
                    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6 last:odd:col-span-2 xl:last:odd:col-span-1">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-xs font-medium text-[#7F8C8D]">
                                Aktivitas Admin
                            </p>

                            <span className="rounded-lg bg-[#EAF6EE] p-2 text-[#1E8E3E]">
                                <SummaryIcon type="admin" />
                            </span>
                        </div>

                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#1E8E3E] sm:mt-3 sm:text-3xl">
                            {formatNumber(stats?.admin)}
                        </p>

                        <p className="mt-1 text-xs text-[#7F8C8D]">
                            Catatan oleh role Admin
                        </p>
                    </div>

                    {/* Employee */}
                    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6 last:odd:col-span-2 xl:last:odd:col-span-1">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-xs font-medium text-[#7F8C8D]">
                                Aktivitas Pegawai
                            </p>

                            <span className="rounded-lg bg-[#FCEBEC] p-2 text-[#8B0F14]">
                                <SummaryIcon type="employee" />
                            </span>
                        </div>

                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">
                            {formatNumber(stats?.employee)}
                        </p>

                        <p className="mt-1 text-xs text-[#7F8C8D]">
                            Catatan oleh role Pegawai
                        </p>
                    </div>
                </div>

                {/* Log table */}
                <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

                    {/* Filter header */}
                    <div className="border-b border-[#E5E7EB] p-4 sm:p-6">
                        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="font-montserrat text-base font-bold text-[#262626]">
                                    Riwayat Activity Log
                                </h2>

                                <p className="mt-1 text-xs text-[#7F8C8D]">
                                    Kolom utama mengikuti field Spatie Activity Log
                                    dan metadata request pada properties.
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative w-full lg:max-w-xs">
                                <svg
                                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F8C8D]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16 16 4 4"
                                    />
                                </svg>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Cari deskripsi, user, IP, user agent..."
                                    className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-xs text-[#262626] placeholder-[#9CA3AF] transition focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mt-4 grid grid-cols-2 gap-2 xl:flex xl:flex-wrap xl:items-center">

                            {/* Log category */}
                            <select
                                value={logNameFilter}
                                onChange={(event) => handleDropdownChange('log_name', event.target.value)}
                                className="w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#525252] focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14] xl:w-auto"
                            >
                                {logNameOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {/* Role */}
                            <select
                                value={roleFilter}
                                onChange={(event) => handleDropdownChange('role', event.target.value)}
                                className="w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#525252] focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14] xl:w-auto"
                            >
                                {roleOptions.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>

                            {/* Date */}
                            <select
                                value={dateFilter}
                                onChange={(event) => handleDropdownChange('date', event.target.value)}
                                className="w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#525252] focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14] xl:w-auto"
                            >
                                <option value="Semua Waktu">Semua Waktu</option>
                                <option value="Hari Ini">Hari Ini</option>
                                <option value="7 Hari Terakhir">7 Hari Terakhir</option>
                            </select>

                            {/* Per page */}
                            <select
                                value={perPage}
                                onChange={(event) => handleDropdownChange('per_page', Number(event.target.value))}
                                className="w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#525252] focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14] xl:w-auto"
                            >
                                {perPageOptions.map((value) => (
                                    <option key={value} value={value}>
                                        {value} data per halaman
                                    </option>
                                ))}
                            </select>

                            {/* Reset */}
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="col-span-2 w-full rounded-lg px-3 py-2.5 text-center text-xs font-semibold text-[#8B0F14] transition hover:bg-[#FCEBEC] xl:col-span-1 xl:ml-auto xl:w-auto"
                            >
                                Reset filter
                            </button>
                        </div>
                    </div>

                    {/* Result information */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
                        <p className="text-xs text-[#7F8C8D]">
                            Menampilkan{' '}
                            <span className="font-semibold text-[#262626]">
                                {formatNumber(totalLogs)}
                            </span>{' '}
                            data yang sesuai
                        </p>

                        <div className="inline-flex items-center gap-2 text-[11px] text-[#7F8C8D]">
                            {isLoading ? (
                                <>
                                    <LoadingIcon />
                                    <span>Memuat data...</span>
                                </>
                            ) : (
                                <>
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#1E8E3E]" />
                                    <span>Data dari database</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Loading overlay */}
                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 bg-white/50" />
                        )}

                        {/* Mobile activity cards */}
                        <div className="divide-y divide-[#E5E7EB] md:hidden">
                            {paginatedLogs.length > 0 ? (
                                paginatedLogs.map((log) => (
                                    <article
                                        key={log.id}
                                        className="space-y-3 p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="inline-flex max-w-full break-all rounded-md bg-[#F3F4F6] px-2.5 py-1 font-mono text-[10px] font-medium text-[#525252]">
                                                {log.log_name || 'default'}
                                            </span>

                                            <EventBadge event={log.event} />
                                        </div>

                                        <div>
                                            <p className="break-words text-sm font-semibold leading-5 text-[#262626]">
                                                {log.description || 'Tidak ada deskripsi'}
                                            </p>

                                            <p className="mt-1 text-[10px] text-[#7F8C8D]">
                                                ID: {log.id} · Subject ID: {log.subject_id ?? '—'}
                                            </p>
                                        </div>

                                        <dl className="grid grid-cols-2 gap-3 rounded-lg bg-[#F9FAFB] p-3 text-[11px]">
                                            <div className="min-w-0">
                                                <dt className="text-[#7F8C8D]">
                                                    Waktu
                                                </dt>

                                                <dd className="mt-1 break-words leading-4 text-[#262626]">
                                                    {formatDateTime(log.created_at)}
                                                </dd>
                                            </div>

                                            <div className="min-w-0">
                                                <dt className="text-[#7F8C8D]">
                                                    Pelaku
                                                </dt>

                                                <dd className="mt-1 break-words font-semibold text-[#262626]">
                                                    {log.causer_name || '—'}
                                                </dd>

                                                <dd className="mt-0.5 break-words text-[#7F8C8D]">
                                                    {log.causer_role || '—'}
                                                </dd>
                                            </div>

                                            <div className="col-span-2 min-w-0">
                                                <dt className="text-[#7F8C8D]">
                                                    IP Address
                                                </dt>

                                                <dd className="mt-1 break-all font-mono text-[#262626]">
                                                    {log.properties?.ip || '—'}
                                                </dd>
                                            </div>
                                        </dl>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedLog(log)}
                                            className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#626262] transition hover:border-[#F2C9CB] hover:bg-[#FCEBEC] hover:text-[#8B0F14]"
                                        >
                                            <DetailIcon />
                                            Lihat detail
                                        </button>
                                    </article>
                                ))
                            ) : (
                                <EmptyState />
                            )}
                        </div>

                        {/* Desktop/tablet table */}
                        <div className="hidden max-w-full overflow-x-auto overscroll-x-contain md:block">
                            <table className="w-full min-w-[1050px] border-collapse text-left">
                                <thead>
                                    <tr className="border-y border-[#E5E7EB] bg-[#F9FAFB]">
                                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            DateTime
                                        </th>

                                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            Log Name
                                        </th>

                                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            Description
                                        </th>

                                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            Causer
                                        </th>

                                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            IP Address
                                        </th>

                                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            User Agent
                                        </th>

                                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            Event
                                        </th>

                                        <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">
                                            Detail
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#E5E7EB]">
                                    {paginatedLogs.length > 0 ? (
                                        paginatedLogs.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="transition hover:bg-[#FCFCFC]"
                                            >
                                                <td className="whitespace-nowrap px-5 py-4 text-xs text-[#626262]">
                                                    {formatDateTime(log.created_at)}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex rounded-md bg-[#F3F4F6] px-2.5 py-1 font-mono text-[10px] font-medium text-[#525252]">
                                                        {log.log_name || 'default'}
                                                    </span>
                                                </td>

                                                <td className="min-w-[220px] px-5 py-4">
                                                    <p className="max-w-[280px] text-xs font-semibold text-[#262626]">
                                                        {log.description || 'Tidak ada deskripsi'}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-[#7F8C8D]">
                                                        ID: {log.id} · Subject ID: {log.subject_id ?? '—'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-xs font-semibold text-[#262626]">
                                                        {log.causer_name || '—'}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-[#7F8C8D]">
                                                        {log.causer_role || '—'} · ID {log.causer_id ?? '—'}
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-[#525252]">
                                                    {log.properties?.ip || '—'}
                                                </td>

                                                <td className="max-w-[230px] px-5 py-4 text-xs text-[#626262]">
                                                    <span
                                                        className="block max-w-[220px] truncate"
                                                        title={log.properties?.user_agent || 'Tidak tersedia'}
                                                    >
                                                        {log.properties?.user_agent || 'Tidak tersedia'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <EventBadge event={log.event} />
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedLog(log)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#626262] transition hover:border-[#F2C9CB] hover:bg-[#FCEBEC] hover:text-[#8B0F14]"
                                                    >
                                                        <DetailIcon />
                                                        Lihat detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8}>
                                                <EmptyState />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Server-side pagination */}
                    <div className="flex flex-col gap-3 border-t border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                        <p className="text-xs text-[#7F8C8D]">
                            Menampilkan{' '}
                            <span className="font-semibold text-[#262626]">
                                {formatNumber(logs?.from)}
                            </span>
                            {' '}–{' '}
                            <span className="font-semibold text-[#262626]">
                                {formatNumber(logs?.to)}
                            </span>
                            {' '}dari{' '}
                            <span className="font-semibold text-[#262626]">
                                {formatNumber(totalLogs)}
                            </span>
                            {' '}log
                        </p>

                        {logs?.links?.length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:justify-end">

                                <span className="mr-1 text-[11px] text-[#7F8C8D] sm:hidden">
                                    Halaman {currentPage} / {lastPage}
                                </span>

                                {logs.links.map((link, index) => {
                                    const label = link.label
                                        .replace('&laquo;', '‹')
                                        .replace('&raquo;', '›');

                                    return (
                                        <button
                                            key={`${link.label}-${index}`}
                                            type="button"
                                            disabled={!link.url || link.active || isLoading}
                                            onClick={() => changePage(link.url)}
                                            className={`
                                                h-8 min-w-8 rounded-lg px-3 text-xs font-semibold transition
                                                ${
                                                    link.active
                                                        ? 'bg-[#8B0F14] text-white'
                                                        : 'border border-[#E5E7EB] bg-white text-[#262626] hover:bg-[#F5F5F5]'
                                                }
                                                disabled:cursor-not-allowed disabled:opacity-40
                                            `}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Information */}
                <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-xs text-[#7F8C8D] shadow-sm">
                    <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0F14]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" d="M12 11v5m0-8h.01" />
                    </svg>

                    <p>
                        Data aktivitas ditampilkan berdasarkan catatan pada
                        tabel Activity Log. Informasi IP Address, User Agent,
                        HTTP Method, dan Route tersedia apabila metadata
                        request tersebut telah dicatat pada properties.
                    </p>
                </div>
            </div>

            {/* Detail modal */}
            {selectedLog && (
                <div
                    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm sm:items-center sm:p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedLog(null);
                        }
                    }}
                >
                    <div className="my-auto max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-7">

                        {/* Modal header */}
                        <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
                            <div className="pr-4">
                                <h2 className="font-montserrat text-lg font-bold text-[#262626]">
                                    Detail Activity Log
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-[#7F8C8D]">
                                    Field log, actor, subject, timestamp,
                                    dan metadata request.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedLog(null)}
                                aria-label="Tutup detail"
                                className="rounded-lg p-1.5 text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mt-5 rounded-xl bg-[#F9FAFB] p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#7F8C8D]">
                                        Description
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-[#262626]">
                                        {selectedLog.description || 'Tidak ada deskripsi'}
                                    </p>
                                </div>

                                <EventBadge event={selectedLog.event} />
                            </div>

                            <p className="mt-3 text-xs text-[#626262]">
                                Log Name:{' '}
                                <span className="font-mono font-semibold">
                                    {selectedLog.log_name || 'default'}
                                </span>
                            </p>
                        </div>

                        {/* Log information */}
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div className="rounded-xl border border-[#E5E7EB] p-4">
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">
                                    Informasi Activity Log
                                </h3>

                                <dl className="space-y-3 text-xs">
                                    <DetailField
                                        label="ID"
                                        value={selectedLog.id}
                                    />

                                    <DetailField
                                        label="Event"
                                        value={selectedLog.event}
                                    />

                                    <DetailField
                                        label="Subject Type"
                                        value={selectedLog.subject_type}
                                    />

                                    <DetailField
                                        label="Subject ID"
                                        value={selectedLog.subject_id}
                                    />

                                    <DetailField
                                        label="Causer Type"
                                        value={selectedLog.causer_type}
                                    />

                                    <DetailField
                                        label="Causer ID"
                                        value={selectedLog.causer_id}
                                    />

                                    <DetailField
                                        label="Batch UUID"
                                        value={selectedLog.batch_uuid}
                                    />
                                </dl>
                            </div>

                            {/* User and request */}
                            <div className="rounded-xl border border-[#E5E7EB] p-4">
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">
                                    Pengguna dan Request
                                </h3>

                                <dl className="space-y-3 text-xs">
                                    <DetailField
                                        label="Causer"
                                        value={selectedLog.causer_name}
                                    />

                                    <DetailField
                                        label="Role"
                                        value={selectedLog.causer_role}
                                    />

                                    <DetailField
                                        label="IP Address"
                                        value={selectedLog.properties?.ip}
                                        mono
                                    />

                                    <DetailField
                                        label="HTTP Method"
                                        value={selectedLog.properties?.method}
                                    />

                                    <DetailField
                                        label="Route"
                                        value={selectedLog.properties?.route}
                                    />

                                    <DetailField
                                        label="User Agent"
                                        value={selectedLog.properties?.user_agent}
                                    />
                                </dl>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="mt-4 rounded-xl border border-[#E5E7EB] p-4">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">
                                Timestamp
                            </h3>

                            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                                <div>
                                    <p className="text-[#7F8C8D]">
                                        Created At
                                    </p>

                                    <p className="mt-1 font-medium text-[#262626]">
                                        {formatDateTime(selectedLog.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#7F8C8D]">
                                        Updated At
                                    </p>

                                    <p className="mt-1 font-medium text-[#262626]">
                                        {formatDateTime(selectedLog.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Properties */}
                        <div className="mt-4 rounded-xl border border-[#E5E7EB] p-4">
                            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#7F8C8D]">
                                Properties (JSON)
                            </h3>

                            <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#F9FAFB] p-3 font-mono text-[11px] leading-5 text-[#525252]">
                                {JSON.stringify(
                                    selectedLog.properties || {},
                                    null,
                                    2
                                )}
                            </pre>
                        </div>

                        {/* Modal footer */}
                        <div className="mt-5 flex justify-end border-t border-[#E5E7EB] pt-4">
                            <button
                                type="button"
                                onClick={() => setSelectedLog(null)}
                                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#262626] transition hover:bg-[#F5F5F5] sm:w-auto"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast notification */}
            {mounted && toast && createPortal(
                <>
                    <style>
                        {`
                            @keyframes sivalden-logs-toast-progress {
                                from { width: 100%; }
                                to { width: 0%; }
                            }
                        `}
                    </style>

                    <div
                        key={toast.id}
                        role={toast.type === 'error' ? 'alert' : 'status'}
                        aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                        className={`fixed left-1/2 top-4 z-[10000] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-lg border border-[#E5E7EB] border-l-4 bg-white shadow-md ${
                            toast.type === 'error'
                                ? 'border-l-[#D92020]'
                                : 'border-l-[#1E8E3E]'
                        }`}
                    >
                        <div className="flex items-center gap-2.5 px-3.5 py-3">
                            <div
                                className={
                                    toast.type === 'error'
                                        ? 'shrink-0 text-[#D92020]'
                                        : 'shrink-0 text-[#1E8E3E]'
                                }
                            >
                                {toast.type === 'error' ? (
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>

                            <div className="min-w-0 flex-1 text-sm leading-snug text-[#262626]">
                                <span className="mr-1.5 font-semibold">
                                    {toast.type === 'error' ? 'Gagal.' : 'Berhasil.'}
                                </span>

                                <span className="break-words text-[#525252]">
                                    {toast.message}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setToast(null)}
                                aria-label="Tutup notifikasi"
                                className="shrink-0 rounded p-1 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#262626]"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="h-0.5 w-full overflow-hidden bg-[#F3F4F6]">
                            <div
                                className={`h-full ${
                                    toast.type === 'error'
                                        ? 'bg-[#D92020]'
                                        : 'bg-[#1E8E3E]'
                                }`}
                                style={{
                                    animation: 'sivalden-logs-toast-progress 4500ms linear forwards',
                                }}
                            />
                        </div>
                    </div>
                </>,
                document.body
            )}
        </SuperadminLayout>
    );
}