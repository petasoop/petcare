import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export type ApiRole = 'ADMIN' | 'STAFF' | 'DOKTER' | 'CLIENT'

export type ApiToken = {
  id?: string
  sub?: string
  role?: ApiRole
  name?: string
  email?: string
  avatar?: string
}

export function normalizeRole(role?: string | null): ApiRole | undefined {
  if (!role) return undefined
  if (role === 'CLIENT' || role === 'ADMIN' || role === 'STAFF' || role === 'DOKTER') return role as ApiRole
  return undefined
}

export async function getApiToken(req: Request) {
  const session = await auth()
  if (!session?.user) return null

  return {
    id: session.user.id as string,
    role: normalizeRole((session.user as any).role),
    name: session.user.name ?? undefined,
    email: session.user.email ?? undefined,
    avatar: (session.user as any).avatar ?? undefined,
  }
}

export async function getCurrentUser(req: Request) {
  const token = await getApiToken(req)
  if (!token || !token.id || !token.role || !token.email) return null
  return {
    id: token.id,
    role: token.role,
    email: token.email,
  }
}

export async function getCurrentUserWithRole(req: Request) {
  const token = await getApiToken(req)
  if (!token || !token.id || !token.role) return null
  return {
    id: getTokenUserId(token),
    role: token.role,
    name: token.name,
    email: token.email,
    avatar: token.avatar,
  }
}

export function getTokenUserId(token: ApiToken | null) {
  return token?.id || token?.sub || ''
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 })
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ message }, { status: 403 })
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ message }, { status: 404 })
}