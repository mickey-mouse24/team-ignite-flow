// Service API unifié pour toutes les requêtes
const API_URL = 'http://localhost:3001/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `Erreur ${response.status}`,
          response.status,
          data.code
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur de connexion au serveur', 0);
    }
  }

  // Méthodes génériques
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Méthodes spécifiques pour l'authentification
  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  async register(userData: Record<string, unknown>) {
    return this.post('/auth/register', userData);
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // Méthodes spécifiques pour les initiatives
  async getInitiatives(params?: Record<string, string>) {
    return this.get<PaginatedResponse<Record<string, unknown>>>('/initiatives', params);
  }

  async createInitiative(data: Record<string, unknown>) {
    return this.post('/initiatives', data);
  }

  async updateInitiative(id: number, data: Record<string, unknown>) {
    return this.put(`/initiatives/${id}`, data);
  }

  async deleteInitiative(id: number) {
    return this.delete(`/initiatives/${id}`);
  }

  async likeInitiative(id: number) {
    return this.post(`/initiatives/${id}/like`);
  }

  async addComment(initiativeId: number, content: string) {
    return this.post(`/initiatives/${initiativeId}/comments`, { content });
  }

  // Méthodes spécifiques pour les projets
  async getProjects(params?: Record<string, string>) {
    return this.get<PaginatedResponse<Record<string, unknown>>>('/projects', params);
  }

  async createProject(data: Record<string, unknown>) {
    return this.post('/projects', data);
  }

  async updateProject(id: number, data: Record<string, unknown>) {
    return this.put(`/projects/${id}`, data);
  }

  async deleteProject(id: number) {
    return this.delete(`/projects/${id}`);
  }

  // Méthodes spécifiques pour les équipes
  async getTeams(params?: Record<string, string>) {
    return this.get<PaginatedResponse<Record<string, unknown>>>('/teams', params);
  }

  async getUsers(params?: Record<string, string>) {
    return this.get<PaginatedResponse<Record<string, unknown>>>('/users', params);
  }

  // Méthodes spécifiques pour les notifications
  async getNotifications(params?: Record<string, string>) {
    return this.get<PaginatedResponse<Record<string, unknown>>>('/notifications', params);
  }

  async markNotificationAsRead(id: string) {
    return this.put(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.put('/notifications/mark-all-read');
  }
}

export const apiService = new ApiService();
export { ApiError };
