/**
 * Navigation Component - École Management System
 * Navigation avec menus adaptés selon les rôles utilisateur
 */

import React from 'react';
import { useAuth } from '../auth/AuthProvider.js';

const Navigation = ({ currentPage, onPageChange }) => {
  const { userRole, isAdmin, isTeacher, isParent, user } = useAuth();

  /**
   * Gérer le clic sur un élément de navigation
   */
  const handleNavClick = (pageId, event) => {
    event.preventDefault();
    
    // Appeler la fonction de changement de page
    if (onPageChange) {
      onPageChange(pageId);
    }
    
    // Ici vous pourrez ajouter la logique de routage
    console.log('Navigation vers:', pageId);
  };

  /**
   * Obtenir les éléments de navigation selon le rôle
   */
  const getNavigationItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        label: 'Tableau de bord',
        icon: '📊',
        path: '/dashboard'
      }
    ];

    if (isAdmin()) {
      return [
        ...baseItems,
        {
          id: 'students',
          label: 'Gestion des élèves',
          icon: '👨‍🎓',
          path: '/students',
          submenu: [
            { id: 'students-list', label: 'Liste des élèves', path: '/students' },
            { id: 'students-add', label: 'Ajouter un élève', path: '/students/add' },
            { id: 'students-import', label: 'Importer des élèves', path: '/students/import' }
          ]
        },
        {
          id: 'teachers',
          label: 'Gestion des enseignants',
          icon: '👩‍🏫',
          path: '/teachers',
          submenu: [
            { id: 'teachers-list', label: 'Liste des enseignants', path: '/teachers' },
            { id: 'teachers-add', label: 'Ajouter un enseignant', path: '/teachers/add' }
          ]
        },
        {
          id: 'classes',
          label: 'Gestion des classes',
          icon: '🏫',
          path: '/classes',
          submenu: [
            { id: 'classes-list', label: 'Liste des classes', path: '/classes' },
            { id: 'classes-add', label: 'Créer une classe', path: '/classes/add' },
            { id: 'classes-assign', label: 'Assignations', path: '/classes/assign' }
          ]
        },
        {
          id: 'attendance',
          label: 'Présences',
          icon: '📝',
          path: '/attendance',
          submenu: [
            { id: 'attendance-daily', label: 'Présences du jour', path: '/attendance/daily' },
            { id: 'attendance-history', label: 'Historique', path: '/attendance/history' },
            { id: 'attendance-reports', label: 'Rapports', path: '/attendance/reports' }
          ]
        },
        {
          id: 'grades',
          label: 'Notes et évaluations',
          icon: '📚',
          path: '/grades',
          submenu: [
            { id: 'grades-entry', label: 'Saisie des notes', path: '/grades/entry' },
            { id: 'grades-reports', label: 'Bulletins', path: '/grades/reports' },
            { id: 'grades-analysis', label: 'Analyses', path: '/grades/analysis' }
          ]
        },
        {
          id: 'messages',
          label: 'Messagerie',
          icon: '✉️',
          path: '/messages'
        },
        {
          id: 'reports',
          label: 'Rapports',
          icon: '📈',
          path: '/reports',
          submenu: [
            { id: 'reports-attendance', label: 'Rapports de présence', path: '/reports/attendance' },
            { id: 'reports-grades', label: 'Rapports de notes', path: '/reports/grades' },
            { id: 'reports-parents', label: 'Communication parents', path: '/reports/parents' }
          ]
        },
        {
          id: 'settings',
          label: 'Paramètres',
          icon: '⚙️',
          path: '/settings',
          submenu: [
            { id: 'settings-school', label: 'Informations école', path: '/settings/school' },
            { id: 'settings-users', label: 'Gestion utilisateurs', path: '/settings/users' },
            { id: 'settings-backup', label: 'Sauvegarde', path: '/settings/backup' }
          ]
        }
      ];
    }

    if (isTeacher()) {
      return [
        ...baseItems,
        {
          id: 'my-classes',
          label: 'Mes classes',
          icon: '🏫',
          path: '/my-classes'
        },
        {
          id: 'students',
          label: 'Mes élèves',
          icon: '👨‍🎓',
          path: '/students'
        },
        {
          id: 'attendance',
          label: 'Présences',
          icon: '📝',
          path: '/attendance',
          submenu: [
            { id: 'attendance-daily', label: 'Présences du jour', path: '/attendance/daily' },
            { id: 'attendance-history', label: 'Historique', path: '/attendance/history' }
          ]
        },
        {
          id: 'grades',
          label: 'Notes',
          icon: '📚',
          path: '/grades',
          submenu: [
            { id: 'grades-entry', label: 'Saisie des notes', path: '/grades/entry' },
            { id: 'grades-view', label: 'Consultation', path: '/grades/view' }
          ]
        },
        {
          id: 'messages',
          label: 'Messagerie',
          icon: '✉️',
          path: '/messages'
        },
        {
          id: 'homework',
          label: 'Devoirs',
          icon: '📝',
          path: '/homework'
        }
      ];
    }

    if (isParent()) {
      return [
        ...baseItems,
        {
          id: 'children',
          label: 'Mes enfants',
          icon: '👨‍👩‍👧‍👦',
          path: '/children',
          submenu: user?.children?.map(child => ({
            id: `child-${child.ID}`,
            label: `${child.FirstName} ${child.LastName}`,
            path: `/children/${child.ID}`
          })) || []
        },
        {
          id: 'attendance',
          label: 'Présences',
          icon: '📊',
          path: '/attendance'
        },
        {
          id: 'grades',
          label: 'Notes',
          icon: '📚',
          path: '/grades'
        },
        {
          id: 'messages',
          label: 'Messagerie',
          icon: '✉️',
          path: '/messages'
        },
        {
          id: 'homework',
          label: 'Devoirs',
          icon: '📝',
          path: '/homework'
        },
        {
          id: 'calendar',
          label: 'Calendrier',
          icon: '📅',
          path: '/calendar'
        }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="main-navigation">
      {/* Profil utilisateur en haut */}
      <div className="nav-profile">
        <div className="profile-avatar">
          {userRole === 'admin' && '👨‍💼'}
          {userRole === 'teacher' && '👩‍🏫'}
          {userRole === 'parent' && '👨‍👩‍👧‍👦'}
        </div>
        <div className="profile-info">
          <div className="profile-name">
            {user?.name || user?.email?.split('@')[0]}
          </div>
          <div className="profile-role">
            {userRole === 'admin' && 'Administrateur'}
            {userRole === 'teacher' && 'Enseignant'}
            {userRole === 'parent' && 'Parent'}
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <ul className="nav-menu">
        {navigationItems.map(item => (
          <li key={item.id} className="nav-item">
            <a
              href={item.path}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={(e) => handleNavClick(item.id, e)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.submenu && <span className="nav-arrow">▼</span>}
            </a>
            
            {/* Sous-menu */}
            {item.submenu && (
              <ul className="nav-submenu">
                {item.submenu.map(subItem => (
                  <li key={subItem.id} className="nav-subitem">
                    <a
                      href={subItem.path}
                      className={`nav-sublink ${currentPage === subItem.id ? 'active' : ''}`}
                      onClick={(e) => handleNavClick(subItem.id, e)}
                    >
                      <span className="nav-sublabel">{subItem.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Raccourcis rapides en bas */}
      <div className="nav-shortcuts">
        <h4>Raccourcis</h4>
        <div className="shortcuts-grid">
          {isAdmin() && (
            <>
              <button 
                className="shortcut-btn"
                onClick={(e) => handleNavClick('students-add', e)}
                title="Ajouter un élève"
              >
                ➕👨‍🎓
              </button>
              <button 
                className="shortcut-btn"
                onClick={(e) => handleNavClick('attendance-daily', e)}
                title="Présences du jour"
              >
                📝
              </button>
            </>
          )}
          
          {isTeacher() && (
            <>
              <button 
                className="shortcut-btn"
                onClick={(e) => handleNavClick('attendance-daily', e)}
                title="Prendre les présences"
              >
                📝
              </button>
              <button 
                className="shortcut-btn"
                onClick={(e) => handleNavClick('grades-entry', e)}
                title="Saisir des notes"
              >
                📚
              </button>
            </>
          )}
          
          <button 
            className="shortcut-btn"
            onClick={(e) => handleNavClick('messages', e)}
            title="Messages"
          >
            ✉️
          </button>
          
          {isParent() && (
            <button 
              className="shortcut-btn"
              onClick={(e) => handleNavClick('children', e)}
              title="Mes enfants"
            >
              👨‍👩‍👧‍👦
            </button>
          )}
        </div>
      </div>

      {/* Informations système */}
      <div className="nav-footer">
        <div className="system-status">
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span className="status-label">En ligne</span>
          </div>
          <div className="last-sync">
            Dernière sync: {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 