import { z } from 'zod';
import {
  UserSchema,
  InitiativeSchema,
  ProjectSchema,
  TeamSchema,
  TeamMemberSchema,
  NotificationSchema,
  CreateInitiativeDataSchema,
  UpdateInitiativeDataSchema,
  CreateProjectDataSchema,
  UpdateProjectDataSchema,
  RegisterDataSchema,
} from './schemas';

// Types de base pour l'application

// Interface utilisateur
export type User = z.infer<typeof UserSchema>;

// Interface initiative
export type Initiative = z.infer<typeof InitiativeSchema>;

// Interface projet
export type Project = z.infer<typeof ProjectSchema>;

// Interface équipe
export type Team = z.infer<typeof TeamSchema>;

// Interface membre d'équipe
export type TeamMember = z.infer<typeof TeamMemberSchema>;

// Interface notification
export type Notification = z.infer<typeof NotificationSchema>;

// Types pour les données de création
export type CreateInitiativeData = z.infer<typeof CreateInitiativeDataSchema>;

export type UpdateInitiativeData = z.infer<typeof UpdateInitiativeDataSchema>;

export type CreateProjectData = z.infer<typeof CreateProjectDataSchema>;

export type UpdateProjectData = z.infer<typeof UpdateProjectDataSchema>;

export type RegisterData = z.infer<typeof RegisterDataSchema>;

// Types pour les réponses API
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface InitiativesResponse {
  initiatives: Initiative[];
  pagination: PaginationInfo;
}

export interface ProjectsResponse {
  projects: Project[];
  pagination: PaginationInfo;
}

export interface TeamsResponse {
  teams: Team[];
  pagination: PaginationInfo;
}

export interface UsersResponse {
  users: TeamMember[];
  pagination: PaginationInfo;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: PaginationInfo;
}

// Types pour les filtres
export interface BaseFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface InitiativeFilters extends BaseFilters {
  status?: string;
  category?: string;
}

export interface ProjectFilters extends BaseFilters {
  status?: string;
  priority?: string;
  manager?: number;
  team?: number;
}

export interface TeamFilters extends BaseFilters {
  manager?: number;
}

export interface UserFilters extends BaseFilters {
  role?: string;
  department?: string;
  team?: number;
}

export interface NotificationFilters extends BaseFilters {
  type?: string;
  is_read?: boolean;
}

// Types pour les réponses API génériques
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Types pour les statistiques
export interface DashboardStats {
  initiatives: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  projects: {
    total: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  users: number;
  notifications: number;
}

// Types pour les composants
export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  link?: string;
  details?: {
    pending?: number;
    inProgress?: number;
    completed?: number;
    overdue?: number;
  };
}

export interface InitiativeCardProps {
  initiative: Initiative;
  compact?: boolean;
  showActions?: boolean;
}

export interface ProjectCardProps {
  project: Project;
  compact?: boolean;
  showActions?: boolean;
}
