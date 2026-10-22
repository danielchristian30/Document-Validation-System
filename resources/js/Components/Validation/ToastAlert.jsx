export default function ToastAlert({ type = 'success', message, onClose }) {
    const isSuccess = type === 'success';

    return (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-[8px] border bg-white p-4 shadow-lg transition-all animate-bounce-short sm:max-w-md border-[#E5E7EB]">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isSuccess ? 'bg-[#1E8E3E]/10 text-[#1E8E3E]' : 'bg-[#D92020]/10 text-[#D92020]'
            }`}>
                {isSuccess ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </div>

            <p className="text-sm font-medium text-[#262626] pr-2">
                {message}
            </p>

            <button onClick={onClose} className="ml-auto text-[#7F8C8D] hover:text-[#262626]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}