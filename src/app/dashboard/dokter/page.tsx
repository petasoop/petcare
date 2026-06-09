import DashboardShell from '@/components/shared/DashboardShell'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export default async function DokterDashboard() {
  const session = await getServerSession(authOptions)
  const dokterId = (session?.user as any)?.id
  const today = new Date()
  const appointments = await prisma.appointment.findMany({
    where: { dokterId, tanggal: { gte: today } },
    orderBy: { tanggal: 'asc' },
    take: 5,
    include: { hewan: true, pelanggan: true },
  })
  const totalUpcoming = await prisma.appointment.count({ where: { dokterId, tanggal: { gte: today } } })

  return (
    <DashboardShell role="DOKTER">
      <div>
        <h2 className="text-2xl font-semibold text-teal-700">Dashboard Dokter</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">Upcoming Appointments: {totalUpcoming}</div>
          <div className="p-4 bg-white rounded shadow">Next Patient: {appointments[0]?.hewan?.nama || 'Belum ada'}</div>
        </div>
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Daftar Janji Selanjutnya</h3>
          <div className="mt-3 space-y-3">
            {appointments.length === 0 ? (
              <div>Tidak ada janji dalam waktu dekat.</div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="border p-3 rounded">
                  <div className="font-semibold">{new Date(appointment.tanggal).toLocaleDateString()} {appointment.waktu}</div>
                  <div className="text-sm text-slate-600">Hewan: {appointment.hewan?.nama || appointment.hewanId}</div>
                  <div className="text-sm">Pemilik: {appointment.pelanggan?.name || '-'}</div>
                  <div className="text-sm">Jenis: {appointment.jenis}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
