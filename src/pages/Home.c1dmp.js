// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// École Management System - Main Application Page

import wixAuth from 'wix-auth-frontend';

// Variables globales pour l'état de l'application
let currentUser = null;
let userRole = null;
let currentPage = 'dashboard';

// Initialisation de la page
$w.onReady(function () {
  console.log('École Management System - Initialisation');
  
  // Masquer tous les éléments au départ
  hideAllElements();
  
  // Initialiser l'authentification
  initializeAuth();
  
  console.log('Application initialisée avec succès');
});

// Fonction pour masquer tous les éléments
function hideAllElements() {
  // Masquer les sections qui ne sont pas encore nécessaires
  try {
    $w('#loginSection').hide();
    $w('#dashboardSection').hide();
    $w('#loadingSection').show();
  } catch (error) {
    console.log('Éléments de page non trouvés, utilisation de l\'affichage par défaut');
  }
}

// Fonction d'initialisation de l'authentification
async function initializeAuth() {
  try {
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = wixAuth.loggedIn();
    
    if (isLoggedIn) {
      // Récupérer les informations de l'utilisateur
      currentUser = await wixAuth.getCurrentUser();
      
      // Déterminer le rôle (temporaire - sera remplacé par la logique Google Sheets)
      userRole = determineUserRole(currentUser);
      
      console.log('Utilisateur connecté:', currentUser.name, 'Rôle:', userRole);
      
      // Afficher le dashboard approprié
      showDashboard();
    } else {
      // Afficher la page de connexion
      showLoginForm();
    }
  } catch (error) {
    console.error('Erreur d\'initialisation de l\'authentification:', error);
    showLoginForm();
  }
}

// Fonction pour déterminer le rôle de l'utilisateur
function determineUserRole(user) {
  // Logique temporaire - à remplacer par la vérification Google Sheets
  if (user.email) {
    if (user.email.includes('admin')) {
      return 'admin';
    } else if (user.email.includes('teacher') || user.email.includes('enseignant')) {
      return 'teacher';
    } else {
      return 'parent';
    }
  }
  return 'parent'; // Par défaut
}

// Fonction pour afficher le formulaire de connexion
function showLoginForm() {
  try {
    $w('#loadingSection').hide();
    $w('#dashboardSection').hide();
    $w('#loginSection').show();
    
    // Mettre à jour les textes de connexion
    $w('#loginTitle').text = 'École Management System';
    $w('#loginSubtitle').text = 'Connectez-vous pour accéder à votre espace';
    $w('#loginButton').label = 'Se connecter';
    
    // Masquer le message d'erreur
    $w('#loginError').hide();
    
  } catch (error) {
    console.error('Erreur affichage formulaire de connexion:', error);
  }
}

// Fonction pour afficher le dashboard
function showDashboard() {
  try {
    $w('#loadingSection').hide();
    $w('#loginSection').hide();
    $w('#dashboardSection').show();
    
    // Mettre à jour les informations utilisateur
    $w('#userWelcome').text = `Bienvenue, ${currentUser?.name || 'Utilisateur'}`;
    $w('#userRole').text = getRoleDisplayName(userRole);
    
    // Charger le contenu selon le rôle
    loadDashboardContent();
    
  } catch (error) {
    console.error('Erreur affichage dashboard:', error);
  }
}

// Fonction pour obtenir le nom d'affichage du rôle
function getRoleDisplayName(role) {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'teacher':
      return 'Enseignant';
    case 'parent':
      return 'Parent';
    default:
      return 'Utilisateur';
  }
}

// Fonction pour charger le contenu du dashboard
function loadDashboardContent() {
  try {
    if (userRole === 'parent') {
      loadParentDashboard();
    } else {
      loadAdminDashboard();
    }
  } catch (error) {
    console.error('Erreur chargement contenu dashboard:', error);
  }
}

// Fonction pour charger le dashboard parent
function loadParentDashboard() {
  try {
    // Afficher les sections appropriées pour les parents
    $w('#parentSection').show();
    $w('#adminSection').hide();
    
    // Données d'exemple - sera remplacé par Google Sheets
    $w('#childrenInfo').text = 'Emma (CE1) - Présent\nLucas (CM2) - Présent';
    $w('#recentMessages').text = 'M. Dupont: Réunion parents (10/06)\nMme Martin: Sortie scolaire (09/06)';
    $w('#attendanceStats').text = 'Emma: 95% de présence\nLucas: 92% de présence';
    
  } catch (error) {
    console.error('Erreur chargement dashboard parent:', error);
    // Fallback: afficher un message simple
    try {
      $w('#dashboardContent').text = 'Dashboard Parent - Données en cours de chargement...';
    } catch (e) {
      console.error('Impossible d\'afficher le contenu de fallback');
    }
  }
}

// Fonction pour charger le dashboard admin/enseignant
function loadAdminDashboard() {
  try {
    // Afficher les sections appropriées pour admin/enseignants
    $w('#adminSection').show();
    $w('#parentSection').hide();
    
    // Données d'exemple - sera remplacé par Google Sheets
    $w('#schoolStats').text = 'Élèves: 245\nEnseignants: 18\nClasses: 12';
    $w('#todayActivity').text = 'Présences: 94%\nMessages: 12 nouveaux\nAlertes: 2';
    $w('#quickActions').text = 'Actions rapides disponibles';
    
  } catch (error) {
    console.error('Erreur chargement dashboard admin:', error);
    // Fallback: afficher un message simple
    try {
      $w('#dashboardContent').text = `Dashboard ${getRoleDisplayName(userRole)} - Données en cours de chargement...`;
    } catch (e) {
      console.error('Impossible d\'afficher le contenu de fallback');
    }
  }
}

// Gestionnaire d'événement pour le bouton de connexion
export function loginButton_click(event) {
  console.log('Tentative de connexion...');
  
  try {
    // Désactiver le bouton pendant la connexion
    $w('#loginButton').disable();
    $w('#loginButton').label = 'Connexion en cours...';
    $w('#loginError').hide();
    
    // Déclencher la connexion Wix
    wixAuth.promptLogin()
      .then((user) => {
        console.log('Connexion réussie:', user);
        currentUser = user;
        userRole = determineUserRole(user);
        showDashboard();
      })
      .catch((error) => {
        console.error('Erreur de connexion:', error);
        
        // Réactiver le bouton et afficher l'erreur
        $w('#loginButton').enable();
        $w('#loginButton').label = 'Se connecter';
        
        $w('#loginError').text = 'Erreur de connexion. Veuillez réessayer.';
        $w('#loginError').show();
      });
      
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion:', error);
    
    // Réactiver le bouton
    try {
      $w('#loginButton').enable();
      $w('#loginButton').label = 'Se connecter';
    } catch (e) {
      console.error('Impossible de réactiver le bouton');
    }
  }
}

// Gestionnaire d'événement pour le bouton de déconnexion
export function logoutButton_click(event) {
  console.log('Déconnexion...');
  
  try {
    wixAuth.logout()
      .then(() => {
        console.log('Déconnexion réussie');
        currentUser = null;
        userRole = null;
        currentPage = 'dashboard';
        showLoginForm();
      })
      .catch((error) => {
        console.error('Erreur de déconnexion:', error);
      });
      
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
}

// Gestionnaires pour la navigation (à implémenter)
export function navDashboard_click(event) {
  console.log('Navigation vers Dashboard');
  currentPage = 'dashboard';
  loadDashboardContent();
}

export function navMessages_click(event) {
  console.log('Navigation vers Messages');
  currentPage = 'messages';
  // À implémenter
}

export function navStudents_click(event) {
  console.log('Navigation vers Élèves');
  currentPage = 'students';
  // À implémenter
}

export function navAttendance_click(event) {
  console.log('Navigation vers Présences');
  currentPage = 'attendance';
  // À implémenter
}

export function navGrades_click(event) {
  console.log('Navigation vers Notes');
  currentPage = 'grades';
  // À implémenter
}
