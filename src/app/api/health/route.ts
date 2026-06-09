import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/error-logging'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', database: 'reachable' })
  } catch (error) {
    logError(error, { fileName: 'health/route.ts', functionName: 'GET' })
    return NextResponse.json(
      { status: 'error', message: 'Database unreachable' },
      { status: 503 },
    )
  }
}
