import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#E5E7EB] last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-5 text-left transition hover:text-[#8B0F14] focus:outline-none"
            >
                <span className={`text-base font-semibold transition-colors ${isOpen ? 'text-[#8B0F14]' : 'text-[#262626]'}`}>
                    {question}
                </span>
                <span className="ml-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FCEBEC] text-[#8B0F14]">
                    <svg
                        className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="pb-5 pr-6 text-sm leading-relaxed text-[#7F8C8D]">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export default function Welcome({ auth }) {
    const steps = [
        {
            id: 1,
            title: "Unggah Dokumen",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            ),
        },
        {
            id: 2,
            title: "Sistem Memindai",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
        {
            id: 3,
            title: "Pencocokan Kriptografi",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        },
        {
            id: 4,
            title: "Hasil Validasi",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const faqs = [
        {
            question: "Bagaimana jika dokumen dinyatakan tidak valid / terindikasi palsu?",
            answer: "Jika status menunjukkan 'Tidak Valid', berarti terdapat perubahan karakter, spasi, atau isi dokumen dari versi resminya. Jangan gunakan dokumen tersebut dan segera laporkan melalui kanal pengaduan resmi Diskominfos Denpasar."
        },
        {
            question: "Mengapa QR Code atau Tanda Tangan Elektronik tidak terbaca?",
            answer: "Pastikan berkas PDF yang diunggah tidak terpotong, rusak (corrupted), atau di-compress ulang secara berlebihan. Gunakan berkas PDF asli yang diunduh langsung dari portal resmi seperti Dota Denpasar."
        },
        {
            question: "Apakah dokumen fisik atau berkas PDF saya akan disimpan di server?",
            answer: "Tidak sama sekali. SIVALDOK menerapkan metode Detached Signature. Berkas fisik Anda hanya dibaca di memori sementara untuk dihitung nilai hash-nya, kemudian langsung dihapus secara otomatis dari server."
        },
        {
            question: "Di mana saya bisa mendapatkan dokumen resmi Kota Denpasar yang valid?",
            answer: "Anda dapat mengunduh dokumen resmi melalui portal terbuka Pemerintah Kota Denpasar (seperti dota.denpasarkota.go.id) atau dari instansi penerbit resmi di lingkungan Pemkot Denpasar."
        },
        {
            question: "Siapa yang dapat saya hubungi jika mengalami kendala teknis saat validasi?",
            answer: "Anda dapat menghubungi tim teknis Diskominfos Denpasar melalui WhatsApp Pengaduan, Email resmi, atau nomor Hotline Helpdesk yang tertera pada bagian bawah halaman ini."
        }
    ];

    return (
        <>
            <Head title="SIVALDEN - Layanan Validasi Dokumen Pemkot Denpasar" />
            
            <div className="bg-[#F5F5F5] font-dmsans text-[#262626] selection:bg-[#8B0F14] selection:text-white">
                
                {/* Navbar */}
                <Navbar auth={auth} />

                {/* --- SECTION 1: HERO (EFEK PARALLAX DENGAN bg-fixed) --- */}
                <section 
                    className="relative flex min-h-[calc(100vh-73px)] w-full items-center overflow-hidden bg-cover bg-fixed bg-center"
                    style={{ backgroundImage: `url('/assets/bajra-sandhi_landscape.webp')` }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 z-0 bg-black/75"></div>

                    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-6 py-20 text-left lg:py-32">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white shadow-sm backdrop-blur-md">
                            <svg className="h-4 w-4 text-[#1E8E3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Layanan Resmi Pemerintah Kota Denpasar
                        </div>

                        <h2 className="max-w-4xl font-montserrat text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                            Cek Keaslian Dokumen Resmi Secara <span className="text-[#E6001A]">Real-Time</span>
                        </h2>

                        <p className="mt-6 max-w-2xl text-lg text-gray-200">
                            Pastikan dokumen dari pemerintah kota Denpasar benar-benar asli. Sistem otomatis mendeteksi perubahan isi dokumen sekecil apa pun untuk mencegah pemalsuan data.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <a href='/validasi' className="flex items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F]">
                                Mulai Cek Dokumen
                            </a>
                            <a 
                                href="#faq-bantuan"
                                className="flex items-center justify-center gap-2 rounded-[8px] border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20"
                            >
                                Layanan Bantuan & FAQ
                            </a>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: ALUR VALIDASI DOKUMEN --- */}
                <section id="cara-kerja" className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="font-montserrat text-3xl font-extrabold tracking-tight text-[#262626] sm:text-4xl">
                                Cara Kerja SIVALDEN
                            </h2>
                            <p className="mt-4 text-lg text-[#7F8C8D]">
                                Proses validasi dilakukan secara asinkron tanpa mengorbankan privasi dokumen fisik Anda.
                            </p>
                        </div>

                        <div className="mt-16 lg:mt-24">
                            <div className="relative">
                                <div className="absolute left-0 top-12 hidden w-full border-t-2 border-dashed border-[#E5E7EB] lg:block" aria-hidden="true"></div>

                                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                                    {steps.map((step) => (
                                        <div key={step.id} className="relative flex flex-col items-center text-center">
                                            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[#FCEBEC] text-[#8B0F14] shadow-sm ring-8 ring-white">
                                                {step.icon}
                                                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] text-sm font-bold text-white ring-4 ring-white">
                                                    {step.id}
                                                </span>
                                            </div>
                                            
                                            <h3 className="mt-6 font-montserrat text-xl font-bold text-[#262626]">
                                                {step.title}
                                            </h3>
                                            <p className="mt-2 max-w-xs text-base text-[#7F8C8D]">
                                                {step.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 3: LAYANAN BANTUAN & FAQ --- */}
                <section id="faq-bantuan" className="border-t border-[#E5E7EB] bg-[#F5F5F5] px-6 py-24">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-14 text-center">
                            <span className="rounded-full bg-[#FCEBEC] px-4 py-1.5 text-xs font-semibold text-[#8B0F14]">
                                Pusat Bantuan & Edukasi
                            </span>
                            <h2 className="mt-4 font-montserrat text-3xl font-extrabold text-[#262626] sm:text-4xl">
                                Pertanyaan Sering Diajukan (FAQ)
                            </h2>
                        </div>

                        <div className="mb-16 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 shadow-sm">
                            {faqs.map((faq, index) => (
                                <FAQItem key={index} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer (Sudah memuat id="kontak" di dalamnya) */}
                <div id="kontak">
                    <Footer />
                </div>
                
            </div>
        </>
    );
}