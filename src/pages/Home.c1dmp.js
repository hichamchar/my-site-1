// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// École Management System - Main Application Page

// Note: Wix modules will be imported when available
// For now, we'll use a simplified approach for testing

// Variables globales pour l'état de l'application
let currentUser = null;
let userRole = null;
let currentPage = 'dashboard';
let registrationData = {};

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
    $w('#section2').hide(); // Login Section
    $w('#section3').hide(); // Dashboard Section
    $w('#section4').hide(); // Registration Section (nested in section3)
    // $w('#loadingSection').show(); // Will add this as a new section
    console.log('Sections organisées: section2=Login, section3=Dashboard, section4=Registration');
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
    $w('#section3').hide(); // Dashboard
    $w('#section4').hide(); // Registration
    $w('#section2').show(); // Login
    
    // Mettre à jour les textes de connexion si les éléments existent
    try {
      $w('#loginTitle').text = 'École Management System';
      $w('#loginSubtitle').text = 'Connectez-vous pour accéder à votre espace';
      $w('#loginButton').label = 'Se connecter';
      $w('#loginError').hide();
    } catch (e) {
      console.log('Éléments de login non encore créés dans l\'éditeur');
    }
    
    console.log('✅ Section Login affichée (section2)');
    
  } catch (error) {
    console.error('Erreur affichage formulaire de connexion:', error);
  }
}

// Fonction pour afficher le dashboard
function showDashboard() {
  try {
    $w('#section2').hide(); // Login
    $w('#section4').hide(); // Registration
    $w('#section3').show(); // Dashboard
    
    // Mettre à jour les informations utilisateur si les éléments existent
    try {
      $w('#userWelcome').text = `Bienvenue, ${currentUser?.name || currentUser?.id || 'Utilisateur'}`;
      $w('#userRole').text = getRoleDisplayName(userRole);
    } catch (e) {
      console.log('Éléments de dashboard non encore créés dans l\'éditeur');
    }
    
    // Charger le contenu selon le rôle
    loadDashboardContent();
    
    console.log('✅ Section Dashboard affichée (section3) pour le rôle:', userRole);
    
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

export function navRegistration_click(event) {
  console.log('Navigation vers Inscription');
  currentPage = 'registration';
  showRegistrationForm();
}

// === FONCTIONNALITÉS D'INSCRIPTION ===

// Fonction pour afficher le formulaire d'inscription
function showRegistrationForm() {
  try {
    // Masquer les autres sections
    $w('#section2').hide(); // Login
    $w('#section3').hide(); // Dashboard
    
    // Afficher la section inscription (nested dans section3)
    $w('#section3').show(); // Montrer le parent d'abord
    $w('#section4').show(); // Puis montrer l'inscription
    
    // Adapter l'interface selon le rôle
    setupRegistrationForm();
    
    console.log('✅ Formulaire d\'inscription affiché (section4) pour:', userRole);
    
  } catch (error) {
    console.error('Erreur affichage formulaire inscription:', error);
  }
}

// Configuration du formulaire d'inscription selon le rôle
function setupRegistrationForm() {
  try {
    // Informations utilisateur (si les éléments existent)
    try {
      $w('#regCurrentUserName').text = currentUser?.name || 'Utilisateur';
      $w('#regCurrentUserRole').text = getRoleDisplayName(userRole);
    } catch (e) {
      console.log('Éléments utilisateur de registration non encore créés');
    }
    
    if (userRole === 'parent') {
      setupParentRegistration();
    } else if (userRole === 'admin' || userRole === 'teacher') {
      setupAdminRegistration();
    }
    
    // Réinitialiser le formulaire
    clearRegistrationForm();
    
    console.log('📝 Formulaire d\'inscription configuré pour:', getRoleDisplayName(userRole));
    
  } catch (error) {
    console.error('Erreur configuration formulaire:', error);
  }
}

// Configuration pour les parents
function setupParentRegistration() {
  try {
    $w('#regPageTitle').text = 'Inscription de votre enfant';
    $w('#regPageSubtitle').text = 'Remplissez le formulaire ci-dessous pour inscrire votre enfant à l\'école';
    
    // Masquer les champs administratifs
    $w('#regAdminFields').hide();
    
    // Pré-remplir l'email parent
    if (currentUser.email) {
      $w('#regParentEmail').value = currentUser.email;
    }
    
    console.log('Configuration parent terminée');
    
  } catch (error) {
    console.error('Erreur configuration parent:', error);
  }
}

// Configuration pour admin/enseignants
function setupAdminRegistration() {
  try {
    $w('#regPageTitle').text = 'Inscription d\'un nouvel élève';
    $w('#regPageSubtitle').text = 'Formulaire d\'inscription administrative';
    
    // Afficher tous les champs administratifs
    $w('#regAdminFields').show();
    
    // Charger les listes déroulantes
    loadRegistrationData();
    
    console.log('Configuration admin terminée');
    
  } catch (error) {
    console.error('Erreur configuration admin:', error);
  }
}

// Charger les données pour l'inscription
function loadRegistrationData() {
  try {
    // Charger la liste des classes
    const classes = [
      { value: 'CP', label: 'CP - Cours Préparatoire' },
      { value: 'CE1', label: 'CE1 - Cours Élémentaire 1' },
      { value: 'CE2', label: 'CE2 - Cours Élémentaire 2' },
      { value: 'CM1', label: 'CM1 - Cours Moyen 1' },
      { value: 'CM2', label: 'CM2 - Cours Moyen 2' }
    ];
    
    $w('#regStudentClass').options = classes;
    
    // Charger la liste des parents existants (pour admin)
    const parents = [
      { value: 'parent1', label: 'Dupont, Marie - marie.dupont@email.com' },
      { value: 'parent2', label: 'Martin, Pierre - pierre.martin@email.com' },
      { value: 'new', label: '+ Nouveau parent' }
    ];
    
    $w('#regExistingParent').options = parents;
    
    console.log('Données d\'inscription chargées');
    
  } catch (error) {
    console.error('Erreur chargement données:', error);
  }
}

// Fonction pour vider le formulaire d'inscription
function clearRegistrationForm() {
  try {
    // Champs élève
    $w('#regStudentFirstName').value = '';
    $w('#regStudentLastName').value = '';
    $w('#regStudentDateOfBirth').value = null;
    $w('#regStudentGender').value = '';
    $w('#regStudentAddress').value = '';
    $w('#regStudentPhone').value = '';
    
    // Champs parent (si admin)
    if (userRole !== 'parent') {
      $w('#regParentFirstName').value = '';
      $w('#regParentLastName').value = '';
      $w('#regParentEmail').value = '';
      $w('#regParentPhone').value = '';
      $w('#regParentAddress').value = '';
    }
    
    // Autres champs
    $w('#regStudentClass').value = '';
    $w('#regPreviousSchool').value = '';
    $w('#regMedicalInfo').value = '';
    $w('#regEmergencyContact').value = '';
    
    // Masquer les messages
    $w('#regSuccessMessage').hide();
    $w('#regErrorMessage').hide();
    
  } catch (error) {
    console.log('Nettoyage formulaire - certains champs non trouvés');
  }
}

// Gestionnaire pour le bouton de soumission de l'inscription
export function submitRegistration_click(event) {
  console.log('=== SOUMISSION INSCRIPTION ===');
  
  try {
    // Valider le formulaire
    if (!validateRegistrationForm()) {
      showRegistrationError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    // Collecter les données
    const formData = collectRegistrationData();
    
    // Soumettre
    submitRegistrationData(formData);
    
  } catch (error) {
    console.error('Erreur soumission inscription:', error);
    showRegistrationError('Une erreur est survenue lors de la soumission');
  }
}

// Validation du formulaire d'inscription
function validateRegistrationForm() {
  let isValid = true;
  
  try {
    // Champs requis
    const firstName = $w('#regStudentFirstName').value;
    const lastName = $w('#regStudentLastName').value;
    const dateOfBirth = $w('#regStudentDateOfBirth').value;
    
    if (!firstName || firstName.length < 2) {
      $w('#regStudentFirstName').style.borderColor = '#f44336';
      isValid = false;
    } else {
      $w('#regStudentFirstName').style.borderColor = '#4CAF50';
    }
    
    if (!lastName || lastName.length < 2) {
      $w('#regStudentLastName').style.borderColor = '#f44336';
      isValid = false;
    } else {
      $w('#regStudentLastName').style.borderColor = '#4CAF50';
    }
    
    if (!dateOfBirth || new Date(dateOfBirth) >= new Date()) {
      $w('#regStudentDateOfBirth').style.borderColor = '#f44336';
      isValid = false;
    } else {
      $w('#regStudentDateOfBirth').style.borderColor = '#4CAF50';
    }
    
    // Validation email parent (si nécessaire)
    if (userRole !== 'parent') {
      const parentEmail = $w('#regParentEmail').value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!parentEmail || !emailRegex.test(parentEmail)) {
        $w('#regParentEmail').style.borderColor = '#f44336';
        isValid = false;
      } else {
        $w('#regParentEmail').style.borderColor = '#4CAF50';
      }
    }
    
  } catch (error) {
    console.error('Erreur validation:', error);
    isValid = false;
  }
  
  return isValid;
}

// Collecter les données du formulaire
function collectRegistrationData() {
  try {
    const data = {
      student: {
        firstName: $w('#regStudentFirstName').value,
        lastName: $w('#regStudentLastName').value,
        dateOfBirth: $w('#regStudentDateOfBirth').value,
        gender: $w('#regStudentGender').value,
        address: $w('#regStudentAddress').value,
        phone: $w('#regStudentPhone').value,
        class: $w('#regStudentClass').value,
        previousSchool: $w('#regPreviousSchool').value,
        medicalInfo: $w('#regMedicalInfo').value,
        emergencyContact: $w('#regEmergencyContact').value
      },
      parent: {},
      submittedBy: currentUser.id,
      submittedByRole: userRole,
      submissionDate: new Date().toISOString()
    };
    
    // Données parent selon le rôle
    if (userRole === 'parent') {
      data.parent = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name
      };
    } else {
      data.parent = {
        firstName: $w('#regParentFirstName').value,
        lastName: $w('#regParentLastName').value,
        email: $w('#regParentEmail').value,
        phone: $w('#regParentPhone').value,
        address: $w('#regParentAddress').value
      };
    }
    
    return data;
    
  } catch (error) {
    console.error('Erreur collecte données:', error);
    throw error;
  }
}

// Soumettre les données d'inscription
function submitRegistrationData(data) {
  try {
    // Désactiver le bouton
    $w('#regSubmitButton').disable();
    $w('#regSubmitButton').label = 'Inscription en cours...';
    
    console.log('Données inscription:', JSON.stringify(data, null, 2));
    
    // Simulation de soumission (sera remplacé par Google Sheets)
    setTimeout(() => {
      try {
        console.log('✅ Inscription réussie!');
        console.log('Élève:', data.student.firstName, data.student.lastName);
        console.log('Classe:', data.student.class);
        
        showRegistrationSuccess('Inscription enregistrée avec succès !');
        clearRegistrationForm();
        
      } catch (error) {
        console.error('Erreur traitement:', error);
        showRegistrationError('Erreur lors de l\'enregistrement');
      } finally {
        // Réactiver le bouton
        $w('#regSubmitButton').enable();
        $w('#regSubmitButton').label = 'Confirmer l\'inscription';
      }
    }, 2000);
    
  } catch (error) {
    console.error('Erreur soumission:', error);
    showRegistrationError('Erreur lors de la soumission');
  }
}

// Afficher message de succès
function showRegistrationSuccess(message) {
  try {
    $w('#regErrorMessage').hide();
    $w('#regSuccessMessage').text = message;
    $w('#regSuccessMessage').show();
    
    // Actions suivantes selon le rôle
    if (userRole === 'parent') {
      console.log('📧 Confirmation par email sera envoyée');
    } else {
      console.log('👤 Élève ajouté au système');
    }
    
  } catch (error) {
    console.log('✅ SUCCÈS:', message);
  }
}

// Afficher message d'erreur
function showRegistrationError(message) {
  try {
    $w('#regSuccessMessage').hide();
    $w('#regErrorMessage').text = message;
    $w('#regErrorMessage').show();
  } catch (error) {
    console.log('❌ ERREUR:', message);
  }
}

// Gestionnaire pour retourner au dashboard
export function backToDashboard_click(event) {
  console.log('Retour au dashboard');
  currentPage = 'dashboard';
  showDashboard();
}

// Gestionnaire pour nouvelle inscription
export function newRegistration_click(event) {
  console.log('Nouvelle inscription');
  clearRegistrationForm();
  setupRegistrationForm();
}
