import { Link } from '@inertiajs/react';

export default function Navbar({ auth }) {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-dmsans">
            
            <nav className="border-b border-[#E5E7EB] px-6 py-3.5">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    {/* Brand Logo & Title */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#8B0F14] text-white font-bold">
                            <img
                                src="/assets/logo.webp"
                                alt="Logo SIVALDEN"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#262626] font-montserrat">
                                SIVALDEN
                            </h1>
                            <p className="text-xs text-[#7F8C8D]">Sistem Validasi Dokumen Pemerintah Kota Denpasar</p>
                        </div>
                    </Link>
                    
                    {/* Menu Navigasi Utama */}
                    <div className="hidden items-center gap-8 md:flex">
                        <a 
                            href="#" 
                            className="text-sm font-semibold text-[#262626] transition hover:text-[#8B0F14]"
                        >
                            Beranda
                        </a>
                        <a 
                            href="#cara-kerja" 
                            className="text-sm font-semibold text-[#7F8C8D] transition hover:text-[#8B0F14]"
                        >
                            Cara Kerja
                        </a>
                        <a 
                            href="#faq-bantuan" 
                            className="text-sm font-semibold text-[#7F8C8D] transition hover:text-[#8B0F14]"
                        >
                            Layanan Bantuan & FAQ
                        </a>
                        <a 
                            href="#kontak" 
                            className="text-sm font-semibold text-[#7F8C8D] transition hover:text-[#8B0F14]"
                        >
                            Kontak Resmi
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
}