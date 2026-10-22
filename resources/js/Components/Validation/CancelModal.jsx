export default function CancelModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-[#E5E7EB]">
                {/* Close Icon Upper Right */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[#7F8C8D] transition hover:text-[#262626]"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex items-start gap-4">
                    {/* Warning Icon Badge */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D92020]/10 text-[#D92020]">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="font-montserrat text-lg font-bold text-[#262626]">
                            Batalkan proses validasi?
                        </h3>
                        <p className="mt-1 text-sm text-[#7F8C8D]">
                            Dokumen akan dikeluarkan dari antrean. Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                    <button
                        onClick={onClose}
                        className="rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#262626] transition hover:bg-[#F5F5F5] active:scale-95"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-[8px] bg-[#E6001A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6B0A0F] active:scale-95 shadow-sm"
                    >
                        Ya, Batalkan
                    </button>
                </div>
            </div>
        </div>
    );
}