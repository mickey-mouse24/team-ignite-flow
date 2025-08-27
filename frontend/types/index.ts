// Types de base pour l'application

// Interface utilisateur
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department?: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Interface initiative
export interface Initiative {
  id: number;
  title: string;
  description: string;
  author_id: number;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  category: string;
  progress: number;
  likes: number;
  comments_count: number;
  participants_count: number;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  author_role: string;
  author_avatar?: string;
  // Nouveaux champs pour la cohérence avec le backend
  objectives?: string;
  expected_impact?: string;
  kpi?: string;
  owner?: string;
  deadline?: string;
  team_size?: string;
  resources?: string;
  budget?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

// Interface projet
export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled' | 'review';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'highest';
  start_date: string;
  end_date: string;
  budget: number; // Calculé à partir de budget_allocated
  budget_allocated?: number; // API field
  budget_spent?: number; // API field
  progress: number;
  manager_id: number;
  team_id?: number;
  created_at: string;
  updated_at: string;
  manager_name?: string;
  team_name?: string;
  first_name?: string; // API field
  last_name?: string; // API field
}

// Interface équipe
export interface Team {
  id: number;
  name: string;
  description?: string;
  manager_id: number;
  created_at: string;
  updated_at: string;
  member_count: number;
  manager_name?: string;
}

// Interface membre d'équipe
export interface TeamMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department?: string;
  avatar_url?: string;
  avatar?: string;
  status: string;
  team_id?: number;
  phone?: string;
  location?: string;
  created_at: string;
}

// Interface notification
export interface Notification {
  id: string;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  user_name?: string;
}

// Types pour les données de création
export interface CreateInitiativeData {
  title: string;
  description: string;
  category: string;
  objectives?: string;
  expected_impact?: string;
  kpi?: string;
  owner?: string;
  deadline?: string;
  team_size?: string;
  resources?: string;
  budget?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateInitiativeData {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  progress?: number;
  objectives?: string;
  expected_impact?: string;
  kpi?: string;
  owner?: string;
  deadline?: string;
  team_size?: string;
  resources?: string;
  budget?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CreateProjectData {
  name: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  budget: number;
  manager_id: number;
  team_id: number;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  progress?: number;
  manager_id?: number;
  team_id?: number;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  department?: string;
}

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
