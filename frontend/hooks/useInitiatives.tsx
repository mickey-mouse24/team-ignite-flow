import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { apiService } from '../lib/api';
import { 
  Initiative, 
  CreateInitiativeData, 
  UpdateInitiativeData, 
  InitiativesResponse, 
  InitiativeFilters 
} from '../types';

export const useInitiatives = (filters: InitiativeFilters = {}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Query pour récupérer les initiatives
  const {
    data: initiativesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['initiatives', filters],
    queryFn: async (): Promise<InitiativesResponse> => {
      if (!token) throw new Error('Token manquant');

      const params: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params[key] = value.toString();
        }
      });

      const response = await apiService.getInitiatives(params);
      return response.data as unknown as InitiativesResponse;
    },
    enabled: !!token,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Mutation pour créer une initiative
  const createInitiativeMutation = useMutation({
    mutationFn: async (initiativeData: CreateInitiativeData): Promise<Initiative> => {
      if (!token) throw new Error('Token manquant');

      const response = await apiService.createInitiative(initiativeData as unknown as Record<string, unknown>);
      return response.data as Initiative;
    },
    onSuccess: (newInitiative) => {
      // Invalider tous les caches d'initiatives pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    },
  });

  // Mutation pour mettre à jour une initiative
  const updateInitiativeMutation = useMutation({
    mutationFn: async ({ id, updateData }: { id: number; updateData: UpdateInitiativeData }): Promise<Initiative> => {
      if (!token) throw new Error('Token manquant');

      const response = await apiService.updateInitiative(id, updateData as unknown as Record<string, unknown>);
      return response.data as Initiative;
    },
    onSuccess: (updatedInitiative) => {
      // Invalider tous les caches d'initiatives pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    },
  });

  // Mutation pour supprimer une initiative
  const deleteInitiativeMutation = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      if (!token) throw new Error('Token manquant');

      await apiService.deleteInitiative(id);
    },
    onSuccess: (_, deletedId) => {
      // Invalider tous les caches d'initiatives pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    },
  });

  // Mutation pour liker une initiative
  const likeInitiativeMutation = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      if (!token) throw new Error('Token manquant');

      await apiService.likeInitiative(id);
    },
    onSuccess: (_, initiativeId) => {
      // Invalider tous les caches d'initiatives pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du like');
    },
  });

  // Hook pour récupérer une initiative spécifique
  const useInitiative = (id: number) => {
    return useQuery({
      queryKey: ['initiative', id],
      queryFn: async (): Promise<Initiative> => {
        if (!token) throw new Error('Token manquant');

        const response = await apiService.get(`/initiatives/${id}`);
        return response.data as Initiative;
      },
      enabled: !!token && !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Debug pour voir les données (seulement en développement)
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 useInitiatives debug:', {
      initiativesCount: initiativesData?.initiatives?.length || 0,
      filters,
      initiatives: initiativesData?.initiatives?.map(i => ({ id: i.id, title: i.title, category: i.category, status: i.status })) || []
    });
  }

  return {
    // Données
    initiatives: initiativesData?.initiatives || [],
    pagination: initiativesData?.pagination,

    // États
    isLoading,
    error: error?.message || null,

    // Actions
    refetch,
    createInitiative: createInitiativeMutation.mutate,
    updateInitiative: updateInitiativeMutation.mutate,
    deleteInitiative: deleteInitiativeMutation.mutate,
    likeInitiative: likeInitiativeMutation.mutate,
    useInitiative,

    // États des mutations
    isCreating: createInitiativeMutation.isPending,
    isUpdating: updateInitiativeMutation.isPending,
    isDeleting: deleteInitiativeMutation.isPending,
    isLiking: likeInitiativeMutation.isPending,
  };
};
