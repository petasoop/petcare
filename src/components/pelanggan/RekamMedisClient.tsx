"use client"
import React, { useState } from 'react'
import useRekamMedis from '@/hooks/useRekamMedis'
import { toast } from '@/components/shared/Toast'
import { useDoctors } from '@/hooks/useDoctors'

export default function RekamMedisClient({ hewanId }: { hewanId: string }) {
  const { query, create, downloadPdf } = useRekamMedis(hewanId)
  const { data: doctorsData } = useDoctors()
  const doctors = doctorsData || []
  const [form, setForm] = useState({ tanggalPeriksa: '', dokterId: '', keluhan: '', diagnosis: '', tindakan: '', resep: '', catatanDokter: '' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await create.mutateAsync({ ...form, hewanId, tanggalPeriksa: form.tanggalPeriksa })
      toast('Rekam medis berhasil disimpan')
      setForm({ tanggalPeriksa: '', dokterId: '', keluhan: '', diagnosis: '', tindakan: '', resep: '', catatanDokter: '' })
    } catch (err: any) {
      toast(err.message || 'Gagal menyimpan rekam medis')
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium">Rekam Medis</h3>
      <div className="mt-4">
        <form onSubmit={handleCreate} className="space-y-2">
          <div>
            <label className="block text-sm">Tanggal Periksa</label>
            <input type="date" value={form.tanggalPeriksa} onChange={(e) => setForm({ ...form, tanggalPeriksa: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Dokter</label>
            <select value={form.dokterId} onChange={(e) => setForm({ ...form, dokterId: e.target.value })} className="border p-2 rounded w-full">
              <option value="">Pilih dokter</option>
              {doctors.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm">Keluhan</label>
            <input value={form.keluhan} onChange={(e) => setForm({ ...form, keluhan: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Diagnosa</label>
            <input value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Tindakan</label>
            <input value={form.tindakan} onChange={(e) => setForm({ ...form, tindakan: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Resep</label>
            <input value={form.resep} onChange={(e) => setForm({ ...form, resep: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Catatan Dokter</label>
            <input value={form.catatanDokter || ''} onChange={(e) => setForm({ ...form, catatanDokter: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div>
            <button type="submit" className="px-3 py-2 bg-teal-600 text-white rounded">Simpan</button>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <h4 className="font-medium">Daftar Rekam Medis</h4>
        <div className="mt-2 space-y-2">
          {query.isLoading && <div>Loading...</div>}
          {(query.data as { data: any[] } | undefined)?.data?.length === 0 && <div>Belum ada rekam medis.</div>}
          {(query.data as { data: any[] } | undefined)?.data?.map((r: any) => (
            <div key={r.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{new Date(r.tanggalPeriksa).toLocaleDateString()}</div>
                <div className="text-sm text-gray-600">{r.keluhan}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => downloadPdf(r.id)} className="px-2 py-1 bg-blue-600 text-white rounded">PDF</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
