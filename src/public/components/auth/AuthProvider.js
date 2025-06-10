/**
 * Auth Provider - École Management System
 * Context React pour la gestion de l'authentification globale
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../../backend/authService.js';

// Context de l'authentification
const AuthContext = createContext({
  user: null,
  userRole: null,
  loading: true,
  error: null,
  login: () => {},
  logout: () => {},
  refreshUserRole: () => {}
});

// Actions pour le reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_USER: 'CLEAR_USER'
};

// Reducer pour gérer l'état d'authentification
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        userRole: action.payload.role,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case AUTH_ACTIONS.CLEAR_USER:
      return {
        ...state,
        user: null,
        userRole: null,
        loading: false,
        error: null
      };

    default:
      return state;
  }
}

// État initial
const initialState = {
  user: null,
  userRole: null,
  loading: true,
  error: null
};

/**
 * Provider d'authentification
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialisation au montage du composant
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialiser l'authentification au démarrage
   */
  const initializeAuth = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const user = await authService.initialize();
      
      if (user) {
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: {
            user: authService.getCurrentUser(),
            role: authService.getCurrentUserRole()
          }
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Erreur lors de l\'initialisation de l\'authentification'
      });
    }
  };

  /**
   * Connecter un utilisateur
   */
  const login = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await authService.login();
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: {
            user: result.user,
            role: result.role
          }
        });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.error || 'Erreur de connexion'
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la connexion';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Déconnecter l'utilisateur
   */
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await authService.logout();
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.error || 'Erreur de déconnexion'
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la déconnexion';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Rafraîchir le rôle utilisateur
   */
  const refreshUserRole = async () => {
    if (!state.user) return;

    try {
      await authService.refreshUserRole();
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          user: authService.getCurrentUser(),
          role: authService.getCurrentUserRole()
        }
      });
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du rôle:', error);
    }
  };

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  /**
   * Vérifier si l'utilisateur a l'un des rôles spécifiés
   */
  const hasAnyRole = (roles) => {
    return authService.hasAnyRole(roles);
  };

  /**
   * Obtenir les données spécifiques au rôle
   */
  const getRoleSpecificData = () => {
    return authService.getRoleSpecificData();
  };

  /**
   * Vérifier l'accès à un élève
   */
  const canAccessStudent = (studentId) => {
    return authService.canAccessStudent(studentId);
  };

  // Valeur du context
  const contextValue = {
    // État
    user: state.user,
    userRole: state.userRole,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    logout,
    refreshUserRole,
    
    // Utilitaires
    hasRole,
    hasAnyRole,
    getRoleSpecificData,
    canAccessStudent,
    
    // Raccourcis pour les rôles
    isAdmin: () => authService.isAdmin(),
    isTeacher: () => authService.isTeacher(),
    isParent: () => authService.isParent(),
    canAccessAdmin: () => authService.canAccessAdmin(),
    
    // Statut
    isAuthenticated: !!state.user && !state.loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour utiliser le context d'authentification
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}

/**
 * Composant pour protéger les routes selon les rôles
 */
export function ProtectedRoute({ children, allowedRoles = [], fallback = null }) {
  const { userRole, loading, isAuthenticated } = useAuth();

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner">Chargement...</div>
      </div>
    );
  }

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Connexion requise</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  // Vérifier les permissions de rôle
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      fallback || (
        <div className="access-denied">
          <h2>Accès refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      )
    );
  }

  return children;
}

/**
 * Composant pour afficher du contenu selon le rôle
 */
export function RoleBasedComponent({ allowedRoles = [], children, fallback = null }) {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated || !allowedRoles.includes(userRole)) {
    return fallback;
  }

  return children;
}

// Export du context pour utilisation avancée
export { AuthContext }; 