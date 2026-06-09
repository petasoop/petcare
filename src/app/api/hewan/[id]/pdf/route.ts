import { getApiToken, getTokenUserId, notFound, unauthorized, forbidden } from '@/lib/api-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateHewanCardDocument, createPdfBufferFromDocument } from '@/lib/pdf'
import { logError } from '@/lib/error-logging'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const { id } = params
    const hewan = await prisma.hewan.findUnique({ where: { id }, include: { pelanggan: true } })
    if (!hewan) return notFound()

    const userId = getTokenUserId(token)
    if (token.role !== 'ADMIN' && hewan.pelangganId !== userId) return forbidden()

    const doc = generateHewanCardDocument(hewan, hewan.pelanggan)
    const buffer = await createPdfBufferFromDocument(doc)
    return new Response(buffer, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="kartu-${hewan.nama}.pdf"` } })
  } catch (error) {
    logError(error, { fileName: 'hewan/[id]/pdf/route.ts', functionName: 'GET' })
    return NextResponse.json({ message: 'Error generating PDF' }, { status: 500 })
  }
}
