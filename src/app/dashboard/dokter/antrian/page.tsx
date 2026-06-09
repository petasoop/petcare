import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DokterAntrianManager from '@/components/dashboard/dokter/DokterAntrianManager'

export default async function DokterAntrianPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const dokterId = (session.user as any)?.id as string

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Antrian</h2>
      <p className="mt-1 text-sm text-slate-500">Daftar appointment mendatang yang ditugaskan ke Anda.</p>
      <DokterAntrianManager dokterId={dokterId} />
    </div>
  )
}