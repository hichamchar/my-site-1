# Technical Context - École Management System

## Technology Stack

### Frontend Framework
- **Wix MCP (Multi-Client Platform)**
  - React.js 16.14.0 (project dependency)
  - Wix Design System components
  - Wix Corvid/Velo APIs
  - Built-in responsive design

### Authentication & Authorization
- **Wix Auth** for user management
- **Custom Role System**: admin, teacher, parent
- **JWT tokens** for session management
- **Role-based routing** protection

### Data Layer
- **Google Sheets API v4** as primary database
- **Google Apps Script** for advanced operations
- **Local Storage** for caching and preferences
- **Session Storage** for temporary data

### Development Tools
- **Wix CLI** (`@wix/cli ^1.0.0`) for local development
- **ESLint** (`^8.25.0`) with Wix plugin for code quality
- **Wix Local Editor** for real-time testing
- **Git Integration** for version control

## Project Structure
```
my-site-1-1/
├── src/
│   ├── pages/                    # Wix pages
│   │   ├── Home.c1dmp.js        # Landing page
│   │   ├── Blog.o84o7.js        # Blog (unused)
│   │   ├── Post.txs10.js        # Post (unused)
│   │   └── masterPage.js        # Master layout
│   ├── backend/                  # Server-side code
│   │   ├── services/            # Business logic
│   │   ├── auth/                # Authentication
│   │   └── permissions.json     # API permissions
│   └── public/                   # Static assets
├── components/                   # Reusable React components
├── services/                     # Google Sheets integration
├── utils/                        # Helper functions
├── styles/                       # CSS modules
└── config/                       # Configuration files
```

## Google Sheets Schema

### Sheet Structure
1. **Students**: ID, FirstName, LastName, DateOfBirth, ClassID, ParentID, Status
2. **Classes**: ID, Name, Level, TeacherID, AcademicYear
3. **Teachers**: ID, FirstName, LastName, Email, Subjects, ClassIDs
4. **Parents**: ID, FirstName, LastName, Email, Phone, StudentIDs
5. **Attendance**: Date, StudentID, Present, Justified, Note, TeacherID
6. **Grades**: StudentID, Subject, Date, Grade, Comment, TeacherID
7. **Messages**: ID, SenderID, ReceiverID, Date, Content, Read, Type

### API Configuration
```javascript
// Google Sheets API setup
const SPREADSHEET_ID = 'your-spreadsheet-id';
const API_KEY = 'your-api-key';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
```

## Development Constraints

### Wix Platform Limitations
- React 16.14.0 (fixed version)
- Limited npm packages (Wix approved only)
- Specific Wix APIs and components required
- No direct database access (hence Google Sheets)

### Google Sheets Limitations
- 10 million cells per spreadsheet max
- 2 million cells per sheet max
- 100 requests per 100 seconds per user
- 300 requests per minute per project

### Performance Considerations
- Client-side rendering limitations
- Google Sheets API rate limits
- Mobile device performance
- Network connectivity variations

## Environment Setup

### Local Development
```bash
npm install              # Install dependencies
wix dev                 # Start local development server
wix sync-types          # Sync Wix type definitions
```

### Authentication Setup
1. Configure Wix Auth in site dashboard
2. Set up Google Cloud Console project
3. Enable Google Sheets API
4. Configure OAuth consent screen
5. Generate API credentials

### Deployment Process
```bash
git add .
git commit -m "feature: description"
git push origin main     # Triggers automatic deployment
```

## Security Requirements
- HTTPS enforced by Wix
- OAuth 2.0 for Google Sheets access
- Role-based access control
- Data encryption in transit
- Wix security compliance 