# MedAI Healthcare Platform - Design Document

## 1. System Architecture

### 1.1 High-Level Architecture

MedAI follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  React 18 + TypeScript + TailwindCSS + Vite (Port 5173)    │
│  - User Portal    - Doctor Portal    - Lab Portal           │
│  - Admin Portal   - Public Pages                            │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│     Node.js + Express.js (Port 5000)                        │
│  - REST API Endpoints  - Authentication & Authorization     │
│  - Business Logic      - Validation & Error Handling        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  MongoDB (Mongoose ODM)  +  Cloudinary (File Storage)       │
│  - User Data    - Medical Records    - Documents            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   External Services Layer                    │
│  - Google Gemini AI (Chat & OCR)                            │
│  - Deepgram (Speech-to-Text & Text-to-Speech)              │
│  - Sarvam AI (Translation)                                  │
│  - Google Maps API (Location Services)                      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Patterns

#### 1.2.1 MVC (Model-View-Controller) Pattern

**Backend Structure:**
```
backend/modules/{module}/
├── models/          # Data models (Mongoose schemas)
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API route definitions
├── middlewares/     # Module-specific middleware
└── utils/           # Helper functions
```

**Frontend Structure:**
```
src/modules/{module}/
├── pages/           # Page components
├── components/      # Reusable UI components
└── services/        # API client functions
```

#### 1.2.2 Modular Architecture

The system is organized into independent, self-contained modules:
- **User Module**: Patient-facing features
- **Doctor Module**: Healthcare provider features
- **Lab Module**: Laboratory management features
- **Admin Module**: Platform administration features
- **AI Module**: AI services (diagnosis, chat, OCR, translation)
- **Maps Module**: Location-based services

Each module has its own models, controllers, services, and routes, promoting:
- Code reusability
- Easy maintenance
- Independent scaling
- Clear boundaries

#### 1.2.3 Service-Oriented Architecture

Business logic is encapsulated in service classes:
- `AIDiagnosisService`: Symptom analysis and diagnosis
- `GeminiChatService`: AI chat interactions
- `GeminiOcrService`: Document OCR processing
- `DeepgramService`: Audio transcription and TTS
- `TranslationService`: Multi-language translation
- `UserService`, `DoctorService`, `LabService`: Domain-specific operations

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.3 | Type-safe JavaScript |
| Vite | 5.4.2 | Build tool and dev server |
| TailwindCSS | 3.4.1 | Utility-first CSS framework |
| React Router | 6.29.0 | Client-side routing |
| Axios | 1.7.9 | HTTP client |
| React Hook Form | 7.54.2 | Form management |
| Yup | 1.4.0 | Form validation |
| React Hot Toast | 2.6.0 | Toast notifications |
| Framer Motion | 11.15.0 | Animations |
| Lucide React | 0.344.0 | Icon library |
| Recharts | 3.1.2 | Data visualization |

### 2.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.21.2 | Web framework |
| MongoDB | 6+ | NoSQL database |
| Mongoose | 8.18.0 | MongoDB ODM |
| JWT | 9.0.2 | Authentication tokens |
| Bcrypt.js | 3.0.2 | Password hashing |
| Joi | 18.0.1 | Input validation |
| Helmet | 8.0.0 | Security headers |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Express Rate Limit | 7.4.1 | Rate limiting |
| Cookie Parser | 1.4.7 | Cookie handling |
| Multer | 1.4.5 | File upload handling |
| Dotenv | 16.6.1 | Environment variables |

### 2.3 AI & External Services

| Service | Purpose | API |
|---------|---------|-----|
| Google Gemini AI | Chat responses & OCR | @google/generative-ai 0.24.1 |
| Deepgram | Speech-to-text & Text-to-speech | REST API |
| Sarvam AI | Multi-language translation | REST API |
| Google Maps | Location services | REST API |
| Cloudinary | File storage & CDN | cloudinary 2.7.0 |

### 2.4 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Nodemon | Auto-restart dev server |
| Concurrently | Run multiple npm scripts |
| PostCSS | CSS processing |
| Autoprefixer | CSS vendor prefixes |

## 3. Database Design

### 3.1 Database Schema Overview

The system uses MongoDB with the following collections:

1. **users** - Patient/user accounts and health data
2. **doctors** - Doctor profiles and credentials
3. **labs** - Laboratory information
4. **admins** - Administrator accounts
5. **appointments** - Appointment bookings
6. **prescriptions** - Medical prescriptions
7. **labrequests** - Lab test requests
8. **labreports** - Lab test reports
8. **doctorapprovals** - Doctor approval workflow
9. **systemlogs** - System audit logs

### 3.2 Detailed Schema Designs

#### 3.2.1 User Schema


```javascript
{
  // Authentication
  fullName: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 8 chars),
  verifyCode: String (required),
  verifyCodeExpiry: Date (required),
  isEmailVerified: Boolean (default: false),
  isPhoneVerified: Boolean (default: false),
  
  // Profile
  role: String (enum: patient/doctor/lab/insurance/admin/manager, default: patient),
  age: Number (required, 1-120),
  gender: String (enum: male/female/other, required),
  phone: String (required, 10 digits),
  healthId: String (unique, sparse),
  profilePicture: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: India)
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String (required),
    phone: String (required),
    relationship: String (required)
  },
  
  // Medical Data (Embedded Arrays)
  medicalHistory: [{
    condition: String (required),
    diagnosis: String (required),
    treatment: String,
    medications: [String],
    doctorName: String,
    hospitalName: String,
    dateRecorded: Date (default: now),
    severity: String (enum: low/medium/high),
    notes: String
  }],
  
  prescriptions: [{
    medicationName: String (required),
    dosage: String (required),
    frequency: String (required),
    duration: String (required),
    prescribedBy: String (required),
    prescribedDate: Date (default: now),
    instructions: String,
    isActive: Boolean (default: true)
  }],
  
  labReports: [{
    testName: String (required),
    testType: String (required),
    reportDate: Date (default: now),
    results: String,
    normalRange: String,
    labName: String,
    doctorReferred: String,
    fileUrl: String,
    status: String (enum: pending/completed/reviewed)
  }],
  
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    validUntil: Date,
    coverageAmount: Number,
    deductible: Number,
    isActive: Boolean (default: false)
  },
  
  scannedDocuments: [{
    fileName: String (required),
    fileType: String (required),
    fileSize: Number (required),
    category: String (enum: medical-history/prescription/lab-report/other, required),
    extractedText: String (required),
    aiAnalysis: {
      patientName: String,
      doctorName: String,
      date: Date,
      medications: [{ name, dosage, frequency }],
      testResults: [{ testName, value, normalRange }],
      diagnosis: String,
      labName: String
    },
    originalFileUrl: String,
    uploadDate: Date (default: now),
    isProcessed: Boolean (default: true),
    confidence: Number
  }],
  
  active_medicine: [{
    name: String (required),
    timeToTake: String (required),
    daysGap: Number (required),
    startDate: Date (required)
  }],
  
  // Metadata
  lastLogin: Date,
  isActive: Boolean (default: true),
  timestamps: true (createdAt, updatedAt)
}
```

**Indexes:**
- `email` (unique)
- `healthId` (unique, sparse)
- `isActive`

#### 3.2.2 Doctor Schema

```javascript
{
  // Authentication
  fullName: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 8 chars),
  role: String (default: doctor),
  
  // Professional Info
  specialization: String (required, enum: 15 specializations),
  licenseNumber: String (required, unique),
  experience: Number (required, min 0),
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  
  // Contact
  phone: String (required, 10 digits),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: India)
  },
  
  // Clinic Details
  clinicDetails: {
    name: String,
    address: String,
    phone: String,
    timings: {
      start: String,
      end: String,
      days: [String]
    }
  },
  
  // Availability
  availability: {
    monday: { start, end, available: Boolean },
    tuesday: { start, end, available: Boolean },
    // ... for all days
  },
  
  // Business Metrics
  consultationFee: Number (required, min 0),
  totalPatients: Number (default: 0),
  totalEarnings: Number (default: 0),
  rating: {
    average: Number (default: 3),
    count: Number (default: 3)
  },
  
  // Verification
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  documents: [{
    type: String,
    url: String,
    verified: Boolean (default: false)
  }],
  
  // Subscription
  subscriptionPlan: String (enum: basic/pro/enterprise, default: basic),
  subscriptionExpiry: Date,
  
  profilePicture: String,
  lastLogin: Date,
  timestamps: true
}
```

**Indexes:**
- `email` (unique)
- `licenseNumber` (unique)
- `specialization`
- `isVerified`
- `isActive`

**Post-save Hook:** Initiates doctor approval workflow on registration

#### 3.2.3 Lab Schema

```javascript
{
  // Authentication
  name: String (required, max 100 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 8 chars),
  role: String (default: lab),
  
  // Registration
  licenseNumber: String (required, unique),
  registrationNumber: String (required, unique),
  accreditation: String (enum: NABL/CAP/ISO15189/Other, required),
  
  // Contact
  contactInfo: {
    phone: String (required, 10 digits),
    alternatePhone: String,
    fax: String,
    website: String
  },
  
  address: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (default: India)
  },
  
  // Operating Hours
  operatingHours: {
    monday: { start, end, isOpen: Boolean },
    // ... for all days
  },
  
  // Services & Equipment
  services: [String] (enum: 13 service types),
  equipment: [{
    name: String,
    model: String,
    manufacturer: String,
    calibrationDate: Date,
    nextCalibrationDue: Date
  }],
  
  staff: [{
    name: String,
    qualification: String,
    role: String,
    licenseNumber: String
  }],
  
  // Approval & Status
  isApproved: Boolean (default: false),
  isActive: Boolean (default: true),
  approvedBy: ObjectId (ref: Admin),
  approvalDate: Date,
  rejectionReason: String,
  
  // Business Metrics
  rating: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  totalReports: Number (default: 0),
  totalRevenue: Number (default: 0),
  
  // Quality Metrics
  qualityMetrics: {
    averageTurnaroundTime: Number (hours),
    reportAccuracy: Number (percentage),
    patientSatisfaction: Number (rating),
    onTimeDelivery: Number (percentage)
  },
  
  // Subscription
  subscriptionPlan: String (enum: basic/pro/enterprise, default: basic),
  subscriptionExpiry: Date,
  
  profilePicture: String,
  documents: [{
    type: String (enum: license/accreditation/registration/insurance),
    url: String,
    verified: Boolean (default: false),
    verifiedBy: ObjectId (ref: Admin),
    verificationDate: Date
  }],
  
  lastLogin: Date,
  timestamps: true
}
```

**Indexes:**
- `email` (unique)
- `licenseNumber` (unique)
- `registrationNumber` (unique)
- `isApproved`
- `isActive`

#### 3.2.4 Admin Schema

```javascript
{
  // Authentication
  fullName: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 8 chars),
  role: String (enum: admin/super-admin/moderator, default: admin),
  
  // Permissions
  permissions: [String] (enum: 9 permission types),
  department: String (enum: operations/medical/technical/compliance),
  
  // Security
  isActive: Boolean (default: true),
  lastLogin: Date,
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  twoFactorEnabled: Boolean (default: false),
  twoFactorSecret: String,
  
  // Audit
  createdBy: ObjectId (ref: Admin),
  auditLog: [{
    action: String (required),
    targetEntity: String (enum: user/doctor/medicine/appointment/system),
    targetId: ObjectId (required),
    details: Mixed,
    ipAddress: String,
    userAgent: String,
    timestamp: Date (default: now)
  }],
  
  profilePicture: String,
  timestamps: true
}
```

**Methods:**
- `comparePassword()`: Verify password
- `isLocked()`: Check if account is locked
- `incLoginAttempts()`: Increment failed login attempts
- `logAction()`: Add entry to audit log

**Indexes:**
- `email` (unique)
- `role`
- `isActive`

#### 3.2.5 Appointment Schema

```javascript
{
  doctor: ObjectId (ref: Doctor, required),
  patient: ObjectId (ref: User, required),
  appointmentDate: Date (required),
  timeSlot: {
    start: String (required),
    end: String (required)
  },
  status: String (enum: pending/confirmed/completed/cancelled/rescheduled, default: pending),
  type: String (enum: consultation/follow-up/emergency/routine-checkup, default: consultation),
  symptoms: String (required),
  notes: String,
  diagnosis: String,
  prescription: ObjectId (ref: Prescription),
  
  // Payment
  consultationFee: Number (required),
  paymentStatus: String (enum: pending/paid/refunded, default: pending),
  paymentMethod: String,
  transactionId: String,
  
  // Cancellation
  cancellationReason: String,
  cancelledBy: String (enum: patient/doctor/admin),
  cancelledAt: Date,
  
  // Rescheduling
  rescheduledFrom: Date,
  rescheduledBy: String (enum: patient/doctor),
  rescheduledAt: Date,
  
  timestamps: true
}
```

**Indexes:**
- `doctor`, `appointmentDate` (compound)
- `patient`, `status` (compound)
- `appointmentDate`, `status` (compound)

---

## 4. API Design

### 4.1 RESTful API Principles

The API follows REST architectural style:

- **Resource-based URLs**: `/api/users`, `/api/doctors`
- **HTTP methods**: GET, POST, PUT, DELETE, PATCH
- **Stateless**: Each request contains all necessary information
- **JSON format**: Request and response bodies use JSON
- **HTTP status codes**: Proper status codes for responses

### 4.2 API Versioning

Current version: v1 (implicit in base URL)

Future versions will use URL versioning:
- v1: `/api/users`
- v2: `/api/v2/users`

### 4.3 Request/Response Format

#### Standard Success Response

```javascript
{
  success: true,
  message: "Operation successful",
  data: {
    // Response data
  }
}
```

#### Standard Error Response

```javascript
{
  success: false,
  message: "Error message",
  errors: [
    {
      field: "email",
      message: "Invalid email format"
    }
  ]
}
```

### 4.4 Authentication Flow

```
1. User Registration
   POST /api/users/register
   → Create user with hashed password
   → Generate verification code
   → Send verification email
   → Return user data (without password)

2. Email Verification
   POST /api/users/verify-email
   → Verify code
   → Mark email as verified
   → Return success

3. User Login
   POST /api/users/login
   → Validate credentials
   → Generate JWT token
   → Set HttpOnly cookie
   → Return user data and token

4. Protected Routes
   GET /api/users/profile
   → Verify JWT token from cookie
   → Decode user ID from token
   → Fetch and return user data

5. User Logout
   POST /api/users/logout
   → Clear authentication cookie
   → Return success
```

### 4.5 Error Handling Strategy

**Error Hierarchy:**

```javascript
// Base Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Specific Error Classes
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}
```

**Global Error Handler:**

```javascript
app.use((err, req, res, next) => {
  // Log error
  logger.error(err);
  
  // Operational errors (expected)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
  
  // Programming errors (unexpected)
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});
```

---

## 5. Security Design

### 5.1 Authentication Security

**Password Security:**
- Minimum 8 characters
- Hashed using bcrypt with 12 salt rounds
- Never stored in plain text
- Never logged or exposed in responses

**JWT Token Security:**
- Signed with secret key (min 32 characters)
- 7-day expiration
- Stored in HttpOnly cookies (prevents XSS)
- Secure flag in production (HTTPS only)
- SameSite=strict (prevents CSRF)

**Session Security:**
- Stateless authentication (JWT)
- Token refresh mechanism
- Logout invalidates token
- Account lockout after 5 failed attempts

### 5.2 Authorization Design

**Role-Based Access Control (RBAC):**

```javascript
// User Roles
const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  LAB: 'lab',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
  MODERATOR: 'moderator'
};

// Admin Permissions
const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_DOCTORS: 'manage_doctors',
  MANAGE_MEDICINES: 'manage_medicines',
  APPROVE_REGISTRATIONS: 'approve_registrations',
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_SETTINGS: 'system_settings',
  FINANCIAL_REPORTS: 'financial_reports',
  AUDIT_LOGS: 'audit_logs',
  MANAGE_ADMINS: 'manage_admins'
};

// Authorization Middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError('Access denied');
    }
    next();
  };
};

// Permission Check
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      throw new AuthorizationError('Insufficient permissions');
    }
    next();
  };
};
```

### 5.3 Data Security

**Encryption:**
- All data in transit encrypted (HTTPS/TLS)
- Sensitive data encrypted at rest
- Database connections encrypted
- API keys stored in environment variables

**Input Validation:**
- Server-side validation with Joi
- Client-side validation with Yup
- Sanitization to prevent injection attacks
- Type checking with TypeScript

**Output Encoding:**
- HTML encoding for user-generated content
- JSON encoding for API responses
- Prevent XSS attacks

### 5.4 API Security

**Rate Limiting:**
```javascript
// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests'
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true
});
```

**CORS Configuration:**
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
```

**Security Headers (Helmet):**
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- X-XSS-Protection

---

## 6. Frontend Design

### 6.1 Component Architecture

**Component Hierarchy:**

```
App
├── Public Pages
│   ├── HomePage
│   ├── AboutPage
│   ├── FeaturesPage
│   └── AuthPage
│
├── User Portal
│   ├── UserDashboard
│   ├── MedicalHistory
│   ├── Prescriptions
│   ├── LabReports
│   ├── HealthVault
│   ├── AIChatbot
│   ├── Paramedics
│   └── Appointments
│
├── Doctor Portal
│   ├── DoctorDashboard
│   ├── DoctorAppointments
│   ├── DoctorPatients
│   ├── DoctorPrescriptions
│   ├── DoctorEarnings
│   └── DoctorProfile
│
├── Lab Portal
│   ├── LabDashboard
│   ├── LabRequests
│   ├── LabReports
│   ├── LabQualityControl
│   └── LabProfile
│
└── Admin Portal
    ├── AdminDashboard
    ├── ManageUsers
    ├── ManageDoctors
    ├── ManageLabs
    ├── ManageMedicines
    └── AdminNotifications
```

### 6.2 State Management

**Local State (useState):**
- Component-specific UI state
- Form inputs
- Toggle states

**Context API:**
- Authentication state (useAuth)
- User information
- Theme preferences

**Server State (React Query - Future):**
- API data caching
- Automatic refetching
- Optimistic updates

### 6.3 Routing Strategy

```typescript
// Public Routes
/ → HomePage
/about → AboutPage
/features → FeaturesPage
/auth → AuthPage

// User Routes (Protected)
/user/dashboard → UserDashboard
/user/medical-history → MedicalHistory
/user/prescriptions → Prescriptions
/user/lab-reports → LabReports
/user/health-vault → HealthVault
/user/ai-chatbot → AIChatbot
/user/paramedics → Paramedics
/user/appointments → Appointments

// Doctor Routes (Protected)
/doctor/dashboard → DoctorDashboard
/doctor/appointments → DoctorAppointments
/doctor/patients → DoctorPatients
/doctor/prescriptions → DoctorPrescriptions
/doctor/earnings → DoctorEarnings
/doctor/profile → DoctorProfile

// Lab Routes (Protected)
/lab/dashboard → LabDashboard
/lab/requests → LabRequests
/lab/reports → LabReports
/lab/quality-control → LabQualityControl
/lab/profile → LabProfile

// Admin Routes (Protected)
/admin/dashboard → AdminDashboard
/admin/users → ManageUsers
/admin/doctors → ManageDoctors
/admin/labs → ManageLabs
/admin/medicines → ManageMedicines
/admin/notifications → AdminNotifications
```

### 6.4 UI/UX Design Principles

**Design System:**
- Consistent color palette (blue primary, green success, red error)
- Typography hierarchy (headings, body, captions)
- Spacing system (4px base unit)
- Component library (buttons, inputs, cards, modals)

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible layouts with CSS Grid and Flexbox
- Touch-friendly UI elements

**Accessibility:**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance (WCAG 2.1 AA)

**User Feedback:**
- Loading states (spinners, skeletons)
- Success/error toast notifications
- Form validation messages
- Confirmation dialogs for destructive actions

---

## 7. AI Services Integration

### 7.1 Google Gemini AI

**Use Cases:**
1. **Health Chatbot**: Conversational AI for health queries
2. **OCR**: Extract text from medical documents

**Implementation:**

```javascript
// Gemini Chat Service
class GeminiChatService {
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    });
  }
  
  async chat(message, conversationHistory) {
    const chat = this.model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    });
    
    const result = await chat.sendMessage(message);
    return result.response.text();
  }
}

// Gemini OCR Service
class GeminiOcrService {
  async extractText(imageBase64, mimeType) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });
    
    const prompt = `Extract all text from this medical document...`;
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      }
    ]);
    
    return this.parseResponse(result.response.text());
  }
}
```

### 7.2 Deepgram Integration

**Use Cases:**
1. **Speech-to-Text**: Transcribe voice messages
2. **Text-to-Speech**: Convert AI responses to audio

**Implementation:**

```javascript
class DeepgramService {
  async transcribe(audioBase64, language = 'en') {
    const response = await fetch(
      'https://api.deepgram.com/v1/listen',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/wav'
        },
        body: Buffer.from(audioBase64, 'base64')
      }
    );
    
    const data = await response.json();
    return data.results.channels[0].alternatives[0].transcript;
  }
  
  async textToSpeech(text, language = 'en') {
    const response = await fetch(
      'https://api.deepgram.com/v1/speak?model=aura-asteria-en',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      }
    );
    
    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer).toString('base64');
  }
}
```

### 7.3 Sarvam AI Translation

**Use Cases:**
- Translate health queries to English
- Translate AI responses to user's language
- Support 22+ Indian languages

**Implementation:**

```javascript
class TranslationService {
  async translate(text, sourceLanguage, targetLanguage) {
    const response = await fetch(
      'https://api.sarvam.ai/translate',
      {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: text,
          source_language_code: sourceLanguage,
          target_language_code: targetLanguage,
          speaker_gender: 'Male',
          mode: 'formal',
          model: 'mayura:v1',
          enable_preprocessing: true
        })
      }
    );
    
    const data = await response.json();
    return data.translated_text;
  }
}
```

### 7.4 AI Diagnosis Service

**Workflow:**

```
1. User Input
   ↓
2. Symptom Analysis
   - Parse symptoms
   - Consider age, gender
   - Review medical history
   ↓
3. AI Processing (Gemini)
   - Generate diagnosis
   - Assess risk level
   - Provide recommendations
   ↓
4. Response Formatting
   - Primary condition
   - Confidence score
   - Differential diagnoses
   - Urgency level
   - Red flags
   ↓
5. Return to User
```

**Implementation:**

```javascript
class AIDiagnosisService {
  async analyzeSy mptoms(symptoms, age, gender, medicalHistory) {
    const prompt = this.buildPrompt(symptoms, age, gender, medicalHistory);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return this.parseResponse(response);
  }
  
  buildPrompt(symptoms, age, gender, medicalHistory) {
    return `
      You are a medical AI assistant. Analyze the following:
      
      Symptoms: ${symptoms}
      Age: ${age}
      Gender: ${gender}
      Medical History: ${medicalHistory.join(', ')}
      
      Provide:
      1. Primary condition (most likely diagnosis)
      2. Confidence score (0-1)
      3. Risk level (low/medium/high)
      4. Recommendations
      5. Urgency (routine/urgent/emergency)
      6. Differential diagnoses (other possibilities)
      7. Red flags (warning signs)
      
      Format as JSON.
    `;
  }
  
  parseResponse(response) {
    // Parse and validate AI response
    const data = JSON.parse(response);
    
    return {
      primaryCondition: data.primary_condition,
      confidence: data.confidence,
      riskLevel: data.risk_level,
      recommendations: data.recommendations,
      urgency: data.urgency,
      differentialDiagnoses: data.differential_diagnoses,
      redFlags: data.red_flags
    };
  }
}
```

---

## 8. File Storage Design

### 8.1 Cloudinary Integration

**Use Cases:**
- Profile pictures
- Medical documents
- Lab reports
- Prescription images

**Configuration:**

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

**Upload Strategy:**

```javascript
// Organized folder structure
const uploadFile = async (file, folder) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: `medai/${folder}`,
    resource_type: 'auto',
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });
  
  return {
    url: result.secure_url,
    publicId: result.public_id
  };
};

// Folder structure:
// medai/
//   ├── profiles/
//   ├── documents/
//   ├── prescriptions/
//   └── lab-reports/
```

---

## 9. Performance Optimization

### 9.1 Database Optimization

**Indexing Strategy:**
```javascript
// Frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ healthId: 1 });
userSchema.index({ isActive: 1 });

// Compound indexes for common queries
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ patient: 1, status: 1 });

// Text indexes for search
medicineSchema.index({ name: 'text', genericName: 'text' });
```

**Query Optimization:**
```javascript
// Use lean() for read-only queries
const users = await User.find().lean();

// Select only needed fields
const users = await User.find().select('name email');

// Limit results
const users = await User.find().limit(10);

// Use pagination
const page = 1;
const limit = 10;
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

### 9.2 API Optimization

**Response Compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

**Caching Strategy:**
```javascript
// Cache static data
const cache = new Map();

const getCachedData = async (key, fetchFunction, ttl = 3600) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl * 1000) {
      return data;
    }
  }
  
  const data = await fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

### 9.3 Frontend Optimization

**Code Splitting:**
```typescript
// Lazy load routes
const UserDashboard = lazy(() => import('./modules/user/pages/UserDashboard'));
const DoctorDashboard = lazy(() => import('./modules/doctor/pages/DoctorDashboard'));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <UserDashboard />
</Suspense>
```

**Image Optimization:**
```typescript
// Use Cloudinary transformations
const optimizedUrl = `${imageUrl}?w=800&q=auto&f=auto`;

// Lazy load images
<img loading="lazy" src={imageUrl} alt="..." />
```

**Bundle Optimization:**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'recharts']
        }
      }
    }
  }
});
```

---

## 10. Monitoring & Logging

### 10.1 Application Logging

**Winston Logger Configuration:**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/app.log' 
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

**Log Levels:**
- **error**: Error events
- **warn**: Warning events
- **info**: Informational messages
- **debug**: Debug messages (development only)

### 10.2 Audit Logging

**System Logs:**
```javascript
const logSystemEvent = async (level, category, action, details) => {
  await SystemLog.create({
    level,
    category,
    action,
    performedBy: req.user?._id,
    performedByModel: req.user?.role,
    details,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    requestUrl: req.originalUrl,
    requestMethod: req.method,
    timestamp: new Date()
  });
};
```

**Admin Audit Log:**
```javascript
const logAdminAction = async (admin, action, targetEntity, targetId, details) => {
  admin.auditLog.push({
    action,
    targetEntity,
    targetId,
    details,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date()
  });
  
  await admin.save();
};
```

---

## 11. Testing Strategy

### 11.1 Testing Pyramid

```
        /\
       /  \
      / E2E \
     /______\
    /        \
   /Integration\
  /____________\
 /              \
/  Unit Tests    \
/________________\
```

### 11.2 Unit Testing

**Backend (Mocha/Chai):**
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Test123'
      };
      
      const user = await userService.createUser(userData);
      
      expect(user).to.have.property('_id');
      expect(user.email).to.equal(userData.email);
    });
  });
});
```

**Frontend (Jest/React Testing Library):**
```typescript
describe('UserProfile', () => {
  it('renders user information', () => {
    const user = { fullName: 'John Doe', email: 'john@example.com' };
    
    render(<UserProfile user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### 11.3 Integration Testing

**API Testing:**
```javascript
describe('User API', () => {
  it('POST /api/users/register should create user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Test123',
        age: 30,
        gender: 'male',
        phone: '9876543210'
      });
    
    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
    expect(response.body.data.user).to.have.property('_id');
  });
});
```

### 11.4 End-to-End Testing

**Cypress (Future):**
```javascript
describe('User Registration Flow', () => {
  it('should register a new user', () => {
    cy.visit('/auth');
    cy.get('[data-testid="signup-tab"]').click();
    cy.get('[name="fullName"]').type('Test User');
    cy.get('[name="email"]').type('test@example.com');
    cy.get('[name="password"]').type('Test123');
    cy.get('[type="submit"]').click();
    cy.url().should('include', '/user/dashboard');
  });
});
```

---

## 12. Deployment Architecture

### 12.1 Development Environment

```
Developer Machine
├── Frontend (Vite Dev Server) - Port 5173
├── Backend (Nodemon) - Port 5000
└── MongoDB (Local) - Port 27017
```

### 12.2 Production Environment

```
                    ┌─────────────┐
                    │   Cloudflare │
                    │   CDN + DNS  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Load Balancer │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ Backend │       │ Backend │       │ Backend │
   │ Server 1│       │ Server 2│       │ Server 3│
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼───────┐
                    │   MongoDB    │
                    │   Cluster    │
                    └──────────────┘
```

### 12.3 Scaling Strategy

**Horizontal Scaling:**
- Multiple backend instances behind load balancer
- Stateless application design
- Session data in Redis (future)

**Database Scaling:**
- MongoDB sharding for large datasets
- Read replicas for read-heavy operations
- Indexes for query optimization

**CDN:**
- Static assets served via Cloudinary CDN
- Frontend build served via Cloudflare/Vercel CDN

---

## 13. Future Enhancements

### 13.1 Phase 2 Features

1. **Telemedicine**
   - Video consultations (WebRTC)
   - Screen sharing
   - Chat during consultation
   - Recording and playback

2. **Payment Integration**
   - Razorpay/Stripe integration
   - Consultation fee processing
   - Lab test payments
   - Invoice generation

3. **Mobile Applications**
   - React Native apps
   - iOS and Android
   - Push notifications
   - Offline mode

4. **Advanced Analytics**
   - Predictive health analytics
   - Treatment outcome tracking
   - Population health insights
   - Custom reports

### 13.2 Technical Improvements

1. **Performance**
   - Redis caching layer
   - GraphQL API (alternative to REST)
   - Server-side rendering (SSR)
   - Progressive Web App (PWA)

2. **Monitoring**
   - Application Performance Monitoring (APM)
   - Real-time error tracking (Sentry)
   - User analytics (Mixpanel/Amplitude)
   - Infrastructure monitoring (Datadog)

3. **Testing**
   - Automated E2E tests
   - Visual regression testing
   - Load testing
   - Security testing

4. **DevOps**
   - CI/CD pipeline (GitHub Actions)
   - Docker containerization
   - Kubernetes orchestration
   - Infrastructure as Code (Terraform)

---

## 14. Conclusion

The MedAI Healthcare Platform is designed with:

- **Scalability**: Modular architecture supports growth
- **Security**: Multiple layers of protection
- **Performance**: Optimized for speed and efficiency
- **Maintainability**: Clean code and clear structure
- **Extensibility**: Easy to add new features
- **Reliability**: Robust error handling and logging

This design document serves as a blueprint for development, ensuring consistency and quality across the platform.

---

**Document Version**: 1.0  
**Last Updated**: January 25, 2025  
**Status**: Complete

For more information, see the [main documentation](README.md).