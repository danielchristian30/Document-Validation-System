import React from 'react';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F5F5F5] font-dmsans text-[#262626]">
            {/* Template sementara Admin Layout */}
            <main className="p-6 lg:p-10">
                {children}
            </main>
        </div>
    );
}