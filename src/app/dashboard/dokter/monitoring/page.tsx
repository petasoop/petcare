import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DokterMonitoringPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const records = await prisma.monitoringHarian.findMany({
    include: { hewan: true },
    orderBy: { tanggal: 'desc' },
    take: 20,
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Monitoring</h2>
      <p className="mt-1 text-sm text-slate-500">Pemantauan harian yang masuk dari pelanggan.</p>
      <div className="mt-6 space-y-3">
        {records.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada data monitoring.</div>
        ) : (
          records.map((record) => (
            <div key={record.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{record.hewan?.nama || record.hewanId}</div>
              <div className="mt-1 text-sm text-slate-600">Tanggal: {new Date(record.tanggal).toLocaleDateString()}</div>
              <div className="text-sm text-slate-600">Nafsu makan: {record.nafsuMakan}</div>
              <div className="text-sm text-slate-600">Aktivitas: {record.aktivitas}</div>
              <div className="text-sm text-slate-600">Catatan: {record.catatanGejala || '-'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}