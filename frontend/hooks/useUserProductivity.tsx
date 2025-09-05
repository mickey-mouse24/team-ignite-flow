import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';

export interface UserProductivity {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  status: string;
  productivityScore: number;
  initiativeStats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    onHold: number;
    avgProgress: number;
  };
  projectStats: {
    total: number;
    completed: number;
    inProgress: number;
    planning: number;
    onHold: number;
    avgProgress: number;
  };
  recentActivity: {
    initiativesCreated: number;
    projectsCreated: number;
    initiativesUpdated: number;
    projectsUpdated: number;
  };
  totalInitiatives: number;
  totalProjects: number;
  teamMemberships: number;
}

export interface UserProductivityFilters {
  period?: 'all' | 'week' | 'month' | 'quarter' | 'year';
  department?: string;
  role?: string;
  limit?: number;
}

export interface UserProductivityResponse {
  users: UserProductivity[];
  period: string;
  filters: {
    department?: string;
    role?: string;
  };
  total: number;
}

export const useUserProductivity = (filters: UserProductivityFilters = {}) => {
  return useQuery({
    queryKey: ['userProductivity', filters],
    queryFn: async (): Promise<UserProductivityResponse> => {
      const params = new URLSearchParams();
      
      if (filters.period) params.append('period', filters.period);
      if (filters.department) params.append('department', filters.department);
      if (filters.role) params.append('role', filters.role);
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await apiService.get(`/user-productivity?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
