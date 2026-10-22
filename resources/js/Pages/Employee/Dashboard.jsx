import React from 'react';
import { Head } from '@inertiajs/react';

export default function EmployeeDashboard({ user }) {
    return (
        <div className="p-6 bg-blue-50 min-h-screen text-gray-900">
            <Head title="Employee Dashboard" />
            <h1 className="text-3xl font-bold text-blue-600">HALAMAN PEGAWAI (EMPLOYEE)</h1>
            <p className="mt-2">Halo, {user.name}. Silakan gunakan menu dokumen untuk pengajuan tandatangan.</p>
        </div>
    );
}