# Project Structure

Complete overview of the MedAI Healthcare Platform file structure and organization.

## Root Directory

```
medai-healthcare-platform/
├── backend/                    # Backend application (Node.js + Express)
├── src/                        # Frontend application (React + TypeScript)
├── __Docs__/                   # Project documentation
├── __MedAI__/                  # Project assets and resources
├── Data/                       # Static data files
├── node_modules/               # Dependencies (auto-generated)
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .git/                       # Git repository data
├── .gitignore                  # Git ignore rules
├── CHANGELOG.md                # Version history and changes
├── CONTRIBUTORS.md             # Project contributors
├── design.md                   # Design document
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── LICENSE                     # MIT License
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Main project documentation
├── requirements.md             # Detailed requirements
├── tailwind.config.js          # TailwindCSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # TypeScript app configuration
├── tsconfig.node.json          # TypeScript node configuration
└── vite.config.ts              # Vite build configuration
```

---

## Backend Structure

```
backend/
├── config/                     # Configuration files
│   ├── db.js                  # MongoDB connection setup
│   └── env.js                 # Environment variables validation
│
├── logs/                       # Application logs
│   └── app.log                # Main application log file
│
├── middlewares/                # Global middleware functions
│   ├── authMiddleware.js      # JWT authentication middleware
│   ├── errorHandler.js        # Global error handling
│   ├── multer.middleware.js   # File upload handling
│   └── validation.js          # Request validation middleware
│
├── modules/                    # Feature modules (MVC pattern)
│   │
│   ├── admin/                 # Admin module
│   │   ├── controllers/       # Request handlers
│   │   │   ├── adminController.js
│   │   │   ├── medicineController.js
│   │   │   └── notificationController.js
│   │   ├── middlewares/       # Module-specific middleware
│   │   │   └── adminAuth.js
│   │   ├── models/            # Data models
│   │   │   ├── Admin.js
│   │   │   ├── DoctorApproval.js
│   │   │   └── SystemLog.js
│   │   ├── routes/            # API routes
│   │   │   └── adminRoutes.js
│   │   ├── services/          # Business logic
│   │   │   ├── adminService.js
│   │   │   └── notificationService.js
│   │   ├── utils/             # Helper functions
│   │   │   ├── doctorApprovalWorkflow.js
│   │   │   └── seedAdmin.js
│   │   └── README.md          # Module documentation
│   │
│   ├── ai/                    # AI services module
│   │   ├── controllers/       # AI request handlers
│   │   │   ├── aiController.js
│   │   │   ├── deepgramController.js
│   │   │   ├── geminiChatController.js
│   │   │   ├── geminiOcrController.js
│   │   │   └── translationController.js
│   │   ├── routes/            # AI API routes
│   │   │   └── aiRoutes.js
│   │   └── services/          # AI service implementations
│   │       ├── aiDiagnosisService.js
│   │       ├── deepgramService.js
│   │       ├── geminiChatService.js
│   │       ├── geminiOcrService.js
│   │       └── translationService.js
│   │
│   ├── doctor/                # Doctor module
│   │   ├── controllers/
│   │   │   └── doctorController.js
│   │   ├── models/
│   │   │   ├── Appointment.js
│   │   │   ├── Doctor.js
│   │   │   ├── Earnings.js
│   │   │   └── Prescription.js
│   │   ├── routes/
│   │   │   └── doctorRoutes.js
│   │   ├── services/
│   │   │   └── doctorService.js
│   │   └── README.md
│   │
│   ├── insurance/             # Insurance module (placeholder)
│   │   └── README.md
│   │
│   ├── lab/                   # Laboratory module
│   │   ├── controllers/
│   │   │   └── labController.js
│   │   ├── models/
│   │   │   ├── Lab.js
│   │   │   ├── LabReport.js
│   │   │   └── LabRequest.js
│   │   ├── routes/
│   │   │   └── labRoutes.js
│   │   ├── services/
│   │   │   └── labService.js
│   │   ├── utils/
│   │   │   └── labHelper.js
│   │   ├── validations/
│   │   │   └── labValidation.js
│   │   └── README.md
│   │
│   ├── manager/               # Manager module (placeholder)
│   │   └── README.md
│   │
│   ├── maps/                  # Maps and location services
│   │   ├── mapsController.js
│   │   ├── mapsRoutes.js
│   │   └── mapsService.js
│   │
│   └── user/                  # User/Patient module
│       ├── controllers/
│       │   ├── appointmentController.js
│       │   ├── userController.js
│       │   └── userSummaryController.js
│       ├── models/
│       │   └── User.js
│       ├── routes/
│       │   └── userRoutes.js
│       └── services/
│           ├── appointmentService.js
│           └── userService.js
│
├── utils/                      # Global utility functions
│   ├── logger.js              # Winston logger configuration
│   └── responseHelper.js      # Standardized API responses
│
├── ROUTES_OVERVIEW.txt        # API routes documentation
└── server.js                  # Application entry point
```

---

## Frontend Structure

```
src/
├── config/                     # Frontend configuration
│
├── modules/                    # Feature modules
│   │
│   ├── admin/                 # Admin portal
│   │   ├── components/        # Admin-specific components
│   │   │   ├── AdminNavbar.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── ComingSoon.tsx
│   │   ├── pages/             # Admin pages
│   │   │   ├── AdminAnalytics.tsx
│   │   │   ├── AdminAppointments.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminNotifications.tsx
│   │   │   ├── AdminSettings.tsx
│   │   │   ├── ManageDoctors.tsx
│   │   │   ├── ManageLabs.tsx
│   │   │   ├── ManageMedicines.tsx
│   │   │   └── ManageUsers.tsx
│   │   └── services/          # Admin API services
│   │       └── adminAPI.ts
│   │
│   ├── doctor/                # Doctor portal
│   │   ├── components/
│   │   │   ├── ComingSoon.tsx
│   │   │   ├── DoctorNavbar.tsx
│   │   │   └── DoctorSidebar.tsx
│   │   ├── pages/
│   │   │   ├── DoctorAIDiagnosis.tsx
│   │   │   ├── DoctorAppointments.tsx
│   │   │   ├── DoctorDashboard.tsx
│   │   │   ├── DoctorEarnings.tsx
│   │   │   ├── DoctorLogin.tsx
│   │   │   ├── DoctorPatients.tsx
│   │   │   ├── DoctorPrescriptions.tsx
│   │   │   ├── DoctorProfile.tsx
│   │   │   └── DoctorSignup.tsx
│   │   └── services/
│   │       ├── aiDiagnosisService.ts
│   │       └── doctorAPI.ts
│   │
│   ├── insurance/             # Insurance portal (placeholder)
│   │   └── components/
│   │       └── ComingSoon.tsx
│   │
│   ├── lab/                   # Laboratory portal
│   │   ├── components/
│   │   │   ├── ComingSoon.tsx
│   │   │   ├── LabNavbar.tsx
│   │   │   └── LabSidebar.tsx
│   │   ├── pages/
│   │   │   ├── LabAnalytics.tsx
│   │   │   ├── LabDashboard.tsx
│   │   │   ├── LabLogin.tsx
│   │   │   ├── LabManageRequests.tsx
│   │   │   ├── LabPatientReports.tsx
│   │   │   ├── LabProfile.tsx
│   │   │   ├── LabQualityControl.tsx
│   │   │   ├── LabRequests.tsx
│   │   │   ├── LabSignup.tsx
│   │   │   └── LabUploadReport.tsx
│   │   └── services/
│   │       └── labAPI.ts
│   │
│   ├── manager/               # Manager portal (placeholder)
│   │   └── components/
│   │       └── ComingSoon.tsx
│   │
│   └── user/                  # User/Patient portal
│       ├── components/
│       │   ├── UserNavbar.tsx
│       │   ├── UserProfile.tsx
│       │   └── UserSidebar.tsx
│       ├── pages/
│       │   ├── AIChatbot/     # AI Chatbot feature
│       │   │   ├── gemini/
│       │   │   │   └── geminiAPI.ts
│       │   │   ├── deepgramAPI.ts
│       │   │   ├── translate.tsx
│       │   │   └── translationAPI.ts
│       │   ├── HealthVault/   # Health Vault feature
│       │   │   ├── Components.tsx
│       │   │   └── DocumentViewModal.tsx
│       │   ├── paramedics/    # Paramedics finder
│       │   │   └── GoogleMaps.tsx
│       │   ├── ActiveMedicinePage.tsx
│       │   ├── AIChatbot.tsx
│       │   ├── Appointments.tsx
│       │   ├── HealthVault.tsx
│       │   ├── Insurance.tsx
│       │   ├── LabReports.tsx
│       │   ├── MedicalHistory.tsx
│       │   ├── Medicines.tsx
│       │   ├── Paramedics.tsx
│       │   ├── Prescriptions.tsx
│       │   ├── UserDashboard.tsx
│       │   ├── UserLogin.tsx
│       │   ├── UserSignup.tsx
│       │   └── VerifyUserEmail.tsx
│       └── services/
│           └── userAPI.ts
│
├── pages/                      # Public pages
│   ├── AboutPage.tsx
│   ├── AuthPage.tsx
│   ├── FeaturesPage.tsx
│   ├── GuardiansPage.tsx
│   └── HomePage.tsx
│
├── shared/                     # Shared resources
│   ├── components/            # Reusable components
│   │   ├── ComingSoon.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useAuth.tsx
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   └── utils/                 # Utility functions
│       └── api.ts
│
├── App.tsx                     # Main App component
├── index.css                   # Global styles
├── main.tsx                    # Application entry point
└── vite-env.d.ts              # Vite type definitions
```

---

## Documentation Structure

```
__Docs__/
├── API_DOCUMENTATION.md        # Complete API reference
├── CONTRIBUTING.md             # Contribution guidelines
├── DATABASE_SCHEMA.md          # Database schema documentation
├── DEPLOYMENT.md               # Deployment guide
├── GEMINI_API_SETUP.md        # Gemini AI setup instructions
├── GOOGLE_MAPS_SETUP.md       # Google Maps setup instructions
├── PROJECT_STRUCTURE.md        # This file
├── QUICK_START.md             # Quick start guide
└── SECURITY.md                # Security best practices
```

---

## Data Files

```
Data/
└── medicine.json               # Medicine database (JSON format)
```

---

## Configuration Files

### Root Level

- **package.json**: Project metadata, dependencies, and scripts
- **package-lock.json**: Locked dependency versions for reproducible builds
- **tsconfig.json**: TypeScript compiler configuration
- **tsconfig.app.json**: TypeScript configuration for application code
- **tsconfig.node.json**: TypeScript configuration for Node.js code
- **vite.config.ts**: Vite build tool configuration
- **tailwind.config.js**: TailwindCSS utility classes configuration
- **postcss.config.js**: PostCSS processing configuration
- **eslint.config.js**: ESLint code linting rules
- **.gitignore**: Files and directories to ignore in Git
- **.env**: Environment variables (not committed to Git)
- **.env.example**: Template for environment variables

---

## Module Organization Pattern

Each backend module follows the MVC (Model-View-Controller) pattern:

```
module-name/
├── controllers/        # Handle HTTP requests and responses
├── models/            # Define data structures and database schemas
├── services/          # Implement business logic
├── routes/            # Define API endpoints
├── middlewares/       # Module-specific middleware (optional)
├── utils/             # Helper functions (optional)
├── validations/       # Input validation schemas (optional)
└── README.md          # Module documentation
```

### Responsibilities

**Controllers**:
- Receive HTTP requests
- Validate input (basic)
- Call service functions
- Send HTTP responses
- Handle errors

**Models**:
- Define Mongoose schemas
- Define data validation rules
- Define instance methods
- Define static methods
- Define pre/post hooks

**Services**:
- Implement business logic
- Interact with database
- Call external APIs
- Process data
- Return results

**Routes**:
- Define API endpoints
- Apply middleware
- Map routes to controllers
- Group related routes

---

## Frontend Module Pattern

Each frontend module follows a component-based architecture:

```
module-name/
├── components/        # Reusable UI components
├── pages/            # Page-level components
├── services/         # API client functions
└── types/            # TypeScript type definitions (optional)
```

### Component Types

**Pages**:
- Full-page components
- Handle routing
- Compose smaller components
- Manage page-level state

**Components**:
- Reusable UI elements
- Presentational components
- Container components
- Shared across pages

**Services**:
- API client functions
- HTTP request wrappers
- Data transformation
- Error handling

---

## File Naming Conventions

### Backend (JavaScript)

- **Files**: camelCase (e.g., `userController.js`)
- **Classes**: PascalCase (e.g., `class UserService`)
- **Functions**: camelCase (e.g., `function getUserById()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `const MAX_ATTEMPTS = 5`)

### Frontend (TypeScript/React)

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Services**: camelCase (e.g., `userAPI.ts`)
- **Types**: PascalCase (e.g., `interface UserData`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)

---

## Import/Export Patterns

### Backend

```javascript
// Named exports (preferred)
exports.getUsers = async (req, res) => { /* ... */ };
exports.createUser = async (req, res) => { /* ... */ };

// Default export (for models)
module.exports = mongoose.model('User', userSchema);
```

### Frontend

```typescript
// Named exports (preferred)
export const UserProfile: React.FC = () => { /* ... */ };
export const formatDate = (date: Date) => { /* ... */ };

// Default export (for pages)
export default UserDashboard;
```

---

## Code Organization Best Practices

### 1. Separation of Concerns

- Keep controllers thin (just handle HTTP)
- Put business logic in services
- Keep models focused on data structure
- Separate validation logic

### 2. DRY (Don't Repeat Yourself)

- Extract common logic to utilities
- Create reusable components
- Share types across modules
- Use middleware for common tasks

### 3. Single Responsibility

- Each file has one clear purpose
- Each function does one thing
- Each component has one responsibility

### 4. Dependency Direction

- Controllers depend on services
- Services depend on models
- Models don't depend on anything
- Utilities are independent

### 5. Modularity

- Modules are self-contained
- Minimal coupling between modules
- Clear interfaces between modules
- Easy to add/remove modules

---

## Adding New Features

### Backend Feature

1. Create module directory in `backend/modules/`
2. Add model in `models/`
3. Add service in `services/`
4. Add controller in `controllers/`
5. Add routes in `routes/`
6. Register routes in `server.js`

### Frontend Feature

1. Create module directory in `src/modules/`
2. Add components in `components/`
3. Add pages in `pages/`
4. Add API service in `services/`
5. Add routes in `App.tsx`

---

## Environment-Specific Files

### Development

- `.env` - Local development variables
- `backend/logs/app.log` - Development logs

### Production

- `.env.production` - Production variables
- Logs sent to external service

### Testing

- `.env.test` - Test environment variables
- Test database

---

## Build Output

### Frontend Build

```
dist/                   # Production build output
├── assets/            # Compiled JS, CSS, images
├── index.html         # Entry HTML file
└── ...
```

### Backend

No build step required (Node.js runs JavaScript directly)

---

## Version Control

### Tracked Files

- Source code (`src/`, `backend/`)
- Configuration files
- Documentation
- Package definitions

### Ignored Files (.gitignore)

- `node_modules/` - Dependencies
- `.env` - Environment variables
- `dist/` - Build output
- `backend/logs/` - Log files
- `.DS_Store` - macOS files
- `*.log` - Log files

---

## Summary

The MedAI project follows a modular, scalable architecture:

- **Backend**: MVC pattern with feature modules
- **Frontend**: Component-based with feature modules
- **Shared**: Common utilities and types
- **Documentation**: Comprehensive guides and references

This structure promotes:
- ✅ Code reusability
- ✅ Easy maintenance
- ✅ Clear separation of concerns
- ✅ Scalability
- ✅ Team collaboration

---

For more information, see the [main README](../README.md).
