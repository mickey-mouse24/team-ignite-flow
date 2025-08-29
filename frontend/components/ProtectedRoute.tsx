import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setShowTimeout(true);
      }, 10000); // 10 secondes de timeout

      return () => clearTimeout(timeout);
    } else {
      setShowTimeout(false);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 mb-2">Chargement en cours...</p>
          {showTimeout && (
            <div className="text-sm text-orange-600">
              Le chargement prend plus de temps que prévu.
              <button 
                onClick={() => window.location.reload()} 
                className="ml-2 text-blue-600 hover:underline"
              >
                Recharger
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
