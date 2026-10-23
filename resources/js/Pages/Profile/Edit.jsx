import { Head, usePage } from '@inertiajs/react';
import SuperadminLayout from '@/Layouts/SuperadminLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const isSuperAdmin = auth?.user?.role === 'superadmin';

    return (
        <>
            <Head title="Edit Profil - SIVALDEN" />

            <div className="mb-8">
                <span className="rounded-full bg-[#FCEBEC] px-3.5 py-1 text-xs font-semibold text-[#8B0F14]">
                    Pengaturan Akun
                </span>
                <h1 className="mt-2 font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl">
                    Edit Profil Pengguna
                </h1>
                <p className="mt-1 text-sm text-[#7F8C8D]">
                    Perbarui informasi personal, alamat email, dan keamanan kata sandi akun kamu.
                </p>
            </div>

            <div className="space-y-6">
                {/* Form Informasi Profil (Name & Email) */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        isSuperAdmin={isSuperAdmin}
                        className="max-w-xl"
                    />
                </div>

                {/* Form Ubah Password (Semua Role Bisa) */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Form Hapus Akun (Hanya Dimunculkan untuk Admin & Pegawai) */}
                {!isSuperAdmin && (
                    <div className="rounded-xl border border-[#D92020]/20 bg-white p-6 shadow-sm sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                )}
            </div>
        </>
    );
}

Edit.layout = (page) => {
    const role = page.props.auth?.user?.role;

    if (role === 'superadmin') {
        return <SuperadminLayout>{page}</SuperadminLayout>;
    }
    if (role === 'admin') {
        return <AdminLayout>{page}</AdminLayout>;
    }
    return <EmployeeLayout>{page}</EmployeeLayout>;
};