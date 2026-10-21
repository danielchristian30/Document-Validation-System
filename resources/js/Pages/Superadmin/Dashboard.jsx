import React from 'react';
import { Head } from '@inertiajs/react';

export default function SuperadminDashboard({ user }) {
    return (
        <div className="p-6 bg-red-50 min-h-screen text-gray-900">
            <Head title="Superadmin Dashboard" />
            <h1 className="text-3xl font-bold text-red-600">HALAMAN SUPERADMIN</h1>
            <p className="mt-2">Halo, {user.name}. Anda memiliki kontrol penuh atas seluruh sistem.</p>
        </div>
    );
}