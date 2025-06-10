// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// École Management System - Main Application Page

// Note: Wix modules will be imported when available
// For now, we'll use a simplified approach for testing

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
    // Pour le développement, on simule différents états d'authentification
    // Dans la version finale, ceci utilisera les vraies APIs Wix
    
    // Simulation: vérifier s'il y a un utilisateur en session
    const simulatedUser = getSimulatedUser();
    
    if (simulatedUser) {
      currentUser = simulatedUser;
      userRole = determineUserRole(currentUser);
      
      console.log('Utilisateur simulé connecté:', currentUser.id, 'Rôle:', userRole);
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

// Fonction temporaire pour simuler un utilisateur (à remplacer par Wix Auth)
function getSimulatedUser() {
  // Vérifier s'il y a un utilisateur stocké localement (simulation)
  if (typeof(Storage) !== "undefined") {
    const storedUser = localStorage.getItem('ecole_sim_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  }
  return null;
}

// Fonction temporaire pour simuler une connexion
function simulateLogin() {
  return new Promise((resolve, reject) => {
    // Simuler un délai de connexion
    setTimeout(() => {
      // Créer un utilisateur simulé avec différents rôles possibles
      const roles = ['admin', 'teacher', 'parent'];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      
      const simulatedUser = {
        id: `user_${randomRole}_${Date.now()}`,
        role: randomRole,
        email: `${randomRole}@ecole-demo.com`,
        name: `${randomRole.charAt(0).toUpperCase() + randomRole.slice(1)} Demo`
      };
      
      resolve(simulatedUser);
    }, 1000);
  });
}

// Fonction temporaire pour simuler une déconnexion
function simulateLogout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

// Fonction pour déterminer le rôle de l'utilisateur
function determineUserRole(user) {
  // Si l'utilisateur simulé a déjà un rôle, l'utiliser
  if (user && user.role) {
    return user.role;
  }
  
  // Logique de fallback basée sur l'ID utilisateur
  if (user && user.id) {
    const userId = user.id;
    if (userId.includes('admin')) {
      return 'admin';
    } else if (userId.includes('teacher')) {
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
    $w('#userWelcome').text = `Bienvenue, ${currentUser?.name || currentUser?.id || 'Utilisateur'}`;
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
    
    // Simulation de connexion (à remplacer par vraie auth Wix)
    simulateLogin()
      .then((user) => {
        console.log('Connexion simulée réussie:', user);
        currentUser = user;
        userRole = determineUserRole(user);
        
        // Stocker l'utilisateur simulé
        if (typeof(Storage) !== "undefined") {
          localStorage.setItem('ecole_sim_user', JSON.stringify(user));
        }
        
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
    simulateLogout()
      .then(() => {
        console.log('Déconnexion simulée réussie');
        currentUser = null;
        userRole = null;
        currentPage = 'dashboard';
        
        // Supprimer l'utilisateur du stockage local
        if (typeof(Storage) !== "undefined") {
          localStorage.removeItem('ecole_sim_user');
        }
        
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
