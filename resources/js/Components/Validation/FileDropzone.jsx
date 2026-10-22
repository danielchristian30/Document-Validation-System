import { useState, useRef } from 'react';

export default function FileDropzone({ selectedFile, status, onFileSelect, onCancel }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Validasi file: Harus PDF & Maksimal 10 MB
    const validateAndProcessFile = (file) => {
        setError(null);

        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Format file tidak didukung. Harap unggah berkas berformat PDF.');
            return;
        }

        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxSizeInBytes) {
            setError('Ukuran file terlalu besar. Batas maksimum berkas adalah 10 MB.');
            return;
        }

        onFileSelect(file);
    };

    // Handler Drag & Drop Events
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndProcessFile(files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndProcessFile(files[0]);
        }
    };

    return (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
            {/* INPUT HIDDEN UNTUK PILIH FILE */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".pdf,application/pdf"
                className="hidden"
            />

            {/* ERROR ALERT (JIKA SALAH FORMAT / OVERSIZE) */}
            {error && (
                <div className="mb-6 flex items-center justify-between rounded-[8px] border border-[#D92020]/20 bg-[#D92020]/5 px-4 py-3 text-sm text-[#D92020]">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError(null)} className="text-[#D92020] hover:opacity-80">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* STATE 1: IDLE / DROPZONE AREA */}
            {status === 'idle' && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group flex cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed py-12 px-6 text-center transition-all duration-200 ${
                        isDragging
                            ? 'border-[#8B0F14] bg-[#FCEBEC]/50 scale-[0.99]'
                            : 'border-[#E5E7EB] bg-white hover:border-[#8B0F14] hover:bg-[#FCEBEC]/20'
                    }`}
                >
                    {/* Icon Cloud Upload dengan Wadah Primary Tint (#FCEBEC) */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FCEBEC] text-[#8B0F14] transition-transform group-hover:scale-110">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>

                    <h3 className="mt-4 font-montserrat text-lg font-bold text-[#262626]">
                        Tarik dokumen ke sini
                    </h3>
                    <p className="mt-1 text-sm text-[#7F8C8D]">
                        atau{' '}
                        <span className="font-semibold text-[#8B0F14] underline decoration-1 underline-offset-2">
                            pilih dari perangkat
                        </span>{' '}
                        · PDF, maks. 10 MB
                    </p>
                </div>
            )}

            {/* STATE 2: SCANNING / MEMPROSES VALIDASI */}
            {status === 'scanning' && (
                <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-[#F5F5F5]/50 py-10 px-6 text-center">
                    {/* Spinner & Document Preview */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#FCEBEC] text-[#8B0F14]">
                        <svg className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#8B0F14] border-t-transparent"></div>
                    </div>

                    <h3 className="mt-5 font-montserrat text-lg font-bold text-[#262626]">
                        Memindai Sidik Jari Kriptografi...
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[#7F8C8D]">
                        {selectedFile?.name || 'Dokumen.pdf'} · {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    {/* Progress Bar Line */}
                    <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#E5E7EB]">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-[#8B0F14]"></div>
                    </div>

                    <p className="mt-3 text-xs text-[#7F8C8D]">
                        Menghitung hash SHA-512 & verifikasi kunci publik Ed25519
                    </p>

                    {/* Tombol Pembatalan */}
                    <button
                        onClick={onCancel}
                        className="mt-6 rounded-[8px] border border-[#E5E7EB] bg-white px-5 py-2 text-xs font-semibold text-[#D92020] shadow-sm transition hover:bg-[#D92020]/5 active:scale-95"
                    >
                        Batalkan Validasi
                    </button>
                </div>
            )}
        </div>
    );
}