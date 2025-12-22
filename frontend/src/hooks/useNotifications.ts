import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export interface Notification {
  id: string;
  type: 'claim' | 'update' | 'resolved' | 'approved' | 'rejected' | 'system';
  title: string;
  message: string;
  itemId?: string;
  read: boolean;
  createdAt: string;
}

// Extend API service for notifications
const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/notifications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('campus_lf_token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },
  
  markAsRead: async (id: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('campus_lf_token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to mark as read');
  },
  
  markAllAsRead: async (): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('campus_lf_token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
  },
};

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getNotifications,
    enabled: isAuthenticated,
    refetchInterval: 15000, // Poll every 15 seconds
    staleTime: 10000,
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
  
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
  
  const markAsRead = useCallback((id: string) => {
    markAsReadMutation.mutate(id);
  }, [markAsReadMutation]);
  
  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  };
}

// Simple event-based notification for real-time updates
class NotificationEventEmitter {
  private listeners: Set<(notification: Notification) => void> = new Set();
  
  subscribe(callback: (notification: Notification) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  emit(notification: Notification) {
    this.listeners.forEach(listener => listener(notification));
  }
}

export const notificationEmitter = new NotificationEventEmitter();

export function useNotificationListener(callback: (notification: Notification) => void) {
  useEffect(() => {
    const unsubscribe = notificationEmitter.subscribe(callback);
    return unsubscribe;
  }, [callback]);
}
