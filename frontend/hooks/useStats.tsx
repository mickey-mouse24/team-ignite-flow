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
  team: {
    total: number;
    active: number;
    inactive: number;
    departments: Array<{
      name: string;
      count: number;
    }>;
  };
  recentActivity: Array<{
    id: string;
    type: 'initiative' | 'project' | 'user' | 'notification';
    title: string;
    description: string;
    timestamp: string;
    user?: {
      name: string;
      avatar?: string;
    };
  }>;
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

      try {
        // Essayer d'abord l'endpoint de stats globales
        const response = await apiService.get('/stats');
        return response.data as GlobalStats;
      } catch (error) {
        // Fallback : calculer les stats à partir des données existantes
        console.warn('Endpoint /stats non disponible, calcul des stats locales...');
        
        const [initiativesRes, projectsRes, usersRes] = await Promise.all([
          apiService.getInitiatives(),
          apiService.getProjects(),
          apiService.getUsers()
        ]);

        const initiatives = initiativesRes.data.initiatives || [];
        const projects = projectsRes.data.projects || [];
        const users = usersRes.data.users || [];

        // Calculer les stats des initiatives
        const initiativeStats = {
          total: initiatives.length,
          pending: initiatives.filter((i: any) => i.status === 'pending').length,
          inProgress: initiatives.filter((i: any) => i.status === 'in-progress').length,
          completed: initiatives.filter((i: any) => i.status === 'completed').length,
          onHold: initiatives.filter((i: any) => i.status === 'on-hold').length,
        };

        // Calculer les stats des projets
        const projectStats = {
          total: projects.length,
          pending: projects.filter((p: any) => p.status === 'pending').length,
          inProgress: projects.filter((p: any) => p.status === 'in-progress').length,
          completed: projects.filter((p: any) => p.status === 'completed').length,
          onHold: projects.filter((p: any) => p.status === 'on-hold').length,
        };

        // Calculer les stats de l'équipe
        const departments = users.reduce((acc: any, user: any) => {
          const dept = user.department || 'Non assigné';
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});

        const teamStats = {
          total: users.length,
          active: users.filter((u: any) => u.status === 'active').length,
          inactive: users.filter((u: any) => u.status === 'inactive').length,
          departments: Object.entries(departments).map(([name, count]) => ({
            name,
            count: count as number
          }))
        };

        // Activité récente (dernières initiatives et projets)
        const recentActivity = [
          ...initiatives.slice(0, 3).map((i: any) => ({
            id: i.id.toString(),
            type: 'initiative' as const,
            title: i.title,
            description: `Initiative ${i.status}`,
            timestamp: i.created_at,
            user: i.author ? {
              name: `${i.author.first_name} ${i.author.last_name}`,
              avatar: i.author.avatar
            } : undefined
          })),
          ...projects.slice(0, 3).map((p: any) => ({
            id: p.id.toString(),
            type: 'project' as const,
            title: p.name,
            description: `Projet ${p.status}`,
            timestamp: p.created_at,
            user: p.manager ? {
              name: `${p.manager.first_name} ${p.manager.last_name}`,
              avatar: p.manager.avatar
            } : undefined
          }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
         .slice(0, 5);

        return {
          initiatives: initiativeStats,
          projects: projectStats,
          team: teamStats,
          recentActivity
        };
      }
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    stats: stats || {
      initiatives: { total: 0, pending: 0, inProgress: 0, completed: 0, onHold: 0 },
      projects: { total: 0, pending: 0, inProgress: 0, completed: 0, onHold: 0 },
      team: { total: 0, active: 0, inactive: 0, departments: [] },
      recentActivity: []
    },
    isLoading,
    error: error?.message || null,
    refetch
  };
};
