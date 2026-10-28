import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, useForm, router } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

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

export default function IPBlocklistIndex({ blockedIps }) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [showModal, setShowModal] = useState(false);
    const [selectedUnblockIP, setSelectedUnblockIP] = useState(null);

    // Inertia form untuk tambah IP blokir manual
    const { data, setData, post, processing, reset, errors } = useForm({
        ip_address: '',
        reason: '',
    });

    // Filter data di sisi frontend berdasarkan pencarian & sumber
    const filteredIPs = blockedIps.data.filter((item) => {
        const keyword = search.trim().toLowerCase();
        const matchesSearch =
            item.ip_address.toLowerCase().includes(keyword) ||
            (item.reason && item.reason.toLowerCase().includes(keyword));
        
        const sourceLabel = item.source === 'automatic' ? 'Otomatis' : 'Manual';
        const matchesFilter = activeFilter === 'Semua' || sourceLabel === activeFilter;

        return matchesSearch && matchesFilter;
    });

    const automaticCount = blockedIps.data.filter((item) => item.source === 'automatic').length;
    const manualCount = blockedIps.data.filter((item) => item.source === 'manual').length;

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route('superadmin.ip-blocklist.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const confirmUnblockIP = () => {
        if (!selectedUnblockIP) return;

        router.delete(route('superadmin.ip-blocklist.destroy', selectedUnblockIP.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedUnblockIP(null);
            },
        });
    };

    return (
        <SuperadminLayout>
            <Head title="IP Blocklist" />

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
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-[#7F8C8D]">Total IP Diblokir</p>
                            <span className="rounded-lg bg-[#FCEBEC] p-2 text-[#8B0F14]"><StatIcon type="shield" /></span>
                        </div>
                        <p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-3 sm:text-3xl">{blockedIps.total}</p>
                        <p className="mt-1 text-xs text-[#7F8C8D]">Alamat IP dalam daftar blokir aktif</p>
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
                                {filteredIPs.length > 0 ? filteredIPs.map((item) => {
                                    const sourceLabel = item.source === 'automatic' ? 'Otomatis' : 'Manual';
                                    return (
                                        <tr key={item.id} className="transition hover:bg-[#FCFCFC]">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                            <circle cx="12" cy="12" r="9" />
                                                            <path strokeLinecap="round" d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4" />
                                                        </svg>
                                                    </span>
                                                    <span className="font-mono text-xs font-semibold text-[#262626]">{item.ip_address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-[#626262]">{item.reason || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.source === 'automatic' ? 'bg-[#FCEBEC] text-[#8B0F14]' : 'bg-[#F3F4F6] text-[#525252]'}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${item.source === 'automatic' ? 'bg-[#D92020]' : 'bg-[#737373]'}`} />
                                                    {sourceLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-[#626262]">{new Date(item.created_at).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 text-xs text-[#626262]">
                                                {item.expires_at ? new Date(item.expires_at).toLocaleString('id-ID') : <span className="font-medium text-[#8B0F14]">Permanen</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedUnblockIP(item)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#F2C9CB] px-3 py-2 text-[11px] font-semibold text-[#8B0F14] transition hover:bg-[#FCEBEC]"
                                                >
                                                    Buka blokir
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-14 text-center">
                                            <p className="text-sm font-semibold text-[#262626]">Tidak ada IP ditemukan</p>
                                            <p className="mt-1 text-xs text-[#7F8C8D]">Coba ubah kata kunci atau filter pencarian.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Modal Tambah IP Blokir */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h2 className="text-lg font-bold text-[#262626]">Blokir Alamat IP Manual</h2>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#262626]">Alamat IP</label>
                                <input
                                    type="text"
                                    value={data.ip_address}
                                    onChange={(e) => setData('ip_address', e.target.value)}
                                    placeholder="Contoh: 192.168.1.50"
                                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs text-[#262626] focus:border-[#8B0F14] focus:ring-[#8B0F14]"
                                />
                                {errors.ip_address && <p className="mt-1 text-xs text-red-600">{errors.ip_address}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#262626]">Alasan Pemblokiran</label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="Masukkan alasan..."
                                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs text-[#262626] focus:border-[#8B0F14] focus:ring-[#8B0F14]"
                                    rows="3"
                                />
                                {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason}</p>}
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#626262]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-[#8B0F14] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6B0A0F]"
                                >
                                    Simpan & Blokir
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Konfirmasi Unblock */}
            {selectedUnblockIP && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h2 className="text-lg font-bold text-[#262626]">Yakin ingin membuka blokir IP?</h2>
                        <p className="mt-1 text-xs text-[#7F8C8D]">
                            Alamat IP <span className="font-mono font-semibold text-[#262626]">{selectedUnblockIP.ip_address}</span> akan kembali diizinkan mengakses sistem.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedUnblockIP(null)}
                                className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#626262]"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmUnblockIP}
                                className="rounded-lg bg-[#D92020] px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                            >
                                Ya, Cabut Blokir
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </SuperadminLayout>
    );
}