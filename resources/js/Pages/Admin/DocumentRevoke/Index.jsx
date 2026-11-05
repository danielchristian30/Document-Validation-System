import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { EmptyState, Icon, PageHeader, PanelHeader, SearchField, StatusBadge } from '@/Components/AdminUI';

const initialDocuments = [
    { id: 1, code: 'DOC-2026-0148', name: 'Surat Keterangan Domisili', category: 'Surat Keterangan', owner: 'Ni Made Puspita', issuedAt: '28 Okt 2026', status: 'Valid', reason: '' },
    { id: 2, code: 'DOC-2026-0146', name: 'Surat Rekomendasi Usaha', category: 'Surat Rekomendasi', owner: 'Ni Luh Sari', issuedAt: '27 Okt 2026', status: 'Valid', reason: '' },
    { id: 3, code: 'DOC-2026-0143', name: 'Surat Keterangan Tidak Mampu', category: 'Surat Keterangan', owner: 'I Kadek Mahendra', issuedAt: '26 Okt 2026', status: 'Dicabut', reason: 'Data pendukung perlu dikoreksi.' },
    { id: 4, code: 'DOC-2026-0141', name: 'Surat Pengantar RT/RW', category: 'Surat Pengantar', owner: 'I Made Wira', issuedAt: '25 Okt 2026', status: 'Menunggu Verifikasi', reason: '' },
    { id: 5, code: 'DOC-2026-0139', name: 'Surat Keterangan Usaha', category: 'Surat Keterangan', owner: 'I Putu Aditya', issuedAt: '24 Okt 2026', status: 'Valid', reason: '' },
];

export default function DocumentRevokeIndex() {
    const [documents, setDocuments] = useState(initialDocuments);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [reason, setReason] = useState('');
    const [notice, setNotice] = useState('');

    const filteredDocuments = useMemo(() => documents.filter((document) => {
        const keyword = searchQuery.trim().toLowerCase();
        const matchesSearch = !keyword || [document.code, document.name, document.category, document.owner].some((value) => value.toLowerCase().includes(keyword));
        const matchesStatus = statusFilter === 'Semua' || document.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [documents, searchQuery, statusFilter]);

    const validCount = documents.filter((document) => ['Valid', 'Terverifikasi'].includes(document.status)).length;
    const revokedCount = documents.filter((document) => document.status === 'Dicabut').length;
    const reviewCount = documents.filter((document) => document.status === 'Menunggu Verifikasi').length;

    const openRevokeModal = (document) => {
        setSelectedDocument(document);
        setReason('');
        setNotice('');
    };

    const confirmRevoke = (event) => {
        event.preventDefault();
        if (!selectedDocument || !reason.trim()) return;
        setDocuments((current) => current.map((document) => document.id === selectedDocument.id ? { ...document, status: 'Dicabut', reason: reason.trim() } : document));
        setSelectedDocument(null);
        setReason('');
        setNotice('Status dokumen diperbarui secara lokal menjadi Dicabut. Perubahan ini belum tersimpan ke server.');
    };

    return (
        <AdminLayout>
            <Head title="Pencabutan Dokumen - SIVALDEN" />
            <PageHeader title="Pencabutan Dokumen" description="Tinjau dokumen yang perlu dinyatakan tidak berlaku dan catat alasan pencabutan secara jelas." />

            {notice ? <div role="status" className="flex min-w-0 items-start gap-2.5 rounded-lg border border-[#B8E0C5] bg-[#F1FAF4] px-4 py-3 text-xs leading-5 text-[#1E8E3E]"><Icon name="check" size={17} className="mt-0.5 shrink-0" /><span className="min-w-0 flex-1">{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Tutup pemberitahuan" className="shrink-0 rounded p-0.5 hover:bg-[#EAF5EE]"><Icon name="x" size={15} /></button></div> : null}

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5"><p className="text-xs text-[#7F8C8D]">Dokumen Sah</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#1E8E3E]">{validCount}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Tersedia untuk ditinjau</p></div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5"><p className="text-xs text-[#7F8C8D]">Dokumen Dicabut</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#D92020]">{revokedCount}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Tidak lagi berlaku</p></div>
                <div className="col-span-2 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:col-span-1 sm:p-5"><p className="text-xs text-[#7F8C8D]">Menunggu Verifikasi</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#A66A00]">{reviewCount}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Perlu pemeriksaan lebih lanjut</p></div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="p-4 sm:p-5"><PanelHeader title="Daftar Dokumen" subtitle="Pencabutan hanya tersedia untuk dokumen berstatus valid atau terverifikasi." /><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Cari nama dokumen, kode, atau pemilik..." /><label className="relative block"><span className="sr-only">Filter status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-xs text-[#525252] outline-none focus:border-[#8B0F14]"><option>Semua</option><option>Valid</option><option>Terverifikasi</option><option>Menunggu Verifikasi</option><option>Dicabut</option></select><Icon name="filter" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7F8C8D]" /></label></div></div>

                <div className="divide-y divide-[#E5E7EB] md:hidden">
                    {filteredDocuments.length ? filteredDocuments.map((document) => (
                        <article key={document.id} className="space-y-3 p-4">
                            <div className="flex min-w-0 items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#8B0F14]"><Icon name="document" size={17} /></div><div className="min-w-0 flex-1"><p className="break-words text-sm font-bold text-[#262626]">{document.name}</p><p className="mt-1 break-all font-mono text-[10px] text-[#7F8C8D]">{document.code}</p><p className="mt-1 text-[11px] text-[#7F8C8D]">{document.category} · {document.owner}</p></div></div>
                            <div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge status={document.status} /><span className="text-[10px] text-[#9CA3AF]">Terbit {document.issuedAt}</span></div>
                            {document.status === 'Dicabut' && document.reason ? <p className="rounded-lg bg-[#FDECEC]/60 p-2.5 text-[11px] leading-5 text-[#8F2020]">Alasan: {document.reason}</p> : null}
                            {['Valid', 'Terverifikasi'].includes(document.status) ? <button type="button" onClick={() => openRevokeModal(document)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D92020]/30 px-3 py-2.5 text-xs font-semibold text-[#D92020] transition hover:bg-[#FDECEC]"><Icon name="shield" size={15} /> Cabut Dokumen</button> : null}
                        </article>
                    )) : <EmptyState title="Dokumen tidak ditemukan" />}
                </div>

                <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-[#F9FAFB] font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]"><tr><th className="px-5 py-3.5">Dokumen</th><th className="px-5 py-3.5">Pemilik</th><th className="px-5 py-3.5">Tanggal Terbit</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Tindakan</th></tr></thead><tbody className="divide-y divide-[#E5E7EB]">{filteredDocuments.length ? filteredDocuments.map((document) => <tr key={document.id} className="transition hover:bg-[#FCEBEC]/20"><td className="px-5 py-4"><p className="font-semibold text-[#262626]">{document.name}</p><p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">{document.code} · {document.category}</p>{document.reason ? <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#D92020]">Alasan: {document.reason}</p> : null}</td><td className="px-5 py-4 text-[#525252]">{document.owner}</td><td className="whitespace-nowrap px-5 py-4 text-[10px] text-[#7F8C8D]">{document.issuedAt}</td><td className="px-5 py-4"><StatusBadge status={document.status} /></td><td className="px-5 py-4 text-right">{['Valid', 'Terverifikasi'].includes(document.status) ? <button type="button" onClick={() => openRevokeModal(document)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#D92020]/30 px-3 py-2 text-[11px] font-semibold text-[#D92020] transition hover:bg-[#FDECEC]"><Icon name="shield" size={14} /> Cabut</button> : <span className="text-[10px] text-[#9CA3AF]">Tidak tersedia</span>}</td></tr>) : <tr><td colSpan={5}><EmptyState title="Dokumen tidak ditemukan" /></td></tr>}</tbody></table></div>
                <div className="border-t border-[#E5E7EB] px-4 py-3 text-[10px] text-[#7F8C8D] sm:px-5">Menampilkan {filteredDocuments.length} dari {documents.length} dokumen · Data demonstrasi</div>
            </section>

            {selectedDocument ? <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedDocument(null); }}>
                <form onSubmit={confirmRevoke} className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                    <div className="flex items-start gap-3 border-b border-[#E5E7EB] pb-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#D92020]"><Icon name="shield" size={19} /></div><div className="min-w-0 flex-1"><h2 className="font-montserrat text-lg font-bold text-[#262626]">Konfirmasi Pencabutan</h2><p className="mt-1 text-xs leading-5 text-[#7F8C8D]">Dokumen yang dicabut akan ditampilkan sebagai tidak berlaku pada daftar ini.</p></div><button type="button" onClick={() => setSelectedDocument(null)} aria-label="Tutup" className="rounded-lg p-1.5 text-[#7F8C8D] hover:bg-[#F5F5F5]"><Icon name="x" size={18} /></button></div>
                    <div className="mt-4 rounded-lg bg-[#F9FAFB] p-3.5"><p className="break-words text-sm font-bold text-[#262626]">{selectedDocument.name}</p><p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">{selectedDocument.code}</p><div className="mt-2"><StatusBadge status={selectedDocument.status} /></div></div>
                    <label className="mt-4 block"><span className="mb-1.5 block text-xs font-semibold text-[#262626]">Alasan pencabutan <span className="text-[#D92020]">*</span></span><textarea required minLength={5} rows={4} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Jelaskan alasan dokumen perlu dicabut..." className="w-full resize-y rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs leading-5 outline-none focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]" /></label>
                    <p className="mt-2 text-[10px] leading-4 text-[#7F8C8D]">Mode tampilan: tindakan ini hanya mengubah state di browser dan tidak menghubungi server.</p>
                    <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setSelectedDocument(null)} className="rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-xs font-semibold text-[#525252] hover:bg-[#F9FAFB]">Batal</button><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D92020] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#B51A1A]"><Icon name="shield" size={15} /> Konfirmasi Cabut</button></div>
                </form>
            </div> : null}
        </AdminLayout>
    );
}
