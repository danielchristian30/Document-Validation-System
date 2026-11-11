import React from 'react';
import { Head } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

function formatDateTime(value) {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    });
}

export default function SuperadminDashboard({ user, stats, recentActivities = [] }) {
    return (
        <SuperadminLayout>
            <Head title="Superadmin Dashboard" />

            {/* Header sambutan */}
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mt-2 break-words font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                        Dashboard Superadmin
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7F8C8D]">
                        Halo, <span className="font-semibold text-[#262626]">{user?.name || 'Superadmin'}</span>. Anda memiliki kontrol penuh atas seluruh sistem dan keamanan data.
                    </p>
                </div>
            </div>

            {/* 3 Card Statistik - Menggunakan last:odd:col-span-2 agar jika ganjil baru memanjang */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                
                {/* Card 1: Total Pengguna Sistem */}
                <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6 last:odd:col-span-2 xl:last:odd:col-span-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">Total Pengguna Sistem</p>
                            <h3 className="mt-2 font-montserrat text-2xl sm:text-3xl font-extrabold text-[#262626]">
                                {stats.activeUsers + stats.inactiveUsers}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-[#FCEBEC] p-2.5 sm:p-3 text-[#8B0F14] transition-transform duration-200 group-hover:scale-110">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1E8E3E]/10 px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#1E8E3E]">
                            {stats.activeUsers} Aktif
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#D92020]/10 px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#D92020]">
                            {stats.inactiveUsers} Non-aktif
                        </span>
                    </div>

                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-[#E5E7EB] pt-3 text-[11px] sm:text-xs text-[#7F8C8D] gap-1 sm:gap-0">
                        <span>Admin: <strong className="text-[#262626]">{stats.totalAdmins}</strong></span>
                        <span>Employee: <strong className="text-[#262626]">{stats.totalEmployees}</strong></span>
                    </div>
                </div>

                {/* Card 2: IP Address Diblokir */}
                <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6 last:odd:col-span-2 xl:last:odd:col-span-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">IP Address Diblokir</p>
                            <h3 className="mt-2 font-montserrat text-2xl sm:text-3xl font-extrabold text-[#D92020]">
                                {stats.blockedIPs}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-[#FCEBEC] p-2.5 sm:p-3 text-[#D92020] transition-transform duration-200 group-hover:scale-110">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs font-medium text-[#7F8C8D] bg-[#F9FAFB] rounded-lg p-2 border border-[#E5E7EB]/50">
                        Mitigasi aktif serangan brute-force
                    </p>
                </div>

                {/* Card 3: Audit Logs Hari Ini */}
                <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6 last:odd:col-span-2 xl:last:odd:col-span-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">Audit Logs Hari Ini</p>
                            <h3 className="mt-2 font-montserrat text-2xl sm:text-3xl font-extrabold text-[#262626]">
                                {stats.auditLogs.toLocaleString('id-ID')}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-[#E6F4EA] p-2.5 sm:p-3 text-[#1E8E3E] transition-transform duration-200 group-hover:scale-110">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs font-medium text-[#1E8E3E] bg-[#F9FAFB] rounded-lg p-2 border border-[#E5E7EB]/50">
                        Terekam polimorfik secara real-time
                    </p>
                </div>

            </div>

            {/* Bagian Aktivitas Keamanan Terbaru */}
            <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-montserrat text-base font-bold text-[#262626]">
                            Aktivitas Sistem Terbaru
                        </h3>
                        <p className="text-xs text-[#7F8C8D] mt-0.5">Log peristiwa keamanan sistem secara langsung</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F5] px-3 py-1 text-[11px] font-medium text-[#7F8C8D]">
                        Pembaruan otomatis
                    </span>
                </div>

                <div className="mt-4 space-y-3">
                    {recentActivities.length > 0 ? (
                        recentActivities.map((item) => (
                            <div 
                                key={item.id} 
                                className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#E5E7EB]/60 bg-[#FAFAFA] p-3.5 text-xs transition-colors hover:bg-[#F5F5F5] sm:flex-row sm:items-center sm:justify-between sm:p-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.is_success ? 'bg-[#1E8E3E]/10 text-[#1E8E3E]' : 'bg-[#D92020]/10 text-[#D92020]'}`}>
                                        {item.is_success ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-semibold text-[#262626]">{item.ip_address}</span>
                                            <span className="rounded bg-[#E5E7EB] px-1.5 py-0.5 text-[10px] font-medium text-[#525252]">{item.causer_name}</span>
                                        </div>
                                        <p className="mt-0.5 truncate text-[#7F8C8D]">{item.description}</p>
                                    </div>
                                </div>
                                
                                <span className="shrink-0 font-mono text-[11px] text-[#7F8C8D] sm:text-right">
                                    {formatDateTime(item.created_at)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F5F5] text-[#9CA3AF]">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 4v5c0 5-4.03 9-9 10C7.03 21 3 17 3 12V7l9-3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <p className="mt-3 text-sm font-semibold text-[#262626]">Belum ada aktivitas keamanan</p>
                            <p className="mt-1 text-xs text-[#7F8C8D]">Aktivitas dan log sistem akan muncul di sini secara otomatis.</p>
                        </div>
                    )}
                </div>
            </div>
        </SuperadminLayout>
    );
}