'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type { RekamMedis, RekamMedisCreateInput, RekamMedisUpdateInput } from '@/types'

interface RekamMedisResponse {
  data: RekamMedis[]
}

export const useRekamMedis = (hewanId?: string): UseQueryResult<RekamMedisResponse, Error> => {
  const key = ['rekam-medis', hewanId]

  return useQuery<RekamMedisResponse, Error>({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch(`/api/rekam-medis?hewanId=${hewanId || ''}`)
      if (!res.ok) throw new Error('Gagal fetch rekam medis')
      return res.json()
    },
    enabled: !!hewanId,
  })
}

export const useCreateRekamMedis = (): UseMutationResult<RekamMedis, Error, RekamMedisCreateInput> => {
  const qc = useQueryClient()
  const key = ['rekam-medis']

  return useMutation<RekamMedis, Error, RekamMedisCreateInput>({
    mutationFn: async (data: RekamMedisCreateInput) => {
      const res = await fetch('/api/rekam-medis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gagal membuat rekam medis')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })
}

export const useUpdateRekamMedis = (): UseMutationResult<RekamMedis, Error, { id: string; data: RekamMedisUpdateInput }> => {
  const qc = useQueryClient()
  const key = ['rekam-medis']

  return useMutation<RekamMedis, Error, { id: string; data: RekamMedisUpdateInput }>({
    mutationFn: async ({ id, data }: { id: string; data: RekamMedisUpdateInput }) => {
      const res = await fetch(`/api/rekam-medis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gagal mengupdate rekam medis')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })
}

export const useDeleteRekamMedis = (): UseMutationResult<void, Error, string> => {
  const qc = useQueryClient()
  const key = ['rekam-medis']

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/rekam-medis/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus rekam medis')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })
}

export const useDownloadRekamMedisPdf = () => {
  return async (id: string): Promise<void> => {
    const res = await fetch(`/api/rekam-medis/${id}/pdf`)
    if (!res.ok) throw new Error('Gagal mengunduh PDF')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rekam-medis-${id}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export default useRekamMedis
