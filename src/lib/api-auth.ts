import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export type ApiRole = 'ADMIN' | 'DOKTER' | 'PELANGGAN'

export type ApiToken = {
  id?: string
  sub?: string
  role?: ApiRole
  name?: string
  email?: string
  avatar?: string
}

export async function getApiToken(req: Request) {
  return (await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })) as ApiToken | null
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