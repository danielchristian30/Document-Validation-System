import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CreateEditModal({ show, onClose, category = null, onSave }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requires_verification: true,
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        requires_verification: category.requires_verification ?? true,
        is_active: category.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        requires_verification: true,
        is_active: true,
      });
    }
    setErrors({});
  }, [category, show]);

  if (!show || !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama kategori wajib diisi.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
      <div
        className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 shadow-2xl transition-all sm:max-h-[calc(100dvh-2rem)] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <h3 className="font-montserrat text-lg font-extrabold text-[#262626]">
              {category ? 'Edit Kategori Dokumen' : 'Tambah Kategori Baru'}
            </h3>
            <p className="mt-0.5 text-xs text-[#7F8C8D]">
              {category
                ? 'Perbarui detail data kategori dokumen di bawah ini.'
                : 'Isi formulir untuk menambahkan kelompok kategori dokumen baru.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#7F8C8D] transition hover:bg-[#F5F5F5] hover:text-[#262626]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#262626]">
              Nama Kategori Dokumen <span className="text-[#D92020]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Surat Rekomendasi Sektoral"
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2 text-xs text-[#262626] outline-none transition ${
                errors.name ? 'border-[#D92020] focus:border-[#D92020]' : 'border-[#E5E7EB] focus:border-[#8B0F14]'
              }`}
            />
            {errors.name && <p className="mt-1 text-[11px] text-[#D92020]">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#262626]">Deskripsi / Penjelasan Kategori</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan peruntukan atau batasan dokumen dalam kategori ini..."
              className="mt-1.5 w-full rounded-lg border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#262626] outline-none transition focus:border-[#8B0F14]"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#262626] transition hover:bg-[#F5F5F5] sm:w-auto"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#8B0F14] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6B0A0F] sm:w-auto"
            >
              {category ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}