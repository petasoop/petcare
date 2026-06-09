import { NextResponse } from 'next/server'
import { getApiToken, unauthorized } from '@/lib/api-auth'

export async function GET(req: Request) {
  const token = await getApiToken(req)
  if (!token) return unauthorized()
  return NextResponse.json({ user: { id: (token as any).id, name: (token as any).name, email: (token as any).email, role: (token as any).role, avatar: (token as any).avatar } })
}
