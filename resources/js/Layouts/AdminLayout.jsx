import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// Sub-komponen Ikon SVG Internal
function NavIcon({ name, className = "h-5 w-5" }) {
    const icons = {
        dashboard: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        employees: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        revoke: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
        ),
        recap: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        menu: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        ),
        close: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    };
    return icons[name] || null;
}

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock Data Admin Logged In (Nantinya dikirim dari Controller)
    const adminUser = {
        name: 'Ari Putra',
        role: 'Admin Bidang',
        bidang: 'Bidang Statistik',
        shortBidang: 'Bid. Statistik',
        avatar: 'AP',
    };

    // Daftar Menu Khusus Admin (4 Menu Saja)
    const navigationLinks = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: 'dashboard',
            active: url.startsWith('/admin/dashboard'),
        },
        {
            name: 'Manajemen Pegawai',
            href: '/admin/employees',
            icon: 'employees',
            active: url.startsWith('/admin/employees'),
        },
        {
            name: 'Revoke Dokumen',
            href: '/admin/document-revoke',
            icon: 'revoke',
            active: url.startsWith('/admin/document-revoke'),
        },
        {
            name: 'Rekapitulasi Dokumen',
            href: '/admin/document-recap',
            icon: 'recap',
            active: url.startsWith('/admin/document-recap'),
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#F5F5F5] font-dmsans text-[#262626]">
            {/* Top Brand Accent Line (4px Brand Red) */}
            <div className="fixed top-0 inset-x-0 z-50 h-1 bg-[#E60014]" />

            {/* Backdrop Mobile Drawer */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* SIDEBAR (Desktop & Mobile Drawer) */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#8B0F14] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="flex h-20 items-center justify-between px-6 pt-2 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white font-montserrat font-bold text-lg">
                            S
                        </div>
                        <div>
                            <h1 className="font-montserrat text-lg font-extrabold tracking-wide text-white">
                                SIVALCOCK
                            </h1>
                            <p className="text-[10px] text-white/70">Diskominfos Denpasar</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
                    >
                        <NavIcon name="close" />
                    </button>
                </div>

                {/* Scope Badge (Informasi Bidang Admin) */}
                <div className="mx-4 mt-5 rounded-xl bg-black/20 p-3 border border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Lingkup Wilayah</p>
                    <p className="mt-0.5 text-xs font-semibold text-white truncate">{adminUser.bidang}</p>
                </div>

                {/* Navigation Items */}
                <div className="mt-4 flex-1 px-3 space-y-1 overflow-y-auto">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                        Menu Utama
                    </p>
                    {navigationLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold transition ${
                                item.active
                                    ? 'bg-white/15 text-white shadow-inner font-bold'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <NavIcon name={item.icon} className={`h-4 w-4 ${item.active ? 'text-white' : 'text-white/70'}`} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Sidebar Footer / Profile Info */}
                <div className="p-4 border-t border-white/10 bg-black/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#8B0F14] font-montserrat text-xs font-bold shadow-sm">
                            {adminUser.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">{adminUser.name}</p>
                            <p className="truncate text-[10px] text-white/70">{adminUser.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar Navigation (Mobile Toggle & Context Title) */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-[#7F8C8D] hover:bg-[#F5F5F5] lg:hidden"
                        >
                            <NavIcon name="menu" />
                        </button>
                        <div>
                            <span className="hidden sm:inline-block rounded-full bg-[#FCEBEC] px-2.5 py-0.5 text-[10px] font-bold text-[#8B0F14]">
                                Panel Admin ({adminUser.shortBidang})
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right text-xs hidden sm:block">
                            <p className="font-semibold text-[#262626]">{adminUser.name}</p>
                            <p className="text-[10px] text-[#7F8C8D]">Diskominfos Kota Denpasar</p>
                        </div>
                    </div>
                </header>

                {/* Page Content Body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}