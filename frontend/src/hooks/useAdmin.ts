import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { showToast } from '@/components/Toast';

export function usePendingItems(collegeId: string) {
  return useQuery({
    queryKey: ['pendingItems', collegeId],
    queryFn: () => api.getPendingItems(collegeId),
    enabled: !!collegeId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useApproveItem(collegeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => api.approveItem(collegeId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingItems', collegeId] });
      queryClient.invalidateQueries({ queryKey: ['items', collegeId] });
      showToast('Item approved successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to approve item', 'error');
    },
  });
}

export function useRejectItem(collegeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => api.rejectItem(collegeId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingItems', collegeId] });
      showToast('Item rejected', 'info');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to reject item', 'error');
    },
  });
}

export function useResolveItem(collegeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => api.resolveItem(collegeId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingItems', collegeId] });
      queryClient.invalidateQueries({ queryKey: ['items', collegeId] });
      showToast('Item marked as resolved!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to resolve item', 'error');
    },
  });
}

export function useGenerateInviteCode(collegeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (type: 'society' | 'college') => api.generateInviteCode(collegeId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCodes', collegeId] });
      showToast('Invite code generated!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to generate code', 'error');
    },
  });
}

export function useAnalytics(collegeId: string) {
  return useQuery({
    queryKey: ['analytics', collegeId],
    queryFn: () => api.getAnalytics(collegeId),
    enabled: !!collegeId,
    staleTime: 60000, // 1 minute
  });
}

export function useCollegeStats(collegeId: string) {
  return useQuery({
    queryKey: ['collegeStats', collegeId],
    queryFn: () => api.getCollegeStats(collegeId),
    enabled: !!collegeId,
    staleTime: 30000,
  });
}
