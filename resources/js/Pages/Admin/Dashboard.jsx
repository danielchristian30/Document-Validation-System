import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminDashboard({ user }) {
    return (
        <div className="p-6 bg-yellow-50 min-h-screen text-gray-900">
            <Head title="Admin Dashboard" />
            <h1 className="text-3xl font-bold text-yellow-600">HALAMAN ADMIN</h1>
            <p className="mt-2">Halo, {user.name}. Anda bertugas mengelola setiap employee serta proses penandatanganan dokumen.</p>
        </div>
    );
}