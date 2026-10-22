import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login Pegawai" />

            <div className="flex min-h-screen flex-col justify-center bg-[#F5F5F5] font-dmsans text-[#262626] px-4 py-12 sm:px-6 lg:px-8 selection:bg-[#8B0F14] selection:text-white">
                
                {/* CONTAINER CARD UTAMA */}
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-md">
                    
                    {/* Bar Identitas Resmi 4px (Brand Red) */}
                    <div className="h-1 w-full bg-[#E6001A]" />

                    <div className="p-8 sm:p-10">
                        {/* BRAND HEADER */}
                        <div className="text-center">
                            <Link href="/" className="inline-flex items-center gap-3 transition active:scale-95">
                                <img 
                                    src="/assets/logo.webp" 
                                    alt="Logo SIVALDEN" 
                                    className="h-12 w-12 object-contain"
                                />
                                <div className="text-left">
                                    <h1 className="font-montserrat text-2xl font-extrabold tracking-tight text-[#262626]">
                                        SIVALDEN
                                    </h1>
                                    {/* <p className="text-xs font-medium text-[#7F8C8D]">
                                        Pemerintah Kota Denpasar
                                    </p> */}
                                </div>
                            </Link>

                            <h2 className="mt-6 font-montserrat text-xl font-bold text-[#262626]">
                                Login Portal Pegawai
                            </h2>
                            <p className="mt-1.5 text-xs text-[#7F8C8D]">
                                Masukkan kredensial email resmi untuk mengelola validasi dokumen.
                            </p>
                        </div>

                        {/* STATUS NOTIFIKASI (JIKA ADA FLASH SESSION) */}
                        {status && (
                            <div className="mt-6 rounded-[8px] border border-[#1E8E3E]/20 bg-[#1E8E3E]/10 p-3 text-center text-xs font-semibold text-[#1E8E3E]">
                                {status}
                            </div>
                        )}

                        {/* FORM LOGIN */}
                        <form onSubmit={submit} className="mt-8 space-y-5">
                            
                            {/* INPUT EMAIL */}
                            <div>
                                <label 
                                    htmlFor="email" 
                                    className="block text-xs font-bold uppercase tracking-wider text-[#262626] font-montserrat"
                                >
                                    Email
                                </label>
                                <div className="mt-1.5">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@denpasarkota.go.id"
                                        className={`w-full rounded-[8px] border px-3.5 py-2.5 text-sm font-medium text-[#262626] placeholder-[#7F8C8D]/60 transition focus:outline-none ${
                                            errors.email
                                                ? 'border-[#D92020] bg-[#D92020]/5 focus:border-[#D92020] focus:ring-1 focus:ring-[#D92020]'
                                                : 'border-[#E5E7EB] bg-white focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]'
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#D92020]">
                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errors.email}</span>
                                    </p>
                                )}
                            </div>

                            {/* INPUT PASSWORD */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label 
                                        htmlFor="password" 
                                        className="block text-xs font-bold uppercase tracking-wider text-[#262626] font-montserrat"
                                    >
                                        Kata Sandi
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs font-semibold text-[#8B0F14] transition hover:underline"
                                        >
                                            Lupa kata sandi?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative mt-1.5">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full rounded-[8px] border px-3.5 py-2.5 pr-10 text-sm font-medium text-[#262626] placeholder-[#7F8C8D]/60 transition focus:outline-none ${
                                            errors.password
                                                ? 'border-[#D92020] bg-[#D92020]/5 focus:border-[#D92020] focus:ring-1 focus:ring-[#D92020]'
                                                : 'border-[#E5E7EB] bg-white focus:border-[#8B0F14] focus:ring-1 focus:ring-[#8B0F14]'
                                        }`}
                                    />
                                    {/* TOGGLE SHOW/HIDE PASSWORD */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7F8C8D] hover:text-[#262626]"
                                    >
                                        {showPassword ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.003 10.003 0 012.122-.136c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-1.748 1.748L3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#D92020]">
                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            {/* CHECKBOX INGAT SAYA */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-[#E5E7EB] text-[#8B0F14] focus:ring-[#8B0F14]"
                                />
                                <label htmlFor="remember" className="ml-2 block text-xs font-medium text-[#7F8C8D]">
                                    Ingat akun saya di perangkat ini
                                </label>
                            </div>

                            {/* TOMBOL SUBMIT */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#8B0F14] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#6B0A0F] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#7F8C8D]/40"
                            >
                                {processing ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <span>Masuk ke Portal</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* FOOTER CARD */}
                    <div className="border-t border-[#E5E7EB] bg-[#F5F5F5]/60 px-8 py-4 text-center">
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7F8C8D] transition hover:text-[#8B0F14]"
                        >
                            Kembali ke Beranda SIVALDEN
                        </Link>
                    </div>
                </div>

                {/* COPYRIGHT INFORMAI */}
                <p className="mt-8 text-center text-xs text-[#7F8C8D]">
                    &copy; Diskominfos Pemerintah Kota Denpasar. Hak Cipta Dilindungi.
                </p>
            </div>
        </>
    );
}