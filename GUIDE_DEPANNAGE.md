# 🔧 Guide de Dépannage - CollabFlow

## 🚨 **PROBLÈME RÉSOLU !**

### **✅ Votre application fonctionne maintenant :**

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3001
- **Base de données** : SQLite avec Prisma

---

## 🚀 **Comment utiliser votre application :**

### **1. Ouvrir l'application**
Allez sur : **http://localhost:5173**

### **2. Se connecter**
Utilisez l'un de ces comptes :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@collabflow.com` | `admin123` | Administrateur |
| `user@collabflow.com` | `user123` | Utilisateur |
| `dev@collabflow.com` | `dev123` | Développeur |
| `designer@collabflow.com` | `designer123` | Designer |

### **3. Fonctionnalités disponibles**
- ✅ **Dashboard** avec statistiques réelles
- ✅ **Initiatives** (créer, modifier, supprimer, liker)
- ✅ **Projets** (créer, modifier, supprimer)
- ✅ **Équipes** et utilisateurs
- ✅ **Données persistantes** dans la base SQLite

---

## 🔧 **Si vous avez des problèmes :**

### **Problème : "Port déjà utilisé"**
```bash
# Tuer tous les processus Node.js et Vite
pkill -f "node\|vite"

# Ou tuer un port spécifique
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### **Problème : "Erreur de connexion au serveur"**
```bash
# Redémarrer le backend
cd backend && npm run dev

# Redémarrer le frontend
cd frontend && npm run dev
```

### **Problème : "Données corrompues"**
```bash
# Réinitialiser la base de données
cd backend
npx prisma db push --force-reset
npm run seed
```

### **Problème : "Dépendances manquantes"**
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
```

---

## 📊 **Vos données réelles :**

### **Utilisateurs (4)**
- Admin System (IT)
- Utilisateur Demo (Marketing)
- Développeur Frontend (IT)
- Designer UX (Design)

### **Initiatives (3)**
- Optimisation du processus de recrutement (65%)
- Mise en place d'une plateforme de formation (25%)
- Programme d'innovation collaborative (100%)

### **Projets (2)**
- Refonte du site web (60%)
- Application mobile (10%)

### **Équipes (2)**
- Équipe Développement (2 membres)
- Équipe Marketing (1 membre)

---

## 🛠️ **Commandes utiles :**

```bash
# Démarrer l'application complète
npm run dev

# Voir les données dans Prisma Studio
cd backend && npm run db:studio

# Réinsérer les données de démo
cd backend && npm run seed

# Vérifier la santé du backend
curl http://localhost:3001/api/health
```

---

## 🎯 **Prochaines étapes :**

1. **Connectez-vous** avec un des comptes de démo
2. **Explorez** toutes les fonctionnalités
3. **Ajoutez** vos propres données via Prisma Studio
4. **Personnalisez** selon vos besoins

---

## ✅ **Votre application est maintenant prête !**

**URLs d'accès :**
- **Application** : http://localhost:5173
- **API Backend** : http://localhost:3001/api
- **Prisma Studio** : http://localhost:5555 (après `npm run db:studio`)

**Bonne utilisation de CollabFlow ! 🎉**
