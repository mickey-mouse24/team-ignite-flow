import { z } from 'zod';

// Schémas de validation Zod
export const UserSchema = z.object({
  id: z.number().positive(),
  email: z.string().email('Format d\'email invalide'),
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  role: z.enum(['admin', 'user', 'developer', 'designer', 'manager']),
  department: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.undefined()),
  status: z.enum(['available', 'busy', 'away', 'offline']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const InitiativeSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  author_id: z.number().positive(),
  status: z.enum(['pending', 'in-progress', 'completed', 'on-hold', 'cancelled']),
  category: z.string().min(1, 'La catégorie est requise'),
  progress: z.number().min(0).max(100),
  likes: z.number().min(0),
  comments_count: z.number().min(0),
  participants_count: z.number().min(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  first_name: z.string(),
  last_name: z.string(),
  author_role: z.string(),
  author_avatar: z.string().optional(),
  objectives: z.string().optional(),
  expected_impact: z.string().optional(),
  kpi: z.string().optional(),
  owner: z.string().optional(),
  deadline: z.string().datetime().optional(),
  team_size: z.string().optional(),
  resources: z.string().optional(),
  budget: z.number().min(0).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

export const ProjectSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, 'Le nom est requis').max(200, 'Le nom est trop long'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  status: z.enum(['planning', 'in-progress', 'completed', 'on-hold', 'cancelled', 'review']),
  priority: z.enum(['low', 'medium', 'high', 'critical', 'highest']),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  budget: z.number().min(0),
  budget_allocated: z.number().min(0).optional(),
  budget_spent: z.number().min(0).optional(),
  progress: z.number().min(0).max(100),
  manager_id: z.number().positive(),
  team_id: z.number().positive().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  manager_name: z.string().optional(),
  team_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const TeamSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  manager_id: z.number().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  member_count: z.number().min(0),
  manager_name: z.string().optional(),
});

export const TeamMemberSchema = z.object({
  id: z.number().positive(),
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Format d\'email invalide'),
  role: z.string().min(1, 'Le rôle est requis'),
  department: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.undefined()),
  avatar: z.string().optional(),
  status: z.string().min(1, 'Le statut est requis'),
  team_id: z.number().positive().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  created_at: z.string().datetime(),
});

export const NotificationSchema = z.object({
  id: z.string().min(1),
  user_id: z.number().positive(),
  title: z.string().min(1, 'Le titre est requis'),
  message: z.string().min(1, 'Le message est requis'),
  type: z.enum(['info', 'success', 'warning', 'error']),
  is_read: z.boolean(),
  created_at: z.string().datetime(),
  user_name: z.string().optional(),
});

// Schémas pour les données de création
export const CreateInitiativeDataSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  category: z.string().min(1, 'La catégorie est requise'),
  objectives: z.string().optional(),
  expected_impact: z.string().optional(),
  kpi: z.string().optional(),
  owner: z.string().optional(),
  deadline: z.string().datetime().optional(),
  team_size: z.string().optional(),
  resources: z.string().optional(),
  budget: z.number().min(0).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const UpdateInitiativeDataSchema = CreateInitiativeDataSchema.partial();

export const CreateProjectDataSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200, 'Le nom est trop long'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  status: z.string().min(1, 'Le statut est requis'),
  priority: z.string().min(1, 'La priorité est requise'),
  start_date: z.string().datetime('Date de début invalide'),
  end_date: z.string().datetime('Date de fin invalide'),
  budget: z.number().min(0, 'Le budget doit être positif'),
  manager_id: z.number().positive('ID du manager invalide'),
  team_id: z.number().positive('ID de l\'équipe invalide'),
});

export const UpdateProjectDataSchema = CreateProjectDataSchema.partial();

export const RegisterDataSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  department: z.string().optional(),
});
