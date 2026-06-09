import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import type { ApiToken, CurrentUser, CurrentUserWithName } from '@/types'
import { logError } from './error-logging'

export async function getApiToken(req: Request): Promise<ApiToken | null> {
  try {
    const session = await auth()
    if (!session?.user) return null

    const sessionUser = session.user as unknown as Record<string, unknown>

    return {
      id: session.user.id as string,
      role: normalizeRole(sessionUser.role as string | null),
      name: (session.user.name ?? undefined) as string | undefined,
      email: (session.user.email ?? undefined) as string | undefined,
      avatar: (sessionUser.avatar ?? undefined) as string | undefined,
    }
  } catch (error) {
    logError(error, {
      fileName: 'api-auth.ts',
      functionName: 'getApiToken',
    })
    return null
  }
}

export async function getCurrentUser(req: Request): Promise<CurrentUser | null> {
  const token = await getApiToken(req)
  if (!token || !token.id || !token.role || !token.email) return null
  return {
    id: token.id,
    role: token.role,
    email: token.email,
  }
}

export async function getCurrentUserWithRole(req: Request): Promise<CurrentUserWithName | null> {
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

export function getTokenUserId(token: ApiToken | null): string {
  return token?.id || token?.sub || ''
}

export function normalizeRole(role?: string | null): 'ADMIN' | 'STAFF' | 'DOKTER' | 'CLIENT' | undefined {
  if (!role) return undefined
  if (role === 'CLIENT' || role === 'ADMIN' || role === 'STAFF' || role === 'DOKTER') {
    return role as 'ADMIN' | 'STAFF' | 'DOKTER' | 'CLIENT'
  }
  return undefined
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ message }, { status: 401 })
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return NextResponse.json({ message }, { status: 403 })
}

export function notFound(message = 'Not found'): NextResponse {
  return NextResponse.json({ message }, { status: 404 })
}