export default function Footer() {
    return (
        <footer className="border-t border-[#E5E7EB] bg-white text-[#262626]">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                    
                    {/* --- KOLOM 1: GOOGLE MAPS EMBED --- */}
                    <div className="h-64 w-full overflow-hidden rounded-[8px] border border-[#E5E7EB] lg:col-span-4 lg:h-auto">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.582862127001!2d115.21168549999999!3d-8.635982399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5045ca9a76c2a25%3A0x539f27fd35d9d58f!2sDinas%20Komunikasi%20%26%20Informatika%20Pemerintah%20Kota%20Denpasar!5e0!3m2!1sid!2sid!4v1791957204190!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Peta Lokasi Diskominfos Denpasar"
                        ></iframe>
                    </div>

                    {/* --- KOLOM 2: PROFIL, KONTAK & SOSIAL MEDIA --- */}
                    <div className="flex flex-col justify-between lg:col-span-5">
                        <div>
                            {/* Judul Instansi */}
                            <h2 
                                className="text-xl font-extrabold uppercase leading-snug tracking-tight text-[#262626] lg:text-2xl"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}
                            >
                                DINAS KOMUNIKASI, INFORMATIKA DAN STATISTIK KOTA DENPASAR
                            </h2>

                            {/* Informasi Kontak & Alamat */}
                            <ul className="mt-6 space-y-3 text-sm text-[#262626]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                                <li className="flex items-start gap-3">
                                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#8B0F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Graha Sewaka Dharma Lumintang Lt. III</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="h-5 w-5 shrink-0 text-[#8B0F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 015.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493-1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href="" className="hover:text-[#8B0F14] transition">0361-431229</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="h-5 w-5 shrink-0 text-[#8B0F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="" className="hover:text-[#8B0F14] transition">kominfo@denpasarkota.go.id</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="h-5 w-5 shrink-0 text-[#8B0F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                    <a href="" className="hover:text-[#8B0F14] transition">kominfostatistik.denpasarkota.go.id</a>
                                </li>
                            </ul>

                            {/* Media Sosial */}
                            <div className="mt-6">
                                <p className="text-sm font-bold text-[#262626]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    Follow Us :
                                </p>
                                <div className="mt-3 flex gap-2">
                                    {/* Instagram */}
                                    <a href="" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#8B0F14] text-white transition hover:bg-[#6B0A0F]">
                                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                    {/* Twitter / X */}
                                    <a href="" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#8B0F14] text-white transition hover:bg-[#6B0A0F]">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                    </a>
                                    {/* YouTube */}
                                    <a href="" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#8B0F14] text-white transition hover:bg-[#6B0A0F]">
                                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                    </a>
                                    {/* Facebook */}
                                    <a href="" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#8B0F14] text-white transition hover:bg-[#6B0A0F]">
                                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Sitemap / Footer Copyright */}
                        <div className="mt-8 text-xs text-[#7F8C8D]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                            <a href="" className="hover:underline">Sitemap</a>
                            <span className="mx-1">|</span>
                            <span>Dinas Komunikasi, Informatika dan Statistik Kota Denpasar.</span>
                        </div>
                    </div>

                    {/* --- KOLOM 3: SITUS TERKAIT --- */}
                    <div className="lg:col-span-3">
                        <h2 
                            className="text-xl font-extrabold uppercase tracking-tight text-[#262626]"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}
                        >
                            SITUS TERKAIT
                        </h2>

                        <ul className="mt-6 space-y-3 text-xs text-[#262626] lg:text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-[#8B0F14]">•</span>
                                <a href="" className="hover:text-[#8B0F14] transition">SP4N LAPOR!</a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-[#8B0F14]">•</span>
                                <a href="" className="hover:text-[#8B0F14] transition">DPS (Denpasar Prama Sewaka) + Android</a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-[#8B0F14]">•</span>
                                <a href="" className="hover:text-[#8B0F14] transition">PRO DENPASAR</a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-[#8B0F14]">•</span>
                                <a href="" className="hover:text-[#8B0F14] transition">Dinas Komunikasi, Informatika, Statistik dan Persandian Provinsi Bali</a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold text-[#8B0F14]">•</span>
                                <a href="" className="hover:text-[#8B0F14] transition">Kementerian Komunikasi dan Digital Republik Indonesia</a>
                            </li>
                        </ul>

                        <div className="mt-4">
                            <a href="" className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B0F14] hover:underline">
                                Selengkapnya
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}