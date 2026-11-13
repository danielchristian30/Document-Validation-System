import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

function Brand({ compact = false }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/10">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <div className="min-w-0">
                <h2 className="truncate font-montserrat text-lg font-extrabold tracking-tight">SIVALDEN</h2>
                {!compact && <p className="text-[10px] text-white/70">Pemkot Denpasar</p>}
            </div>
        </div>
    );
}

function NavIcon({ name, className = 'h-5 w-5' }) {
    const icons = {
        dashboard: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        document: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        employees: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        recap: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
        user: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        logout: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        ),
    };

    return icons[name] || null;
}

function NavigationLinks({ url, onNavigate }) {
    const items = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard', active: url.startsWith('/admin/dashboard') },
        { name: 'Manajemen Dokumen', href: '/admin/document-management', icon: 'document', active: url.startsWith('/admin/document-management') },
        { name: 'Manajemen Pegawai', href: '/admin/employee-management', icon: 'employees', active: url.startsWith('/admin/employee-management') },
        { name: 'Rekapitulasi Dokumen', href: '/admin/document-recap', icon: 'recap', active: url.startsWith('/admin/document-recap') },
    ];

    return items.map((item) => (
        <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            aria-current={item.active ? 'page' : undefined}
            className={`flex min-w-0 items-center gap-3 rounded-[8px] px-4 py-3 text-sm transition ${
                item.active
                    ? 'bg-white/15 font-semibold text-white'
                    : 'font-medium text-white/80 hover:bg-white/10 hover:text-white'
            }`}
        >
            <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.name}</span>
        </Link>
    ));
}

function ProfileActions({ user, onNavigate, mobile = false }) {
    return (
        <div className={mobile ? 'space-y-1 border-t border-white/10 px-4 py-4' : 'py-1'}>
            {mobile && (
                <div className="mb-3 flex min-w-0 items-center gap-3 rounded-lg bg-black/15 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-montserrat font-bold text-[#8B0F14]">
                        {(user?.username || user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-bold uppercase text-white">{user?.username || user?.name || 'Admin Bidang'}</p>
                        <p className="truncate text-[10px] text-white/70">{user?.email || 'admin@denpasarkota.go.id'}</p>
                    </div>
                </div>
            )}
            <Link
                href={route('profile.edit')}
                onClick={onNavigate}
                className={mobile
                    ? 'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-white/90 transition hover:bg-white/10'
                    : 'flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#262626] transition hover:bg-[#F5F5F5] hover:text-[#8B0F14]'}
            >
                <NavIcon name="user" className={`h-4 w-4 shrink-0 ${mobile ? 'text-white/70' : 'text-[#7F8C8D]'}`} />
                Edit Profil
            </Link>
            <Link
                href={route('logout')}
                method="post"
                as="button"
                onClick={onNavigate}
                className={mobile
                    ? 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/10'
                    : 'flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-semibold text-[#D92020] transition hover:bg-[#D92020]/10'}
            >
                <NavIcon name="logout" className="h-4 w-4 shrink-0" />
                Keluar
            </Link>
        </div>
    );
}

export default function AdminLayout({ children }) {
    const { props, url } = usePage();
    const authUser = props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const adminUser = {
        name: authUser?.username || authUser?.name || 'Admin Bidang',
        email: authUser?.email || 'admin@denpasarkota.go.id',
        bidang: authUser?.bidang?.name || authUser?.bidang || authUser?.division?.name || authUser?.division || 'Bidang Statistik',
        shortBidang: authUser?.bidang?.name || authUser?.bidang || authUser?.division?.name || authUser?.division || 'Bidang Statistik',
    };
    const avatar = adminUser.name.charAt(0).toUpperCase();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSidebarOpen(false);
                setIsProfileOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!sidebarOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [sidebarOpen]);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen w-full overflow-x-clip bg-[#F5F5F5] font-dmsans text-[#262626] selection:bg-[#8B0F14] selection:text-white">
            <div className="sticky top-0 z-[60] h-1 w-full bg-[#E6001A]" />

            <div className="flex min-h-[calc(100vh-4px)] w-full">
                {/* DESKTOP SIDEBAR */}
                <aside className="sticky top-1 hidden h-[calc(100vh-4px)] w-64 shrink-0 flex-col justify-between bg-[#8B0F14] text-white lg:flex">
                    <div className="flex min-h-0 flex-col overflow-hidden">
                        <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">
                            <Brand />
                        </div>

                        <div className="shrink-0 px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/55">
                            Menu Utama
                        </div>

                        <nav className="min-h-0 space-y-1 overflow-y-auto overscroll-contain px-4 pb-4">
                            <NavigationLinks url={url} />
                        </nav>
                    </div>

                    <div className="relative shrink-0 border-t border-white/10 p-4">
                        {isProfileOpen && (
                            <div className="absolute bottom-full left-4 right-4 z-50 mb-2 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-xl">
                                <div className="border-b border-[#E5E7EB] px-4 py-2.5">
                                    <p className="truncate text-xs font-bold uppercase text-[#262626]">{adminUser.name}</p>
                                    <p className="truncate text-[10px] text-[#7F8C8D]">{adminUser.email}</p>
                                </div>
                                <ProfileActions user={authUser || adminUser} onNavigate={() => setIsProfileOpen(false)} />
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsProfileOpen((open) => !open)}
                            aria-expanded={isProfileOpen}
                            className="flex w-full min-w-0 items-center justify-between gap-3 rounded-[8px] bg-black/20 p-3 text-left transition hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/70"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-montserrat font-bold text-[#8B0F14]">
                                    {avatar}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-bold uppercase text-white">{adminUser.name}</p>
                                    <p className="truncate text-[10px] text-white/70">{adminUser.shortBidang}</p>
                                </div>
                            </div>
                            <svg className={`h-4 w-4 shrink-0 text-white/80 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                </aside>

                {/* CONTENT COLUMN */}
                <div className="min-w-0 flex-1">
                    {/* MOBILE TOPBAR */}
                    <header className="sticky top-1 z-40 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden sm:px-5">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#8B0F14]">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-montserrat text-sm font-extrabold tracking-tight text-[#262626]">SIVALDEN</p>
                                <p className="truncate text-[10px] text-[#7F8C8D]">Admin Bidang · {adminUser.shortBidang}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Buka navigasi"
                            aria-expanded={sidebarOpen}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#8B0F14] transition hover:bg-[#FCEBEC] focus:outline-none focus:ring-2 focus:ring-[#8B0F14]"
                        >
                            <NavIcon name="menu" />
                        </button>
                    </header>

                    <main className="w-full min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10">
                        {children}
                    </main>
                </div>
            </div>

            {/* MOBILE DRAWER */}
            <div
                className={`fixed inset-x-0 bottom-0 top-1 z-[70] flex bg-black/50 transition-opacity duration-300 ease-in-out lg:hidden ${
                    sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={!sidebarOpen}
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) closeSidebar();
                }}
            >
                <aside
                    className={`flex h-full w-[min(86vw,320px)] max-w-full flex-col bg-[#8B0F14] text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    aria-label="Navigasi Admin"
                >
                    <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
                        <Brand />
                        <button
                            type="button"
                            onClick={closeSidebar}
                            aria-label="Tutup navigasi"
                            className="ml-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                            <NavIcon name="close" />
                        </button>
                    </div>

                    <div className="shrink-0 px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/55">
                        Menu Utama
                    </div>

                    <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 pb-4">
                        <NavigationLinks url={url} onNavigate={closeSidebar} />
                    </nav>

                    <div className="shrink-0 border-t border-white/10">
                        <div className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                            {adminUser.bidang}
                        </div>
                        <ProfileActions user={authUser || adminUser} onNavigate={closeSidebar} mobile />
                    </div>
                </aside>
            </div>
        </div>
    );
}