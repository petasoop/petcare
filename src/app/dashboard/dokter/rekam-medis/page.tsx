import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DokterRekamMedisPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const dokterId = (session.user as any)?.id as string
  const records = await prisma.rekamMedis.findMany({
    where: { dokterId },
    include: { hewan: true, appointment: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Rekam Medis</h2>
      <p className="mt-1 text-sm text-slate-500">Catatan pemeriksaan yang Anda tangani.</p>
      <div className="mt-6 space-y-3">
        {records.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada rekam medis.</div>
        ) : (
          records.map((record) => (
            <div key={record.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{record.hewan?.nama || record.hewanId}</div>
              <div className="mt-1 text-sm text-slate-600">Tanggal: {new Date(record.tanggalPeriksa).toLocaleDateString()}</div>
              <div className="text-sm text-slate-600">Diagnosis: {record.diagnosis || '-'}</div>
              <div className="text-sm text-slate-600">Tindakan: {record.tindakan || '-'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}