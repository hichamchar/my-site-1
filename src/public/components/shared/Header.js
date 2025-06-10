/**
 * Header Component - École Management System
 * Header principal avec informations utilisateur et déconnexion
 */

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider.js';

const Header = ({ onToggleSidebar, currentPage }) => {
  const { user, userRole, logout, isAdmin, isTeacher, isParent } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /**
   * Gérer la déconnexion
   */
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // La redirection sera gérée par le AuthProvider
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoggingOut(false);
      setShowUserMenu(false);
    }
  };

  /**
   * Obtenir le titre de la page actuelle
   */
  const getPageTitle = () => {
    const pageTitles = {
      dashboard: 'Tableau de bord',
      students: 'Gestion des élèves',
      teachers: 'Gestion des enseignants',
      classes: 'Gestion des classes',
      attendance: 'Présences',
      grades: 'Notes et évaluations',
      messages: 'Messagerie',
      reports: 'Rapports',
      settings: 'Paramètres',
      'my-classes': 'Mes classes',
      children: 'Mes enfants',
      homework: 'Devoirs',
      calendar: 'Calendrier'
    };

    return pageTitles[currentPage] || 'École Management System';
  };

  /**
   * Obtenir les informations utilisateur à afficher
   */
  const getUserDisplayInfo = () => {
    if (isAdmin()) {
      return {
        name: user?.name || 'Administrateur',
        subtitle: 'Administration',
        avatar: '👨‍💼'
      };
    }

    if (isTeacher()) {
      const teacherData = user?.teacherData;
      return {
        name: teacherData ? `${teacherData.FirstName} ${teacherData.LastName}` : user?.name || 'Enseignant',
        subtitle: teacherData?.Subjects || 'Enseignant',
        avatar: '👩‍🏫'
      };
    }

    if (isParent()) {
      const parentData = user?.parentData;
      const childrenCount = user?.children?.length || 0;
      return {
        name: parentData ? `${parentData.FirstName} ${parentData.LastName}` : user?.name || 'Parent',
        subtitle: `Parent de ${childrenCount} enfant${childrenCount > 1 ? 's' : ''}`,
        avatar: '👨‍👩‍👧‍👦'
      };
    }

    return {
      name: user?.name || user?.email || 'Utilisateur',
      subtitle: 'Utilisateur',
      avatar: '👤'
    };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Bouton menu mobile */}
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Ouvrir/fermer le menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Logo et titre */}
        <div className="header-brand">
          <div className="brand-logo">🏫</div>
          <div className="brand-text">
            <h1 className="brand-title">École Management</h1>
            <span className="page-title">{getPageTitle()}</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        {/* Barre de recherche rapide (placeholder) */}
        <div className="header-search">
          <input 
            type="text" 
            placeholder="Recherche rapide..." 
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-notifications">
          <button className="notification-btn" title="Notifications">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
        </div>

        {/* Menu utilisateur */}
        <div className="header-user">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Menu utilisateur"
          >
            <div className="user-avatar">{userInfo.avatar}</div>
            <div className="user-info">
              <span className="user-name">{userInfo.name}</span>
              <span className="user-role">{userInfo.subtitle}</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {/* Menu déroulant utilisateur */}
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">{userInfo.avatar}</div>
                <div className="user-details">
                  <strong>{userInfo.name}</strong>
                  <span>{userInfo.subtitle}</span>
                  <small>{user?.email}</small>
                </div>
              </div>

              <div className="user-dropdown-menu">
                <button className="dropdown-item">
                  <span className="item-icon">👤</span>
                  <span className="item-text">Mon profil</span>
                </button>

                <button className="dropdown-item">
                  <span className="item-icon">⚙️</span>
                  <span className="item-text">Préférences</span>
                </button>

                <button className="dropdown-item">
                  <span className="item-icon">❓</span>
                  <span className="item-text">Aide</span>
                </button>

                <div className="dropdown-divider"></div>

                <button 
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <span className="item-icon">🚪</span>
                  <span className="item-text">
                    {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay pour fermer le menu utilisateur */}
      {showUserMenu && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header; 