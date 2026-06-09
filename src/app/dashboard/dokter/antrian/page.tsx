import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DokterAntrianPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const dokterId = (session.user as any)?.id as string
  const today = new Date()
  const appointments = await prisma.appointment.findMany({
    where: { dokterId, tanggal: { gte: today } },
    include: { hewan: true, pelanggan: true },
    orderBy: { tanggal: 'asc' },
    take: 20,
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Antrian</h2>
      <p className="mt-1 text-sm text-slate-500">Daftar appointment mendatang yang ditugaskan ke Anda.</p>
      <div className="mt-6 space-y-3">
        {appointments.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada antrian mendatang.</div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{new Date(appointment.tanggal).toLocaleDateString()} {appointment.waktu}</div>
              <div className="mt-1 text-sm text-slate-600">Pasien: {appointment.hewan?.nama || appointment.hewanId}</div>
              <div className="text-sm text-slate-600">Pemilik: {appointment.pelanggan?.name || '-'}</div>
              <div className="text-sm text-slate-600">Status: {appointment.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}