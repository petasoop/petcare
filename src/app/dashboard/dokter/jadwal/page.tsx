import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DokterJadwalPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const dokterId = (session.user as any)?.id as string
  const schedules = await prisma.jadwalDokter.findMany({
    where: { dokterId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Jadwal Praktek</h2>
      <p className="mt-1 text-sm text-slate-500">Jadwal aktif yang terhubung ke akun Anda.</p>
      <div className="mt-6 space-y-3">
        {schedules.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada jadwal aktif.</div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{schedule.hari}</div>
              <div className="mt-1 text-sm text-slate-600">{schedule.jamMulai} - {schedule.jamSelesai}</div>
              <div className="text-sm text-slate-600">Status: {schedule.isAktif ? 'Aktif' : 'Nonaktif'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}