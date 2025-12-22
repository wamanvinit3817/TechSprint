import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { showToast } from '@/components/Toast';

export interface ItemData {
  title: string;
  description: string;
  category: string;
  status: 'lost' | 'found';
  location: string;
  date: string;
  image?: string;
  collegeId: string;
  societyId?: string;
}

export function useItems(collegeId: string, params?: { status?: string; societyId?: string }) {
  return useQuery({
    queryKey: ['items', collegeId, params],
    queryFn: () => api.getItems(collegeId, params),
    enabled: !!collegeId,
    staleTime: 30000,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => api.getItem(id),
    enabled: !!id,
  });
}

export function useUserItems(userId: string) {
  return useQuery({
    queryKey: ['userItems', userId],
    queryFn: () => api.getUserItems(userId),
    enabled: !!userId,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ItemData) => api.createItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items', variables.collegeId] });
      queryClient.invalidateQueries({ queryKey: ['userItems'] });
      showToast('Item reported successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to report item', 'error');
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemData> }) => 
      api.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['userItems'] });
      showToast('Item updated successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to update item', 'error');
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['userItems'] });
      showToast('Item deleted successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to delete item', 'error');
    },
  });
}

export function useClaimItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.claimItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      showToast('Claim request sent!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to claim item', 'error');
    },
  });
}
