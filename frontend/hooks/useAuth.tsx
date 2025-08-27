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

// Simulation de l'authentification sans backend
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

function useAuth() {
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
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      return true;
    }
    return false;
  }, []);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (storedUser && storedToken && isAuthenticated === 'true') {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Nettoyer si les données sont incomplètes
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

      const result = await simulateAuth(email, password);

      if (result.success) {
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

      const newToken = `demo-token-${Date.now()}`;

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
        const updatedUser = { ...prev, ...userData };
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
