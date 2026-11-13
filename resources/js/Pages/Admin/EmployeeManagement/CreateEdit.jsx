import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const EMAIL_DOMAIN = '@denpasarkota.com';

export default function CreateEditModal({
    show,
    onClose,
    employee = null,
    bidang = '',
    onSave,
}) {
    const [mounted, setMounted] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setDataState] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const isEdit = Boolean(employee);

    useEffect(() => {
        setMounted(true);
    }, []);

    const setData = (field, value) => {
        setDataState((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // Isi form saat modal dibuka atau pegawai yang dipilih berubah.
    useEffect(() => {
        if (!show) return;

        setErrors({});
        setDataState({
            name: employee?.name || '',
            username:
                employee?.username ||
                (employee?.email ? employee.email.split('@')[0] : ''),
            email: employee?.email
                ? `${employee.email.split('@')[0]}${EMAIL_DOMAIN}`
                : '',
            password: '',
            password_confirmation: '',
        });
    }, [show, employee]);

    if (!show || !mounted) return null;

    const closeModal = () => {
        if (processing) return;

        setErrors({});
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        const trimmedName = data.name.trim();
        const trimmedUsername = data.username.trim();
        const emailPrefix = data.email.split('@')[0].trim();

        if (!trimmedName) {
            newErrors.name = 'Nama lengkap wajib diisi.';
        }
        if (!trimmedUsername) {
            newErrors.username = 'Username wajib diisi.';
        }
        if (!emailPrefix) {
            newErrors.email = 'Alamat email wajib diisi.';
        }
        if (!isEdit && data.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter.';
        } else if (
            isEdit &&
            data.password.length > 0 &&
            data.password.length < 8
        ) {
            newErrors.password = 'Password minimal 8 karakter.';
        }
        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation =
                'Konfirmasi password tidak cocok.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setProcessing(true);

        const payload = {
            name: trimmedName,
            username: trimmedUsername,
            email: `${emailPrefix}${EMAIL_DOMAIN}`,
            ...(data.password ? { password: data.password } : {}),
        };

        if (onSave) {
            onSave(payload);
        }

        setProcessing(false);
    };

    const inputClass =
        'w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#262626] placeholder-[#7F8C8D] transition focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14]';

    const errorClass = 'mt-1 text-[11px] text-[#D92020]';

    const labelClass =
        'mb-1.5 block text-xs font-semibold text-[#262626]';

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
            }}
        >
            <div
                className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-7"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                    <div>
                        <h3 className="font-montserrat text-lg font-bold text-[#262626]">
                            {isEdit
                                ? 'Edit Profil Pegawai'
                                : 'Tambah Pegawai Baru'}
                        </h3>

                        <p className="mt-0.5 text-xs text-[#7F8C8D]">
                            {isEdit
                                ? 'Perbarui informasi akun pegawai.'
                                : `Isi formulir di bawah ini untuk menambahkan akun operasional pegawai${bidang ? ` pada ${bidang}` : ''}.`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={processing}
                        className="rounded-lg p-1.5 text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626] disabled:opacity-50"
                        aria-label="Tutup modal"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* NAMA */}
                    <div>
                        <label className={labelClass}>
                            Nama Lengkap <span className="text-[#D92020]">*</span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            autoComplete="name"
                            required
                            className={inputClass}
                        />

                        {errors.name && (
                            <p className={errorClass}>{errors.name}</p>
                        )}
                    </div>

                    {/* USERNAME */}
                    <div>
                        <label className={labelClass}>
                            Username <span className="text-[#D92020]">*</span>
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Masukkan username"
                            autoComplete="username"
                            required
                            className={inputClass}
                        />

                        {errors.username && (
                            <p className={errorClass}>{errors.username}</p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className={labelClass}>
                            Alamat Email <span className="text-[#D92020]">*</span>
                        </label>

                        <div className="flex w-full">
                            <input
                                type="text"
                                name="email"
                                value={data.email
                                    .split('@')[0]
                                    .replace(/@/g, '')}
                                onChange={(e) => {
                                    const emailPrefix = e.target.value
                                        .split('@')[0]
                                        .trim();

                                    setData(
                                        'email',
                                        emailPrefix
                                            ? `${emailPrefix}${EMAIL_DOMAIN}`
                                            : ''
                                    );
                                }}
                                placeholder="Masukkan nama email"
                                autoComplete="off"
                                required
                                aria-label="Nama email"
                                className="w-full min-w-0 rounded-l-[8px] rounded-r-none border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#262626] placeholder-[#7F8C8D] transition focus:z-10 focus:border-[#8B0F14] focus:outline-none focus:ring-1 focus:ring-[#8B0F14]"
                            />

                            <span className="inline-flex shrink-0 items-center rounded-r-[8px] border border-l-0 border-[#E5E7EB] bg-[#F9FAFB] px-3 text-xs text-[#626262]">
                                {EMAIL_DOMAIN}
                            </span>
                        </div>

                        {errors.email && (
                            <p className={errorClass}>{errors.email}</p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className={labelClass}>
                            Password{' '}
                            {isEdit ? (
                                <span className="text-[11px] font-normal text-[#7F8C8D]">
                                    (Kosongkan jika tidak diubah)
                                </span>
                            ) : (
                                <span className="text-[#D92020]">*</span>
                            )}
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                            required={!isEdit}
                            minLength={8}
                            className={inputClass}
                        />

                        {errors.password && (
                            <p className={errorClass}>{errors.password}</p>
                        )}
                    </div>

                    {/* KONFIRMASI PASSWORD */}
                    <div>
                        <label className={labelClass}>
                            Konfirmasi Password{' '}
                            {!isEdit && (
                                <span className="text-[#D92020]">*</span>
                            )}
                        </label>

                        <input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            placeholder="Ulangi password"
                            autoComplete="new-password"
                            required={!isEdit || data.password.length > 0}
                            className={inputClass}
                        />

                        {errors.password_confirmation && (
                            <p className={errorClass}>
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={processing}
                            className="w-full rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#262626] transition hover:bg-[#F5F5F5] disabled:opacity-50 sm:w-auto sm:py-2"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-[8px] bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : isEdit
                                    ? 'Simpan Perubahan'
                                    : 'Tambah Pegawai'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}