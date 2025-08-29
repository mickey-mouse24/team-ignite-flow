# 🚀 Guide de Démarrage Rapide - CollabFlow

## ✅ **SERVEUR DÉMARRÉ AVEC SUCCÈS !**

### **📡 URLs d'accès :**
- **Application Frontend** : http://localhost:5173
- **API Backend** : http://localhost:3001/api
- **Health Check** : http://localhost:3001/api/health

---

## 🔐 **CONNEXION À L'APPLICATION**

### **Comptes de démonstration disponibles :**

| Email | Mot de passe | Rôle | Département |
|-------|-------------|------|-------------|
| `admin@collabflow.com` | `admin123` | Administrateur | IT |
| `user@collabflow.com` | `user123` | Utilisateur | Marketing |
| `dev@collabflow.com` | `dev123` | Développeur | IT |
| `designer@collabflow.com` | `designer123` | Designer | Design |

---

## 📊 **DONNÉES DISPONIBLES**

### **Initiatives (3)**
1. **Programme d'innovation collaborative** (100% terminé)
2. **Mise en place d'une plateforme de formation** (25% terminé)
3. **Optimisation du processus de recrutement** (65% terminé)

### **Projets (2)**
1. **Refonte du site web** (60% terminé)
2. **Application mobile** (10% terminé)

### **Équipes (2)**
1. **Équipe Développement** (2 membres)
2. **Équipe Marketing** (1 membre)

---

## 🎯 **FONCTIONNALITÉS DISPONIBLES**

### **✅ Dashboard**
- Statistiques en temps réel
- Vue d'ensemble des initiatives et projets
- Métriques de performance

### **✅ Gestion des Initiatives**
- Créer une nouvelle initiative
- Modifier une initiative existante
- Supprimer une initiative
- Liker une initiative
- Filtrer par statut/catégorie
- Recherche textuelle

### **✅ Gestion des Projets**
- Créer un nouveau projet
- Modifier un projet existant
- Supprimer un projet
- Suivi du budget et de la progression
- Filtrage et recherche

### **✅ Gestion des Équipes**
- Voir la liste des équipes
- Voir les membres d'équipe
- Statistiques d'équipe

### **✅ Utilisateurs**
- Liste des utilisateurs
- Profils détaillés
- Statistiques par utilisateur

---

## 🛠️ **COMMANDES UTILES**

### **Redémarrer l'application**
```bash
# Depuis la racine du projet
npm run dev
```

### **Gérer la base de données**
```bash
# Voir les données dans Prisma Studio
cd backend && npm run db:studio

# Réinsérer les données de démo
cd backend && npm run seed

# Vérifier la santé du backend
curl http://localhost:3001/api/health
```

### **En cas de problème**
```bash
# Tuer tous les processus
pkill -f "node\|vite"

# Libérer les ports
lsof -ti:3001,5173 | xargs kill -9

# Redémarrer
npm run dev
```

---

## 🔧 **STRUCTURE TECHNIQUE**

### **Frontend**
- **Framework** : React + TypeScript
- **Build Tool** : Vite
- **UI Library** : Radix UI + Tailwind CSS
- **State Management** : React Query + Context API
- **Validation** : Zod

### **Backend**
- **Framework** : Node.js + Express
- **Base de données** : SQLite avec Prisma ORM
- **Validation** : Middleware personnalisé
- **Authentification** : Tokens JWT simulés

### **Base de données**
- **Type** : SQLite (fichier local)
- **ORM** : Prisma
- **Schéma** : 8 tables avec relations

---

## 🎉 **VOTRE APPLICATION EST PRÊTE !**

**Ouvrez votre navigateur et allez sur :**
**http://localhost:5173**

**Connectez-vous avec :**
- Email : `admin@collabflow.com`
- Mot de passe : `admin123`

**Bonne utilisation de CollabFlow ! 🚀**
