import { toast } from 'sonner';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    let errorMessage = 'Une erreur inattendue s\'est produite';
    let errorStatus = 0;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
      if ('status' in error) {
        errorStatus = Number(error.status);
      }
    }

    // Gestion spécifique par code d'erreur
    switch (errorStatus) {
      case 401:
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        // Rediriger vers la page de connexion
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        break;
      case 403:
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        break;
      case 404:
        errorMessage = 'Ressource non trouvée.';
        break;
      case 422:
        errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
        break;
      case 429:
        errorMessage = 'Trop de requêtes. Veuillez patienter avant de réessayer.';
        break;
      case 500:
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        break;
      case 502:
      case 503:
      case 504:
        errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.';
        break;
      default:
        if (errorStatus === 0) {
          errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
        }
        break;
    }

    // Log de l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context || 'ErrorHandler'}]`, error);
    }

    // Affichage du toast d'erreur
    toast.error(errorMessage, {
      duration: errorStatus >= 500 ? 8000 : 5000, // Plus long pour les erreurs serveur
      action: errorStatus === 401 ? {
        label: 'Se reconnecter',
        onClick: () => window.location.href = '/login'
      } : undefined
    });
  }

  static handleNetworkError(): void {
    toast.error('Erreur de connexion réseau. Vérifiez votre connexion internet.', {
      duration: 6000,
      action: {
        label: 'Réessayer',
        onClick: () => window.location.reload()
      }
    });
  }

  static handleValidationError(errors: Record<string, string[]>): void {
    const errorMessages = Object.values(errors).flat();
    const message = errorMessages.length > 0 
      ? `Erreurs de validation: ${errorMessages.join(', ')}`
      : 'Données invalides';
    
    toast.error(message, {
      duration: 6000
    });
  }

  static handleTimeoutError(): void {
    toast.error('La requête a pris trop de temps. Veuillez réessayer.', {
      duration: 5000,
      action: {
        label: 'Réessayer',
        onClick: () => window.location.reload()
      }
    });
  }

  static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('fetch') || 
             error.message.includes('network') ||
             error.message.includes('connection');
    }
    return false;
  }

  static isAuthError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'status' in error) {
      return Number(error.status) === 401 || Number(error.status) === 403;
    }
    return false;
  }

  static isServerError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'status' in error) {
      const status = Number(error.status);
      return status >= 500 && status < 600;
    }
    return false;
  }
}
