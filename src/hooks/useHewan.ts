'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type { Hewan, ApiPaginatedResponse, HewanCreateInput, HewanUpdateInput } from '@/types'

const fetchHewan = async (page = 1, limit = 10, pelangganId?: string): Promise<ApiPaginatedResponse<Hewan>> => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (pelangganId) params.set('pelangganId', pelangganId)
  const res = await fetch(`/api/hewan?${params.toString()}`)
  if (!res.ok) throw new Error('Error fetching')
  return res.json()
}

export function useHewan(page = 1, limit = 10, pelangganId?: string): UseQueryResult<ApiPaginatedResponse<Hewan>, Error> {
  return useQuery<ApiPaginatedResponse<Hewan>, Error>({
    queryKey: ['hewan', page, limit, pelangganId],
    queryFn: () => fetchHewan(page, limit, pelangganId),
  })
}

export function useCreateHewan(): UseMutationResult<Hewan, Error, HewanCreateInput> {
  const qc = useQueryClient()
  return useMutation<Hewan, Error, HewanCreateInput>({
    mutationFn: async (data: HewanCreateInput) => {
      const res = await fetch('/api/hewan', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Error creating hewan')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hewan'] }),
  })
}

export function useUpdateHewan(): UseMutationResult<Hewan, Error, { id: string; data: HewanUpdateInput }> {
  const qc = useQueryClient()
  return useMutation<Hewan, Error, { id: string; data: HewanUpdateInput }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/hewan/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Error updating hewan')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hewan'] }),
  })
}
