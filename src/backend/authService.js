/**
 * Authentication Service - École Management System
 * Service de gestion de l'authentification et des rôles utilisateur
 */

import wixAuth from 'wix-auth-frontend';
import GoogleSheetsService from './googleSheetsService.js';

class AuthService {
  constructor() {
    this.googleSheets = new GoogleSheetsService();
    this.currentUser = null;
    this.currentUserRole = null;
    
    // Rôles disponibles dans l'application
    this.roles = {
      ADMIN: 'admin',
      TEACHER: 'teacher', 
      PARENT: 'parent'
    };
  }

  /**
   * Initialiser le service d'authentification
   */
  async initialize() {
    try {
      // Vérifier si l'utilisateur est déjà connecté
      const user = await wixAuth.currentUser();
      if (user) {
        await this.setCurrentUser(user);
      }
      return this.currentUser;
    } catch (error) {
      console.error('Erreur initialisation auth:', error);
      return null;
    }
  }

  /**
   * Connecter un utilisateur
   */
  async login() {
    try {
      const user = await wixAuth.login();
      await this.setCurrentUser(user);
      return {
        success: true,
        user: this.currentUser,
        role: this.currentUserRole
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  async logout() {
    try {
      await wixAuth.logout();
      this.currentUser = null;
      this.currentUserRole = null;
      return { success: true };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Définir l'utilisateur actuel et déterminer son rôle
   */
  async setCurrentUser(user) {
    this.currentUser = user;
    this.currentUserRole = await this.determineUserRole(user);
  }

  /**
   * Déterminer le rôle d'un utilisateur basé sur son email
   */
  async determineUserRole(user) {
    if (!user || !user.email) {
      return null;
    }

    try {
      const email = user.email.toLowerCase();

      // Vérifier si c'est un administrateur (par email ou configuration)
      if (this.isAdminEmail(email)) {
        return this.roles.ADMIN;
      }

      // Vérifier si c'est un enseignant
      const teachers = await this.googleSheets.getTeachers();
      const teacher = teachers.find(t => t.Email && t.Email.toLowerCase() === email);
      if (teacher) {
        // Stocker les informations de l'enseignant
        this.currentUser.teacherData = teacher;
        return this.roles.TEACHER;
      }

      // Vérifier si c'est un parent
      const parent = await this.googleSheets.getParentByEmail(email);
      if (parent) {
        // Stocker les informations du parent et de ses enfants
        this.currentUser.parentData = parent;
        this.currentUser.children = await this.googleSheets.getStudentsByParentId(parent.ID);
        return this.roles.PARENT;
      }

      // Utilisateur non reconnu
      console.warn('Utilisateur non trouvé dans la base de données:', email);
      return null;

    } catch (error) {
      console.error('Erreur lors de la détermination du rôle:', error);
      return null;
    }
  }

  /**
   * Vérifier si un email correspond à un administrateur
   */
  isAdminEmail(email) {
    // Liste des emails administrateurs (à configurer selon l'école)
    const adminEmails = [
      'admin@ecole.fr',
      'direction@ecole.fr',
      'secretariat@ecole.fr'
    ];
    
    return adminEmails.includes(email.toLowerCase());
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Obtenir le rôle de l'utilisateur actuel
   */
  getCurrentUserRole() {
    return this.currentUserRole;
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  hasRole(role) {
    return this.currentUserRole === role;
  }

  /**
   * Vérifier si l'utilisateur a l'un des rôles spécifiés
   */
  hasAnyRole(roles) {
    return roles.includes(this.currentUserRole);
  }

  /**
   * Vérifier si l'utilisateur est administrateur
   */
  isAdmin() {
    return this.hasRole(this.roles.ADMIN);
  }

  /**
   * Vérifier si l'utilisateur est enseignant
   */
  isTeacher() {
    return this.hasRole(this.roles.TEACHER);
  }

  /**
   * Vérifier si l'utilisateur est parent
   */
  isParent() {
    return this.hasRole(this.roles.PARENT);
  }

  /**
   * Vérifier si l'utilisateur peut accéder aux fonctions administratives
   */
  canAccessAdmin() {
    return this.hasAnyRole([this.roles.ADMIN, this.roles.TEACHER]);
  }

  /**
   * Obtenir les données spécifiques selon le rôle
   */
  getRoleSpecificData() {
    switch (this.currentUserRole) {
      case this.roles.TEACHER:
        return this.currentUser.teacherData;
      case this.roles.PARENT:
        return {
          parentData: this.currentUser.parentData,
          children: this.currentUser.children
        };
      default:
        return null;
    }
  }

  /**
   * Vérifier si l'utilisateur peut voir les données d'un élève
   */
  canAccessStudent(studentId) {
    // Admin et enseignants peuvent voir tous les élèves
    if (this.canAccessAdmin()) {
      return true;
    }

    // Parents peuvent seulement voir leurs propres enfants
    if (this.isParent() && this.currentUser.children) {
      return this.currentUser.children.some(child => child.ID === studentId);
    }

    return false;
  }

  /**
   * Vérifier si l'utilisateur peut envoyer un message à un destinataire
   */
  canMessageUser(recipientId, recipientRole) {
    // Admin peut écrire à tout le monde
    if (this.isAdmin()) {
      return true;
    }

    // Enseignants peuvent écrire aux parents et autres enseignants
    if (this.isTeacher()) {
      return recipientRole === this.roles.PARENT || recipientRole === this.roles.TEACHER;
    }

    // Parents peuvent écrire aux enseignants et admin
    if (this.isParent()) {
      return recipientRole === this.roles.TEACHER || recipientRole === this.roles.ADMIN;
    }

    return false;
  }

  /**
   * Obtenir le statut de connexion
   */
  getAuthStatus() {
    return {
      isAuthenticated: !!this.currentUser,
      user: this.currentUser,
      role: this.currentUserRole,
      roleData: this.getRoleSpecificData()
    };
  }

  /**
   * Forcer la re-détermination du rôle (utile après mise à jour des données)
   */
  async refreshUserRole() {
    if (this.currentUser) {
      await this.setCurrentUser(this.currentUser);
    }
  }
}

// Export de l'instance singleton
const authService = new AuthService();
export default authService; 