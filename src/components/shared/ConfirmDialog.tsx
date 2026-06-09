"use client"
import React from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: { open: boolean; title?: string; message?: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/15 bg-slate-50 shadow-2xl shadow-slate-900/10">
        <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-6 py-5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-500/15 text-teal-700">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{title || 'Konfirmasi Tindakan'}</h3>
            <p className="mt-1 text-sm text-slate-500">{message || 'Apakah Anda yakin ingin melanjutkan dengan perubahan ini?'}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-slate-50"
            >
              <X size={16} /> Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <CheckCircle2 size={16} /> Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
