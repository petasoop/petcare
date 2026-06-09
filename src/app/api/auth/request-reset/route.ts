import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { sendPasswordReset } from '@/lib/email'
import { logError } from '@/lib/error-logging'

const schema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ message: 'If the email exists, a reset link will be sent.' })

    const token = crypto.randomBytes(24).toString('hex')
    const salt = await bcrypt.genSalt(10)
    const tokenHash = await bcrypt.hash(token, salt)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.passwordReset.create({ data: { userId: user.id, tokenHash, expiresAt } })
    await sendPasswordReset(user.email, token)

    return NextResponse.json({ message: 'If the email exists, a reset link will be sent.' })
  } catch (error) {
    logError(error, { fileName: 'auth/request-reset/route.ts', functionName: 'POST' })
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Invalid input' }, { status: 400 })
  }
}
