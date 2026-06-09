import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DokterRiwayatPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const dokterId = (session.user as any)?.id as string
  const today = new Date()
  const history = await prisma.appointment.findMany({
    where: {
      dokterId,
      OR: [{ status: 'SELESAI' }, { tanggal: { lt: today } }],
    },
    include: { hewan: true, pelanggan: true },
    orderBy: { tanggal: 'desc' },
    take: 20,
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Riwayat</h2>
      <p className="mt-1 text-sm text-slate-500">Janji dan tindakan yang sudah berlalu.</p>
      <div className="mt-6 space-y-3">
        {history.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada riwayat.</div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{new Date(item.tanggal).toLocaleDateString()} {item.waktu}</div>
              <div className="mt-1 text-sm text-slate-600">Hewan: {item.hewan?.nama || item.hewanId}</div>
              <div className="text-sm text-slate-600">Pemilik: {item.pelanggan?.name || '-'}</div>
              <div className="text-sm text-slate-600">Status: {item.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}