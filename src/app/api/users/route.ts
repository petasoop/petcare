import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { forbidden, getCurrentUserWithRole, unauthorized } from '@/lib/api-auth'
import { logError } from '@/lib/error-logging'
import { checkRateLimit } from '@/lib/rate-limit'

const createSchema = z.object({ name: z.string(), email: z.string().email(), role: z.enum(['ADMIN','STAFF','DOKTER','CLIENT']), password: z.string().min(6) })

export async function GET(req: Request) {
  try {
    const token = await getCurrentUserWithRole(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN') return forbidden()

    const url = new URL(req.url)
    const role = url.searchParams.get('role') as 'ADMIN' | 'STAFF' | 'DOKTER' | 'CLIENT' | undefined
    const where = role ? { role } : undefined
    const users = await prisma.user.findMany({ where })
    return NextResponse.json({ data: users })
  } catch (error) {
    logError(error, { fileName: 'users/route.ts', functionName: 'GET' })
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = createSchema.parse(body)

    if (parsed.role === 'CLIENT') {
      const limit = checkRateLimit(req, 'registration-client', 3, 60 * 60 * 1000)
      if (limit.limited) {
        return NextResponse.json(
          { message: 'Too many registration attempts from this IP, please try again later.' },
          { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
        )
      }
    }

    const token = await getCurrentUserWithRole(req)
    if (parsed.role !== 'CLIENT' && (!token || token.role !== 'ADMIN')) {
      return forbidden()
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(parsed.password, salt)
    const created = await prisma.user.create({ data: { name: parsed.name, email: parsed.email, role: parsed.role, password: hash } })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    logError(error, { fileName: 'users/route.ts', functionName: 'POST' })
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Invalid input' }, { status: 400 })
  }
}
