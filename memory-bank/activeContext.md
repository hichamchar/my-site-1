# Active Context - École Management System

## Current Work Focus
Développement des composants core de l'application scolaire avec priorité sur:

### Phase 1 - Foundation (Current Sprint)
1. **Authentication & Roles Setup** ⏳
   - Configuration Wix Auth avec rôles personnalisés
   - Système de protection des routes
   - Context utilisateur global

2. **Google Sheets Integration** ⏳
   - Service d'accès aux données
   - CRUD operations pour toutes les entités
   - Gestion des erreurs et retry logic

3. **Core Components** ⏳
   - Dashboard Direction/Enseignants
   - Dashboard Parents
   - Composants de navigation
   - Layout responsive

4. **Messaging System** ⏳
   - Interface d'envoi/réception messages
   - Notifications en temps réel
   - Historique des conversations

## Recent Decisions & Changes

### Architecture Decisions
- **Choix Google Sheets**: Simplicité maintenance vs performance
- **Wix MCP**: Plateforme intégrée vs développement custom
- **Role-based UI**: Interfaces distinctes vs interface unique avec permissions

### Component Structure
```
components/
├── auth/
│   ├── LoginForm.js
│   ├── RoleProvider.js
│   └── ProtectedRoute.js
├── dashboards/
│   ├── AdminDashboard.js
│   ├── TeacherDashboard.js
│   └── ParentDashboard.js
├── shared/
│   ├── Navigation.js
│   ├── Header.js
│   └── Layout.js
└── messaging/
    ├── MessageList.js
    ├── MessageForm.js
    └── ConversationView.js
```

## Current Priorities

### Immediate Tasks (This Session)
1. **Setup Authentication System**
   - Wix Auth configuration
   - Role assignment logic
   - Protected routing implementation

2. **Google Sheets Service**
   - API authentication setup
   - Base CRUD operations
   - Error handling patterns

3. **Dashboard Components**
   - Admin dashboard with stats
   - Parent dashboard with child info
   - Responsive design implementation

4. **Navigation & Routing**
   - Role-based menu system
   - Page routing configuration
   - Layout components

### Next Steps (Following Sessions)
1. Student management interface
2. Attendance tracking system
3. Grade management features
4. Advanced messaging features
5. Calendar integration
6. Mobile optimization

## Technical Considerations

### Data Modeling
- Relations entre feuilles Google Sheets
- IDs uniques et foreign keys
- Validation des données côté client

### Performance Optimization
- Lazy loading des composants
- Pagination des listes
- Cache local des données fréquentes

### User Experience
- Loading states pour toutes les opérations
- Messages d'erreur utilisateur-friendly
- Navigation intuitive selon le rôle

## Questions à Résoudre
1. **Refresh des données**: Polling vs WebSockets vs manual refresh
2. **Offline capability**: Quelles données cacher localement
3. **Backup strategy**: Comment protéger les données Google Sheets
4. **Scaling**: Comment gérer l'augmentation du nombre d'utilisateurs

## Testing Strategy
- Components testing avec Wix testing tools
- Integration testing avec Google Sheets sandbox
- User acceptance testing avec école pilote
- Performance testing sur différents devices 