import React from 'react';

export function Icon({ name = 'document', size = 18, className = '' }) {
    const common = {
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
        width: size,
        height: size,
        'aria-hidden': true,
    };

    switch (name) {
        case 'grid': return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
        case 'users': return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
        case 'document': return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>;
        case 'activity': return <svg {...common}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>;
        case 'shield': return <svg {...common}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /><path d="m9 12 2 2 4-4" /></svg>;
        case 'folders': return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 10h18" /></svg>;
        case 'search': return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
        case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
        case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
        case 'check': return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
        case 'x': return <svg {...common}><path d="M18 6 6 18M6 6l12 12" /></svg>;
        case 'filter': return <svg {...common}><path d="M4 5h16M7 12h10m-7 7h4" /></svg>;
        case 'eye': return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
        case 'arrow': return <svg {...common}><path d="M7 17 17 7M8 7h9v9" /></svg>;
        case 'menu': return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
        case 'logout': return <svg {...common}><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>;
        default: return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>;
    }
}

export function PageHeader({ eyebrow = 'Modul Admin', title, description, action }) {
    return (
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                {eyebrow ? (
                    <span className="inline-flex rounded-full bg-[#FCEBEC] px-3.5 py-1 text-xs font-semibold text-[#8B0F14]">
                        {eyebrow}
                    </span>
                ) : null}
                <h1 className={`${eyebrow ? 'mt-2' : 'mt-1 sm:mt-2'} break-words font-montserrat text-2xl font-extrabold text-[#262626] sm:text-3xl`}>{title}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-[#7F8C8D]">{description}</p>
            </div>
            {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
        </div>
    );
}

export function StatCard({ label, value, detail, icon = 'document', tone = 'maroon' }) {
    const toneClasses = {
        maroon: 'bg-[#FCEBEC] text-[#8B0F14]',
        green: 'bg-[#EAF5EE] text-[#1E8E3E]',
        red: 'bg-[#FDECEC] text-[#D92020]',
        amber: 'bg-[#FFF5E5] text-[#A66A00]',
        gray: 'bg-[#F3F4F6] text-[#525252]',
    };

    return (
        <article className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-5">
            <div className="flex min-w-0 items-start justify-between gap-2">
                <p className="min-w-0 text-xs font-medium leading-5 text-[#7F8C8D] sm:text-sm">{label}</p>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone] || toneClasses.maroon}`}>
                    <Icon name={icon} size={17} />
                </span>
            </div>
            <p className="mt-2 break-words font-montserrat text-2xl font-extrabold leading-tight text-[#262626] sm:mt-3 sm:text-3xl">{value}</p>
            {detail ? <p className="mt-2 break-words text-[11px] leading-4 text-[#7F8C8D] sm:text-xs">{detail}</p> : null}
        </article>
    );
}

export function StatusBadge({ status }) {
    const normalized = String(status || '').toLowerCase();
    let classes = 'bg-[#F3F4F6] text-[#525252]';
    let dot = 'bg-[#7F8C8D]';

    if (['aktif', 'valid', 'terbit', 'terverifikasi', 'berhasil', 'disetujui'].some((word) => normalized.includes(word))) {
        classes = 'bg-[#EAF5EE] text-[#1E8E3E]';
        dot = 'bg-[#1E8E3E]';
    } else if (['dicabut', 'tidak sah', 'nonaktif', 'gagal', 'ditolak'].some((word) => normalized.includes(word))) {
        classes = 'bg-[#FDECEC] text-[#D92020]';
        dot = 'bg-[#D92020]';
    } else if (['menunggu', 'review', 'proses', 'pending'].some((word) => normalized.includes(word))) {
        classes = 'bg-[#FFF5E5] text-[#A66A00]';
        dot = 'bg-[#D99A19]';
    }

    return <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold leading-4 ${classes}`}><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />{status || 'Tidak diketahui'}</span>;
}

export function PanelHeader({ title, subtitle, action }) {
    return (
        <div className="flex min-w-0 flex-col gap-2 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h2 className="font-montserrat text-sm font-bold text-[#262626] sm:text-base">{title}</h2>
                {subtitle ? <p className="mt-1 text-xs leading-5 text-[#7F8C8D]">{subtitle}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}

export function SearchField({ value, onChange, placeholder = 'Cari data...' }) {
    return (
        <div className="relative w-full min-w-0">
            <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7F8C8D]" />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-xs text-[#262626] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#8B0F14] focus:bg-white focus:ring-1 focus:ring-[#8B0F14]"
            />
        </div>
    );
}

export function EmptyState({ title = 'Data tidak ditemukan', description = 'Coba ubah kata kunci atau filter yang dipilih.' }) {
    return (
        <div className="px-4 py-10 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-[#7F8C8D]"><Icon name="document" size={19} /></span>
            <p className="mt-3 text-sm font-semibold text-[#262626]">{title}</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#7F8C8D]">{description}</p>
        </div>
    );
}

const filterTabTone = {
    Aktif: 'bg-[#1E8E3E] text-white shadow-sm',
    Nonaktif: 'bg-[#D92020] text-white shadow-sm',
};

export function FilterTabs({ options, value, onChange }) {
    return (
        <div className="grid min-w-0 grid-cols-3 gap-2 min-[480px]:flex">
            {options.map((option) => {
                const active = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        aria-pressed={active}
                        className={`flex w-full items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-bold transition min-[480px]:w-auto min-[480px]:px-4 ${active ? (filterTabTone[option.value] || 'bg-[#8B0F14] text-white shadow-sm') : 'bg-[#F5F5F5] text-[#7F8C8D] hover:bg-[#E5E7EB] hover:text-[#262626]'}`}
                    >
                        <span>{option.label}</span>
                        {option.count !== undefined ? (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#262626]'}`}>{option.count}</span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}