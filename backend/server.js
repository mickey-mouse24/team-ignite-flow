import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

// Middleware d'authentification JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token d\'authentification manquant' 
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token d\'authentification invalide' 
      });
    }
    req.user = user;
    next();
  });
};

// Middleware de validation pour les initiatives
const validateInitiative = (req, res, next) => {
  try {
    const { title, description, category, budget, priority, deadline, progress } = req.body;
    
    validateRequired(title, 'Titre');
    validateRequired(description, 'Description');
    validateRequired(category, 'Catégorie');
    
    if (title.length > 200) {
      throw new Error('Le titre ne peut pas dépasser 200 caractères');
    }
    
    if (description.length < 10) {
      throw new Error('La description doit contenir au moins 10 caractères');
    }

    // Validation du budget si renseigné
    if (budget !== undefined && budget !== null) {
      if (isNaN(budget) || budget < 0) {
        throw new Error('Le budget doit être un nombre positif');
      }
    }

    // Validation de la priorité si renseignée
    if (priority && !['low', 'medium', 'high', 'critical'].includes(priority)) {
      throw new Error('Priorité invalide. Valeurs acceptées : low, medium, high, critical');
    }

    // Validation de la catégorie
    const validCategories = [
      'Ressources Humaines',
      'Technologie', 
      'Formation',
      'Marketing',
      'Innovation',
      'Commercialisation'
    ];
    
    if (!validCategories.includes(category)) {
      throw new Error('Catégorie invalide. Valeurs acceptées : ' + validCategories.join(', '));
    }

    // Validation de la date limite si renseignée
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        throw new Error('Format de date limite invalide');
      }
      if (deadlineDate < new Date()) {
        throw new Error('La date limite ne peut pas être dans le passé');
      }
    }

    // Validation du progrès si renseigné
    if (progress !== undefined && progress !== null) {
      if (isNaN(progress) || progress < 0 || progress > 100) {
        throw new Error('Le progrès doit être un nombre entre 0 et 100');
      }
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
    const { name, description, start_date, end_date, budget, status, priority, manager_id, team_id } = req.body;
    
    validateRequired(name, 'Nom');
    validateRequired(description, 'Description');
    validateRequired(start_date, 'Date de début');
    validateRequired(end_date, 'Date de fin');
    validateRequired(budget, 'Budget');
    validateRequired(manager_id, 'ID du manager');
    
    if (name.length > 200) {
      throw new Error('Le nom ne peut pas dépasser 200 caractères');
    }
    
    if (description.length < 10) {
      throw new Error('La description doit contenir au moins 10 caractères');
    }
    
    if (budget < 0) {
      throw new Error('Le budget doit être positif');
    }
    
    // Validation du statut si renseigné
    if (status && !['planning', 'in-progress', 'completed', 'on-hold', 'cancelled', 'review'].includes(status)) {
      throw new Error('Statut invalide. Valeurs acceptées : planning, in-progress, completed, on-hold, cancelled, review');
    }
    
    // Validation de la priorité si renseignée
    if (priority && !['low', 'medium', 'high', 'critical', 'highest'].includes(priority)) {
      throw new Error('Priorité invalide. Valeurs acceptées : low, medium, high, critical, highest');
    }
    
    // Validation de l'ID du manager
    if (isNaN(manager_id) || manager_id <= 0) {
      throw new Error('ID du manager invalide');
    }
    
    // Validation de l'ID de l'équipe si renseigné
    if (team_id !== undefined && team_id !== null && (isNaN(team_id) || team_id <= 0)) {
      throw new Error('ID de l\'équipe invalide');
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

// Middleware de validation pour les équipes
const validateTeam = (req, res, next) => {
  try {
    const { name, description, manager_id } = req.body;
    
    validateRequired(name, 'Nom');
    validateRequired(manager_id, 'ID du manager');
    
    if (name.length > 200) {
      throw new Error('Le nom ne peut pas dépasser 200 caractères');
    }
    
    // Validation de l'ID du manager
    if (isNaN(manager_id) || manager_id <= 0) {
      throw new Error('ID du manager invalide');
    }
    
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Middleware de validation pour les utilisateurs
const validateUser = (req, res, next) => {
  try {
    const { email, first_name, last_name, role, department, status, phone, location } = req.body;
    
    validateRequired(email, 'Email');
    validateRequired(first_name, 'Prénom');
    validateRequired(last_name, 'Nom');
    
    // Validation de l'email
    if (!validateEmail(email)) {
      throw new Error('Format d\'email invalide');
    }
    
    // Validation des noms
    if (first_name.length > 100) {
      throw new Error('Le prénom ne peut pas dépasser 100 caractères');
    }
    
    if (last_name.length > 100) {
      throw new Error('Le nom ne peut pas dépasser 100 caractères');
    }
    
    // Validation du rôle si renseigné
    if (role && !['admin', 'user', 'developer', 'designer', 'manager'].includes(role)) {
      throw new Error('Rôle invalide. Valeurs acceptées : admin, user, developer, designer, manager');
    }
    
    // Validation du statut si renseigné
    if (status && !['available', 'busy', 'away', 'offline'].includes(status)) {
      throw new Error('Statut invalide. Valeurs acceptées : available, busy, away, offline');
    }
    
    // Validation du téléphone si renseigné
    if (phone && phone.length > 20) {
      throw new Error('Le numéro de téléphone ne peut pas dépasser 20 caractères');
    }
    
    // Validation de la localisation si renseignée
    if (location && location.length > 100) {
      throw new Error('La localisation ne peut pas dépasser 100 caractères');
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
    userId: req.user?.id,
  });

  // Gestion des erreurs Prisma étendue
  if (err.code) {
    const errorMap = {
      'P2002': { status: 409, message: 'Conflit : valeur déjà existante' },
      'P2025': { status: 404, message: 'Enregistrement non trouvé' },
      'P2003': { status: 400, message: 'Violation de contrainte de clé étrangère' },
      'P2014': { status: 400, message: 'Violation de contrainte unique' },
      'P2011': { status: 400, message: 'Contrainte de validation échouée' },
      'P2012': { status: 400, message: 'Valeur manquante pour un champ requis' },
      'P2013': { status: 400, message: 'Argument manquant pour un champ requis' },
      'P2015': { status: 400, message: 'Enregistrement requis pour cette opération' },
      'P2016': { status: 400, message: 'Erreur de connexion à la base de données' },
      'P2017': { status: 400, message: 'Erreur de relation entre enregistrements' },
      'P2018': { status: 400, message: 'Enregistrement connecté non trouvé' },
      'P2019': { status: 400, message: 'Erreur de valeur d\'entrée' },
      'P2020': { status: 400, message: 'Valeur hors limites' },
      'P2021': { status: 400, message: 'Table inexistante' },
      'P2022': { status: 400, message: 'Colonne inexistante' },
      'P2023': { status: 400, message: 'Erreur de type de données' },
      'P2024': { status: 400, message: 'Timeout de la base de données' },
    };
    
    const error = errorMap[err.code] || { status: 400, message: 'Erreur de base de données' };
    return res.status(error.status).json({
      success: false,
      message: error.message,
      code: err.code
    });
  }

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

    // Vérifier le mot de passe (en production, utiliser bcrypt)
    // Pour le moment, on accepte n'importe quel mot de passe pour les tests
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Email ou mot de passe incorrect'
    //   });
    // }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
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
    // Filtrer les champs undefined et null avant d'envoyer à Prisma
    const filteredBody = filterUndefinedFields(req.body);
    
    const projectData = {
      ...filteredBody,
      budget_allocated: filteredBody.budget || 0,
      budget: undefined // Supprimer le champ budget car on utilise budget_allocated
    };
    
    const newProject = await prisma.project.create({
      data: projectData,
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
      manager_name: `${newProject.manager.first_name} ${newProject.manager.last_name}`,
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

app.post('/api/teams', validateTeam, async (req, res, next) => {
  try {
    // Filtrer les champs undefined et null avant d'envoyer à Prisma
    const filteredBody = filterUndefinedFields(req.body);
    
    const newTeam = await prisma.team.create({
      data: filteredBody,
      include: {
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });
    
    const formattedTeam = {
      ...newTeam,
      manager_name: `${newTeam.manager.first_name} ${newTeam.manager.last_name}`,
      member_count: 0,
      projects_count: 0,
      manager: undefined
    };
    
    res.status(201).json({
      success: true,
      message: 'Équipe créée avec succès',
      data: formattedTeam
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/teams/:id', validateTeam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    // Filtrer les champs undefined et null avant d'envoyer à Prisma
    const filteredBody = filterUndefinedFields(req.body);
    
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: filteredBody,
      include: {
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });
    
    const formattedTeam = {
      ...updatedTeam,
      manager_name: `${updatedTeam.manager.first_name} ${updatedTeam.manager.last_name}`,
      manager: undefined
    };
    
    res.json({
      success: true,
      message: 'Équipe mise à jour',
      data: formattedTeam
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }
    next(error);
  }
});

app.delete('/api/teams/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    await prisma.team.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Équipe supprimée'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }
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
      avatar: user.avatar_url, // Alias pour compatibilité frontend
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

app.post('/api/users', validateUser, async (req, res, next) => {
  try {
    // Filtrer les champs undefined et null avant d'envoyer à Prisma
    const filteredBody = filterUndefinedFields(req.body);
    
    const userData = {
      ...filteredBody,
      role: filteredBody.role || 'user',
      status: filteredBody.status || 'available'
    };
    
    const newUser = await prisma.user.create({
      data: userData
    });
    
    const formattedUser = {
      ...newUser,
      avatar: newUser.avatar_url,
      initiatives_count: 0,
      projects_count: 0,
      teams_count: 0
    };
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: formattedUser
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }
    next(error);
  }
});

app.put('/api/users/:id', validateUser, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    // Filtrer les champs undefined et null avant d'envoyer à Prisma
    const filteredBody = filterUndefinedFields(req.body);
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredBody
    });
    
    const formattedUser = {
      ...updatedUser,
      avatar: updatedUser.avatar_url
    };
    
    res.json({
      success: true,
      message: 'Utilisateur mis à jour',
      data: formattedUser
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }
    next(error);
  }
});

app.delete('/api/users/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    await prisma.user.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Utilisateur supprimé'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
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

// User Productivity route
app.get('/api/user-productivity', async (req, res, next) => {
  try {
    const { period = 'all', department, role, limit = 10 } = req.query;
    
    // Construire les filtres de date
    let dateFilter = {};
    if (period !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        dateFilter = {
          created_at: {
            gte: startDate
          }
        };
      }
    }
    
    // Construire les filtres utilisateur
    const userFilters = {};
    if (department) userFilters.department = department;
    if (role) userFilters.role = role;
    
    // Récupérer les utilisateurs avec leurs statistiques
    const users = await prisma.user.findMany({
      where: userFilters,
      include: {
        initiatives: {
          where: dateFilter,
          select: {
            id: true,
            status: true,
            progress: true,
            created_at: true,
            updated_at: true
          }
        },
        projects: {
          where: dateFilter,
          select: {
            id: true,
            status: true,
            progress: true,
            created_at: true,
            updated_at: true
          }
        },
        _count: {
          select: {
            initiatives: true,
            projects: true,
            teamMemberships: true
          }
        }
      }
    });
    
    // Calculer les scores de productivité
    const usersWithScores = users.map(user => {
      const initiatives = user.initiatives;
      const projects = user.projects;
      
      // Calculer les statistiques des initiatives
      const initiativeStats = {
        total: initiatives.length,
        completed: initiatives.filter(i => i.status === 'completed').length,
        inProgress: initiatives.filter(i => i.status === 'in-progress').length,
        pending: initiatives.filter(i => i.status === 'pending').length,
        onHold: initiatives.filter(i => i.status === 'on-hold').length,
        avgProgress: initiatives.length > 0 
          ? initiatives.reduce((sum, i) => sum + (i.progress || 0), 0) / initiatives.length 
          : 0
      };
      
      // Calculer les statistiques des projets
      const projectStats = {
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        planning: projects.filter(p => p.status === 'planning').length,
        onHold: projects.filter(p => p.status === 'on-hold').length,
        avgProgress: projects.length > 0 
          ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length 
          : 0
      };
      
      // Calculer le score de productivité (0-100)
      const productivityScore = calculateProductivityScore(initiativeStats, projectStats);
      
      // Calculer l'activité récente (dernières 30 jours)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentActivity = {
        initiativesCreated: initiatives.filter(i => new Date(i.created_at) >= thirtyDaysAgo).length,
        projectsCreated: projects.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length,
        initiativesUpdated: initiatives.filter(i => new Date(i.updated_at) >= thirtyDaysAgo).length,
        projectsUpdated: projects.filter(p => new Date(p.updated_at) >= thirtyDaysAgo).length
      };
      
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar_url,
        status: user.status,
        productivityScore,
        initiativeStats,
        projectStats,
        recentActivity,
        totalInitiatives: user._count.initiatives,
        totalProjects: user._count.projects,
        teamMemberships: user._count.teamMemberships
      };
    });
    
    // Trier par score de productivité
    usersWithScores.sort((a, b) => b.productivityScore - a.productivityScore);
    
    // Limiter les résultats
    const limitedUsers = usersWithScores.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        users: limitedUsers,
        period,
        filters: { department, role },
        total: usersWithScores.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Fonction pour calculer le score de productivité
function calculateProductivityScore(initiativeStats, projectStats) {
  let score = 0;
  
  // Score basé sur les initiatives (40% du total)
  const initiativeScore = (
    (initiativeStats.completed * 10) + // 10 points par initiative terminée
    (initiativeStats.inProgress * 5) + // 5 points par initiative en cours
    (initiativeStats.avgProgress * 0.1) // 0.1 point par % de progression moyen
  );
  
  // Score basé sur les projets (60% du total)
  const projectScore = (
    (projectStats.completed * 15) + // 15 points par projet terminé
    (projectStats.inProgress * 8) + // 8 points par projet en cours
    (projectStats.avgProgress * 0.15) // 0.15 point par % de progression moyen
  );
  
  score = (initiativeScore * 0.4) + (projectScore * 0.6);
  
  // Normaliser le score entre 0 et 100
  return Math.min(Math.round(score), 100);
}

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
