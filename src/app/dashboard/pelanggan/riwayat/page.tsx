import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import RiwayatHistory from '@/components/pelanggan/RiwayatHistory'

export default async function PelangganRiwayatPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'CLIENT') redirect('/dashboard')

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Riwayat</h2>
      <p className="mt-1 text-sm text-slate-500">Appointment dan kunjungan sebelumnya.</p>
      <RiwayatHistory />
    </div>
  )
}