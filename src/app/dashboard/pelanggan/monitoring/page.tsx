import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function PelangganMonitoringPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'PELANGGAN') redirect('/dashboard')

  const pelangganId = (session.user as any)?.id as string
  const hewanList = await prisma.hewan.findMany({
    where: { pelangganId },
    include: { Monitoring: { orderBy: { tanggal: 'desc' }, take: 5 } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Monitoring</h2>
      <p className="mt-1 text-sm text-slate-500">Catatan monitoring harian untuk hewan Anda.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {hewanList.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada hewan terdaftar.</div>
        ) : (
          hewanList.map((hewan) => (
            <div key={hewan.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{hewan.nama}</div>
              <div className="mt-3 space-y-2">
                {hewan.Monitoring.length === 0 ? (
                  <div className="text-sm text-slate-500">Belum ada monitoring.</div>
                ) : (
                  hewan.Monitoring.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="text-sm font-medium text-slate-900">{new Date(item.tanggal).toLocaleDateString()}</div>
                      <div className="text-sm text-slate-600">Nafsu makan: {item.nafsuMakan}</div>
                      <div className="text-sm text-slate-600">Aktivitas: {item.aktivitas}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}