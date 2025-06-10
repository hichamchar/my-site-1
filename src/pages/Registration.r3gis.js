// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// École Management System - Page d'inscription des élèves

// Variables globales pour la gestion du formulaire
let currentUser = null;
let userRole = null;
let formData = {};
let isSubmitting = false;

// Initialisation de la page
$w.onReady(function () {
  console.log('Page d\'inscription - Initialisation');
  
  // Vérifier l'authentification utilisateur
  checkUserAuthentication();
  
  // Initialiser le formulaire
  initializeForm();
  
  // Configurer les événements
  setupFormEvents();
  
  console.log('Page d\'inscription initialisée avec succès');
});

// Fonction pour vérifier l'authentification
function checkUserAuthentication() {
  try {
    // Récupérer l'utilisateur depuis le stockage local (simulation)
    if (typeof(Storage) !== "undefined") {
      const storedUser = localStorage.getItem('ecole_sim_user');
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        userRole = currentUser.role;
        
        console.log('Utilisateur authentifié:', currentUser.name, 'Rôle:', userRole);
        
        // Adapter l'interface selon le rôle
        adaptInterfaceForRole();
      } else {
        // Rediriger vers la page de connexion
        redirectToLogin();
      }
    } else {
      console.error('Local Storage non disponible');
      redirectToLogin();
    }
  } catch (error) {
    console.error('Erreur vérification authentification:', error);
    redirectToLogin();
  }
}

// Fonction pour rediriger vers la page de connexion
function redirectToLogin() {
  try {
    // Simuler l'affichage d'un message d'erreur
    console.log('Redirection vers login nécessaire');
    alert('Vous devez être connecté pour accéder à cette page. Redirection vers l\'accueil...');
    window.location.href = '/';
  } catch (error) {
    console.error('Erreur redirection login:', error);
  }
}

// Fonction pour adapter l'interface selon le rôle
function adaptInterfaceForRole() {
  try {
    console.log('Adaptation interface pour le rôle:', userRole);
    
    // Simuler l'affichage des informations utilisateur
    console.log(`Interface adaptée pour: ${currentUser.name} (${getRoleDisplayName(userRole)})`);
    
    // Adapter les champs selon le rôle
    if (userRole === 'parent') {
      setupParentRegistration();
    } else if (userRole === 'admin' || userRole === 'teacher') {
      setupAdminRegistration();
    }
    
  } catch (error) {
    console.error('Erreur adaptation interface:', error);
  }
}

// Configuration pour l'inscription par les parents
function setupParentRegistration() {
  try {
    console.log('Configuration pour inscription parent');
    console.log('Titre: Inscription de votre enfant');
    console.log('Email parent pré-rempli:', currentUser.email);
    
    // Simuler la configuration parent
    formData.parentMode = true;
    formData.parentEmail = currentUser.email;
    
  } catch (error) {
    console.error('Erreur configuration parent:', error);
  }
}

// Configuration pour l'inscription par admin/enseignants
function setupAdminRegistration() {
  try {
    console.log('Configuration pour inscription administrative');
    console.log('Titre: Inscription d\'un nouvel élève');
    
    // Charger les listes déroulantes
    loadClassesList();
    loadParentsList();
    
    formData.adminMode = true;
    
  } catch (error) {
    console.error('Erreur configuration admin:', error);
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

// Fonction d'initialisation du formulaire
function initializeForm() {
  try {
    // Réinitialiser les données
    formData = {
      student: {},
      parent: {},
      isValid: false
    };
    
    console.log('Formulaire d\'inscription initialisé');
  } catch (error) {
    console.error('Erreur initialisation formulaire:', error);
  }
}

// Configuration des événements du formulaire
function setupFormEvents() {
  try {
    console.log('Configuration des événements de validation en temps réel');
    
    // Simuler la configuration des événements
    formData.eventsConfigured = true;
    
  } catch (error) {
    console.error('Erreur configuration événements:', error);
  }
}

// Fonction de validation d'un champ
function validateField(fieldId, value) {
  let isValid = true;
  let errorMessage = '';
  
  switch (fieldId) {
    case 'studentFirstName':
    case 'studentLastName':
      isValid = value && value.length >= 2;
      errorMessage = 'Le nom doit contenir au moins 2 caractères';
      break;
      
    case 'studentDateOfBirth':
      isValid = value && new Date(value) < new Date();
      errorMessage = 'Veuillez sélectionner une date de naissance valide';
      break;
      
    case 'parentEmail':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = value && emailRegex.test(value);
      errorMessage = 'Veuillez saisir un email valide';
      break;
      
    case 'parentPhone':
      const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
      isValid = value && phoneRegex.test(value);
      errorMessage = 'Veuillez saisir un numéro de téléphone valide';
      break;
  }
  
  console.log(`Validation ${fieldId}: ${isValid ? 'OK' : 'Erreur - ' + errorMessage}`);
  return isValid;
}

// Fonction pour charger la liste des classes
function loadClassesList() {
  try {
    // Simulation des classes disponibles (sera remplacé par Google Sheets)
    const classes = [
      { value: 'CP', label: 'CP - Cours Préparatoire' },
      { value: 'CE1', label: 'CE1 - Cours Élémentaire 1' },
      { value: 'CE2', label: 'CE2 - Cours Élémentaire 2' },
      { value: 'CM1', label: 'CM1 - Cours Moyen 1' },
      { value: 'CM2', label: 'CM2 - Cours Moyen 2' }
    ];
    
    formData.availableClasses = classes;
    console.log('Liste des classes chargée:', classes.length, 'classes disponibles');
    
  } catch (error) {
    console.error('Erreur chargement classes:', error);
  }
}

// Fonction pour charger la liste des parents
function loadParentsList() {
  try {
    // Simulation des parents (sera remplacé par Google Sheets)
    const parents = [
      { value: 'parent1', label: 'Dupont, Marie - marie.dupont@email.com' },
      { value: 'parent2', label: 'Martin, Pierre - pierre.martin@email.com' },
      { value: 'new', label: '+ Nouveau parent' }
    ];
    
    formData.availableParents = parents;
    console.log('Liste des parents chargée:', parents.length, 'parents disponibles');
    
  } catch (error) {
    console.error('Erreur chargement parents:', error);
  }
}

// Fonction pour charger les informations d'un parent sélectionné
function loadSelectedParentInfo(parentId) {
  try {
    // Simulation des données parent (sera remplacé par Google Sheets)
    const parentData = {
      'parent1': {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@email.com',
        phone: '06 12 34 56 78',
        address: '123 Rue de la République, 75000 Paris'
      },
      'parent2': {
        firstName: 'Pierre',
        lastName: 'Martin',
        email: 'pierre.martin@email.com',
        phone: '06 87 65 43 21',
        address: '456 Avenue des Écoles, 75000 Paris'
      }
    };
    
    const parent = parentData[parentId];
    if (parent) {
      formData.selectedParent = parent;
      console.log('Informations parent chargées:', parent.firstName, parent.lastName);
    }
    
  } catch (error) {
    console.error('Erreur chargement info parent:', error);
  }
}

// Gestionnaire d'événement pour le bouton de soumission
export function submitRegistration_click(event) {
  console.log('=== SOUMISSION FORMULAIRE D\'INSCRIPTION ===');
  
  if (isSubmitting) {
    console.log('Soumission déjà en cours, abandon');
    return;
  }
  
  try {
    // Simuler la collecte des données du formulaire
    const registrationData = {
      student: {
        firstName: 'Emma',
        lastName: 'Exemple',
        dateOfBirth: '2015-03-15',
        gender: 'F',
        address: '123 Rue de l\'École, 75000 Paris',
        class: 'CE1'
      },
      parent: userRole === 'parent' ? {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name
      } : {
        firstName: 'Parent',
        lastName: 'Exemple',
        email: 'parent.exemple@email.com',
        phone: '06 12 34 56 78'
      },
      submittedBy: currentUser.id,
      submittedByRole: userRole,
      submissionDate: new Date().toISOString()
    };
    
    // Simuler la soumission
    submitRegistrationData(registrationData);
    
  } catch (error) {
    console.error('Erreur soumission formulaire:', error);
    showErrorMessage('Une erreur est survenue lors de la soumission');
  }
}

// Fonction pour soumettre les données d'inscription
function submitRegistrationData(data) {
  isSubmitting = true;
  
  console.log('Début soumission inscription...');
  console.log('Données à soumettre:', JSON.stringify(data, null, 2));
  
  // Simulation de l'appel API (sera remplacé par Google Sheets)
  setTimeout(() => {
    try {
      console.log('✅ Inscription enregistrée avec succès !');
      console.log('Élève:', data.student.firstName, data.student.lastName);
      console.log('Classe:', data.student.class);
      console.log('Parent:', data.parent.email);
      
      showSuccessMessage('Inscription enregistrée avec succès !');
      showNextActions();
      
    } catch (error) {
      console.error('❌ Erreur traitement inscription:', error);
      showErrorMessage('Erreur lors de l\'enregistrement de l\'inscription');
    } finally {
      isSubmitting = false;
      console.log('Fin de soumission');
    }
  }, 2000);
}

// Fonction pour afficher les actions suivantes
function showNextActions() {
  console.log('=== ACTIONS SUIVANTES ===');
  
  if (userRole === 'parent') {
    console.log('📧 Vous recevrez une confirmation par email');
    console.log('📞 L\'école vous contactera pour finaliser l\'inscription');
  } else {
    console.log('👤 L\'élève peut maintenant être géré dans le système');
    console.log('📊 Les informations sont disponibles dans les tableaux de bord');
  }
}

// Fonctions utilitaires pour les messages
function showSuccessMessage(message) {
  console.log('✅ SUCCÈS:', message);
  
  // Dans une vraie interface, ceci afficherait un message vert
  alert('✅ ' + message);
}

function showErrorMessage(message) {
  console.log('❌ ERREUR:', message);
  
  // Dans une vraie interface, ceci afficherait un message rouge
  alert('❌ ' + message);
}

// Gestionnaire pour le bouton retour
export function backToHome_click(event) {
  console.log('Retour vers la page d\'accueil');
  
  try {
    window.location.href = '/';
  } catch (error) {
    console.error('Erreur redirection:', error);
  }
}

// Gestionnaire pour une nouvelle inscription
export function newRegistration_click(event) {
  console.log('=== NOUVELLE INSCRIPTION ===');
  
  try {
    // Réinitialiser le formulaire
    initializeForm();
    console.log('Formulaire réinitialisé pour une nouvelle inscription');
    
  } catch (error) {
    console.error('Erreur nouvelle inscription:', error);
  }
}

// Fonction de démonstration pour tester différents scénarios
export function testRegistration_click(event) {
  console.log('=== TEST INSCRIPTION ===');
  
  // Tester avec différents rôles
  const testScenarios = [
    {
      role: 'parent',
      student: { firstName: 'Sophie', lastName: 'Parent', class: 'CP' }
    },
    {
      role: 'admin',
      student: { firstName: 'Thomas', lastName: 'Admin', class: 'CE2' }
    },
    {
      role: 'teacher',
      student: { firstName: 'Julie', lastName: 'Teacher', class: 'CM1' }
    }
  ];
  
  testScenarios.forEach((scenario, index) => {
    console.log(`Test ${index + 1}: Inscription par ${scenario.role}`);
    console.log(`Élève: ${scenario.student.firstName} ${scenario.student.lastName} (${scenario.student.class})`);
  });
}

// Fonctions utilitaires pour la validation
function validateRequiredFields() {
  const requiredFields = [
    { id: 'studentFirstName', name: 'Prénom élève' },
    { id: 'studentLastName', name: 'Nom élève' },
    { id: 'studentDateOfBirth', name: 'Date de naissance' }
  ];
  
  if (userRole !== 'parent') {
    requiredFields.push(
      { id: 'parentEmail', name: 'Email parent' },
      { id: 'parentPhone', name: 'Téléphone parent' }
    );
  }
  
  let isValid = true;
  let missingFields = [];
  
  requiredFields.forEach(field => {
    // Simulation de vérification
    const hasValue = Math.random() > 0.2; // 80% de chance d'avoir une valeur
    if (!hasValue) {
      isValid = false;
      missingFields.push(field.name);
    }
  });
  
  if (!isValid) {
    console.log('❌ Champs manquants:', missingFields.join(', '));
  }
  
  return isValid;
}

console.log('📝 Page d\'inscription chargée - Prête pour les inscriptions d\'élèves');
