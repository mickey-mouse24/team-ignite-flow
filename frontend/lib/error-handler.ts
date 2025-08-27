import { toast } from 'sonner';

// Types d'erreurs
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: number;
  details?: unknown;
}

// Gestionnaire d'erreurs principal
export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Analyser et classer une erreur
  analyzeError(error: unknown): AppError {
    if (error instanceof Error) {
      // Erreurs réseau
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return {
          type: ErrorType.NETWORK,
          message: 'Erreur de connexion réseau. Vérifiez votre connexion internet.',
          details: error
        };
      }

      // Erreurs d'authentification
      if (error.message.includes('401') || error.message.includes('Token')) {
        return {
          type: ErrorType.AUTH,
          message: 'Session expirée. Veuillez vous reconnecter.',
          code: 401,
          details: error
        };
      }

      // Erreurs de validation
      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return {
          type: ErrorType.VALIDATION,
          message: 'Données invalides. Vérifiez vos informations.',
          details: error
        };
      }

      // Erreurs serveur
      if (error.message.includes('500') || error.message.includes('server')) {
        return {
          type: ErrorType.SERVER,
          message: 'Erreur serveur. Veuillez réessayer plus tard.',
          code: 500,
          details: error
        };
      }

      // Erreur générique
      return {
        type: ErrorType.UNKNOWN,
        message: error.message || 'Une erreur inattendue s\'est produite.',
        details: error
      };
    }

    // Erreur non-Error
    return {
      type: ErrorType.UNKNOWN,
      message: 'Une erreur inattendue s\'est produite.',
      details: error
    };
  }

  // Gérer une erreur avec affichage utilisateur
  handleError(error: unknown, showToast = true): AppError {
    const appError = this.analyzeError(error);

    // Log de l'erreur pour le débogage
    console.error('Erreur gérée:', {
      type: appError.type,
      message: appError.message,
      details: appError.details
    });

    // Afficher une notification à l'utilisateur
    if (showToast) {
      this.showErrorToast(appError);
    }

    return appError;
  }

  // Afficher une notification d'erreur
  private showErrorToast(error: AppError): void {
    const icon = this.getErrorIcon(error.type);
    const title = this.getErrorTitle(error.type);

    toast.error(`${icon} ${title}`, {
      description: error.message,
      duration: 5000,
      action: {
        label: 'Réessayer',
        onClick: () => window.location.reload()
      }
    });
  }

  // Obtenir l'icône pour le type d'erreur
  private getErrorIcon(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return '🌐';
      case ErrorType.AUTH:
        return '🔐';
      case ErrorType.VALIDATION:
        return '⚠️';
      case ErrorType.SERVER:
        return '🖥️';
      case ErrorType.UNKNOWN:
        return '❌';
    }
  }

  // Obtenir le titre pour le type d'erreur
  private getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return 'Erreur réseau';
      case ErrorType.AUTH:
        return 'Erreur d\'authentification';
      case ErrorType.VALIDATION:
        return 'Données invalides';
      case ErrorType.SERVER:
        return 'Erreur serveur';
      case ErrorType.UNKNOWN:
        return 'Erreur';
    }
  }

  // Gérer les erreurs de requête API
  handleApiError(response: Response, data?: unknown): AppError {
    const error: AppError = {
      type: ErrorType.UNKNOWN,
      message: 'Erreur de requête API',
      code: response.status,
      details: data
    };

    switch (response.status) {
      case 400:
        error.type = ErrorType.VALIDATION;
        error.message = 'Requête invalide';
        break;
      case 401:
        error.type = ErrorType.AUTH;
        error.message = 'Non autorisé';
        break;
      case 403:
        error.type = ErrorType.AUTH;
        error.message = 'Accès refusé';
        break;
      case 404:
        error.message = 'Ressource non trouvée';
        break;
      case 500:
        error.type = ErrorType.SERVER;
        error.message = 'Erreur serveur interne';
        break;
      case 502:
      case 503:
      case 504:
        error.type = ErrorType.SERVER;
        error.message = 'Service temporairement indisponible';
        break;
    }

    return this.handleError(error);
  }

  // Gérer les erreurs de validation de formulaire
  handleValidationError(errors: Record<string, string>): void {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error('⚠️ Erreur de validation', {
        description: firstError,
        duration: 4000
      });
    }
  }

  // Gérer les erreurs de succès
  handleSuccess(message: string, description?: string): void {
    toast.success('✅ Succès', {
      description: description || message,
      duration: 3000
    });
  }

  // Gérer les avertissements
  handleWarning(message: string, description?: string): void {
    toast.warning('⚠️ Attention', {
      description: description || message,
      duration: 4000
    });
  }
}

// Instance singleton
export const errorHandler = ErrorHandler.getInstance();

// Hook pour utiliser le gestionnaire d'erreurs
export const useErrorHandler = () => {
  return {
    handleError: (error: unknown, showToast = true) => errorHandler.handleError(error, showToast),
    handleApiError: (response: Response, data?: unknown) => errorHandler.handleApiError(response, data),
    handleValidationError: (errors: Record<string, string>) => errorHandler.handleValidationError(errors),
    handleSuccess: (message: string, description?: string) => errorHandler.handleSuccess(message, description),
    handleWarning: (message: string, description?: string) => errorHandler.handleWarning(message, description),
  };
};
