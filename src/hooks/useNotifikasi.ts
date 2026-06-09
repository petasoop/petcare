import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useNotifikasi(userId?: string) {
  return useQuery({
    queryKey: ['notifikasi', userId],
    queryFn: async () => {
      const res = await fetch(`/api/notifikasi?userId=${userId}`)
      if (!res.ok) throw new Error('Error fetching notifications')
      return res.json()
    },
    enabled: !!userId,
  })
}

export function useMarkRead(userId?: string) {
  const qc = useQueryClient()
  return useMutation({
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
