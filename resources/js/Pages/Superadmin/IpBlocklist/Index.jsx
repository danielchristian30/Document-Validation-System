import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Head } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

const initialBlockedIPs = [
    {
        id: 1,
        ip: '192.0.2.44',
        reason: 'Percobaan login berulang',
        source: 'Otomatis',
        blockedAt: '27 Okt 2026, 08:42',
        expiresAt: '27 Okt 2026, 20:42',
    },
    {
        id: 2,
        ip: '198.51.100.27',
        reason: 'Aktivitas mencurigakan',
        source: 'Manual',
        blockedAt: '27 Okt 2026, 08:15',
        expiresAt: 'Permanen',
    },
    {
        id: 3,
        ip: '203.0.113.18',
        reason: 'Melebihi batas permintaan',
        source: 'Otomatis',
        blockedAt: '26 Okt 2026, 22:06',
        expiresAt: '27 Okt 2026, 10:06',
    },
    {
        id: 4,
        ip: '192.0.2.91',
        reason: 'Pemblokiran oleh administrator',
        source: 'Manual',
        blockedAt: '25 Okt 2026, 14:30',
        expiresAt: 'Permanen',
    },
];

function StatIcon({ type }) {
    const common = {
        className: 'h-5 w-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    };

    if (type === 'shield') {
        return (
            <svg {...common}>
                <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        );
    }

    if (type === 'clock') {
        return (
            <svg {...common}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </svg>
        );
    }

    if (type === 'zap') {
        return (
            <svg {...common}>
                <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="12" r="9" />
        </svg>
    );
}

export default function IPBlocklistIndex() {
    const [blockedIPs, setBlockedIPs] = useState(initialBlockedIPs);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [showModal, setShowModal] = useState(false);
    const [selectedUnblockIP, setSelectedUnblockIP] = useState(null);
    const [form, setForm] = useState({ ip: '', reason: '', duration: '24 jam' });
    const [formError, setFormError] = useState('');
    const [toast, setToast] = useState(null);

    // Samakan notifikasi dengan halaman Manajemen Pengguna.
    useEffect(() => {
        if (!toast || toast.type === 'loading') return;

        const timer = window.setTimeout(() => {
            setToast(null);
        }, 4500);

        return () => window.clearTimeout(timer);
    }, [toast]);

    const showToast = (type, message) => {
        setToast({ id: Date.now(), type, message });
    };

    const filteredIPs = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return blockedIPs.filter((item) => {
            const matchesSearch =
                item.ip.toLowerCase().includes(keyword) ||
                item.reason.toLowerCase().includes(keyword) ||
                item.source.toLowerCase().includes(keyword);
            const matchesFilter = activeFilter === 'Semua' || item.source === activeFilter;

            return matchesSearch && matchesFilter;
        });
    }, [blockedIPs, search, activeFilter]);

    const todayCount = blockedIPs.filter((item) => item.blockedAt.startsWith('27 Okt 2026')).length;
    const automaticCount = blockedIPs.filter((item) => item.source === 'Otomatis').length;
    const manualCount = blockedIPs.filter((item) => item.source === 'Manual').length;

    const closeModal = () => {
        setShowModal(false);
        setForm({ ip: '', reason: '', duration: '24 jam' });
        setFormError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const ip = form.ip.trim();

        if (!ip || !form.reason.trim()) {
            const message = 'Alamat IP dan alasan pemblokiran wajib diisi.';
            setFormError(message);
            showToast('error', message);
            return;
        }

        if (blockedIPs.some((item) => item.ip.toLowerCase() === ip.toLowerCase())) {
            const message = 'Alamat IP tersebut sudah ada di daftar blokir.';
            setFormError(message);
            showToast('error', message);
            return;
        }

        const blockedAt = '27 Okt 2026, 09:00';
        const expiresAt = form.duration === 'Permanen'
            ? 'Permanen'
            : form.duration === '1 jam'
                ? '27 Okt 2026, 10:00'
                : form.duration === '12 jam'
                    ? '27 Okt 2026, 21:00'
                    : '28 Okt 2026, 09:00';

        setBlockedIPs((current) => [
            {
                id: Date.now(),
                ip,
                reason: form.reason.trim(),
                source: 'Manual',
                blockedAt,
                expiresAt,
            },
            ...current,
        ]);
        closeModal();
        showToast('success', `Alamat IP ${ip} berhasil ditambahkan ke daftar blocklist demo.`);
    };

    // Buka dialog konfirmasi terlebih dahulu, jangan langsung menghapus IP.
    const requestUnblockIP = (id) => {
        const targetIP = blockedIPs.find((item) => item.id === id);
        if (targetIP) setSelectedUnblockIP(targetIP);
    };

    const cancelUnblockIP = () => setSelectedUnblockIP(null);

    const confirmUnblockIP = () => {
        if (!selectedUnblockIP) return;

        const targetIP = selectedUnblockIP;
        setBlockedIPs((current) => current.filter((item) => item.id !== targetIP.id));
        setSelectedUnblockIP(null);
        showToast('success', `Alamat IP ${targetIP.ip} berhasil dihapus dari daftar blocklist demo.`);
    };

    return (
        <SuperadminLayout>
            <Head title="IP Blocklist" />

            {/* TOAST ALERT: konsisten dengan halaman Manajemen Pengguna */}
            {toast && createPortal(
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

            <div className="w-full min-w-0 space-y-5 sm:space-y-7">
                {/* Page heading */}
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="mt-1 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                            IP Blocklist
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#7F8C8D]">
                            Kelola alamat IP yang diblokir untuk membantu melindungi sistem dari akses mencurigakan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#8B0F14] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] focus:outline-none focus:ring-2 focus:ring-[#8B0F14] focus:ring-offset-2 sm:w-auto"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                        </svg>
                        Blokir IP
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-[#7F8C8D]">Total IP Diblokir</p>
                            <span className="rounded-lg bg-[#FCEBEC] p-2 text-[#8B0F14]"><StatIcon type="shield" /></span>
                        </div>
                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{blockedIPs.length}</p>
                        <p className="mt-1 text-xs text-[#7F8C8D]">Alamat IP dalam daftar blokir</p>
                    </div>

                    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-[#7F8C8D]">Diblokir Hari Ini</p>
                            <span className="rounded-lg bg-[#FFF4E5] p-2 text-[#B7791F]"><StatIcon type="clock" /></span>
                        </div>
                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{todayCount}</p>
                        <p className="mt-1 text-xs text-[#7F8C8D]">Pemblokiran pada hari ini</p>
                    </div>

                    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-[#7F8C8D]">Blokir Otomatis</p>
                            <span className="rounded-lg bg-[#FCEBEC] p-2 text-[#8B0F14]"><StatIcon type="zap" /></span>
                        </div>
                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#D92020] sm:mt-3 sm:text-3xl">{automaticCount}</p>
                        <p className="mt-1 text-xs text-[#7F8C8D]">Dipicu sistem keamanan</p>
                    </div>

                    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-[#7F8C8D]">Blokir Manual</p>
                            <span className="rounded-lg bg-[#F3F4F6] p-2 text-[#626262]"><StatIcon type="manual" /></span>
                        </div>
                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{manualCount}</p>
                        <p className="mt-1 text-xs text-[#7F8C8D]">Ditambahkan administrator</p>
                    </div>
                </div>

                {/* Main table panel */}
                <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                    <div className="flex min-w-0 flex-col gap-4 border-b border-[#E5E7EB] p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="font-montserrat text-base font-bold text-[#262626]">Daftar IP yang Diblokir</h2>
                            <p className="mt-1 text-xs text-[#7F8C8D]">Pantau alasan, sumber, dan masa berlaku pemblokiran.</p>
                        </div>

                        <div className="relative w-full min-w-0 lg:max-w-xs">
                            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="11" cy="11" r="7" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16 16 4 4" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari IP atau alasan..."
                                className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-xs text-[#262626] placeholder-[#9CA3AF] transition focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
                        {['Semua', 'Manual', 'Otomatis'].map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                                    activeFilter === filter
                                        ? 'bg-[#8B0F14] text-white shadow-sm'
                                        : 'border border-[#E5E7EB] bg-white text-[#626262] hover:bg-[#F9FAFB]'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                        <span className="ml-auto text-xs text-[#7F8C8D]">{filteredIPs.length} data</span>
                    </div>

                    {/* Mobile view: each IP becomes a compact card */}
                    <div className="mt-3 divide-y divide-[#E5E7EB] md:hidden">
                        {filteredIPs.length > 0 ? filteredIPs.map((item) => (
                            <article key={item.id} className="space-y-3 p-4">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <circle cx="12" cy="12" r="9" />
                                                <path strokeLinecap="round" d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4" />
                                            </svg>
                                        </span>
                                        <div className="min-w-0">
                                            <p className="break-all font-mono text-xs font-bold text-[#262626]">{item.ip}</p>
                                            <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${item.source === 'Otomatis' ? 'bg-[#FCEBEC] text-[#8B0F14]' : 'bg-[#F3F4F6] text-[#525252]'}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${item.source === 'Otomatis' ? 'bg-[#D92020]' : 'bg-[#737373]'}`} />
                                                {item.source}
                                            </span>
                                        </div>
                                    </div>
                                    {item.expiresAt === 'Permanen' && <span className="shrink-0 rounded-md bg-[#FCEBEC] px-2 py-1 text-[10px] font-semibold text-[#8B0F14]">Permanen</span>}
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7F8C8D]">Alasan Pemblokiran</p>
                                    <p className="mt-1 break-words text-xs leading-5 text-[#525252]">{item.reason}</p>
                                </div>
                                <dl className="grid grid-cols-2 gap-3 rounded-lg bg-[#F9FAFB] p-3 text-[11px]">
                                    <div className="min-w-0">
                                        <dt className="text-[#7F8C8D]">Waktu Diblokir</dt>
                                        <dd className="mt-1 break-words leading-4 text-[#262626]">{item.blockedAt}</dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-[#7F8C8D]">Kedaluwarsa</dt>
                                        <dd className={`mt-1 break-words leading-4 ${item.expiresAt === 'Permanen' ? 'font-semibold text-[#8B0F14]' : 'text-[#262626]'}`}>{item.expiresAt}</dd>
                                    </div>
                                </dl>
                                <button
                                    type="button"
                                    onClick={() => requestUnblockIP(item.id)}
                                    className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-[#F2C9CB] px-3 py-2 text-xs font-semibold text-[#8B0F14] transition hover:bg-[#FCEBEC]"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
                                    </svg>
                                    Buka blokir
                                </button>
                            </article>
                        )) : (
                            <div className="px-4 py-10 text-center">
                                <p className="text-sm font-semibold text-[#262626]">Tidak ada IP ditemukan</p>
                                <p className="mt-1 text-xs text-[#7F8C8D]">Coba ubah kata kunci atau filter pencarian.</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop/tablet table */}
                    <div className="mt-4 hidden max-w-full overflow-x-auto overscroll-x-contain md:block">
                        <table className="w-full min-w-[850px] border-collapse text-left">
                            <thead>
                                <tr className="border-y border-[#E5E7EB] bg-[#F9FAFB]">
                                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">Alamat IP</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">Alasan Pemblokiran</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">Sumber</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">Waktu Diblokir</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">Kedaluwarsa</th>
                                    <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-[#7F8C8D]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]">
                                {filteredIPs.length > 0 ? filteredIPs.map((item) => (
                                    <tr key={item.id} className="transition hover:bg-[#FCFCFC]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                        <circle cx="12" cy="12" r="9" />
                                                        <path strokeLinecap="round" d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4" />
                                                    </svg>
                                                </span>
                                                <span className="font-mono text-xs font-semibold text-[#262626]">{item.ip}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[#626262]">{item.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.source === 'Otomatis' ? 'bg-[#FCEBEC] text-[#8B0F14]' : 'bg-[#F3F4F6] text-[#525252]'}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${item.source === 'Otomatis' ? 'bg-[#D92020]' : 'bg-[#737373]'}`} />
                                                {item.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[#626262]">{item.blockedAt}</td>
                                        <td className="px-6 py-4 text-xs text-[#626262]">
                                            {item.expiresAt === 'Permanen' ? (
                                                <span className="font-medium text-[#8B0F14]">Permanen</span>
                                            ) : item.expiresAt}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => requestUnblockIP(item.id)}
                                                title="Buka blokir (demo frontend)"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#F2C9CB] px-3 py-2 text-[11px] font-semibold text-[#8B0F14] transition hover:bg-[#FCEBEC]"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
                                                </svg>
                                                Buka blokir
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-14 text-center">
                                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F9FAFB] text-[#9CA3AF]">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                    <circle cx="11" cy="11" r="7" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16 16 4 4" />
                                                </svg>
                                            </div>
                                            <p className="mt-3 text-sm font-semibold text-[#262626]">Tidak ada IP ditemukan</p>
                                            <p className="mt-1 text-xs text-[#7F8C8D]">Coba ubah kata kunci atau filter pencarian.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-[#E5E7EB] px-4 py-4 text-xs text-[#7F8C8D] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <span>Menampilkan {filteredIPs.length} dari {blockedIPs.length} alamat IP</span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1E8E3E]" />
                            Tampilan demo · data belum terhubung ke server
                        </span>
                    </div>
                </section>
            </div>

            {/* Confirmation modal: buka blokir IP */}
            {selectedUnblockIP && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm sm:items-center sm:p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) cancelUnblockIP();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="unblock-confirm-title"
                        className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-7"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D92020]/10 text-[#D92020]">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 id="unblock-confirm-title" className="font-montserrat text-lg font-bold text-[#262626]">
                                    Yakin ingin membuka blokir IP?
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-[#7F8C8D]">
                                    Anda akan menghapus alamat IP berikut dari daftar blokir. Pastikan aktivitas dari alamat ini sudah aman sebelum melanjutkan.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7F8C8D]">Alamat IP yang dipilih</p>
                            <p className="mt-1 font-mono text-sm font-bold text-[#262626]">{selectedUnblockIP.ip}</p>
                            <p className="mt-2 text-xs text-[#626262]">Alasan: {selectedUnblockIP.reason}</p>
                            <p className="mt-1 text-xs text-[#626262]">Sumber blokir: {selectedUnblockIP.source}</p>
                        </div>

                        <p className="mt-4 text-xs leading-5 text-[#8B0F14]">
                            Pada sistem yang sudah terintegrasi, menghapus blokir dapat membuat alamat IP ini bisa mengakses layanan kembali sesuai aturan keamanan yang berlaku.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={cancelUnblockIP}
                                className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#262626] transition hover:bg-[#F5F5F5] sm:w-auto"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmUnblockIP}
                                className="w-full rounded-[8px] bg-[#8B0F14] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] focus:outline-none focus:ring-2 focus:ring-[#8B0F14] focus:ring-offset-2 sm:w-auto"
                            >
                                Ya, Buka Blokir
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Add IP modal: frontend demo only */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm sm:items-center sm:p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <div className="my-auto max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-7">
                        <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
                            <div>
                                <h2 className="font-montserrat text-lg font-bold text-[#262626]">Blokir Alamat IP</h2>
                                <p className="mt-1 text-xs leading-5 text-[#7F8C8D]">Tambahkan alamat IP ke daftar blokir secara manual.</p>
                            </div>
                            <button type="button" onClick={closeModal} aria-label="Tutup modal" className="rounded-lg p-1.5 text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">Alamat IP <span className="text-[#D92020]">*</span></label>
                                <input
                                    type="text"
                                    value={form.ip}
                                    onChange={(event) => { setForm({ ...form, ip: event.target.value }); setFormError(''); }}
                                    placeholder="Contoh: 192.0.2.10"
                                    required
                                    className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#262626] placeholder-[#9CA3AF] focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">Alasan Pemblokiran <span className="text-[#D92020]">*</span></label>
                                <textarea
                                    value={form.reason}
                                    onChange={(event) => { setForm({ ...form, reason: event.target.value }); setFormError(''); }}
                                    placeholder="Jelaskan alasan alamat IP diblokir..."
                                    rows={3}
                                    required
                                    className="w-full resize-none rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#262626] placeholder-[#9CA3AF] focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#262626]">Durasi Pemblokiran</label>
                                <select
                                    value={form.duration}
                                    onChange={(event) => setForm({ ...form, duration: event.target.value })}
                                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-xs text-[#262626] focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
                                >
                                    <option value="1 jam">1 jam</option>
                                    <option value="12 jam">12 jam</option>
                                    <option value="24 jam">24 jam</option>
                                    <option value="Permanen">Permanen</option>
                                </select>
                            </div>

                            {formError && <p className="text-xs text-[#D92020]">{formError}</p>}

                            <div className="flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                                <button type="button" onClick={closeModal} className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#262626] transition hover:bg-[#F5F5F5] sm:w-auto">Batal</button>
                                <button type="submit" className="w-full rounded-lg bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] sm:w-auto">Tambahkan ke Blocklist</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperadminLayout>
    );
}