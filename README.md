# 🚀 CollabFlow - Plateforme de Collaboration d'Équipe

Une application moderne de gestion de projets et de collaboration d'équipe construite avec React, TypeScript, et Node.js.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec JWT
- 📋 **Gestion d'initiatives** avec likes et commentaires
- 👥 **Gestion d'équipes** et de projets
- 🔔 **Système de notifications** en temps réel
- 📊 **Tableaux de bord** avec statistiques
- 🎨 **Interface moderne** avec Tailwind CSS et shadcn/ui
- 📱 **Responsive design** pour tous les appareils
- ⚡ **Performance optimisée** avec React Query et code splitting

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **React Router** pour la navigation
- **React Query** pour la gestion d'état serveur
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants
- **Lucide React** pour les icônes
- **Sonner** pour les notifications toast

### Backend
- **Node.js** avec CommonJS
- **Prisma** comme ORM
- **SQLite** pour la base de données
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/collabflow.git
cd collabflow
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
```bash
cp env.example .env
```

Modifiez le fichier `.env` selon vos besoins :
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="votre-secret-jwt-super-securise"

# Server
PORT=3001
NODE_ENV=development

# API
API_URL="http://localhost:3001/api"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Security
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN="24h"
```

### 4. Configuration de la base de données
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# Créer un utilisateur admin
npm run db:admin

# (Optionnel) Seeder la base de données
npm run db:seed
```

### 5. Démarrer l'application

#### Développement complet (serveur + client)
```bash
npm run dev:full
```

#### Ou séparément :
```bash
# Terminal 1 - Serveur backend
npm run dev:server

# Terminal 2 - Client frontend
npm run dev
```

L'application sera disponible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3001/api

## 📁 Structure du Projet

```
team-ignite-flow/
├── src/
│   ├── components/          # Composants React
│   │   ├── ui/             # Composants UI (shadcn/ui)
│   │   ├── layout/         # Composants de mise en page
│   │   └── ...
│   ├── hooks/              # Hooks personnalisés
│   ├── pages/              # Pages de l'application
│   ├── lib/                # Utilitaires et configurations
│   └── App.tsx             # Composant racine
├── server/
│   └── real-server.cjs     # Serveur backend
├── prisma/
│   ├── schema.prisma       # Schéma de base de données
│   ├── seed.cjs           # Données de test
│   └── create-admin.cjs   # Script de création d'admin
├── public/                 # Assets statiques
└── dist/                   # Build de production
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Démarrer le client en mode dev
npm run dev:server       # Démarrer le serveur backend
npm run dev:full         # Démarrer client + serveur

# Build
npm run build            # Build de production
npm run build:dev        # Build en mode développement
npm run preview          # Prévisualiser le build

# Base de données
npm run db:generate      # Générer le client Prisma
npm run db:push          # Pousser le schéma vers la DB
npm run db:studio        # Ouvrir Prisma Studio
npm run db:admin         # Créer un utilisateur admin
npm run db:seed          # Seeder la base de données

# Qualité de code
npm run lint             # Linter ESLint
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Les tokens sont stockés dans le localStorage et renouvelés automatiquement.

### Utilisateur par défaut
Après avoir exécuté `npm run db:admin`, vous pouvez vous connecter avec :
- Email : `admin@collabflow.com`
- Mot de passe : `admin123`

## 📊 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/profile` - Profil utilisateur

### Initiatives
- `GET /api/initiatives` - Liste des initiatives (avec pagination)
- `POST /api/initiatives` - Créer une initiative
- `PUT /api/initiatives/:id` - Modifier une initiative
- `DELETE /api/initiatives/:id` - Supprimer une initiative
- `POST /api/initiatives/:id/like` - Liker/unliker une initiative
- `POST /api/initiatives/:id/comments` - Ajouter un commentaire

### Notifications
- `GET /api/notifications` - Liste des notifications
- `PUT /api/notifications/:id/read` - Marquer comme lue

### Projets
- `GET /api/projects` - Liste des projets

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs

### Équipes
- `GET /api/teams` - Liste des équipes

## 🎨 Personnalisation

### Thème
L'application utilise Tailwind CSS avec un système de thème personnalisable. Modifiez les couleurs dans `tailwind.config.ts`.

### Composants UI
Les composants shadcn/ui peuvent être personnalisés dans `src/components/ui/`.

## 🚀 Déploiement

### Production
```bash
# Build de production
npm run build

# Le dossier dist/ contient l'application prête pour la production
```

### Variables d'environnement de production
```env
NODE_ENV=production
JWT_SECRET=votre-secret-super-securise
CORS_ORIGIN=https://votre-domaine.com
DATABASE_URL=file:./prod.db
```

## 🧪 Tests

```bash
# Lancer les tests (à implémenter)
npm test

# Tests en mode watch
npm run test:watch
```

## 📈 Performance

L'application est optimisée pour les performances :

- **Code splitting** automatique avec Vite
- **Lazy loading** des composants
- **Cache intelligent** avec React Query
- **Optimisation des images** et assets
- **Bundle size** optimisé (~800KB gzippé)

## 🔒 Sécurité

- Validation des entrées côté serveur
- Protection CSRF avec CORS configuré
- Hachage sécurisé des mots de passe (bcrypt)
- Tokens JWT avec expiration
- Sanitisation des données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que toutes les dépendances sont installées
2. Assurez-vous que la base de données est configurée
3. Vérifiez les logs du serveur
4. Ouvrez une issue sur GitHub

## 🔄 Changelog

### v1.0.0
- ✅ Authentification complète
- ✅ Gestion des initiatives
- ✅ Système de notifications
- ✅ Interface responsive
- ✅ Optimisations de performance
- ✅ Gestion d'erreurs robuste

---

**CollabFlow** - Simplifiez la collaboration de votre équipe ! 🚀
