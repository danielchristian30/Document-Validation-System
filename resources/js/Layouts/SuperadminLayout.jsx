import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SuperadminLayout({ children }) {
    const { props, url } = usePage();
    const user = props.auth?.user;
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-dmsans text-[#262626] selection:bg-[#8B0F14] selection:text-white">
            {/* Bar Identitas Resmi 4px (Fixed di Paling Atas) */}
            <div className="sticky top-0 z-50 h-1 w-full bg-[#E6001A]" />

            <div className="flex">
                {/* SIDEBAR PANEL SUPERADMIN (Sticky & Pas Tinggi Layar) */}
                <aside className="sticky top-1 hidden h-[calc(100vh-4px)] w-64 flex-col justify-between bg-[#8B0F14] text-white lg:flex shrink-0">
                    <div className="flex flex-col overflow-hidden">
                        {/* Header Sidebar */}
                        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6 shrink-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/10">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-montserrat text-lg font-extrabold tracking-tight">SIVALDEN</h2>
                                <p className="text-[10px] text-white/70">Pemkot Denpasar</p>
                            </div>
                        </div>

                        <div className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/55 shrink-0">
                            Menu
                        </div>

                        {/* Navigasi Menu */}
                        <nav className="space-y-1 px-4 overflow-y-auto">
                            <Link
                                href={route('dashboard')}
                                className={`flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm transition ${
                                    url === '/dashboard' || url?.startsWith('/superadmin/dashboard')
                                        ? 'bg-white/15 font-semibold text-white'
                                        : 'font-medium text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Dashboard
                            </Link>
                            <Link
                                href={route('superadmin.users.index')}
                                className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                User Management
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                IP Blocklist
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                System Logs
                            </Link>
                        </nav>
                    </div>

                    {/* Profil & Dropdown Menu di Bagian Bawah Sidebar (Selalu Terkunci di Bawah) */}
                    <div className="relative border-t border-white/10 p-4 shrink-0">
                        {isProfileOpen && (
                            <div className="absolute bottom-full left-4 right-4 mb-2 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-xl z-50">
                                <div className="border-b border-[#E5E7EB] px-4 py-2.5">
                                    <p className="truncate text-xs font-bold text-[#262626] uppercase">{user?.username || 'Super Admin'}</p>
                                    <p className="truncate text-[10px] text-[#7F8C8D]">{user?.email || 'admin@denpasarkota.go.id'}</p>
                                </div>
                                <div className="py-1">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]"
                                    >
                                        <svg className="h-4 w-4 text-[#7F8C8D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Edit Profil
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-semibold text-[#D92020] transition hover:bg-[#D92020]/10"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </Link>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex w-full items-center justify-between gap-3 rounded-[8px] bg-black/20 p-3 text-left transition hover:bg-black/30 focus:outline-none"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-montserrat font-bold text-[#8B0F14]">
                                    {user?.username ?user.email.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="truncate text-xs font-bold text-white uppercase">{user?.username || 'Super Admin'}</p>
                                    <p className="text-[10px] text-white/70">{user?.email}</p>
                                </div>
                            </div>
                            <svg
                                className={`h-4 w-4 text-white/80 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-6 lg:p-10 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}