import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { EmptyState, Icon, PageHeader, PanelHeader, SearchField, StatCard, StatusBadge } from '@/Components/AdminUI';

const initialLogs = [
    { id: 1, code: 'DOC-2026-0148', document: 'Surat Keterangan Domisili', category: 'Surat Keterangan', actor: 'Ni Made Puspita', action: 'Dokumen ditandatangani', date: '28 Okt 2026, 09.42', status: 'Terverifikasi' },
    { id: 2, code: 'DOC-2026-0147', document: 'Surat Permohonan Informasi', category: 'Surat Permohonan', actor: 'I Putu Aditya', action: 'Dokumen diunggah', date: '28 Okt 2026, 09.15', status: 'Menunggu Verifikasi' },
    { id: 3, code: 'DOC-2026-0146', document: 'Surat Rekomendasi Usaha', category: 'Surat Rekomendasi', actor: 'Ni Luh Sari', action: 'Kategori diperbarui', date: '28 Okt 2026, 08.58', status: 'Valid' },
    { id: 4, code: 'DOC-2026-0145', document: 'Surat Pengantar RT/RW', category: 'Surat Pengantar', actor: 'I Made Wira', action: 'Dokumen diperiksa', date: '27 Okt 2026, 16.35', status: 'Menunggu Verifikasi' },
    { id: 5, code: 'DOC-2026-0144', document: 'Surat Keterangan Usaha', category: 'Surat Keterangan', actor: 'Ni Made Puspita', action: 'Dokumen diverifikasi', date: '27 Okt 2026, 15.20', status: 'Terverifikasi' },
    { id: 6, code: 'DOC-2026-0143', document: 'Surat Keterangan Tidak Mampu', category: 'Surat Keterangan', actor: 'I Kadek Mahendra', action: 'Dokumen diterbitkan', date: '27 Okt 2026, 13.04', status: 'Valid' },
    { id: 7, code: 'DOC-2026-0142', document: 'Surat Rekomendasi Kegiatan', category: 'Surat Rekomendasi', actor: 'Komang Pradnya', action: 'Dokumen dicabut', date: '27 Okt 2026, 11.45', status: 'Dicabut' },
];

export default function DocumentActivityLogIndex() {
    const [logs] = useState(initialLogs);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [actionFilter, setActionFilter] = useState('Semua Aktivitas');

    const filteredLogs = useMemo(() => logs.filter((log) => {
        const keyword = searchQuery.trim().toLowerCase();
        const matchesSearch = !keyword || [log.code, log.document, log.category, log.actor, log.action].some((value) => value.toLowerCase().includes(keyword));
        const matchesStatus = statusFilter === 'Semua Status' || log.status === statusFilter;
        const matchesAction = actionFilter === 'Semua Aktivitas' || log.action === actionFilter;
        return matchesSearch && matchesStatus && matchesAction;
    }), [logs, searchQuery, statusFilter, actionFilter]);

    const verifiedCount = logs.filter((log) => ['Valid', 'Terverifikasi'].includes(log.status)).length;
    const reviewCount = logs.filter((log) => log.status === 'Menunggu Verifikasi').length;
    const revokedCount = logs.filter((log) => log.status === 'Dicabut').length;

    return (
        <AdminLayout>
            <Head title="Aktivitas Dokumen - SIVALDEN" />
            <PageHeader title="Aktivitas Dokumen" description="Tinjau jejak aktivitas dokumen, termasuk pengunggahan, pemeriksaan, verifikasi, penerbitan, dan pencabutan." />

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <StatCard label="Log Aktivitas" value={logs.length} detail="Contoh entri pada halaman ini" icon="activity" tone="maroon" />
                <StatCard label="Dokumen Valid" value={verifiedCount} detail="Valid atau sudah terverifikasi" icon="check" tone="green" />
                <div className="col-span-2 sm:col-span-1"><StatCard label="Menunggu Verifikasi" value={reviewCount} detail={`${revokedCount} dokumen dicabut dalam data contoh`} icon="clock" tone="amber" /></div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="p-4 sm:p-5">
                    <PanelHeader title="Riwayat Aktivitas" subtitle="Cari berdasarkan nama dokumen, kode, pegawai, atau jenis aktivitas." />
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Cari dokumen atau pegawai..." />
                        <label className="relative block"><span className="sr-only">Filter status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-xs text-[#525252] outline-none focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]"><option>Semua Status</option><option>Valid</option><option>Terverifikasi</option><option>Menunggu Verifikasi</option><option>Dicabut</option></select><Icon name="filter" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7F8C8D]" /></label>
                        <label className="relative block"><span className="sr-only">Filter aktivitas</span><select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} className="w-full appearance-none rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-xs text-[#525252] outline-none focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]"><option>Semua Aktivitas</option>{[...new Set(logs.map((log) => log.action))].map((action) => <option key={action}>{action}</option>)}</select><Icon name="filter" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7F8C8D]" /></label>
                    </div>
                </div>

                <div className="divide-y divide-[#E5E7EB] md:hidden">
                    {filteredLogs.length ? filteredLogs.map((log) => (
                        <article key={log.id} className="space-y-3 p-4">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]"><Icon name="document" size={17} /></div>
                                <div className="min-w-0 flex-1"><p className="break-words text-sm font-bold text-[#262626]">{log.document}</p><p className="mt-1 break-all font-mono text-[10px] text-[#7F8C8D]">{log.code}</p><p className="mt-1 break-words text-[11px] text-[#525252]">{log.action}</p></div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F1F2] pt-3"><div className="min-w-0"><p className="text-[10px] text-[#7F8C8D]">Pelaksana</p><p className="mt-1 break-words text-xs font-semibold text-[#262626]">{log.actor}</p></div><StatusBadge status={log.status} /></div>
                            <p className="text-[10px] text-[#9CA3AF]">{log.date} · {log.category}</p>
                        </article>
                    )) : <EmptyState title="Aktivitas tidak ditemukan" />}
                </div>

                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[900px] text-left text-xs">
                        <thead className="bg-[#F9FAFB] font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]"><tr><th className="px-5 py-3.5">Dokumen</th><th className="px-5 py-3.5">Aktivitas</th><th className="px-5 py-3.5">Pelaksana</th><th className="px-5 py-3.5">Waktu</th><th className="px-5 py-3.5">Status</th></tr></thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {filteredLogs.length ? filteredLogs.map((log) => <tr key={log.id} className="transition hover:bg-[#FCEBEC]/20"><td className="px-5 py-4"><p className="font-semibold text-[#262626]">{log.document}</p><p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">{log.code} · {log.category}</p></td><td className="px-5 py-4 text-[#525252]">{log.action}</td><td className="px-5 py-4 text-[#525252]">{log.actor}</td><td className="whitespace-nowrap px-5 py-4 text-[10px] text-[#7F8C8D]">{log.date}</td><td className="px-5 py-4"><StatusBadge status={log.status} /></td></tr>) : <tr><td colSpan={5}><EmptyState title="Aktivitas tidak ditemukan" /></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-1 border-t border-[#E5E7EB] px-4 py-3 text-[10px] text-[#7F8C8D] sm:flex-row sm:items-center sm:justify-between sm:px-5"><span>Menampilkan {filteredLogs.length} dari {logs.length} aktivitas</span><span>Data contoh untuk kebutuhan visualisasi</span></div>
            </section>
        </AdminLayout>
    );
}