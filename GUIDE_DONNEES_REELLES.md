# 🚀 Guide d'utilisation de CollabFlow avec des données réelles

## 📋 **Vue d'ensemble**

Votre application CollabFlow utilise maintenant une **base de données SQLite réelle** avec Prisma au lieu de données simulées. Toutes les données sont persistantes et sauvegardées localement.

## 🗄️ **Base de données**

### **Structure**
- **Type** : SQLite (fichier local)
- **Emplacement** : `backend/prisma/dev.db`
- **ORM** : Prisma
- **Schéma** : `backend/prisma/schema.prisma`

### **Tables créées**
- `users` - Utilisateurs de l'application
- `initiatives` - Initiatives et projets stratégiques
- `projects` - Projets concrets
- `teams` - Équipes de travail
- `team_members` - Membres des équipes
- `comments` - Commentaires sur les initiatives
- `likes` - Likes sur les initiatives
- `notifications` - Notifications système

## 👥 **Comptes de démonstration**

### **Administrateur**
- **Email** : `admin@collabflow.com`
- **Mot de passe** : `admin123`
- **Rôle** : Admin
- **Département** : IT

### **Utilisateur standard**
- **Email** : `user@collabflow.com`
- **Mot de passe** : `user123`
- **Rôle** : User
- **Département** : Marketing

### **Développeur**
- **Email** : `dev@collabflow.com`
- **Mot de passe** : `dev123`
- **Rôle** : Developer
- **Département** : IT

### **Designer**
- **Email** : `designer@collabflow.com`
- **Mot de passe** : `designer123`
- **Rôle** : Designer
- **Département** : Design

## 🔧 **Commandes utiles**

### **Démarrer l'application**
```bash
# Depuis la racine du projet
npm run dev

# Ou séparément
cd backend && npm run dev
cd frontend && npm run dev
```

### **Gérer la base de données**
```bash
# Générer le client Prisma
cd backend && npm run db:generate

# Pousser les changements de schéma
cd backend && npm run db:push

# Insérer des données de démonstration
cd backend && npm run seed

# Ouvrir Prisma Studio (interface graphique)
cd backend && npm run db:studio
```

### **Réinitialiser la base de données**
```bash
cd backend
npx prisma db push --force-reset
npm run seed
```

## 📊 **Données de démonstration incluses**

### **Initiatives (3)**
1. **Optimisation du processus de recrutement** (65% terminé)
2. **Mise en place d'une plateforme de formation** (25% terminé)
3. **Programme d'innovation collaborative** (100% terminé)

### **Projets (2)**
1. **Refonte du site web** (60% terminé)
2. **Application mobile** (10% terminé)

### **Équipes (2)**
1. **Équipe Développement** (2 membres)
2. **Équipe Marketing** (1 membre)

### **Commentaires et likes**
- Commentaires sur les initiatives
- Likes sur les initiatives
- Notifications système

## 🔄 **Fonctionnalités disponibles**

### **Authentification**
- ✅ Connexion avec email/mot de passe
- ✅ Gestion des rôles (admin, user, developer, designer)
- ✅ Tokens de session

### **Initiatives**
- ✅ Créer une nouvelle initiative
- ✅ Modifier une initiative existante
- ✅ Supprimer une initiative
- ✅ Liker une initiative
- ✅ Filtrer par statut/catégorie
- ✅ Recherche textuelle
- ✅ Pagination

### **Projets**
- ✅ Créer un nouveau projet
- ✅ Modifier un projet existant
- ✅ Supprimer un projet
- ✅ Filtrer par statut/priorité
- ✅ Recherche textuelle
- ✅ Pagination

### **Équipes**
- ✅ Voir la liste des équipes
- ✅ Voir les membres d'équipe
- ✅ Statistiques d'équipe

### **Utilisateurs**
- ✅ Voir la liste des utilisateurs
- ✅ Statistiques par utilisateur

### **Statistiques**
- ✅ Dashboard avec métriques
- ✅ Compteurs d'initiatives/projets
- ✅ Statistiques par statut

## 🛠️ **Personnalisation**

### **Ajouter de nouveaux utilisateurs**
1. Ouvrir Prisma Studio : `cd backend && npm run db:studio`
2. Aller dans la table `users`
3. Cliquer sur "Add record"
4. Remplir les champs requis

### **Modifier le schéma de base de données**
1. Éditer `backend/prisma/schema.prisma`
2. Exécuter `npm run db:push`
3. Régénérer le client : `npm run db:generate`

### **Ajouter de nouvelles données de démonstration**
1. Éditer `backend/seed.js`
2. Exécuter `npm run seed`

## 🔒 **Sécurité**

### **En développement**
- Mots de passe en dur (pour la démo)
- Pas de chiffrement des données
- Base de données locale

### **En production (recommandations)**
- Hachage des mots de passe (bcrypt)
- JWT pour l'authentification
- Base de données PostgreSQL/MySQL
- Variables d'environnement sécurisées
- HTTPS obligatoire

## 📈 **Évolutions possibles**

### **Fonctionnalités à ajouter**
- [ ] Système de commentaires avancé
- [ ] Notifications en temps réel
- [ ] Upload de fichiers
- [ ] Système de permissions granulaire
- [ ] API pour applications mobiles
- [ ] Export de données (PDF, Excel)
- [ ] Intégration avec des outils externes

### **Améliorations techniques**
- [ ] Cache Redis pour les performances
- [ ] Logs structurés
- [ ] Tests automatisés
- [ ] CI/CD pipeline
- [ ] Monitoring et alertes
- [ ] Sauvegarde automatique

## 🆘 **Dépannage**

### **Problème de connexion à la base de données**
```bash
cd backend
npx prisma generate
npx prisma db push
```

### **Données corrompues**
```bash
cd backend
npx prisma db push --force-reset
npm run seed
```

### **Erreur de port déjà utilisé**
```bash
pkill -f "node.*server"
pkill -f "vite"
```

### **Problème de dépendances**
```bash
rm -rf node_modules
npm install
```

## 🎯 **Prochaines étapes**

1. **Tester toutes les fonctionnalités** avec les comptes de démo
2. **Personnaliser les données** selon vos besoins
3. **Ajouter de nouveaux utilisateurs** via Prisma Studio
4. **Configurer l'environnement de production** si nécessaire
5. **Implémenter les fonctionnalités manquantes**

---

## 🚀 **Votre application est maintenant prête !**

**URLs d'accès :**
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001/api
- **Health Check** : http://localhost:3001/api/health
- **Prisma Studio** : http://localhost:5555 (après `npm run db:studio`)

**Bonne utilisation de CollabFlow ! 🎉**
