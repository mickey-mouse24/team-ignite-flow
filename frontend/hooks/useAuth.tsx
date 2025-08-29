import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Validation des tokens
const validateToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  // Vérifier la structure du token (format basique)
  const tokenParts = token.split('-');
  if (tokenParts.length < 3) return false;
  
  // Vérifier que le token n'est pas expiré (simulation)
  // En production, il faudrait vérifier la signature JWT
  return true;
};

// Authentification simulée (fallback si le backend n'est pas disponible)
const simulateAuth = async (email: string, password: string) => {
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Vérifier les identifiants de démonstration
  if (email === 'admin@collabflow.com' && password === 'admin123') {
    return {
      success: true,
      user: {
        id: 1,
        email: 'admin@collabflow.com',
        first_name: 'Admin',
        last_name: 'System',
        role: 'admin',
        department: 'IT',
        status: 'available',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      token: 'demo-token-admin-123'
    }
  } else if (email === 'user@collabflow.com' && password === 'user123') {
    return {
      success: true,
      user: {
        id: 2,
        email: 'user@collabflow.com',
        first_name: 'Utilisateur',
        last_name: 'Demo',
        role: 'user',
        department: 'Marketing',
        status: 'available',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      token: 'demo-token-user-456'
    }
  } else {
    throw new Error('Email ou mot de passe incorrect')
  }
}

// Authentification avec le backend réel ou simulation
const authenticateWithBackend = async (email: string, password: string) => {
  // Validation des entrées
  if (!email || !password) {
    throw new Error('Email et mot de passe requis');
  }
  
  if (!email.includes('@')) {
    throw new Error('Format d\'email invalide');
  }
  
  if (password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion');
    }

    return {
      success: true,
      user: data.data.user,
      token: data.data.token
    };
  } catch (error) {
    // Si le backend n'est pas disponible, utiliser l'authentification simulée
    console.log('Backend non disponible, utilisation de l\'authentification simulée');
    return simulateAuth(email, password);
  }
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fonction pour rafraîchir le token (simulation)
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken && validateToken(storedToken)) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        return true;
      } catch (error) {
        // Si le parsing échoue, nettoyer les données corrompues
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        setToken(null);
        return false;
      }
    }
    return false;
  }, []);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (storedUser && storedToken && isAuthenticated === 'true' && validateToken(storedToken)) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        } catch (error) {
          // Nettoyer si les données sont corrompues
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          setUser(null);
          setToken(null);
        }
      } else {
        // Nettoyer si les données sont incomplètes ou invalides
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authenticateWithBackend(email, password);

      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      } else {
        setError('Erreur de connexion');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validation des données d'inscription
      if (!userData.email || !userData.password || !userData.first_name || !userData.last_name) {
        throw new Error('Tous les champs sont requis');
      }

      if (!userData.email.includes('@')) {
        throw new Error('Format d\'email invalide');
      }

      if (userData.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now(),
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: 'user',
        department: userData.department || 'Général',
        status: 'available',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newToken = `demo-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', newToken);
      localStorage.setItem('isAuthenticated', 'true');
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (prev) {
        const updatedUser = { ...prev, ...userData, updated_at: new Date().toISOString() };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
