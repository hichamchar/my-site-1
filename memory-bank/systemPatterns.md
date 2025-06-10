# System Patterns - École Management System

## Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Wix MCP Frontend                         │
├─────────────────────────┬───────────────────────────────────┤
│   Admin/Teacher UI      │         Parent UI                 │
│   - Dashboard           │   - Child Dashboard               │
│   - Student Management  │   - Attendance Tracking          │
│   - Messaging           │   - Grade Viewing                 │
│   - Attendance          │   - Messaging                     │
└─────────────────────────┴───────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Wix Auth        │
                    │   Role-Based      │
                    │   (admin/teacher/ │
                    │    parent)        │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Google Sheets    │
                    │  Data Layer       │
                    │  - Students       │
                    │  - Classes        │
                    │  - Teachers       │
                    │  - Parents        │
                    │  - Attendance     │
                    │  - Messages       │
                    └───────────────────┘
```

## Core Design Patterns

### 1. Role-Based Access Control (RBAC)
```javascript
// Pattern: Route protection based on user roles
const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { user, userRole } = useAuth();
  return allowedRoles.includes(userRole) ? <Component {...rest} /> : <AccessDenied />;
};
```

### 2. Data Service Layer
```javascript
// Pattern: Centralized Google Sheets integration
class GoogleSheetsService {
  async getStudents() { /* Sheet: Students */ }
  async updateAttendance() { /* Sheet: Attendance */ }
  async sendMessage() { /* Sheet: Messages */ }
}
```

### 3. Component Composition
```javascript
// Pattern: Reusable dashboard components
<Dashboard>
  <StatsWidget />
  <RecentActivity />
  <QuickActions />
</Dashboard>
```

### 4. State Management Pattern
```javascript
// Pattern: Context + useReducer for complex state
const SchoolContext = createContext();
const schoolReducer = (state, action) => { /* handles school data */ };
```

## Data Flow Patterns

### 1. Real-time Updates
- Wix Realtime API for instant message notifications
- Polling for Google Sheets data updates
- Optimistic UI updates with rollback

### 2. Caching Strategy
- Local storage for user preferences
- Session storage for current data
- Service worker for offline functionality

### 3. Error Handling
- Centralized error boundary components
- Graceful degradation for API failures
- User-friendly error messages

## Security Patterns

### 1. Authentication Flow
1. Wix Auth login → Role assignment
2. JWT token validation
3. Role-based component rendering
4. API endpoint protection

### 2. Data Validation
- Client-side form validation
- Server-side data sanitization
- Google Sheets data type enforcement

## Performance Patterns

### 1. Lazy Loading
- Route-based code splitting
- Component lazy loading
- Image optimization

### 2. Data Optimization
- Pagination for large datasets
- Debounced search queries
- Batch Google Sheets operations 