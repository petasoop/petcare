'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type { Invoice, ApiResponse, InvoiceCreateInput, InvoiceUpdateInput } from '@/types'

const INVOICE_KEY = ['invoice']

interface InvoiceQueryResponse {
  data: Invoice[]
}

export const useInvoice = (status?: string): UseQueryResult<InvoiceQueryResponse, Error> => {
  const queryKey = status ? [...INVOICE_KEY, status] : INVOICE_KEY

  return useQuery<InvoiceQueryResponse, Error>({
    queryKey,
    queryFn: async () => {
      const url = new URL('/api/invoice', window.location.href)
      if (status) url.searchParams.set('status', status)
      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Gagal mengambil invoice')
      return res.json()
    },
  })
}

interface CreateInvoiceData {
  customerId: string
  hewanId?: string
  items: Array<{
    inventoryId?: string
    namaItem: string
    quantity: number
    unitPrice: number
  }>
}

export const useCreateInvoice = (): UseMutationResult<Invoice, Error, CreateInvoiceData> => {
  const qc = useQueryClient()

  return useMutation<Invoice, Error, CreateInvoiceData>({
    mutationFn: async (data: CreateInvoiceData) => {
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gagal membuat invoice')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICE_KEY }),
  })
}

export const useUpdateInvoice = (): UseMutationResult<Invoice, Error, { id: string; data: InvoiceUpdateInput }> => {
  const qc = useQueryClient()

  return useMutation<Invoice, Error, { id: string; data: InvoiceUpdateInput }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/invoice/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gagal memperbarui invoice')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICE_KEY }),
  })
}

export const useApproveInvoice = (): UseMutationResult<Invoice, Error, string> => {
  const qc = useQueryClient()

  return useMutation<Invoice, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/invoice/${id}/approve`, { method: 'PUT' })
      if (!res.ok) throw new Error('Gagal approve invoice')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICE_KEY }),
  })
}

export const usePrintInvoice = (): UseMutationResult<Invoice, Error, string> => {
  const qc = useQueryClient()

  return useMutation<Invoice, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/invoice/${id}/print`, { method: 'PUT' })
      if (!res.ok) throw new Error('Gagal print invoice')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICE_KEY }),
  })
}

export const useVoidInvoice = (): UseMutationResult<Invoice, Error, { id: string; voidReason: string }> => {
  const qc = useQueryClient()

  return useMutation<Invoice, Error, { id: string; voidReason: string }>({
    mutationFn: async ({ id, voidReason }) => {
      const res = await fetch(`/api/invoice/${id}/void`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voidReason }),
      })
      if (!res.ok) throw new Error('Gagal void invoice')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICE_KEY }),
  })
}

export default useInvoice
