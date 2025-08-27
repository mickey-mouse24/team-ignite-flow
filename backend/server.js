import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Données de démonstration
const users = [
  {
    id: 1,
    email: 'admin@collabflow.com',
    first_name: 'Admin',
    last_name: 'System',
    role: 'admin',
    department: 'IT',
    status: 'available',
    avatar_url: null,
    avatar: null,
    phone: '+33 1 23 45 67 89',
    location: 'Paris, France',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    email: 'user@collabflow.com',
    first_name: 'Utilisateur',
    last_name: 'Demo',
    role: 'user',
    department: 'Marketing',
    status: 'available',
    avatar_url: null,
    avatar: null,
    phone: '+33 1 98 76 54 32',
    location: 'Lyon, France',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    email: 'dev@collabflow.com',
    first_name: 'Développeur',
    last_name: 'Frontend',
    role: 'developer',
    department: 'IT',
    status: 'available',
    avatar_url: null,
    avatar: null,
    phone: '+33 1 11 22 33 44',
    location: 'Marseille, France',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    email: 'designer@collabflow.com',
    first_name: 'Designer',
    last_name: 'UX',
    role: 'designer',
    department: 'Design',
    status: 'available',
    avatar_url: null,
    avatar: null,
    phone: '+33 1 55 66 77 88',
    location: 'Toulouse, France',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const initiatives = [
  {
    id: 1,
    title: 'Optimisation du processus de recrutement',
    description: 'Améliorer le processus de recrutement pour réduire le temps d\'embauche et améliorer l\'expérience candidat.',
    author_id: 1,
    status: 'in-progress',
    category: 'Ressources Humaines',
    progress: 65,
    likes: 12,
    comments_count: 5,
    participants_count: 8,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    first_name: 'Admin',
    last_name: 'System',
    author_role: 'admin'
  },
  {
    id: 2,
    title: 'Mise en place d\'une plateforme de formation en ligne',
    description: 'Créer une plateforme interne pour la formation continue des employés avec des modules interactifs.',
    author_id: 2,
    status: 'pending',
    category: 'Formation',
    progress: 25,
    likes: 8,
    comments_count: 3,
    participants_count: 12,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    first_name: 'Utilisateur',
    last_name: 'Demo',
    author_role: 'user'
  },
  {
    id: 3,
    title: 'Programme d\'innovation collaborative',
    description: 'Lancer un programme pour encourager l\'innovation et la collaboration inter-départements.',
    author_id: 1,
    status: 'completed',
    category: 'Innovation',
    progress: 100,
    likes: 25,
    comments_count: 15,
    participants_count: 20,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    first_name: 'Admin',
    last_name: 'System',
    author_role: 'admin'
  }
];

const projects = [
  {
    id: 1,
    name: 'Refonte du site web',
    description: 'Moderniser le site web de l\'entreprise avec une nouvelle identité visuelle.',
    status: 'in-progress',
    priority: 'high',
    start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget_allocated: 50000,
    budget_spent: 25000,
    progress: 60,
    manager_id: 1,
    team_id: 1,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    first_name: 'Admin',
    last_name: 'System'
  },
  {
    id: 2,
    name: 'Application mobile',
    description: 'Développer une application mobile pour améliorer l\'engagement client.',
    status: 'planning',
    priority: 'medium',
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    budget_allocated: 80000,
    budget_spent: 0,
    progress: 10,
    manager_id: 2,
    team_id: 2,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    first_name: 'Utilisateur',
    last_name: 'Demo'
  }
];

const teams = [
  {
    id: 1,
    name: 'Équipe Développement',
    description: 'Équipe responsable du développement des applications',
    department: 'IT',
    members_count: 8,
    projects_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Équipe Marketing',
    description: 'Équipe en charge des campagnes marketing et communication',
    department: 'Marketing',
    members_count: 5,
    projects_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Routes API

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@collabflow.com' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: users[0],
        token: 'demo-token-admin-123'
      }
    });
  } else if (email === 'user@collabflow.com' && password === 'user123') {
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: users[1],
        token: 'demo-token-user-456'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }
});

// Initiatives routes
app.get('/api/initiatives', (req, res) => {
  res.json({
    success: true,
    data: {
      initiatives: initiatives,
      pagination: {
        page: 1,
        limit: 10,
        total: initiatives.length,
        pages: 1
      }
    }
  });
});

app.post('/api/initiatives', (req, res) => {
  const newInitiative = {
    id: initiatives.length + 1,
    ...req.body,
    author_id: 1,
    status: 'pending',
    progress: 0,
    likes: 0,
    comments_count: 0,
    participants_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    first_name: 'Admin',
    last_name: 'System',
    author_role: 'admin'
  };
  
  initiatives.push(newInitiative);
  
  res.json({
    success: true,
    message: 'Initiative créée avec succès',
    data: newInitiative
  });
});

app.put('/api/initiatives/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = initiatives.findIndex(i => i.id === id);
  
  if (index !== -1) {
    initiatives[index] = { ...initiatives[index], ...req.body, updated_at: new Date().toISOString() };
    res.json({
      success: true,
      message: 'Initiative mise à jour',
      data: initiatives[index]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Initiative non trouvée'
    });
  }
});

app.delete('/api/initiatives/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = initiatives.findIndex(i => i.id === id);
  
  if (index !== -1) {
    initiatives.splice(index, 1);
    res.json({
      success: true,
      message: 'Initiative supprimée'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Initiative non trouvée'
    });
  }
});

app.post('/api/initiatives/:id/like', (req, res) => {
  const id = parseInt(req.params.id);
  const index = initiatives.findIndex(i => i.id === id);
  
  if (index !== -1) {
    initiatives[index].likes += 1;
    res.json({
      success: true,
      message: 'Like ajouté'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Initiative non trouvée'
    });
  }
});

// Projects routes
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: {
      projects: projects,
      pagination: {
        page: 1,
        limit: 10,
        total: projects.length,
        pages: 1
      }
    }
  });
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: projects.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    first_name: 'Admin',
    last_name: 'System'
  };
  
  projects.push(newProject);
  
  res.json({
    success: true,
    message: 'Projet créé avec succès',
    data: newProject
  });
});

app.put('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body, updated_at: new Date().toISOString() };
    res.json({
      success: true,
      message: 'Projet mis à jour',
      data: projects[index]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Projet non trouvé'
    });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  
  if (index !== -1) {
    projects.splice(index, 1);
    res.json({
      success: true,
      message: 'Projet supprimé'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Projet non trouvé'
    });
  }
});

// Teams routes
app.get('/api/teams', (req, res) => {
  res.json({
    success: true,
    data: {
      teams: teams,
      pagination: {
        page: 1,
        limit: 10,
        total: teams.length,
        pages: 1
      }
    }
  });
});

// Users routes
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: {
      users: users,
      pagination: {
        page: 1,
        limit: 10,
        total: users.length,
        pages: 1
      }
    }
  });
});

// Stats route
app.get('/api/stats', (req, res) => {
  const stats = {
    initiatives: {
      total: initiatives.length,
      pending: initiatives.filter(i => i.status === 'pending').length,
      inProgress: initiatives.filter(i => i.status === 'in-progress').length,
      completed: initiatives.filter(i => i.status === 'completed').length,
      onHold: initiatives.filter(i => i.status === 'on-hold').length
    },
    projects: {
      total: projects.length,
      pending: projects.filter(p => p.status === 'planning').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'on-hold').length
    },
    team: {
      total: users.length,
      active: users.filter(u => u.status === 'available').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      departments: [
        { name: 'IT', count: 2 },
        { name: 'Marketing', count: 1 },
        { name: 'Design', count: 1 }
      ]
    },
    recentActivity: [
      {
        id: '1',
        type: 'initiative',
        title: 'Nouvelle initiative créée',
        description: 'Optimisation du processus de recrutement',
        timestamp: new Date().toISOString(),
        user: { name: 'Admin System' }
      },
      {
        id: '2',
        type: 'project',
        title: 'Projet mis à jour',
        description: 'Refonte du site web - 60% terminé',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        user: { name: 'Admin System' }
      }
    ]
  };

  res.json({
    success: true,
    data: stats
  });
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend CollabFlow opérationnel',
    timestamp: new Date().toISOString()
  });
});

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend CollabFlow démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
