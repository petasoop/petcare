import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import type { User } from '@/types'

export function useDoctors(): UseQueryResult<User[], Error> {
  return useQuery<User[], Error>({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await fetch('/api/users?role=DOKTER')
      if (!res.ok) throw new Error('Error fetching doctors')
      const json = (await res.json()) as { data: User[] }
      return json.data
    },
  })
}
