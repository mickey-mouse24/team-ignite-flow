import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { apiService } from '../lib/api';
import {
  Team,
  TeamMember,
  TeamsResponse,
  UsersResponse,
  TeamFilters,
  UserFilters
} from '../types';



export const useTeam = (filters: TeamFilters = {}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Query pour récupérer les équipes
  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    error: teamsError,
    refetch: refetchTeams
  } = useQuery({
    queryKey: ['teams', filters],
    queryFn: async (): Promise<TeamsResponse> => {
      if (!token) throw new Error('Token manquant');

      const params: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params[key] = value.toString();
        }
      });

      const response = await apiService.getTeams(params);
      return response.data;
    },
    enabled: !!token,
    staleTime: 15 * 60 * 1000, // 15 minutes (augmenté)
    gcTime: 30 * 60 * 1000, // 30 minutes (augmenté)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Query pour récupérer les utilisateurs
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users', filters],
    queryFn: async (): Promise<UsersResponse> => {
      if (!token) throw new Error('Token manquant');

      const params: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params[key] = value.toString();
        }
      });

      const response = await apiService.getUsers(params);
      return response.data;
    },
    enabled: !!token,
    staleTime: 15 * 60 * 1000, // 15 minutes (augmenté)
    gcTime: 30 * 60 * 1000, // 30 minutes (augmenté)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Mutation pour créer une équipe
  const createTeamMutation = useMutation({
    mutationFn: async (teamData: { name: string; description?: string; department: string }) => {
      if (!token) throw new Error('Token manquant');
      const response = await apiService.post('/teams', teamData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Équipe créée avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    },
  });

  // Mutation pour mettre à jour une équipe
  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, updateData }: { id: number; updateData: Partial<Team> }) => {
      if (!token) throw new Error('Token manquant');
      const response = await apiService.put(`/teams/${id}`, updateData);
      return response.data;
    },
    onSuccess: (updatedTeam) => {
      queryClient.setQueryData(['teams'], (oldData: TeamsResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          teams: oldData.teams.map(team =>
            team.id === updatedTeam.id ? updatedTeam : team
          ),
        };
      });
      toast.success('Équipe mise à jour avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    },
  });

  // Mutation pour supprimer une équipe
  const deleteTeamMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('Token manquant');
      await apiService.delete(`/teams/${id}`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['teams'], (oldData: TeamsResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          teams: oldData.teams.filter(team => team.id !== deletedId),
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total - 1,
          },
        };
      });
      toast.success('Équipe supprimée avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    },
  });

  // Mutation pour ajouter un membre
  const addMemberMutation = useMutation({
    mutationFn: async ({ teamId, userId }: { teamId: number; userId: number }) => {
      if (!token) throw new Error('Token manquant');
      const response = await apiService.post(`/teams/${teamId}/members`, { user_id: userId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Membre ajouté avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'ajout du membre');
    },
  });

  // Mutation pour retirer un membre
  const removeMemberMutation = useMutation({
    mutationFn: async ({ teamId, userId }: { teamId: number; userId: number }) => {
      if (!token) throw new Error('Token manquant');
      await apiService.delete(`/teams/${teamId}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Membre retiré avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du retrait du membre');
    },
  });

  // Hook pour récupérer une équipe spécifique
  const useTeamById = (id: number) => {
    return useQuery({
      queryKey: ['team', id],
      queryFn: async (): Promise<Team> => {
        if (!token) throw new Error('Token manquant');
        const response = await apiService.get(`/teams/${id}`);
        return response.data as Team;
      },
      enabled: !!token && !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    // Données
    teams: teamsData?.teams || [],
    users: usersData?.users || [],
    teamsPagination: teamsData?.pagination,
    usersPagination: usersData?.pagination,

    // États
    isLoadingTeams,
    isLoadingUsers,
    teamsError: teamsError?.message || null,
    usersError: usersError?.message || null,

    // Actions
    refetchTeams,
    refetchUsers,
    createTeam: createTeamMutation.mutate,
    updateTeam: updateTeamMutation.mutate,
    deleteTeam: deleteTeamMutation.mutate,
    addMember: addMemberMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    useTeamById,

    // États des mutations
    isCreatingTeam: createTeamMutation.isPending,
    isUpdatingTeam: updateTeamMutation.isPending,
    isDeletingTeam: deleteTeamMutation.isPending,
    isAddingMember: addMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
  };
};
