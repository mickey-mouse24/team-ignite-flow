# 🚀 Guide de Démarrage Rapide - CollabFlow

## ✅ **Application Lancée avec Succès !**

Votre application CollabFlow est maintenant opérationnelle et accessible.

## 🌐 **Accès à l'Application**

### **Frontend (Interface Utilisateur)**
```
🌐 URL: http://localhost:5173
📱 Interface: React avec Vite
🎨 UI: shadcn/ui + Tailwind CSS
```

### **Backend (API)**
```
🔗 URL: http://localhost:3001
📡 API: http://localhost:3001/api
💾 Base de données: SQLite avec Prisma
```

## 🔐 **Connexion à l'Application**

### **Comptes de Test Disponibles**

#### **Administrateur**
```
📧 Email: daouda@collab.com
🔑 Mot de passe: admin123
👤 Rôle: Admin
```

#### **Manager RH**
```
📧 Email: marie.dupont@collab.com
🔑 Mot de passe: user123
👤 Rôle: Manager
```

#### **Manager IT**
```
📧 Email: thomas.martin@collab.com
🔑 Mot de passe: manager123
👤 Rôle: Manager
```

## 📱 **Pages Disponibles**

### **Pages Principales**
- 🏠 **Dashboard** (`/`) - Tableau de bord principal
- 💡 **Initiatives** (`/initiatives`) - Gestion des initiatives
- 📋 **Projets** (`/projects`) - Gestion des projets
- 👥 **Équipe** (`/team`) - Gestion d'équipe
- 🔐 **Connexion** (`/login`) - Page d'authentification

### **Fonctionnalités**
- ✅ **Authentification** - Connexion sécurisée
- ✅ **Gestion des Initiatives** - Création et suivi
- ✅ **Gestion des Projets** - Projets et tâches
- ✅ **Gestion d'Équipe** - Structure organisationnelle
- ✅ **Statistiques** - Tableau de bord avec métriques

## 🛠️ **Commandes Utiles**

### **Démarrer l'Application**
```bash
# Démarrer frontend + backend
npm run dev

# Démarrer séparément
npm run dev:frontend    # Frontend uniquement
npm run dev:backend     # Backend uniquement
```

### **Base de Données**
```bash
# Peupler avec des données de test
npm run db:seed

# Ouvrir Prisma Studio (interface DB)
npm run db:studio
```

### **Arrêter l'Application**
```bash
# Arrêter tous les processus
pkill -f "node.*server" && pkill -f "vite"
```

## 📊 **Données de Test**

### **Initiatives Disponibles**
- 🎯 **Amélioration du processus de recrutement** (65% terminé)
- ☁️ **Migration vers le cloud** (25% terminé)
- 👨‍🏫 **Programme de mentorat** (100% terminé)

### **Projets Disponibles**
- 🚀 **Migration Cloud AWS** (65% terminé)
- 📚 **Système de Mentorat** (100% terminé)

### **Équipes**
- 💻 **Équipe IT** - Développement et infrastructure
- 📈 **Équipe Marketing** - Marketing et communication
- 👥 **Équipe RH** - Ressources humaines
- 🎓 **Équipe Formation** - Formation et développement

## 🔧 **Dépannage**

### **Problèmes Courants**

#### **Port déjà utilisé**
```bash
# Libérer le port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Libérer le port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

#### **Base de données**
```bash
# Réinitialiser la base de données
npm run db:seed
```

#### **Dépendances**
```bash
# Réinstaller les dépendances
npm run install:all
```

## 📱 **Navigation dans l'Application**

### **1. Connexion**
- Ouvrez http://localhost:5173
- Cliquez sur "Se connecter"
- Utilisez un des comptes de test

### **2. Dashboard**
- Vue d'ensemble des projets et initiatives
- Statistiques en temps réel
- Activité récente

### **3. Initiatives**
- Créer de nouvelles initiatives
- Suivre le progrès
- Collaborer avec l'équipe

### **4. Projets**
- Gérer les projets
- Assigner des tâches
- Suivre les budgets

### **5. Équipe**
- Voir la structure organisationnelle
- Gérer les rôles
- Collaborer

## 🎯 **Fonctionnalités Clés**

### **✅ Authentification Sécurisée**
- JWT tokens
- Sessions persistantes
- Rôles et permissions

### **✅ Interface Moderne**
- Design responsive
- Composants shadcn/ui
- Animations fluides

### **✅ Base de Données**
- SQLite avec Prisma
- Relations complexes
- Données de test complètes

### **✅ API RESTful**
- Endpoints sécurisés
- Validation des données
- Gestion d'erreurs

## 🎉 **Prêt à Utiliser !**

Votre application CollabFlow est maintenant **entièrement fonctionnelle** et prête à être utilisée !

- ✅ **Frontend** : http://localhost:5173
- ✅ **Backend** : http://localhost:3001
- ✅ **Base de données** : Peuplée avec des données de test
- ✅ **Authentification** : Comptes de test disponibles

**🚀 Bonne utilisation de CollabFlow !**
