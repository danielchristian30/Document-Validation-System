import React from 'react';
import { Head } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

export default function SuperadminDashboard({ user, stats, recentActivities = [] }) {
    return (
        <SuperadminLayout>
            <Head title="Superadmin Dashboard" />

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mt-1 break-words font-montserrat text-2xl font-extrabold text-[#262626] sm:mt-2 sm:text-3xl">
                        Dashboard Superadmin
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7F8C8D]">
                        Halo, {user?.name || 'Superadmin'}. Anda memiliki kontrol penuh atas seluruh sistem dan keamanan data.
                    </p>
                </div>
            </div>

            {/* 3 Card Statistik */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {/* Card 1: Total User Aktif/Non-aktif & Rincian Role */}
                <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-6">
                    <p className="text-xs font-medium text-[#7F8C8D]">Total Pengguna Sistem</p>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                            {stats.activeUsers + stats.inactiveUsers}
                        </span>
                        <span className="text-xs font-semibold text-[#1E8E3E]">({stats.activeUsers} Aktif)</span>
                        <span className="text-xs font-semibold text-[#D92020]">({stats.inactiveUsers} Non-aktif)</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 border-t border-[#E5E7EB] pt-3 text-xs text-[#7F8C8D] min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                        <span>Akun Admin: <strong className="text-[#262626]">{stats.totalAdmins}</strong></span>
                        <span>Akun Employee: <strong className="text-[#262626]">{stats.totalEmployees}</strong></span>
                    </div>
                </div>

                {/* Card 2: IP Address Diblokir */}
                <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-6">
                    <p className="text-xs font-medium text-[#7F8C8D]">IP Address Diblokir</p>
                    <h3 className="mt-2 font-montserrat text-2xl font-extrabold text-[#D92020] sm:text-3xl">
                        {stats.blockedIPs}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-[#7F8C8D]">Mitigasi serangan brute-force</p>
                </div>

                {/* Card 3: Audit Logs Hari Ini */}
                <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-6">
                    <p className="text-xs font-medium text-[#7F8C8D]">Audit Logs Hari Ini</p>
                    <h3 className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                        {stats.auditLogs.toLocaleString('id-ID')}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-[#1E8E3E]">Terekam polimorfik secara real-time</p>
                </div>
            </div>

            {/* Card Ringkasan Aktivitas Sistem (Dari Spatie Activity Log) */}
            <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
                <div className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-montserrat text-base font-bold text-[#262626]">
                        Aktivitas Keamanan Terbaru
                    </h3>
                    <span className="text-xs text-[#7F8C8D]">Pembaruan otomatis</span>
                </div>
                <div className="mt-4 space-y-3 sm:space-y-4">
                    {recentActivities.length > 0 ? (
                        recentActivities.map((item) => (
                            <div key={item.id} className="flex min-w-0 flex-col gap-2 rounded-[8px] bg-[#F5F5F5] p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                                    <span className={`h-2 w-2 rounded-full ${item.is_success ? 'bg-[#1E8E3E]' : 'bg-[#D92020]'}`}></span>
                                    <span className="font-mono font-semibold text-[#262626]">{item.ip_address}</span>
                                    <span className="min-w-0 break-words text-[#7F8C8D]">
                                        · {item.description} ({item.causer_name})
                                    </span>
                                </div>
                                <span className="shrink-0 self-start font-mono text-[11px] text-[#7F8C8D] sm:self-auto">{item.created_at}</span>
                            </div>
                        ))
                    ) : (
                        <p className="py-6 text-center text-xs text-[#7F8C8D] sm:py-4">Belum ada aktivitas keamanan yang terekam di log.</p>
                    )}
                </div>
            </div>
        </SuperadminLayout>
    );
}