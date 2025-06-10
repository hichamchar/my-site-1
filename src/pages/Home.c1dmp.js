// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// École Management System - Main Application Page

import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from '../public/components/auth/AuthProvider.js';
import Layout from '../public/components/shared/Layout.js';
import AdminDashboard from '../public/components/dashboards/AdminDashboard.js';
import ParentDashboard from '../public/components/dashboards/ParentDashboard.js';
import MessageCenter from '../public/components/messaging/MessageCenter.js';

// Application principale
function SchoolApp() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

// Routeur simple basé sur les rôles
function AppRouter() {
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  
  // Hook d'authentification
  const { isAuthenticated, userRole, loading } = React.useContext(
    React.createContext() // Sera remplacé par useAuth()
  );

  // Fonction pour changer de page
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    
    // Mettre à jour l'URL si nécessaire
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', `#${pageId}`);
    }
  };

  // Rendu conditionnel selon l'état d'authentification
  const renderPage = () => {
    if (!isAuthenticated) {
      return <LoginForm />;
    }

    switch (currentPage) {
      case 'dashboard':
        return userRole === 'parent' ? <ParentDashboard /> : <AdminDashboard />;
      
      case 'messages':
        return <MessageCenter />;
      
      // Autres pages à implémenter
      case 'students':
        return <div>Page gestion des élèves (à implémenter)</div>;
      
      case 'attendance':
        return <div>Page présences (à implémenter)</div>;
      
      case 'grades':
        return <div>Page notes (à implémenter)</div>;
      
      default:
        return userRole === 'parent' ? <ParentDashboard /> : <AdminDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderPage()}
    </Layout>
  );
}

// Composant de connexion simple
function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  
  const handleLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      // Utiliser le contexte d'authentification pour se connecter
      console.log('Tentative de connexion...');
      // await login(); // Sera implémenté avec useAuth
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-form">
      <div className="login-card">
        <h2>Connexion</h2>
        <p>Connectez-vous à votre espace École Management System</p>
        
        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="login-button"
        >
          {isLoggingIn ? 'Connexion en cours...' : 'Se connecter avec Wix'}
        </button>
        
        <div className="login-info">
          <h3>Types de comptes :</h3>
          <ul>
            <li><strong>Administrateurs :</strong> Gestion complète de l'école</li>
            <li><strong>Enseignants :</strong> Gestion des classes et élèves</li>
            <li><strong>Parents :</strong> Suivi des enfants</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

$w.onReady(function () {
  console.log('École Management System - Initialisation');
  
  // Monter l'application React
  const appContainer = $w('#reactApp');
  if (appContainer && appContainer.html) {
    // Créer un conteneur pour React
    appContainer.html = '<div id="school-app-root"></div>';
    
    // Attendre que le DOM soit prêt
    setTimeout(() => {
      const rootElement = document.getElementById('school-app-root');
      if (rootElement) {
        ReactDOM.render(<SchoolApp />, rootElement);
      } else {
        console.error('Conteneur React non trouvé');
      }
    }, 100);
  } else {
    console.error('Élément #reactApp non trouvé sur la page');
  }
  
  // Gestion de la navigation par URL
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      console.log('Navigation vers:', hash);
      // Notifier le routeur du changement de page
    }
  });
  
  // Gestion des erreurs globales
  window.addEventListener('error', (event) => {
    console.error('Erreur application:', event.error);
  });
  
  console.log('Application initialisée avec succès');
});
