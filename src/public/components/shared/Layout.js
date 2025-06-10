/**
 * Layout Component - École Management System
 * Layout principal avec navigation responsive et gestion des rôles
 */

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider.js';
import Navigation from './Navigation.js';
import Header from './Header.js';

const Layout = ({ children, currentPage = 'dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Afficher un loader pendant l'initialisation
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="school-logo">🏫</div>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h2>École Management System</h2>
          <p>Initialisation en cours...</p>
        </div>
      </div>
    );
  }

  // Afficher la page de login si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="login-layout">
        <div className="login-container">
          <div className="school-branding">
            <div className="school-logo">🏫</div>
            <h1>École Management System</h1>
            <p>Plateforme de gestion scolaire</p>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Header principal */}
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
      />

      {/* Container principal */}
      <div className="main-container">
        {/* Sidebar de navigation */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Navigation 
            currentPage={currentPage}
            onPageChange={() => setSidebarOpen(false)} // Fermer sidebar sur mobile après navigation
          />
        </aside>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenu principal */}
        <main className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <p>&copy; 2024 École Management System</p>
          </div>
          <div className="footer-section">
            <span className="footer-links">
              <a href="#help">Aide</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Confidentialité</a>
            </span>
          </div>
          <div className="footer-section">
            <span className="version">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 