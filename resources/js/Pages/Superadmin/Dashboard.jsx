import React from 'react';
import { Head } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';

export default function SuperadminDashboard({ user }) {
    return (
        <SuperadminLayout>
            <Head title="Superadmin Dashboard" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                        Dashboard Superadmin
                    </h1>
                    <p className="mt-1 text-sm text-[#7F8C8D]">
                        Halo, {user?.name || 'Superadmin'}. Anda memiliki kontrol penuh atas seluruh sistem dan keamanan data.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                    <p className="text-xs font-medium text-[#7F8C8D]">Total Akun Admin</p>
                    <h3 className="mt-2 font-montserrat text-3xl font-extrabold text-[#262626]">6</h3>
                    <p className="mt-2 text-xs font-medium text-[#1E8E3E]">Semua akun terverifikasi aktif</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                    <p className="text-xs font-medium text-[#7F8C8D]">IP Address Diblokir</p>
                    <h3 className="mt-2 font-montserrat text-3xl font-extrabold text-[#D92020]">2</h3>
                    <p className="mt-2 text-xs font-medium text-[#7F8C8D]">Mitigasi serangan brute-force</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                    <p className="text-xs font-medium text-[#7F8C8D]">Audit Logs Hari Ini</p>
                    <h3 className="mt-2 font-montserrat text-3xl font-extrabold text-[#262626]">1,284</h3>
                    <p className="mt-2 text-xs font-medium text-[#1E8E3E]">Terekam polimorfik secara real-time</p>
                </div>
            </div>

            {/* Card Ringkasan Aktivitas Sistem */}
            <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                    <h3 className="font-montserrat text-base font-bold text-[#262626]">
                        Aktivitas Keamanan Terbaru
                    </h3>
                    <span className="text-xs text-[#7F8C8D]">Pembaruan otomatis</span>
                </div>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between rounded-[8px] bg-[#F5F5F5] p-3 text-xs">
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#1E8E3E]"></span>
                            <span className="font-mono font-semibold text-[#262626]">192.168.1.45</span>
                            <span className="text-[#7F8C8D]">· Berhasil melakukan login sebagai Admin Diskominfo</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#7F8C8D]">Baru saja</span>
                    </div>
                    <div className="flex items-center justify-between rounded-[8px] bg-[#F5F5F5] p-3 text-xs">
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#D92020]"></span>
                            <span className="font-mono font-semibold text-[#262626]">203.0.113.42</span>
                            <span className="text-[#7F8C8D]">· Percobaan login gagal berulang (IP Otomatis Masuk Daftar Blokir)</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#7F8C8D]">15 menit lalu</span>
                    </div>
                </div>
            </div>
        </SuperadminLayout>
    );
}