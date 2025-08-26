import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'

interface PointsResponse {
  balance: number
  transactions: Array<{
    id: string
    type: 'EARN' | 'TRANSFER' | 'REDEEM' | 'RECEIVE'
    amount: number
    description: string
    timestamp: string
    status: 'success' | 'pending' | 'failed'
  }>
}

export function usePoints() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<PointsResponse>({
    queryKey: ['points'],
    queryFn: async () => {
      const API_URL = import.meta.env.VITE_API_JAVA || ''
      const response = await fetch(`${API_URL}/points`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch points')
      }
      return response.json()
    },
    enabled: !!user,
  })

  const earnMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      const API_URL = import.meta.env.VITE_API_JAVA || ''
      const response = await fetch(`${API_URL}/points/earn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ amount, description }),
      })
      if (!response.ok) {
        throw new Error('Failed to earn points')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points'] })
    },
  })

  const transferMutation = useMutation({
    mutationFn: async ({
      recipient,
      amount,
      description,
    }: {
      recipient: string
      amount: number
      description: string
    }) => {
      const API_URL = import.meta.env.VITE_API_JAVA || ''
      const response = await fetch(`${API_URL}/points/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ recipient, amount, description }),
      })
      if (!response.ok) {
        throw new Error('Failed to transfer points')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points'] })
    },
  })

  return {
    points: data?.balance ?? 0,
    transactions: data?.transactions ?? [],
    isLoading,
    earnPoints: earnMutation.mutateAsync,
    transferPoints: transferMutation.mutateAsync,
    isEarning: earnMutation.isPending,
    isTransferring: transferMutation.isPending,
  }
}