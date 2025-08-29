import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware de sécurité
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de validation des données
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} est requis`);
  }
  return true;
};

// Fonction utilitaire pour filtrer les champs undefined et null
const filterUndefinedFields = (obj) => {
  const filtered = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      filtered[key] = value;
    }
  });
  return filtered;
};

// Middleware de validation pour les initiatives
const validateInitiative = (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    
    validateRequired(title, 'Titre');
    validateRequired(description, 'Description');
    validateRequired(category, 'Catégorie');
    
    if (title.length > 200) {
      throw new Error('Le titre ne peut pas dépasser 200 caractères');
    }
    
    if (description.length < 10) {
      throw new Error('La description doit contenir au moins 10 caractères');
    }
    
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Middleware de validation pour les projets
const validateProject = (req, res, next) => {
  try {
    const { name, description, start_date, end_date, budget } = req.body;
    
    validateRequired(name, 'Nom');
    validateRequired(description, 'Description');
    validateRequired(start_date, 'Date de début');
    validateRequired(end_date, 'Date de fin');
    validateRequired(budget, 'Budget');
    
    if (name.length > 200) {
      throw new Error('Le nom ne peut pas dépasser 200 caractères');
    }
    
    if (description.length < 10) {
      throw new Error('La description doit contenir au moins 10 caractères');
    }
    
    if (budget < 0) {
      throw new Error('Le budget doit être positif');
    }
    
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Format de date invalide');
    }
    
    if (startDate >= endDate) {
      throw new Error('La date de fin doit être postérieure à la date de début');
    }
    
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Middleware de gestion d'erreurs global
const errorHandler = (err, req, res, next) => {
  console.error('Erreur serveur:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Gestion des erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: err.errors
    });
  }

  // Gestion des erreurs de syntaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Format JSON invalide'
    });
  }

  // Erreur par défaut
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : err.message
  });
};

// Routes API

// Auth routes
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validation des entrées
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }
    
    // Rechercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // En production, vous devriez vérifier le hash du mot de passe
    // Pour la démo, on accepte les mots de passe en dur
    const validPasswords = {
      'user@collabflow.com': 'user123'
    };
    
    if (validPasswords[email] !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    const token = `demo-token-${user.role}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Initiatives routes
app.get('/api/initiatives', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    
    // Construire les filtres
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Récupérer les initiatives avec l'auteur
    const initiatives = await prisma.initiative.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            avatar_url: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { created_at: 'desc' }
    });
    
    // Compter le total
    const total = await prisma.initiative.count({ where });
    
    // Formater la réponse
    const formattedInitiatives = initiatives.map(initiative => ({
      ...initiative,
      first_name: initiative.author.first_name,
      last_name: initiative.author.last_name,
      author_role: initiative.author.role,
      author_avatar: initiative.author.avatar_url,
      comments_count: initiative._count.comments,
      likes: initiative._count.likes,
      participants_count: 1, // À implémenter avec les participants
      author: undefined,
      _count: undefined
    }));
    
    res.json({
      success: true,
      data: {
        initiatives: formattedInitiatives,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/initiatives', validateInitiative, async (req, res, next) => {
  try {
    // Filtrer les champs undefined et null avant d'envoyer à Prisma
    const filteredBody = filterUndefinedFields(req.body);
    
    const initiativeData = {
      ...filteredBody,
      author_id: 1, // TODO: En production, récupérer depuis le token JWT via middleware d'authentification
      progress: 0,
    };
    
    const newInitiative = await prisma.initiative.create({
      data: initiativeData,
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            avatar_url: true
          }
        }
      }
    });
    
    const formattedInitiative = {
      ...newInitiative,
      first_name: newInitiative.author.first_name,
      last_name: newInitiative.author.last_name,
      author_role: newInitiative.author.role,
      author_avatar: newInitiative.author.avatar_url,
      comments_count: 0,
      likes: 0,
      participants_count: 1,
      author: undefined
    };
    
    res.status(201).json({
      success: true,
      message: 'Initiative créée avec succès',
      data: formattedInitiative
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/initiatives/:id', validateInitiative, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    // Filtrer les champs undefined et null avant d'envoyer à Prisma
    const filteredBody = filterUndefinedFields(req.body);
    
    const updatedInitiative = await prisma.initiative.update({
      where: { id },
      data: filteredBody,
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            avatar_url: true
          }
        }
      }
    });
    
    const formattedInitiative = {
      ...updatedInitiative,
      first_name: updatedInitiative.author.first_name,
      last_name: updatedInitiative.author.last_name,
      author_role: updatedInitiative.author.role,
      author_avatar: updatedInitiative.author.avatar_url,
      author: undefined
    };
    
    res.json({
      success: true,
      message: 'Initiative mise à jour',
      data: formattedInitiative
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Initiative non trouvée'
      });
    }
    next(error);
  }
});

app.delete('/api/initiatives/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    await prisma.initiative.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Initiative supprimée'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Initiative non trouvée'
      });
    }
    next(error);
  }
});

app.post('/api/initiatives/:id/like', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = 1; // En production, récupérer depuis le token JWT
    
    await prisma.like.create({
      data: {
        user_id: userId,
        initiative_id: id
      }
    });
    
    res.json({
      success: true,
      message: 'Like ajouté'
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà liké cette initiative'
      });
    }
    next(error);
  }
});

// Projects routes
app.get('/api/projects', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    
    // Construire les filtres
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Récupérer les projets avec le manager
    const projects = await prisma.project.findMany({
      where,
      include: {
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            avatar_url: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { created_at: 'desc' }
    });
    
    // Compter le total
    const total = await prisma.project.count({ where });
    
    // Formater la réponse
    const formattedProjects = projects.map(project => ({
      ...project,
      first_name: project.manager.first_name,
      last_name: project.manager.last_name,
      manager_name: `${project.manager.first_name} ${project.manager.last_name}`,
      team_name: project.team?.name,
      budget: project.budget_allocated || 0,
      manager: undefined,
      team: undefined
    }));
    
    res.json({
      success: true,
      data: {
        projects: formattedProjects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/projects', validateProject, async (req, res, next) => {
  try {
    const newProject = await prisma.project.create({
      data: req.body,
      include: {
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            avatar_url: true
          }
        }
      }
    });
    
    const formattedProject = {
      ...newProject,
      first_name: newProject.manager.first_name,
      last_name: newProject.manager.last_name,
      budget: newProject.budget_allocated || 0,
      manager: undefined
    };
    
    res.status(201).json({
      success: true,
      message: 'Projet créé avec succès',
      data: formattedProject
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/projects/:id', validateProject, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: req.body,
      include: {
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            avatar_url: true
          }
        }
      }
    });
    
    const formattedProject = {
      ...updatedProject,
      first_name: updatedProject.manager.first_name,
      last_name: updatedProject.manager.last_name,
      budget: updatedProject.budget_allocated || 0,
      manager: undefined
    };
    
    res.json({
      success: true,
      message: 'Projet mis à jour',
      data: formattedProject
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    next(error);
  }
});

app.delete('/api/projects/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    await prisma.project.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Projet supprimé'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    next(error);
  }
});

// Teams routes
app.get('/api/teams', async (req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        },
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    });
    
    const formattedTeams = teams.map(team => ({
      id: team.id,
      name: team.name,
      description: team.description,
      manager_id: team.manager_id,
      created_at: team.created_at,
      updated_at: team.updated_at,
      member_count: team._count.members,
      projects_count: team._count.projects,
      manager_name: `${team.manager.first_name} ${team.manager.last_name}`,
      manager: undefined,
      _count: undefined
    }));
    
    res.json({
      success: true,
      data: {
        teams: formattedTeams,
        pagination: {
          page: 1,
          limit: 10,
          total: teams.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Users routes
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            initiatives: true,
            projects: true,
            teamMemberships: true
          }
        }
      }
    });
    
    const formattedUsers = users.map(user => ({
      ...user,
      initiatives_count: user._count.initiatives,
      projects_count: user._count.projects,
      teams_count: user._count.teamMemberships,
      _count: undefined
    }));
    
    res.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: users.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Stats route
app.get('/api/stats', async (req, res, next) => {
  try {
    const [
      initiativesStats,
      projectsStats,
      usersCount,
      notificationsCount
    ] = await Promise.all([
      prisma.initiative.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.project.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.user.count(),
      prisma.notification.count()
    ]);
    
    const stats = {
      initiatives: {
        total: initiativesStats.reduce((sum, stat) => sum + stat._count.status, 0),
        pending: initiativesStats.find(s => s.status === 'pending')?._count.status || 0,
        inProgress: initiativesStats.find(s => s.status === 'in-progress')?._count.status || 0,
        completed: initiativesStats.find(s => s.status === 'completed')?._count.status || 0,
        onHold: initiativesStats.find(s => s.status === 'on-hold')?._count.status || 0
      },
      projects: {
        total: projectsStats.reduce((sum, stat) => sum + stat._count.status, 0),
        pending: projectsStats.find(s => s.status === 'planning')?._count.status || 0,
        inProgress: projectsStats.find(s => s.status === 'in-progress')?._count.status || 0,
        completed: projectsStats.find(s => s.status === 'completed')?._count.status || 0,
        onHold: projectsStats.find(s => s.status === 'on-hold')?._count.status || 0
      },
      users: usersCount,
      notifications: notificationsCount
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend CollabFlow opérationnel',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware d'erreur (doit être en dernier)
app.use(errorHandler);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend CollabFlow démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Base de données: SQLite avec Prisma`);
});
