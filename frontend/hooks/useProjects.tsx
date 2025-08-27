import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { apiService } from '../lib/api';
import { 
  Project, 
  CreateProjectData, 
  UpdateProjectData, 
  ProjectsResponse, 
  ProjectFilters 
} from '../types';

export const useProjects = (filters: ProjectFilters = {}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Query pour récupérer les projets
  const {
    data: projectsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects', filters],
    queryFn: async (): Promise<ProjectsResponse> => {
      if (!token) throw new Error('Token manquant');



      const params: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params[key] = value.toString();
        }
      });

      const response = await apiService.getProjects(params);
      
      // Transformer les données de l'API pour correspondre au frontend
      const transformedProjects = response.data.projects.map((project: {
        budget_allocated?: number;
        budget?: number;
        first_name?: string;
        last_name?: string;
        manager_name?: string;
        team_name?: string;
        [key: string]: unknown;
      }) => ({
        ...project,
        budget: project.budget_allocated || project.budget || 0,
        manager_name: project.first_name && project.last_name 
          ? `${project.first_name} ${project.last_name}` 
          : project.manager_name || 'Non assigné',
        team_name: project.team_name || 'Non assignée'
      }));

      return {
        ...response.data,
        projects: transformedProjects
      };
    },
    enabled: !!token,
    staleTime: 15 * 60 * 1000, // 15 minutes (augmenté)
    gcTime: 30 * 60 * 1000, // 30 minutes (augmenté)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Mutation pour créer un projet
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: CreateProjectData): Promise<Project> => {
      if (!token) throw new Error('Token manquant');

      const response = await apiService.createProject(projectData);
      return response.data as Project;
    },
    onSuccess: (newProject) => {
      // Invalider et refetch les projets
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projet créé avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    },
  });

  // Mutation pour mettre à jour un projet
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updateData }: { id: number; updateData: UpdateProjectData }): Promise<Project> => {
      if (!token) throw new Error('Token manquant');

      const response = await apiService.updateProject(id, updateData);
      return response.data as Project;
    },
    onSuccess: (updatedProject) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['projects'], (oldData: ProjectsResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          projects: oldData.projects.map(project =>
            project.id === updatedProject.id ? updatedProject : project
          ),
        };
      });
      toast.success('Projet mis à jour avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    },
  });

  // Mutation pour supprimer un projet
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      if (!token) throw new Error('Token manquant');

      await apiService.deleteProject(id);
    },
    onSuccess: (_, deletedId) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['projects'], (oldData: ProjectsResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          projects: oldData.projects.filter(project => project.id !== deletedId),
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total - 1,
          },
        };
      });
      toast.success('Projet supprimé avec succès!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    },
  });

  // Hook pour récupérer un projet spécifique
  const useProjectById = (id: number) => {
    return useQuery({
      queryKey: ['project', id],
      queryFn: async (): Promise<Project> => {
        if (!token) throw new Error('Token manquant');

        const response = await apiService.get(`/projects/${id}`);
        return response.data as Project;
      },
      enabled: !!token && !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    // Données
    projects: projectsData?.projects || [],
    pagination: projectsData?.pagination,

    // États
    isLoading,
    error: error?.message || null,

    // Actions
    refetch,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    useProjectById,

    // États des mutations
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
};
