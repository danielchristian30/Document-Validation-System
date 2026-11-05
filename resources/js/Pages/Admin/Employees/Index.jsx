import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { EmptyState, FilterTabs, Icon, PageHeader, SearchField, StatusBadge } from '@/Components/AdminUI';

const initialEmployees = [
    { id: 'PGW-001', name: 'Ni Made Puspita', email: 'made.puspita@denpasarkota.com', bidang: 'Pelayanan Publik', jabatan: 'Verifikator Dokumen', status: 'Aktif' },
    { id: 'PGW-002', name: 'I Putu Aditya', email: 'putu.aditya@denpasarkota.com', bidang: 'Administrasi', jabatan: 'Staf Administrasi', status: 'Aktif' },
    { id: 'PGW-003', name: 'Ni Luh Sari', email: 'luh.sari@denpasarkota.com', bidang: 'Perizinan', jabatan: 'Operator Dokumen', status: 'Aktif' },
    { id: 'PGW-004', name: 'I Made Wira', email: 'made.wira@denpasarkota.com', bidang: 'Pelayanan Publik', jabatan: 'Verifikator Dokumen', status: 'Aktif' },
    { id: 'PGW-005', name: 'Komang Pradnya', email: 'komang.pradnya@denpasarkota.com', bidang: 'Arsip Digital', jabatan: 'Staf Arsip', status: 'Nonaktif' },
    { id: 'PGW-006', name: 'I Kadek Mahendra', email: 'kadek.mahendra@denpasarkota.com', bidang: 'Administrasi', jabatan: 'Operator Dokumen', status: 'Aktif' },
];

const blankForm = { name: '', email: '', bidang: 'Administrasi', jabatan: '' };

export default function EmployeesIndex() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(blankForm);

    const filteredEmployees = useMemo(() => employees.filter((employee) => {
        const keyword = searchQuery.trim().toLowerCase();
        const matchesQuery = !keyword || [employee.name, employee.email, employee.id, employee.bidang, employee.jabatan].some((value) => String(value).toLowerCase().includes(keyword));
        const matchesStatus = activeFilter === 'Semua' || employee.status === activeFilter;
        return matchesQuery && matchesStatus;
    }), [employees, searchQuery, activeFilter]);

    const activeCount = employees.filter((employee) => employee.status === 'Aktif').length;
    const inactiveCount = employees.length - activeCount;

    const addEmployee = (event) => {
        event.preventDefault();
        const nextEmployee = {
            id: `PGW-${String(employees.length + 1).padStart(3, '0')}`,
            name: form.name.trim(),
            email: form.email.trim(),
            bidang: form.bidang,
            jabatan: form.jabatan.trim() || 'Staf Administrasi',
            status: 'Aktif',
        };
        if (!nextEmployee.name || !nextEmployee.email) return;
        setEmployees((current) => [nextEmployee, ...current]);
        setSearchQuery('');
        setActiveFilter('Semua');
        setForm(blankForm);
        setShowModal(false);
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pegawai - SIVALDEN" />
            <PageHeader
                title="Manajemen Pegawai"
                description="Lihat data pegawai, unit kerja, jabatan, dan status akses dalam ruang lingkup administrasi Anda."
                action={<button type="button" onClick={() => setShowModal(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 sm:w-auto"><Icon name="plus" size={15} /> Tambah Pegawai</button>}
            />

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5"><p className="text-xs text-[#7F8C8D]">Total Pegawai</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626]">{employees.length}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Akun pegawai terdaftar</p></div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5"><p className="text-xs text-[#7F8C8D]">Pegawai Aktif</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#1E8E3E]">{activeCount}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Dapat mengakses sistem</p></div>
                <div className="col-span-2 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:col-span-1 sm:p-5"><p className="text-xs text-[#7F8C8D]">Pegawai Nonaktif</p><p className="mt-2 font-montserrat text-2xl font-extrabold text-[#D92020]">{inactiveCount}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">Akses tidak aktif</p></div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="flex min-w-0 flex-col gap-4 border-b border-[#E5E7EB] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <FilterTabs
                        value={activeFilter}
                        onChange={setActiveFilter}
                        options={[
                            { value: 'Semua', label: 'Semua', count: employees.length },
                            { value: 'Aktif', label: 'Aktif', count: activeCount },
                            { value: 'Nonaktif', label: 'Nonaktif', count: inactiveCount },
                        ]}
                    />
                    <div className="w-full sm:max-w-xs"><SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Cari nama, email, atau unit kerja..." /></div>
                </div>

                <div className="divide-y divide-[#E5E7EB] md:hidden">
                    {filteredEmployees.length ? filteredEmployees.map((employee) => (
                        <article key={employee.id} className="space-y-3 p-4">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B0F14] font-montserrat text-sm font-bold text-white">{employee.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</div>
                                <div className="min-w-0 flex-1"><p className="break-words text-sm font-bold text-[#262626]">{employee.name}</p><p className="mt-0.5 break-all text-[11px] text-[#7F8C8D]">{employee.email}</p><p className="mt-1 text-[10px] text-[#9CA3AF]">ID: {employee.id}</p></div>
                                <StatusBadge status={employee.status} />
                            </div>
                            <dl className="grid grid-cols-2 gap-3 rounded-lg bg-[#F9FAFB] p-3">
                                <div className="min-w-0"><dt className="text-[10px] text-[#7F8C8D]">Unit Kerja</dt><dd className="mt-1 break-words text-xs font-semibold text-[#262626]">{employee.bidang}</dd></div>
                                <div className="min-w-0"><dt className="text-[10px] text-[#7F8C8D]">Jabatan</dt><dd className="mt-1 break-words text-xs font-semibold text-[#262626]">{employee.jabatan}</dd></div>
                            </dl>
                        </article>
                    )) : <EmptyState title="Pegawai tidak ditemukan" />}
                </div>

                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[780px] text-left text-xs">
                        <thead className="bg-[#F9FAFB] font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]"><tr><th className="px-5 py-3.5">Pegawai</th><th className="px-5 py-3.5">Unit Kerja</th><th className="px-5 py-3.5">Jabatan</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">ID Pegawai</th></tr></thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {filteredEmployees.length ? filteredEmployees.map((employee) => <tr key={employee.id} className="transition hover:bg-[#FCEBEC]/20"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8B0F14] font-montserrat text-xs font-bold text-white">{employee.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</div><div className="min-w-0"><p className="font-semibold text-[#262626]">{employee.name}</p><p className="mt-1 text-[10px] text-[#7F8C8D]">{employee.email}</p></div></div></td><td className="px-5 py-4 text-[#525252]">{employee.bidang}</td><td className="px-5 py-4 text-[#525252]">{employee.jabatan}</td><td className="px-5 py-4"><StatusBadge status={employee.status} /></td><td className="px-5 py-4 font-mono text-[11px] text-[#7F8C8D]">{employee.id}</td></tr>) : <tr><td colSpan={5}><EmptyState title="Pegawai tidak ditemukan" /></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-1 border-t border-[#E5E7EB] px-4 py-3 text-[10px] text-[#7F8C8D] sm:flex-row sm:items-center sm:justify-between sm:px-5"><span>Menampilkan {filteredEmployees.length} dari {employees.length} pegawai</span><span>Data demonstrasi · perubahan hanya tersimpan selama halaman terbuka</span></div>
            </section>

            {showModal ? <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-4" onClick={(event) => { if (event.target === event.currentTarget) setShowModal(false); }}>
                <form onSubmit={addEmployee} className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-4"><div><h2 className="font-montserrat text-lg font-bold text-[#262626]">Tambah Pegawai</h2><p className="mt-1 text-xs leading-5 text-[#7F8C8D]">Isi informasi pegawai untuk melihat tampilan data baru.</p></div><button type="button" aria-label="Tutup" onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-[#7F8C8D] hover:bg-[#F5F5F5]"><Icon name="x" size={18} /></button></div>
                    <div className="mt-5 space-y-4">
                        <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#262626]">Nama lengkap</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]" placeholder="Masukkan nama pegawai" /></label>
                        <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#262626]">Email</span><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]" placeholder="nama@denpasarkota.com" /></label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#262626]">Unit kerja</span><select value={form.bidang} onChange={(event) => setForm({ ...form, bidang: event.target.value })} className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#8B0F14]"><option>Administrasi</option><option>Pelayanan Publik</option><option>Perizinan</option><option>Arsip Digital</option></select></label><label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#262626]">Jabatan</span><input value={form.jabatan} onChange={(event) => setForm({ ...form, jabatan: event.target.value })} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#8B0F14]" placeholder="Contoh: Verifikator Dokumen" /></label></div>
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-xs font-semibold text-[#525252] hover:bg-[#F9FAFB]">Batal</button><button type="submit" className="rounded-lg bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95">Tambahkan Pegawai</button></div>
                </form>
            </div> : null}
        </AdminLayout>
    );
}