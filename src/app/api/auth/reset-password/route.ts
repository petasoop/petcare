import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { logError } from '@/lib/error-logging'
import { checkRateLimit } from '@/lib/rate-limit'

const schema = z.object({ token: z.string(), password: z.string().min(8) })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = schema.parse(body)

    const limit = checkRateLimit(req, 'reset-password', 5, 15 * 60 * 1000)
    if (limit.limited) {
      return NextResponse.json(
        { message: 'Too many requests from this IP, please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const now = new Date()
    const reset = await prisma.passwordReset.findFirst({
      where: { used: false, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, userId: true, tokenHash: true },
    })

    if (!reset) return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })

    const match = await bcrypt.compare(token, reset.tokenHash)
    if (!match) return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await prisma.user.update({ where: { id: reset.userId }, data: { password: hash } })
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } })

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error) {
    logError(error, { fileName: 'auth/reset-password/route.ts', functionName: 'POST' })
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Invalid input' }, { status: 400 })
  }
}
