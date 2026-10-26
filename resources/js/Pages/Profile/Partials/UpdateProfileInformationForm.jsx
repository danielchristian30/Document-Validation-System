import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    isSuperAdmin = false,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isSuperAdmin) return;
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="font-montserrat text-lg font-bold text-[#262626]">
                    Informasi Profil
                </h2>
                <p className="mt-1 text-sm text-[#7F8C8D]">
                    {isSuperAdmin
                        ? 'Informasi nama dan email Superadmin dikunci oleh sistem dan tidak dapat diubah.'
                        : 'Perbarui informasi profil dan alamat email akun Anda.'}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full disabled:bg-[#F5F5F5] disabled:text-[#7F8C8D] disabled:cursor-not-allowed"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused={!isSuperAdmin}
                        autoComplete="name"
                        disabled={isSuperAdmin}
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full disabled:bg-[#F5F5F5] disabled:text-[#7F8C8D] disabled:cursor-not-allowed"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                {/* Tombol Simpan Hanya Ditampilkan Jika Bukan Superadmin */}
                {!isSuperAdmin && (
                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-[#1E8E3E]">Tersimpan.</p>
                        </Transition>
                    </div>
                )}
            </form>
        </section>
    );
}