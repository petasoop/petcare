'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type { Notifikasi } from '@/types'

interface NotifikasiResponse {
  data: Notifikasi[]
}

export function useNotifikasi(userId?: string): UseQueryResult<NotifikasiResponse, Error> {
  return useQuery<NotifikasiResponse, Error>({
    queryKey: ['notifikasi', userId],
    queryFn: async () => {
      const res = await fetch(`/api/notifikasi?userId=${userId}`)
      if (!res.ok) throw new Error('Error fetching notifications')
      return res.json()
    },
    enabled: !!userId,
  })
}

export function useMarkRead(userId?: string): UseMutationResult<Notifikasi, Error, string> {
  const qc = useQueryClient()
  return useMutation<Notifikasi, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifikasi/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isRead: true }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Error marking read')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifikasi', userId] }),
  })
}
