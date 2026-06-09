import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DokterJadwalManager from '@/components/dashboard/dokter/DokterJadwalManager'

export default async function DokterJadwalPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const dokterId = (session.user as any)?.id as string

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Jadwal Praktek</h2>
      <p className="mt-1 text-sm text-slate-500">Jadwal aktif yang terhubung ke akun Anda.</p>
      <DokterJadwalManager dokterId={dokterId} />
    </div>
  )
}