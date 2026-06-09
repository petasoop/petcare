import React from 'react'
import Chat from '@/components/pelanggan/Chat'
import { auth } from '@/auth'

export default async function KonsultasiPage() {
  // server-side get session to obtain user id
  // fallback: client will fetch /api/users/me for user id
  let userId: string | undefined
  try {
    const session: any = await auth()
    userId = session?.user?.id
  } catch (e) {
    userId = undefined
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Konsultasi</h2>
      <div className="mt-4">
        {/* If server session not available, Chat will still work if userId provided via client */}
        <Chat userId={userId || ''} />
      </div>
    </div>
  )
}
