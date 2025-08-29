import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { apiService } from '../lib/api';

export interface GlobalStats {
  initiatives: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
  projects: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
  users: number;
  notifications: number;
}

export const useStats = () => {
  const { token } = useAuth();

  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<GlobalStats> => {
      if (!token) throw new Error('Token manquant');

      const response = await apiService.get('/stats');
      return response.data as GlobalStats;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    stats,
    isLoading,
    error: error?.message,
    refetch
  };
};
