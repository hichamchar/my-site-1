# Structure Google Sheets - École Management System

## Configuration Google Sheets

### Étape 1: Créer le fichier Google Sheets
1. Créez un nouveau fichier Google Sheets
2. Nommez-le "École Management - Base de données"
3. Créez les feuilles suivantes (onglets)

### Étape 2: Structure des feuilles

## Feuille "Élèves"
| ID | FirstName | LastName | DateOfBirth | ClassID | ParentID | Status | CreatedDate |
|----|-----------|----------|-------------|---------|----------|--------|-------------|
| eleve_001 | Emma | Dupont | 2010-05-15 | class_001 | parent_001 | Actif | 2024-01-15 |
| eleve_002 | Lucas | Martin | 2010-08-22 | class_001 | parent_002 | Actif | 2024-01-15 |
| eleve_003 | Léa | Bernard | 2009-12-10 | class_002 | parent_003 | Actif | 2024-01-15 |
| eleve_004 | Nathan | Petit | 2011-03-08 | class_001 | parent_004 | Actif | 2024-01-15 |
| eleve_005 | Chloé | Moreau | 2010-11-25 | class_002 | parent_005 | Actif | 2024-01-15 |

## Feuille "Classes"
| ID | Name | Level | TeacherID | AcademicYear | MaxStudents |
|----|------|-------|-----------|--------------|-------------|
| class_001 | CM1-A | CM1 | teacher_001 | 2023-2024 | 25 |
| class_002 | CM2-A | CM2 | teacher_002 | 2023-2024 | 25 |
| class_003 | CE2-A | CE2 | teacher_003 | 2023-2024 | 24 |

## Feuille "Enseignants"
| ID | FirstName | LastName | Email | Subjects | ClassIDs | Phone |
|----|-----------|----------|-------|----------|----------|-------|
| teacher_001 | Marie | Durand | marie.durand@ecole.fr | Français,Mathématiques | class_001 | 0123456789 |
| teacher_002 | Pierre | Leroy | pierre.leroy@ecole.fr | Histoire,Géographie | class_002 | 0123456790 |
| teacher_003 | Sophie | Blanc | sophie.blanc@ecole.fr | Sciences,Arts | class_003 | 0123456791 |

## Feuille "Parents"
| ID | FirstName | LastName | Email | Phone | StudentIDs | Address |
|----|-----------|----------|-------|-------|------------|---------|
| parent_001 | Jean | Dupont | jean.dupont@email.com | 0612345678 | eleve_001 | 123 Rue de la Paix |
| parent_002 | Marie | Martin | marie.martin@email.com | 0612345679 | eleve_002 | 456 Avenue des Fleurs |
| parent_003 | Paul | Bernard | paul.bernard@email.com | 0612345680 | eleve_003 | 789 Boulevard du Soleil |
| parent_004 | Anne | Petit | anne.petit@email.com | 0612345681 | eleve_004 | 321 Rue des Écoles |
| parent_005 | Luc | Moreau | luc.moreau@email.com | 0612345682 | eleve_005 | 654 Place de la Liberté |

## Feuille "Présences"
| Date | StudentID | Present | Justified | Note | TeacherID |
|------|-----------|---------|-----------|------|-----------|
| 2024-03-01 | eleve_001 | true | false |  | teacher_001 |
| 2024-03-01 | eleve_002 | true | false |  | teacher_001 |
| 2024-03-01 | eleve_003 | false | true | Rendez-vous médical | teacher_002 |
| 2024-03-01 | eleve_004 | true | false |  | teacher_001 |
| 2024-03-01 | eleve_005 | true | false |  | teacher_002 |
| 2024-03-02 | eleve_001 | true | false |  | teacher_001 |
| 2024-03-02 | eleve_002 | false | false |  | teacher_001 |

## Feuille "Notes"
| StudentID | Subject | Date | Grade | Comment | TeacherID |
|-----------|---------|------|-------|---------|-----------|
| eleve_001 | Mathématiques | 2024-02-15 | 16 | Très bon travail | teacher_001 |
| eleve_001 | Français | 2024-02-20 | 14 | Bien | teacher_001 |
| eleve_002 | Mathématiques | 2024-02-15 | 12 | Peut mieux faire | teacher_001 |
| eleve_002 | Français | 2024-02-20 | 15 | Bon niveau | teacher_001 |
| eleve_003 | Histoire | 2024-02-18 | 17 | Excellent | teacher_002 |
| eleve_003 | Géographie | 2024-02-25 | 15 | Très bien | teacher_002 |

## Feuille "Messages"
| ID | SenderID | ReceiverID | Date | Content | Read | Type |
|----|----------|------------|------|---------|------|------|
| msg_001 | teacher_001 | parent_001 | 2024-03-01T10:30:00Z | Bonjour, Emma a eu d'excellents résultats ce mois-ci ! | false | message |
| msg_002 | parent_002 | teacher_001 | 2024-03-01T14:15:00Z | Merci pour votre retour. Lucas sera absent demain pour un rendez-vous médical. | true | message |
| msg_003 | teacher_002 | parent_003 | 2024-03-02T09:00:00Z | Léa a rattrapé son retard en mathématiques, félicitations ! | false | message |

## Configuration API Google Sheets

### Étape 3: Obtenir les credentials API

1. **Aller sur Google Cloud Console**
   - https://console.cloud.google.com/

2. **Créer un nouveau projet**
   - Nom: "École Management System"

3. **Activer l'API Google Sheets**
   - Bibliothèque → Rechercher "Google Sheets API" → Activer

4. **Créer des credentials**
   - Credentials → Créer des identifiants → Clé API
   - Copier la clé API générée

5. **Obtenir l'ID du spreadsheet**
   - Dans l'URL de votre fichier Google Sheets
   - Format: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

### Étape 4: Configuration dans l'application

Mettre à jour le fichier `googleSheetsService.js` :

```javascript
this.spreadsheetId = 'VOTRE_SPREADSHEET_ID_ICI';
this.apiKey = 'VOTRE_CLE_API_ICI';
```

### Étape 5: Permissions du fichier

1. **Rendre le fichier accessible**
   - Partager → Modifier les autorisations
   - "Toute personne disposant du lien peut consulter"
   - OU créer un compte de service pour plus de sécurité

## Exemples d'utilisation

### Lecture des données
```javascript
// Obtenir tous les élèves
const students = await googleSheets.getStudents();

// Obtenir un élève spécifique
const student = await googleSheets.getStudentById('eleve_001');

// Obtenir les enfants d'un parent
const children = await googleSheets.getStudentsByParentId('parent_001');
```

### Écriture des données (nécessite OAuth)
```javascript
// Ajouter une présence
await googleSheets.addAttendance('eleve_001', '2024-03-03', true, false, '', 'teacher_001');

// Envoyer un message
await googleSheets.addMessage('teacher_001', 'parent_001', 'Message de test', 'message');
```

## Sécurité et bonnes pratiques

### Protection des données
- Utilisez un compte de service Google pour l'accès programmatique
- Limitez les permissions aux seules feuilles nécessaires
- Implémentez une validation des données côté client
- Sauvegardez régulièrement le fichier Google Sheets

### Performance
- Utilisez le cache local pour les données fréquemment consultées
- Implémentez la pagination pour les grandes listes
- Groupez les requêtes API quand possible
- Surveillez les limites de taux de l'API Google

### Évolutivité
- Prévoyez la migration vers une vraie base de données si nécessaire
- Organisez les données par année scolaire
- Archivez les anciennes données
- Documentez la structure pour les nouveaux développeurs

## Limites Google Sheets
- Maximum 10 millions de cellules par fichier
- Maximum 2 millions de cellules par feuille
- 100 requêtes par 100 secondes par utilisateur
- 300 requêtes par minute par projet

Pour une école de taille moyenne (< 500 élèves), ces limites sont largement suffisantes. 