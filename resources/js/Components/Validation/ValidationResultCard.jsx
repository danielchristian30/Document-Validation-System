// Pastikan ada "export default" di depan fungsi:
export default function ValidationResultCard({ status, fileName, fileSize, onReset }) {
    const isValid = status === 'valid';

    return (
        <div className="space-y-6">
            {/* CARD STATUS HASIL VALIDASI */}
            <div className={`relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm sm:p-8 transition-all ${
                isValid ? 'border-[#1E8E3E]/30' : 'border-[#D92020]/30'
            }`}>
                {/* Visual Indicator Left Border */}
                <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${
                    isValid ? 'bg-[#1E8E3E]' : 'bg-[#D92020]'
                }`} />

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        {/* Icon Status Circle */}
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                            isValid ? 'bg-[#1E8E3E]/10 text-[#1E8E3E]' : 'bg-[#D92020]/10 text-[#D92020]'
                        }`}>
                            {isValid ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 className="font-montserrat text-xl font-bold text-[#262626] sm:text-2xl">
                                {isValid ? 'Tanda tangan valid' : 'Tanda tangan tidak valid'}
                            </h2>
                            <p className="mt-1 text-sm text-[#7F8C8D]">
                                {isValid
                                    ? 'Dokumen telah ditandatangani secara elektronik dan tercatat pada sistem.'
                                    : 'Keaslian tanda tangan pada dokumen ini tidak dapat diverifikasi.'}
                            </p>
                        </div>
                    </div>

                    {/* Status Pill Badge */}
                    <div className="self-start">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            isValid
                                ? 'bg-[#1E8E3E]/10 text-[#1E8E3E]'
                                : 'bg-[#D92020]/10 text-[#D92020]'
                        }`}>
                            {isValid ? (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Terverifikasi
                                </>
                            ) : (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Gagal
                                </>
                            )}
                        </span>
                    </div>
                </div>

                <hr className="my-6 border-[#E5E7EB]" />

                {/* METADATA DOKUMEN & PENANDATANGAN */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium text-[#7F8C8D]">Penandatangan</p>
                        <p className="mt-1 font-montserrat text-sm font-bold text-[#262626]">
                            {isValid ? 'I Gusti Ngurah Jaya Negara' : 'Tidak dikenali'}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-[#7F8C8D]">Waktu validasi</p>
                        <p className="mt-1 font-dmsans text-sm font-bold text-[#262626]">
                            18 Jun 2025 · 09.42 WITA
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-[#7F8C8D]">Nama Berkas</p>
                        <p className="mt-1 font-mono text-xs font-semibold text-[#262626]">
                            {fileName}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-[#7F8C8D]">Ukuran Berkas</p>
                        <p className="mt-1 font-mono text-xs font-semibold text-[#262626]">
                            {(fileSize / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>
                </div>

                {/* DIGEST HASH SHA-512 */}
                <div className="mt-6 rounded-[8px] bg-[#F5F5F5] p-4">
                    <p className="text-xs font-medium text-[#7F8C8D]">Nilai Hash Dokumen (SHA-512)</p>
                    <div className="mt-2 flex items-center justify-between overflow-hidden rounded-[6px] bg-white px-3 py-2 border border-[#E5E7EB]">
                        <code className="overflow-x-auto font-mono text-xs text-[#8B0F14]">
                            {isValid
                                ? '8c61f0a7b92c4e519283f1201293840129384e01d9b27a81c192039485012938'
                                : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                        </code>
                    </div>
                </div>
            </div>

            {/* TOMBOL AKSI ATAS HASIL */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={onReset}
                    className="rounded-[8px] border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#262626] shadow-sm transition hover:bg-[#FCEBEC] hover:text-[#8B0F14] active:scale-95"
                >
                    Cek Dokumen Lain
                </button>
            </div>
        </div>
    );
}