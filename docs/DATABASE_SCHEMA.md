# Database Schema Documentation

Complete database schema reference for MedAI Healthcare Platform.

## Overview

MedAI uses MongoDB as its primary database with Mongoose ODM for schema definition and validation.

**Database Name**: `medai`

**Collections**: 9 main collections

---

## Collections

### 1. Users Collection

Stores patient/user account information and medical records.

```javascript
{
  // Authentication
  _id: ObjectId,
  fullName: String (required, max 50),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  verifyCode: String (required),
  verifyCodeExpiry: Date (required),
  isEmailVerified: Boolean (default: false),
  isPhoneVerified: Boolean (default: false),
  
  // Profile
  role: String (enum: ['patient', 'doctor', 'lab', 'insurance', 'admin', 'manager'], default: 'patient'),
  age: Number (required, min: 1, max: 120),
  gender: String (enum: ['male', 'female', 'other'], required),
  phone: String (required, 10 digits),
  healthId: String (unique, sparse),
  profilePicture: String (URL),
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: 'India')
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String (required),
    phone: String (required),
    relationship: String (required)
  },
  
  // Medical History
  medicalHistory: [{
    condition: String (required),
    diagnosis: String (required),
    treatment: String,
    medications: [String],
    doctorName: String,
    hospitalName: String,
    dateRecorded: Date (default: now),
    severity: String (enum: ['low', 'medium', 'high']),
    notes: String
  }],
  
  // Prescriptions
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
  
  // Lab Reports
  labReports: [{
    testName: String (required),
    testType: String (required),
    reportDate: Date (default: now),
    results: String,
    normalRange: String,
    labName: String,
    doctorReferred: String,
    fileUrl: String,
    status: String (enum: ['pending', 'completed', 'reviewed'])
  }],
  
  // Insurance
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    validUntil: Date,
    coverageAmount: Number,
    deductible: Number,
    isActive: Boolean (default: false)
  },
  
  // Scanned Documents (Health Vault)
  scannedDocuments: [{
    fileName: String (required),
    fileType: String (required),
    fileSize: Number (required),
    category: String (enum: ['medical-history', 'prescription', 'lab-report', 'other'], required),
    extractedText: String (required),
    aiAnalysis: {
      patientName: String,
      doctorName: String,
      date: Date,
      medications: [{
        name: String,
        dosage: String,
        frequency: String
      }],
      testResults: [{
        testName: String,
        value: String,
        normalRange: String
      }],
      diagnosis: String,
      labName: String
    },
    originalFileUrl: String,
    uploadDate: Date (default: now),
    isProcessed: Boolean (default: true),
    confidence: Number
  }],
  
  // Active Medicines
  active_medicine: [{
    name: String (required),
    timeToTake: String (required),
    daysGap: Number (required),
    startDate: Date (required)
  }],
  
  // Metadata
  lastLogin: Date,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ email: 1 } // unique
{ healthId: 1 } // unique, sparse
{ isActive: 1 }
{ 'medicalHistory.dateRecorded': -1 }
{ 'prescriptions.prescribedDate': -1 }
```

---

### 2. Doctors Collection

Stores doctor profiles and professional information.

```javascript
{
  // Authentication
  _id: ObjectId,
  fullName: String (required, max 50),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (default: 'doctor'),
  
  // Professional Info
  specialization: String (required, enum: [
    'General Medicine', 'Cardiology', 'Dermatology', 'Neurology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Radiology',
    'Surgery', 'Gynecology', 'Ophthalmology', 'ENT',
    'Oncology', 'Endocrinology', 'Gastroenterology'
  ]),
  licenseNumber: String (required, unique),
  experience: Number (required, min: 0),
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
    country: String (default: 'India')
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
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean }
  },
  
  // Business Metrics
  consultationFee: Number (required, min: 0),
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
  subscriptionPlan: String (enum: ['basic', 'pro', 'enterprise'], default: 'basic'),
  subscriptionExpiry: Date,
  
  profilePicture: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ email: 1 } // unique
{ licenseNumber: 1 } // unique
{ specialization: 1 }
{ isVerified: 1, isActive: 1 }
```

---

### 3. Labs Collection

Stores laboratory information and credentials.

```javascript
{
  // Authentication
  _id: ObjectId,
  name: String (required, max 100),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (default: 'lab'),
  
  // Registration
  licenseNumber: String (required, unique),
  registrationNumber: String (required, unique),
  accreditation: String (enum: ['NABL', 'CAP', 'ISO15189', 'Other'], required),
  
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
    country: String (default: 'India')
  },
  
  // Operating Hours
  operatingHours: {
    monday: { start: String, end: String, isOpen: Boolean },
    tuesday: { start: String, end: String, isOpen: Boolean },
    wednesday: { start: String, end: String, isOpen: Boolean },
    thursday: { start: String, end: String, isOpen: Boolean },
    friday: { start: String, end: String, isOpen: Boolean },
    saturday: { start: String, end: String, isOpen: Boolean },
    sunday: { start: String, end: String, isOpen: Boolean }
  },
  
  // Services & Equipment
  services: [String] (enum: [
    'Blood Tests', 'Urine Tests', 'Imaging', 'Pathology',
    'Microbiology', 'Biochemistry', 'Hematology', 'Serology',
    'Molecular Diagnostics', 'Histopathology', 'Cytology',
    'Immunology', 'Toxicology'
  ]),
  
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
  approvedBy: ObjectId (ref: 'Admin'),
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
    averageTurnaroundTime: Number,
    reportAccuracy: Number,
    patientSatisfaction: Number,
    onTimeDelivery: Number
  },
  
  // Subscription
  subscriptionPlan: String (enum: ['basic', 'pro', 'enterprise'], default: 'basic'),
  subscriptionExpiry: Date,
  
  profilePicture: String,
  documents: [{
    type: String (enum: ['license', 'accreditation', 'registration', 'insurance']),
    url: String,
    verified: Boolean (default: false),
    verifiedBy: ObjectId (ref: 'Admin'),
    verificationDate: Date
  }],
  
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ email: 1 } // unique
{ licenseNumber: 1 } // unique
{ registrationNumber: 1 } // unique
{ isApproved: 1, isActive: 1 }
{ 'address.city': 1, 'address.state': 1 }
```

---

### 4. Admins Collection

Stores administrator accounts and permissions.

```javascript
{
  _id: ObjectId,
  fullName: String (required, max 50),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['admin', 'super-admin', 'moderator'], default: 'admin'),
  
  // Permissions
  permissions: [String] (enum: [
    'manage_users', 'manage_doctors', 'manage_medicines',
    'approve_registrations', 'view_analytics', 'system_settings',
    'financial_reports', 'audit_logs', 'manage_admins'
  ]),
  
  department: String (enum: ['operations', 'medical', 'technical', 'compliance']),
  
  // Security
  isActive: Boolean (default: true),
  lastLogin: Date,
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  twoFactorEnabled: Boolean (default: false),
  twoFactorSecret: String,
  
  // Audit
  createdBy: ObjectId (ref: 'Admin'),
  auditLog: [{
    action: String (required),
    targetEntity: String (enum: ['user', 'doctor', 'medicine', 'appointment', 'system']),
    targetId: ObjectId (required),
    details: Mixed,
    ipAddress: String,
    userAgent: String,
    timestamp: Date (default: now)
  }],
  
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ email: 1 } // unique
{ role: 1, isActive: 1 }
```

---

### 5. Appointments Collection

Stores appointment bookings between patients and doctors.

```javascript
{
  _id: ObjectId,
  doctor: ObjectId (ref: 'Doctor', required),
  patient: ObjectId (ref: 'User', required),
  
  appointmentDate: Date (required),
  timeSlot: {
    start: String (required),
    end: String (required)
  },
  
  status: String (enum: [
    'pending', 'confirmed', 'completed', 
    'cancelled', 'rescheduled'
  ], default: 'pending'),
  
  type: String (enum: [
    'consultation', 'follow-up', 
    'emergency', 'routine-checkup'
  ], default: 'consultation'),
  
  symptoms: String (required),
  notes: String,
  diagnosis: String,
  prescription: ObjectId (ref: 'Prescription'),
  
  // Payment
  consultationFee: Number (required),
  paymentStatus: String (enum: ['pending', 'paid', 'refunded'], default: 'pending'),
  paymentMethod: String,
  transactionId: String,
  
  // Cancellation
  cancellationReason: String,
  cancelledBy: String (enum: ['patient', 'doctor', 'admin']),
  cancelledAt: Date,
  
  // Rescheduling
  rescheduledFrom: Date,
  rescheduledBy: String (enum: ['patient', 'doctor']),
  rescheduledAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ doctor: 1, appointmentDate: 1 }
{ patient: 1, status: 1 }
{ appointmentDate: 1, status: 1 }
```

---

### 6. Prescriptions Collection

Stores digital prescriptions issued by doctors.

```javascript
{
  _id: ObjectId,
  doctor: ObjectId (ref: 'Doctor', required),
  patient: ObjectId (ref: 'User', required),
  appointment: ObjectId (ref: 'Appointment'),
  
  // Prescription Details
  medications: [{
    name: String (required),
    dosage: String (required),
    frequency: String (required),
    duration: String (required),
    instructions: String,
    beforeFood: Boolean,
    afterFood: Boolean
  }],
  
  diagnosis: String (required),
  symptoms: [String],
  recommendations: String,
  followUpDate: Date,
  labTestsRecommended: [String],
  
  // Status
  status: String (enum: ['active', 'completed', 'discontinued'], default: 'active'),
  issuedDate: Date (default: now),
  validUntil: Date,
  
  // Digital Signature
  doctorSignature: String,
  digitalSignature: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ doctor: 1, issuedDate: -1 }
{ patient: 1, status: 1 }
{ appointment: 1 }
```

---

### 7. LabRequests Collection

Stores lab test requests from doctors/patients.

```javascript
{
  _id: ObjectId,
  requestNumber: String (unique, auto-generated),
  
  patient: ObjectId (ref: 'User', required),
  doctor: ObjectId (ref: 'Doctor'),
  lab: ObjectId (ref: 'Lab'),
  
  // Test Details
  testType: String (required),
  testName: String (required),
  priority: String (enum: ['routine', 'urgent', 'emergency'], default: 'routine'),
  
  // Status Tracking
  status: String (enum: [
    'Requested', 'Lab Assigned', 'Sample Collected',
    'Processing', 'Completed', 'Delivered'
  ], default: 'Requested'),
  
  // Sample Collection
  sampleCollection: {
    method: String (enum: ['home', 'lab', 'hospital']),
    address: String,
    scheduledDate: Date,
    collectedDate: Date,
    collectedBy: String,
    sampleCondition: String
  },
  
  // Billing
  billing: {
    totalAmount: Number,
    discount: Number,
    finalAmount: Number,
    paymentMethod: String,
    paymentStatus: String (enum: ['pending', 'paid', 'refunded']),
    transactionId: String
  },
  
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ requestNumber: 1 } // unique
{ patient: 1, status: 1 }
{ lab: 1, status: 1 }
{ 'sampleCollection.scheduledDate': 1 }
```

---

### 8. LabReports Collection

Stores lab test reports and results.

```javascript
{
  _id: ObjectId,
  reportNumber: String (unique, auto-generated),
  
  labRequest: ObjectId (ref: 'LabRequest', required),
  patient: ObjectId (ref: 'User', required),
  doctor: ObjectId (ref: 'Doctor'),
  lab: ObjectId (ref: 'Lab', required),
  
  // Test Information
  testType: String (required),
  testName: String (required),
  sampleCollectionDate: Date,
  reportDate: Date (default: now),
  
  // Results
  priority: String (enum: ['routine', 'urgent', 'emergency']),
  status: String (enum: ['pending', 'completed', 'reviewed'], default: 'pending'),
  
  files: [String], // URLs
  resultsSummary: String,
  findings: String,
  interpretation: String,
  recommendations: String,
  
  // Test Parameters
  testParameters: [{
    parameterName: String,
    value: String,
    unit: String,
    normalRange: String,
    isAbnormal: Boolean
  }],
  
  // Signatures
  technicianSignature: {
    name: String,
    qualification: String,
    signature: String,
    date: Date
  },
  
  pathologistSignature: {
    name: String,
    qualification: String,
    signature: String,
    date: Date
  },
  
  // Quality Control
  qualityControl: {
    reviewed: Boolean (default: false),
    reviewer: String,
    reviewDate: Date,
    qualityScore: Number,
    comments: String
  },
  
  // Sharing
  sharedWith: {
    patient: Boolean (default: true),
    doctor: Boolean (default: true),
    admin: Boolean (default: false)
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ reportNumber: 1 } // unique
{ patient: 1, reportDate: -1 }
{ lab: 1, status: 1 }
{ labRequest: 1 }
```

---

### 9. DoctorApprovals Collection

Tracks doctor registration approval workflow.

```javascript
{
  _id: ObjectId,
  doctor: ObjectId (ref: 'Doctor', required, unique),
  
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  
  // Verification
  documentsVerified: Boolean (default: false),
  licenseVerified: Boolean (default: false),
  qualificationsVerified: Boolean (default: false),
  
  // Admin Actions
  reviewedBy: ObjectId (ref: 'Admin'),
  reviewedAt: Date,
  comments: String,
  rejectionReason: String,
  
  // Notifications
  notificationsSent: [{
    type: String,
    sentAt: Date,
    status: String
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ doctor: 1 } // unique
{ status: 1, createdAt: -1 }
```

---

### 10. SystemLogs Collection

Stores system audit logs and activities.

```javascript
{
  _id: ObjectId,
  
  level: String (enum: ['info', 'warning', 'error', 'critical'], required),
  category: String (enum: [
    'authentication', 'user_action', 'doctor_action',
    'admin_action', 'ai', 'system', 'security'
  ], required),
  
  action: String (required),
  performedBy: ObjectId,
  performedByModel: String (enum: ['User', 'Doctor', 'Lab', 'Admin']),
  
  targetEntity: String,
  targetId: ObjectId,
  
  details: Mixed,
  
  // Request Info
  ipAddress: String,
  userAgent: String,
  requestUrl: String,
  requestMethod: String,
  
  // Error Info (if applicable)
  errorMessage: String,
  errorStack: String,
  
  timestamp: Date (default: now),
  createdAt: Date
}
```

**Indexes:**
```javascript
{ timestamp: -1 }
{ level: 1, category: 1 }
{ performedBy: 1, timestamp: -1 }
```

---

## Relationships

### One-to-Many Relationships

- User → Appointments (one user has many appointments)
- Doctor → Appointments (one doctor has many appointments)
- Doctor → Prescriptions (one doctor issues many prescriptions)
- User → Prescriptions (one user receives many prescriptions)
- Lab → LabReports (one lab generates many reports)
- User → LabReports (one user has many lab reports)

### One-to-One Relationships

- Doctor → DoctorApproval (one doctor has one approval record)
- Appointment → Prescription (one appointment may have one prescription)
- LabRequest → LabReport (one request generates one report)

### Embedded Documents

- User → medicalHistory (embedded array)
- User → prescriptions (embedded array)
- User → labReports (embedded array)
- User → scannedDocuments (embedded array)
- Doctor → qualifications (embedded array)
- Doctor → availability (embedded object)

---

## Data Validation

All schemas include validation rules:

- Required fields
- String length limits
- Number ranges
- Enum values
- Email format
- Phone number format
- Date ranges

---

## Performance Optimization

### Indexes

Indexes are created on:
- Unique fields (email, license numbers)
- Frequently queried fields (status, dates)
- Foreign key references
- Compound indexes for common queries

### Query Optimization

- Use `.select()` to limit returned fields
- Use `.lean()` for read-only queries
- Implement pagination for large datasets
- Use aggregation pipeline for complex queries

---

For more information, see the [main documentation](../README.md).
