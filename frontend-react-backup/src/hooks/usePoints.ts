import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getBalance, getTransactionHistory, earnPoints as earnPointsApi, transferPoints as transferPointsApi } from '@/services/api'

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
      const [balanceResponse, historyResponse] = await Promise.all([
        getBalance(),
        getTransactionHistory()
      ])
      
      return {
        balance: balanceResponse.data,
        transactions: historyResponse.data.map((tx: any) => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          timestamp: tx.timestamp,
          status: tx.status.toLowerCase()
        }))
      }
    },
    enabled: !!user,
    // Tắt mọi auto-refetch, chỉ fetch một lần khi mount
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  })

  const earnMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      const response = await earnPointsApi({ amount, description })
      return response.data
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
      const response = await transferPointsApi(recipient, { amount, description })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points'] })
    },
  })

  return {
    points: (data as PointsResponse)?.balance ?? 0,
    transactions: (data as PointsResponse)?.transactions ?? [],
    isLoading,
    earnPoints: earnMutation.mutateAsync,
    transferPoints: transferMutation.mutateAsync,
    isEarning: earnMutation.isPending,
    isTransferring: transferMutation.isPending,
  }
}
