# Guide de déploiement - École Management System

## 📋 Prérequis

### Comptes nécessaires
- ✅ Compte Wix (Premium recommandé)
- ✅ Compte Google Cloud Platform
- ✅ Compte Google Drive/Sheets
- ✅ Compte GitHub (pour le versioning)

### Outils requis
- ✅ Node.js 14.8+ installé
- ✅ Git installé
- ✅ Wix CLI installé (`npm install -g @wix/cli`)
- ✅ Navigateur moderne

## 🚀 Étapes de déploiement

### 1. Configuration Google Sheets

#### 1.1 Créer le fichier de données
1. Aller sur [Google Sheets](https://sheets.google.com)
2. Créer un nouveau fichier nommé "École Management - Base de données"
3. Créer les onglets suivants :
   - Élèves
   - Classes  
   - Enseignants
   - Parents
   - Présences
   - Notes
   - Messages

4. Copier la structure depuis `sample-data/google-sheets-structure.md`

#### 1.2 Configurer l'API Google Sheets
1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un nouveau projet "École Management System"
3. Activer l'API Google Sheets :
   - Menu → Bibliothèque → Rechercher "Google Sheets API" → Activer
4. Créer des credentials :
   - Menu → Identifiants → Créer des identifiants → Clé API
   - Copier la clé générée
5. Noter l'ID du spreadsheet depuis l'URL de votre fichier

### 2. Configuration du projet Wix

#### 2.1 Connecter le repository
```bash
# Cloner le projet
git clone <your-repository-url>
cd my-site-1-1

# Installer les dépendances
npm install

# Synchroniser les types Wix
npm run postinstall
```

#### 2.2 Configuration des services
1. Éditer `src/backend/googleSheetsService.js`
   ```javascript
   this.spreadsheetId = 'VOTRE_SPREADSHEET_ID';
   this.apiKey = 'VOTRE_API_KEY';
   ```

2. Éditer `src/backend/authService.js`
   - Mettre à jour la liste des emails administrateurs
   ```javascript
   const adminEmails = [
     'admin@votre-ecole.fr',
     'direction@votre-ecole.fr'
   ];
   ```

#### 2.3 Configurer l'authentification Wix
1. Dans le Wix Editor :
   - Aller dans Paramètres → Membres
   - Activer l'authentification des membres
   - Configurer les champs requis (Nom, Email)

### 3. Structure des pages Wix

#### 3.1 Page principale (Home)
Dans le Wix Editor :
1. Ajouter un élément HTML personnalisé
2. Donner l'ID `reactApp` à cet élément
3. Le code est déjà dans `src/pages/Home.c1dmp.js`

#### 3.2 Pages additionnelles (optionnel)
- Créer des pages pour chaque section si nécessaire
- Utiliser le même pattern avec des éléments HTML personnalisés

### 4. Développement local

#### 4.1 Démarrer le serveur de développement
```bash
# Démarrer le serveur local Wix
npm run dev

# Ou directement
wix dev
```

#### 4.2 Tester l'application
1. Ouvrir http://localhost:8080 (port par défaut Wix)
2. Tester l'authentification
3. Vérifier les connexions API Google Sheets
4. Tester les différents rôles

### 5. Déploiement en production

#### 5.1 Commit et push
```bash
# Ajouter tous les fichiers
git add .

# Commit avec message descriptif
git commit -m "feat: Application École Management System complète"

# Push vers la branche principale
git push origin main
```

#### 5.2 Déploiement automatique
- Le push vers `main` déclenche automatiquement le déploiement Wix
- Vérifier le statut dans le Wix Editor

#### 5.3 Configuration finale
1. Dans Wix Editor → Paramètres → Domaine
   - Configurer votre domaine personnalisé si nécessaire
2. Paramètres → SEO
   - Configurer titre, description, favicon
3. Paramètres → Analytics
   - Ajouter Google Analytics si souhaité

### 6. Configuration des utilisateurs

#### 6.1 Comptes administrateurs
1. Créer les comptes dans Wix Members
2. S'assurer que les emails correspondent à ceux dans `authService.js`

#### 6.2 Import des enseignants
1. Ajouter les enseignants dans la feuille "Enseignants"
2. Créer leurs comptes Wix avec les mêmes emails
3. Tester la connexion et l'attribution du rôle

#### 6.3 Import des parents
1. Ajouter les parents dans la feuille "Parents"
2. Créer leurs comptes Wix avec les mêmes emails
3. Vérifier la liaison avec leurs enfants

### 7. Tests de validation

#### 7.1 Tests fonctionnels
- [ ] Connexion administrateur
- [ ] Connexion enseignant  
- [ ] Connexion parent
- [ ] Affichage des tableaux de bord
- [ ] Envoi/réception de messages
- [ ] Consultation des présences
- [ ] Consultation des notes

#### 7.2 Tests de performance
- [ ] Chargement initial < 3 secondes
- [ ] Navigation fluide entre les pages
- [ ] Responsive design sur mobile/tablette

#### 7.3 Tests de sécurité
- [ ] Accès protégé selon les rôles
- [ ] Données sensibles non exposées
- [ ] Communications API sécurisées

### 8. Maintenance et monitoring

#### 8.1 Surveillance
- Configurer Google Analytics
- Monitorer les erreurs dans la console Wix
- Surveiller les limites d'usage de l'API Google Sheets

#### 8.2 Sauvegardes
- Sauvegarder régulièrement le fichier Google Sheets
- Exporter les données importantes
- Maintenir une copie du code source

#### 8.3 Mises à jour
- Suivre les mises à jour Wix CLI
- Tester les nouvelles fonctionnalités
- Maintenir la documentation

## 🔧 Dépannage

### Problèmes courants

#### Erreur "Élément #reactApp non trouvé"
- Vérifier que l'élément HTML a bien l'ID `reactApp`
- S'assurer que l'élément est visible sur la page

#### Erreur API Google Sheets
- Vérifier la clé API et l'ID du spreadsheet
- Vérifier les permissions du fichier Google Sheets
- Contrôler les quotas d'utilisation de l'API

#### Problème d'authentification
- Vérifier la configuration Wix Members
- Contrôler les emails dans les feuilles de données
- Tester avec un compte différent

#### Erreurs de performance
- Optimiser les requêtes API (pagination, cache)
- Réduire la taille des données chargées
- Utiliser le lazy loading

### Logs de débogage
```javascript
// Activer les logs détaillés
console.log('Debug mode activé');

// Dans googleSheetsService.js
console.log('Données reçues:', response);

// Dans authService.js  
console.log('Utilisateur connecté:', user);
```

## 📞 Support

### Ressources utiles
- [Documentation Wix Velo](https://www.wix.com/velo/reference/)
- [API Google Sheets](https://developers.google.com/sheets/api)
- [React 16 Documentation](https://16.reactjs.org/)

### Contact
- Email technique : votre-email@ecole.fr
- Documentation projet : [Lien vers documentation]
- Repository GitHub : [Lien vers repo]

## 🔄 Historique des versions

### v1.0.0 - Version initiale
- Authentification multi-rôles
- Tableaux de bord admin/parent
- Système de messagerie
- Intégration Google Sheets
- Interface responsive

### Prochaines versions prévues
- v1.1.0 : Gestion complète des élèves
- v1.2.0 : Système de présences avancé
- v1.3.0 : Module de notes et bulletins
- v1.4.0 : Notifications push
- v1.5.0 : Application mobile

---

**⚠️ Important** : Assurez-vous de tester l'application en mode développement avant le déploiement en production. Sauvegardez toujours vos données avant les mises à jour majeures. 