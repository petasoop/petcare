import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { forbidden, getApiToken, unauthorized } from '@/lib/api-auth'

export async function GET(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN') return forbidden()

    const items = await prisma.inventory.findMany()
    const header = ['Nama Item','Kategori','Stok','Satuan','Harga','Stok Minimal']
    const rows = items.map(i => [i.namaItem, i.kategori, String(i.stok), i.satuan, String(i.harga), String(i.stokMinimal)])
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="inventory.csv"' } })
  } catch (err) {
    return NextResponse.json({ message: 'Error exporting' }, { status: 500 })
  }
}
