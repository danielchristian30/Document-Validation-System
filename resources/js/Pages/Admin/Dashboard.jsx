import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/AdminUI';

const docs = [
    {
        id: 1,
        code: 'DOC-2026-0218',
        name: 'Laporan Statistik Kependudukan Triwulan III',
        owner: 'Ni Made Puspita',
        date: '5 Nov 2026 · 09.42',
        status: 'Menunggu Verifikasi',
    },
    {
        id: 2,
        code: 'DOC-2026-0217',
        name: 'Data Perkembangan Ekonomi Daerah',
        owner: 'I Putu Aditya',
        date: '5 Nov 2026 · 08.50',
        status: 'Valid',
    },
    {
        id: 3,
        code: 'DOC-2026-0216',
        name: 'Laporan Indikator Pembangunan',
        owner: 'Ni Luh Sari',
        date: '4 Nov 2026 · 15.16',
        status: 'Terverifikasi',
    },
];

function Icon({ name, className = 'h-5 w-5' }) {
    const icons = {
        building: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01M14 9v.01M14 12v.01M14 15v.01M14 18v.01" />
            </svg>
        ),
        document: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        clock: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        check: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
        shield: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 4v5c0 5-4.03 9-9 10-4.97-1-9-5-9-10V7l9-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
        ),
        alert: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
        ),
    };

    return icons[name] || null;
}

function PanelHeader({ title, subtitle, action }) {
    return (
        <div className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3 className="font-montserrat text-base font-bold text-[#262626]">{title}</h3>
                <p className="mt-0.5 text-xs text-[#7F8C8D]">{subtitle}</p>
            </div>
            {action}
        </div>
    );
}

function StatCard({ label, value, detail, icon, tone = 'maroon' }) {
    const tones = {
        maroon: {
            value: 'text-[#262626]',
            iconBg: 'bg-[#FCEBEC]',
            iconText: 'text-[#8B0F14]',
        },
        amber: {
            value: 'text-[#A66A00]',
            iconBg: 'bg-[#FFF4D6]',
            iconText: 'text-[#A66A00]',
        },
        green: {
            value: 'text-[#1E8E3E]',
            iconBg: 'bg-[#E6F4EA]',
            iconText: 'text-[#1E8E3E]',
        },
        red: {
            value: 'text-[#D92020]',
            iconBg: 'bg-[#FCEBEC]',
            iconText: 'text-[#D92020]',
        },
    };

    const toneStyle = tones[tone] || tones.maroon;

    return (
        <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">{label}</p>
                    <h3 className={`mt-2 font-montserrat text-2xl font-extrabold sm:text-3xl ${toneStyle.value}`}>
                        {value}
                    </h3>
                </div>
                <div className={`shrink-0 rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-110 sm:p-3 ${toneStyle.iconBg} ${toneStyle.iconText}`}>
                    <Icon name={icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
            </div>
            <p className="mt-3 border-t border-[#E5E7EB] pt-3 text-[11px] text-[#7F8C8D] sm:mt-4 sm:text-xs">
                {detail}
            </p>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        'Menunggu Verifikasi': 'bg-[#FFF4D6] text-[#A66A00]',
        Valid: 'bg-[#E6F4EA] text-[#1E8E3E]',
        Terverifikasi: 'bg-[#E6F4EA] text-[#1E8E3E]',
    };

    return (
        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status] || 'bg-[#F5F5F5] text-[#525252]'}`}>
            {status}
        </span>
    );
}

export default function AdminDashboard({ user: pageUser }) {
    const { props } = usePage();
    const user = pageUser || props.auth?.user || {};
    const bidangValue = user.bidang || user.division || 'Bidang Statistik';
    const bidang = typeof bidangValue === 'object'
        ? bidangValue.name || 'Bidang Statistik'
        : bidangValue;

    const activities = [
        {
            title: 'Dokumen baru diunggah',
            description: 'Laporan Statistik Kependudukan Triwulan III',
            actor: 'Ni Made Puspita',
            time: '09.42 WITA',
            icon: 'document',
            tone: 'maroon',
        },
        {
            title: 'Dokumen berhasil diverifikasi',
            description: 'Data Perkembangan Ekonomi Daerah',
            actor: 'Admin Bidang',
            time: '08.50 WITA',
            icon: 'check',
            tone: 'green',
        },
        {
            title: 'Perbaikan dokumen diminta',
            description: 'Rekapitulasi Data Sektoral',
            actor: 'Admin Bidang',
            time: 'Kemarin',
            icon: 'alert',
            tone: 'amber',
        },
    ];

    const activityTones = {
        maroon: 'bg-[#FCEBEC] text-[#8B0F14]',
        green: 'bg-[#E6F4EA] text-[#1E8E3E]',
        amber: 'bg-[#FFF4D6] text-[#A66A00]',
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin - SIVALDEN" />

            <PageHeader
                title="Dashboard Admin"
                description={`Pantau dokumen, aktivitas pegawai, dan status verifikasi pada ${bidang}.`}
            />

            {/* Ruang lingkup bidang */}
            <section className="group mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCEBEC] text-[#8B0F14] transition-transform duration-200 group-hover:scale-110">
                            <Icon name="building" size={20} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]">
                                Ruang Lingkup Pengelolaan
                            </p>
                            <p className="mt-1 truncate font-montserrat text-sm font-bold text-[#262626]">{bidang}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistik khusus bidang */}
            <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                <StatCard label="Total Dokumen" value="248" detail={`Dokumen pada bidang ${bidang}`} icon="document" tone="maroon" />
                <StatCard label="Menunggu Verifikasi" value="18" detail="Perlu ditinjau admin" icon="clock" tone="amber" />
                <StatCard label="Dokumen Valid" value="214" detail="Sudah terverifikasi" icon="check" tone="green" />
                <StatCard label="Dokumen Dicabut" value="16" detail="Tidak lagi berlaku" icon="shield" tone="red" />
            </section>

            {/* Dokumen dan aktivitas bidang */}
            <section className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,.85fr)]">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                    <div className="p-4 sm:p-6">
                        <PanelHeader
                            title="Dokumen Terbaru"
                            subtitle={`Dokumen yang baru diunggah oleh pegawai bidang ${bidang}`}
                            action={
                                <Link
                                    href="/admin/document-management"
                                    className="w-fit text-[11px] font-semibold text-[#8B0F14] transition-colors hover:text-[#E6001A] hover:underline"
                                >
                                    Kelola dokumen
                                </Link>
                            }
                        />
                    </div>

                    {/* Tampilan mobile */}
                    <div className="divide-y divide-[#E5E7EB] md:hidden">
                        {docs.map((doc) => (
                            <article key={doc.id} className="group space-y-2 p-4 transition-colors duration-200 hover:bg-[#FCEBEC]/20">
                                <p className="text-xs font-bold text-[#262626] transition-colors group-hover:text-[#8B0F14]">
                                    {doc.name}
                                </p>
                                <p className="font-mono text-[10px] text-[#7F8C8D]">{doc.code}</p>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-[10px] text-[#7F8C8D]">{doc.owner}</span>
                                    <StatusBadge status={doc.status} />
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Tampilan desktop */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[620px] text-left text-xs">
                            <thead className="bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-wider text-[#7F8C8D]">
                                <tr>
                                    <th className="px-5 py-3">Dokumen</th>
                                    <th className="px-5 py-3">Pegawai</th>
                                    <th className="px-5 py-3">Tanggal</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]">
                                {docs.map((doc) => (
                                    <tr key={doc.id} className="transition-colors duration-150 hover:bg-[#FCEBEC]/30">
                                        <td className="px-5 py-4">
                                            <b className="font-semibold text-[#262626]">{doc.name}</b>
                                            <p className="mt-1 font-mono text-[10px] text-[#7F8C8D]">{doc.code}</p>
                                        </td>
                                        <td className="px-5 py-4 text-[#525252]">{doc.owner}</td>
                                        <td className="px-5 py-4 text-[10px] text-[#7F8C8D]">{doc.date}</td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={doc.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-[#E5E7EB] px-4 py-3 text-[10px] text-[#7F8C8D]">
                        Data demonstrasi · frontend saja
                    </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
                    <PanelHeader
                        title="Aktivitas Terbaru"
                        subtitle="Perubahan terakhir pada dokumen bidang."
                    />

                    <div className="mt-4 space-y-3">
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className="group flex min-w-0 gap-3 rounded-xl border border-transparent p-2 transition-all duration-200 hover:border-[#E5E7EB] hover:bg-[#FAFAFA]"
                            >
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${activityTones[activity.tone]}`}>
                                    <Icon name={activity.icon} className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1 border-b border-[#F0F1F2] pb-3 last:border-0 last:pb-0">
                                    <p className="text-xs font-semibold text-[#262626]">{activity.title}</p>
                                    <p className="mt-1 text-[10px] leading-4 text-[#7F8C8D]">{activity.description}</p>
                                    <p className="mt-1 text-[10px] text-[#9CA3AF]">
                                        {activity.actor} · {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}