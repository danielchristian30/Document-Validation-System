import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { EmptyState, FilterTabs, Icon, PageHeader, PanelHeader, SearchField, StatusBadge } from '@/Components/AdminUI';

const initialCategories = [
    { id: 1, name: 'Surat Keterangan', code: 'KAT-001', description: 'Dokumen yang menerangkan status atau kondisi tertentu.', documentCount: 428, status: 'Aktif' },
    { id: 2, name: 'Surat Permohonan', code: 'KAT-002', description: 'Dokumen permohonan layanan atau informasi kepada instansi.', documentCount: 316, status: 'Aktif' },
    { id: 3, name: 'Surat Rekomendasi', code: 'KAT-003', description: 'Dokumen rekomendasi yang diterbitkan oleh unit terkait.', documentCount: 205, status: 'Aktif' },
    { id: 4, name: 'Surat Pengantar', code: 'KAT-004', description: 'Dokumen pengantar untuk proses administrasi lanjutan.', documentCount: 187, status: 'Aktif' },
    { id: 5, name: 'Dokumen Internal', code: 'KAT-005', description: 'Dokumen untuk keperluan administrasi internal.', documentCount: 94, status: 'Nonaktif' },
    { id: 6, name: 'Surat Pernyataan', code: 'KAT-006', description: 'Dokumen berisi pernyataan resmi dari pemohon atau pihak terkait.', documentCount: 54, status: 'Aktif' },
];

export default function DocumentCategoriesIndex() {
    const [categories, setCategories] = useState(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [notice, setNotice] = useState('');

    const filteredCategories = useMemo(() => categories.filter((category) => {
        const keyword = searchQuery.trim().toLowerCase();
        const matchesSearch = !keyword || [category.name, category.code, category.description].some((value) => value.toLowerCase().includes(keyword));
        const matchesStatus = statusFilter === 'Semua' || category.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [categories, searchQuery, statusFilter]);

    const activeCount = categories.filter((category) => category.status === 'Aktif').length;
    const documentCount = categories.reduce((total, category) => total + category.documentCount, 0);

    const submitCategory = (event) => {
        event.preventDefault();
        const name = form.name.trim();
        if (!name) return;
        if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
            setNotice('Nama kategori sudah ada pada daftar contoh. Gunakan nama lain.');
            return;
        }
        const category = {
            id: Date.now(),
            name,
            code: `KAT-${String(categories.length + 1).padStart(3, '0')}`,
            description: form.description.trim() || 'Belum ada deskripsi kategori.',
            documentCount: 0,
            status: 'Aktif',
        };
        setCategories((current) => [category, ...current]);
        setSearchQuery('');
        setStatusFilter('Semua');
        setForm({ name: '', description: '' });
        setShowModal(false);
        setNotice(`Kategori “${name}” ditambahkan pada tampilan demo. Data belum disimpan ke server.`);
    };

    const toggleCategoryStatus = (id) => {
        setCategories((current) => current.map((category) => category.id === id ? { ...category, status: category.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : category));
        setNotice('Status kategori diperbarui pada tampilan demo saja.');
    };

    return (
        <AdminLayout>
            <Head title="Kategori Dokumen - SIVALDEN" />
            <PageHeader title="Kategori Dokumen" description="Kelompokkan dokumen berdasarkan jenisnya agar pencatatan dan pemantauan lebih terstruktur." action={<button type="button" onClick={() => { setForm({ name: '', description: '' }); setShowModal(true); }} className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 sm:w-auto"><Icon name="plus" size={15} /> Buat Kategori</button>} />

            {notice ? <div role="status" className="flex min-w-0 items-start gap-2.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-xs leading-5 text-[#525252]"><Icon name="activity" size={17} className="mt-0.5 shrink-0 text-[#8B0F14]" /><span className="min-w-0 flex-1">{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Tutup pemberitahuan" className="shrink-0 rounded p-0.5 text-[#7F8C8D] hover:bg-[#F5F5F5]"><Icon name="x" size={15} /></button></div> : null}

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5"><p className="text-xs text-[#7F8C8D]">Total Kategori</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626]">{categories.length}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Kategori terdaftar pada demo</p></div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5"><p className="text-xs text-[#7F8C8D]">Kategori Aktif</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#1E8E3E]">{activeCount}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Dapat dipilih dalam proses dokumen</p></div>
                <div className="col-span-2 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:col-span-1 sm:p-5"><p className="text-xs text-[#7F8C8D]">Dokumen dalam Kategori</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626]">{documentCount.toLocaleString('id-ID')}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Jumlah contoh pada semua kategori</p></div>
            </section>

            <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
                <PanelHeader title="Daftar Kategori" subtitle="Pilih status dan cari kategori berdasarkan nama atau deskripsi." />
                <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <FilterTabs
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: 'Semua', label: 'Semua', count: categories.length },
                            { value: 'Aktif', label: 'Aktif', count: activeCount },
                            { value: 'Nonaktif', label: 'Nonaktif', count: categories.length - activeCount },
                        ]}
                    />
                    <div className="w-full sm:max-w-xs"><SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Cari kategori dokumen..." /></div>
                </div>

                {filteredCategories.length ? <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                    {filteredCategories.map((category) => <article key={category.id} className="flex min-w-0 flex-col rounded-xl border border-[#E5E7EB] p-4 transition hover:border-[#E7C4C7] hover:shadow-sm sm:p-5">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCEBEC] text-[#8B0F14]"><Icon name="folders" size={19} /></div>
                            <div className="min-w-0 flex-1"><h2 className="break-words font-montserrat text-sm font-bold text-[#262626]">{category.name}</h2><p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">{category.code}</p></div>
                            <StatusBadge status={category.status} />
                        </div>
                        <p className="mt-4 min-h-[40px] break-words text-xs leading-5 text-[#7F8C8D]">{category.description}</p>
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EEF0F2] pt-3">
                            <div><p className="text-[10px] text-[#7F8C8D]">Jumlah dokumen</p><p className="mt-1 text-sm font-bold text-[#262626]">{category.documentCount.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-[#7F8C8D]">dokumen</span></p></div>
                            <button type="button" onClick={() => toggleCategoryStatus(category.id)} className={`rounded-lg border px-3 py-2 text-[10px] font-semibold transition ${category.status === 'Aktif' ? 'border-[#E5E7EB] text-[#626262] hover:border-[#D92020]/30 hover:bg-[#FDECEC] hover:text-[#D92020]' : 'border-[#B8E0C5] bg-[#F1FAF4] text-[#1E8E3E] hover:bg-[#EAF5EE]'}`}>{category.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                        </div>
                    </article>)}
                </div> : <div className="mt-4"><EmptyState title="Kategori tidak ditemukan" description="Coba gunakan kata kunci lain atau ubah filter status." /></div>}
                <div className="mt-4 border-t border-[#E5E7EB] pt-3 text-[10px] text-[#7F8C8D]">Menampilkan {filteredCategories.length} dari {categories.length} kategori · Perubahan hanya tersimpan selama halaman terbuka</div>
            </section>

            {showModal ? <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4" onClick={(event) => { if (event.target === event.currentTarget) setShowModal(false); }}>
                <form onSubmit={submitCategory} className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-4"><div><h2 className="font-montserrat text-lg font-bold text-[#262626]">Buat Kategori Dokumen</h2><p className="mt-1 text-xs leading-5 text-[#7F8C8D]">Kategori baru akan ditambahkan ke daftar tampilan.</p></div><button type="button" onClick={() => setShowModal(false)} aria-label="Tutup" className="rounded-lg p-1.5 text-[#7F8C8D] hover:bg-[#F5F5F5]"><Icon name="x" size={18} /></button></div>
                    <div className="mt-5 space-y-4">
                        <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#262626]">Nama kategori <span className="text-[#D92020]">*</span></span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Contoh: Surat Pernyataan" className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]" /></label>
                        <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#262626]">Deskripsi</span><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Jelaskan jenis dokumen yang masuk ke kategori ini..." className="w-full resize-y rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs leading-5 outline-none focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]" /></label>
                        <div className="rounded-lg bg-[#F9FAFB] p-3 text-[10px] leading-5 text-[#7F8C8D]">Kode kategori dibuat otomatis pada data demo. Integrasi backend belum termasuk dalam halaman ini.</div>
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-xs font-semibold text-[#525252] hover:bg-[#F9FAFB]">Batal</button><button type="submit" className="rounded-lg bg-[#8B0F14] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#6B0A0F]">Simpan Kategori</button></div>
                </form>
            </div> : null}
        </AdminLayout>
    );
}
