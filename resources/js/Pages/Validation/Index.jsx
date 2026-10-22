import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import FileDropzone from '@/Components/Validation/FileDropzone';
import ValidationResultCard from '@/Components/Validation/ValidationResultCard';
import CancelModal from '@/Components/Validation/CancelModal';
import ToastAlert from '@/Components/Validation/ToastAlert';

export default function ValidationIndex({ auth }) {
    // State simulasi untuk pengujian UI murni (Pure Frontend)
    const [status, setStatus] = useState('idle'); // 'idle' | 'scanning' | 'valid' | 'invalid'
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

    // Handler saat file dipilih/di-drop
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setStatus('scanning');

        setTimeout(() => {
            if (file.name.toLowerCase().includes('invalid')) {
                setStatus('invalid');
                setToast({
                    show: true,
                    type: 'danger',
                    message: 'Validasi gagal. Keaslian dokumen tidak dapat diverifikasi.',
                });
            } else {
                setStatus('valid');
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Dokumen berhasil divalidasi dan terverifikasi asli.',
                });
            }
        }, 2000);
    };

    // Handler reset untuk validasi ulang
    const handleReset = () => {
        setSelectedFile(null);
        setStatus('idle');
    };

    // Handler pembatalan dari Modal Shell
    const handleConfirmCancel = () => {
        setShowCancelModal(false);
        handleReset();
        setToast({
            show: true,
            type: 'danger',
            message: 'Proses validasi dokumen telah dibatalkan.',
        });
    };

    return (
        <>
            <Head title="Validasi Dokumen - SIVALDOK" />

            <div className="min-h-screen bg-[#F5F5F5] font-dmsans text-[#262626] selection:bg-[#8B0F14] selection:text-white">
                <Navbar auth={auth} />

                {/* Banner Toast Notification Floating */}
                {toast.show && (
                    <ToastAlert
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                )}

                <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
                    {/* Header Halaman */}
                    <div className="mb-8">
                        <span className="rounded-full bg-[#FCEBEC] px-3.5 py-1 text-xs font-semibold text-[#8B0F14]">
                            Layanan Publik SIVALDOK
                        </span>
                        <h1 className="mt-3 font-montserrat text-3xl font-extrabold text-[#262626] sm:text-4xl">
                            Validasi Dokumen Elektronik
                        </h1>
                        <p className="mt-2 text-base text-[#7F8C8D]">
                            Unggah berkas PDF resmi Pemerintah Kota Denpasar untuk memverifikasi keaslian Tanda Tangan Elektronik (TTE) dan keutuhan dokumen.
                        </p>
                    </div>

                    {/* Render Komponen Utama Berdasarkan Status */}
                    <div className="space-y-6">
                        {status === 'idle' || status === 'scanning' ? (
                            <FileDropzone
                                selectedFile={selectedFile}
                                status={status}
                                onFileSelect={handleFileSelect}
                                onCancel={() => setShowCancelModal(true)}
                            />
                        ) : (
                            <ValidationResultCard
                                status={status}
                                fileName={selectedFile?.name || 'Dokumen_Resmi_Pemkot.pdf'}
                                fileSize={selectedFile?.size || 1024 * 750}
                                onReset={handleReset}
                            />
                        )}
                    </div>

                    {/* Panel Pengujian Mode UI (Dev Control Panel) */}
                    <div className="mt-12 rounded-[8px] border border-[#E5E7EB] bg-white p-4 shadow-sm">
                        <p className="mb-2 font-montserrat text-xs font-bold uppercase tracking-wider text-[#7F8C8D]">
                            Panel Pengujian Tampilan UI (Mock State Controls)
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <button
                                onClick={handleReset}
                                className={`rounded-[8px] px-3 py-1.5 font-semibold transition ${status === 'idle' ? 'bg-[#8B0F14] text-white' : 'bg-[#F5F5F5] text-[#262626] hover:bg-[#E5E7EB]'}`}
                            >
                                State: Idle (Dropzone)
                            </button>
                            <button
                                onClick={() => setStatus('scanning')}
                                className={`rounded-[8px] px-3 py-1.5 font-semibold transition ${status === 'scanning' ? 'bg-[#8B0F14] text-white' : 'bg-[#F5F5F5] text-[#262626] hover:bg-[#E5E7EB]'}`}
                            >
                                State: Memproses
                            </button>
                            <button
                                onClick={() => setStatus('valid')}
                                className={`rounded-[8px] px-3 py-1.5 font-semibold transition ${status === 'valid' ? 'bg-[#8B0F14] text-white' : 'bg-[#F5F5F5] text-[#262626] hover:bg-[#E5E7EB]'}`}
                            >
                                State: Valid (Centang Hijau)
                            </button>
                            <button
                                onClick={() => setStatus('invalid')}
                                className={`rounded-[8px] px-3 py-1.5 font-semibold transition ${status === 'invalid' ? 'bg-[#8B0F14] text-white' : 'bg-[#F5F5F5] text-[#262626] hover:bg-[#E5E7EB]'}`}
                            >
                                State: Tidak Valid (Merah)
                            </button>
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="rounded-[8px] bg-[#E6001A] px-3 py-1.5 font-semibold text-white transition hover:bg-[#6B0A0F]"
                            >
                                Trigger Modal Batal
                            </button>
                        </div>
                    </div>
                </main>

                <Footer />

                {/* Modal Konfirmasi Pembatalan */}
                <CancelModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleConfirmCancel}
                />
            </div>
        </>
    );
}