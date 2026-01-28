# MedAI API Documentation

Complete API reference for the MedAI Healthcare Platform.

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.medai.com/api
```

## Authentication

Most endpoints require authentication using JWT tokens stored in HttpOnly cookies.

### Headers

```http
Content-Type: application/json
Cookie: token=<jwt_token>
```

---

## User/Patient Endpoints

### Authentication

#### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "age": 30,
  "gender": "male",
  "phone": "9876543210",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "9876543211",
    "relationship": "spouse"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

#### Logout User
```http
POST /users/logout
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Profile Management

#### Get User Profile
```http
GET /users/profile
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "gender": "male",
      "phone": "9876543210",
      "profilePicture": "url",
      "address": { /* address object */ },
      "emergencyContact": { /* emergency contact */ }
    }
  }
}
```

#### Update User Profile
```http
PUT /users/profile
```

**Request Body:**
```json
{
  "fullName": "John Updated",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

### Medical Records

#### Get Document Counts
```http
GET /users/document-counts
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "medicalHistoryCount": 5,
    "prescriptionsCount": 10,
    "labReportsCount": 8,
    "scannedDocumentsCount": 15
  }
}
```

#### Get Medical History
```http
GET /users/medical-history
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "medicalHistory": [
      {
        "_id": "record_id",
        "condition": "Hypertension",
        "diagnosis": "Stage 1 Hypertension",
        "treatment": "Lifestyle changes and medication",
        "medications": ["Amlodipine 5mg"],
        "doctorName": "Dr. Smith",
        "hospitalName": "City Hospital",
        "dateRecorded": "2024-01-15T00:00:00.000Z",
        "severity": "medium",
        "notes": "Monitor blood pressure regularly"
      }
    ]
  }
}
```

#### Add Medical History
```http
POST /users/medical-history
```

**Request Body:**
```json
{
  "condition": "Diabetes Type 2",
  "diagnosis": "Type 2 Diabetes Mellitus",
  "treatment": "Metformin and diet control",
  "medications": ["Metformin 500mg"],
  "doctorName": "Dr. Johnson",
  "hospitalName": "General Hospital",
  "severity": "medium",
  "notes": "Regular blood sugar monitoring required"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Medical history added successfully",
  "data": {
    "medicalRecord": { /* new record */ }
  }
}
```

#### Get Prescriptions
```http
GET /users/prescriptions
```

**Query Parameters:**
- `isActive` (optional): Filter by active status (true/false)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "prescriptions": [
      {
        "_id": "prescription_id",
        "medicationName": "Amoxicillin",
        "dosage": "500mg",
        "frequency": "3 times daily",
        "duration": "7 days",
        "prescribedBy": "Dr. Smith",
        "prescribedDate": "2024-01-20T00:00:00.000Z",
        "instructions": "Take after meals",
        "isActive": true
      }
    ]
  }
}
```

#### Add Prescription
```http
POST /users/prescriptions
```

**Request Body:**
```json
{
  "medicationName": "Paracetamol",
  "dosage": "500mg",
  "frequency": "3 times daily",
  "duration": "5 days",
  "prescribedBy": "Dr. Johnson",
  "instructions": "Take with water after meals"
}
```

**Response:** `201 Created`

#### Get Lab Reports
```http
GET /users/lab-reports
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "labReports": [
      {
        "_id": "report_id",
        "testName": "Complete Blood Count",
        "testType": "Blood Test",
        "reportDate": "2024-01-25T00:00:00.000Z",
        "results": "Normal",
        "normalRange": "4.5-11.0 x10^9/L",
        "labName": "PathLab",
        "doctorReferred": "Dr. Smith",
        "fileUrl": "https://cloudinary.com/...",
        "status": "completed"
      }
    ]
  }
}
```

#### Add Lab Report
```http
POST /users/lab-reports
```

**Request Body:**
```json
{
  "testName": "Lipid Profile",
  "testType": "Blood Test",
  "results": "Cholesterol: 180 mg/dL",
  "normalRange": "< 200 mg/dL",
  "labName": "DiagnosticLab",
  "doctorReferred": "Dr. Johnson",
  "fileUrl": "https://cloudinary.com/..."
}
```

**Response:** `201 Created`

### Health Vault (Scanned Documents)

#### Get Scanned Documents
```http
GET /users/scanned-documents
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "scannedDocuments": [
      {
        "_id": "doc_id",
        "fileName": "prescription_jan2024.pdf",
        "fileType": "application/pdf",
        "fileSize": 245678,
        "category": "prescription",
        "extractedText": "Patient: John Doe...",
        "aiAnalysis": {
          "patientName": "John Doe",
          "doctorName": "Dr. Smith",
          "date": "2024-01-15",
          "medications": [
            {
              "name": "Amoxicillin",
              "dosage": "500mg",
              "frequency": "3 times daily"
            }
          ]
        },
        "originalFileUrl": "https://cloudinary.com/...",
        "uploadDate": "2024-01-20T10:30:00.000Z",
        "isProcessed": true,
        "confidence": 0.95
      }
    ]
  }
}
```

#### Add Scanned Document
```http
POST /users/scanned-documents
```

**Request Body:**
```json
{
  "fileName": "lab_report.pdf",
  "fileType": "application/pdf",
  "fileSize": 156789,
  "category": "lab-report",
  "extractedText": "Test results...",
  "aiAnalysis": {
    "patientName": "John Doe",
    "testResults": [
      {
        "testName": "Hemoglobin",
        "value": "14.5 g/dL",
        "normalRange": "13-17 g/dL"
      }
    ]
  },
  "originalFileUrl": "https://cloudinary.com/...",
  "confidence": 0.92
}
```

**Response:** `201 Created`

#### Delete Scanned Document
```http
DELETE /users/scanned-documents/:documentId
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### Insurance

#### Get Insurance Details
```http
GET /users/insurance
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "insurance": {
      "provider": "Health Insurance Co.",
      "policyNumber": "POL123456",
      "groupNumber": "GRP789",
      "validUntil": "2025-12-31T00:00:00.000Z",
      "coverageAmount": 500000,
      "deductible": 10000,
      "isActive": true
    }
  }
}
```

#### Update Insurance
```http
PUT /users/insurance
```

**Request Body:**
```json
{
  "provider": "New Insurance Co.",
  "policyNumber": "POL654321",
  "coverageAmount": 1000000,
  "validUntil": "2026-12-31"
}
```

**Response:** `200 OK`

---

## AI Services Endpoints

### AI Diagnosis

#### Get AI Diagnosis
```http
POST /ai/diagnosis
```

**Request Body:**
```json
{
  "symptoms": "fever, headache, body ache",
  "age": 30,
  "gender": "male",
  "medicalHistory": ["hypertension"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "diagnosis": {
      "primaryCondition": "Viral Fever",
      "confidence": 0.85,
      "riskLevel": "low",
      "recommendations": [
        "Rest and hydration",
        "Take paracetamol for fever",
        "Consult doctor if symptoms persist"
      ],
      "urgency": "routine",
      "differentialDiagnoses": [
        {
          "condition": "Influenza",
          "probability": 0.75
        },
        {
          "condition": "Common Cold",
          "probability": 0.60
        }
      ],
      "redFlags": [],
      "ageSpecificFactors": [],
      "genderSpecificFactors": []
    }
  }
}
```

### Gemini Chat

#### Chat with AI
```http
POST /ai/chat
```

**Request Body:**
```json
{
  "message": "What are the symptoms of diabetes?",
  "conversationHistory": []
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "response": "Diabetes symptoms include increased thirst, frequent urination, extreme hunger, unexplained weight loss, fatigue, blurred vision, slow-healing sores, and frequent infections. If you experience these symptoms, consult a healthcare provider for proper diagnosis and treatment."
  }
}
```

### Gemini OCR

#### Extract Text from Image
```http
POST /ai/gemini-ocr/ocr
```

**Request Body:**
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "mimeType": "image/jpeg"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "extractedText": "Full extracted text from document...",
    "category": "prescription",
    "structuredData": {
      "patientName": "John Doe",
      "doctorName": "Dr. Smith",
      "date": "2024-01-15",
      "medications": [
        {
          "name": "Amoxicillin",
          "dosage": "500mg",
          "frequency": "3 times daily"
        }
      ]
    },
    "confidence": 0.95
  }
}
```

### Deepgram Services

#### Transcribe Audio
```http
POST /ai/deepgram/transcribe
```

**Request Body:**
```json
{
  "audioBase64": "base64_encoded_audio_data",
  "language": "en"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "transcript": "I have been experiencing headaches for the past three days",
    "confidence": 0.92
  }
}
```

#### Text to Speech
```http
POST /ai/deepgram/tts
```

**Request Body:**
```json
{
  "text": "Take this medication twice daily after meals",
  "language": "en"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "audioBase64": "base64_encoded_audio_data",
    "format": "mp3"
  }
}
```

### Translation

#### Translate Text
```http
POST /ai/translate
```

**Request Body:**
```json
{
  "text": "I have a headache",
  "sourceLanguage": "en",
  "targetLanguage": "hi"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "translatedText": "मुझे सिरदर्द है",
    "sourceLanguage": "en",
    "targetLanguage": "hi"
  }
}
```

#### Get Supported Languages
```http
GET /ai/translate/languages
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "languages": [
      { "code": "en-IN", "name": "English", "nativeName": "English" },
      { "code": "hi-IN", "name": "Hindi", "nativeName": "हिन्दी" },
      { "code": "bn-IN", "name": "Bengali", "nativeName": "বাংলা" }
      // ... more languages
    ]
  }
}
```

---

## Doctor Endpoints

### Authentication

#### Register Doctor
```http
POST /doctors/register
```

**Request Body:**
```json
{
  "fullName": "Dr. Sarah Johnson",
  "email": "sarah@example.com",
  "password": "SecurePass123",
  "specialization": "Cardiology",
  "licenseNumber": "MED123456",
  "experience": 10,
  "qualifications": [
    {
      "degree": "MBBS",
      "institution": "Medical College",
      "year": 2010
    },
    {
      "degree": "MD Cardiology",
      "institution": "Advanced Medical Institute",
      "year": 2014
    }
  ],
  "phone": "9876543210",
  "consultationFee": 500,
  "clinicDetails": {
    "name": "Heart Care Clinic",
    "address": "123 Medical Street, Mumbai",
    "phone": "9876543211"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Doctor registered successfully. Awaiting admin approval.",
  "data": {
    "doctor": { /* doctor object */ }
  }
}
```

#### Login Doctor
```http
POST /doctors/login
```

**Request Body:**
```json
{
  "email": "sarah@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`

### Profile Management

#### Get Doctor Profile
```http
GET /doctors/profile
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "doctor": {
      "_id": "doctor_id",
      "fullName": "Dr. Sarah Johnson",
      "email": "sarah@example.com",
      "specialization": "Cardiology",
      "licenseNumber": "MED123456",
      "experience": 10,
      "consultationFee": 500,
      "isVerified": true,
      "rating": {
        "average": 4.5,
        "count": 120
      },
      "totalPatients": 450,
      "totalEarnings": 225000
    }
  }
}
```

#### Update Doctor Profile
```http
PUT /doctors/profile
```

**Request Body:**
```json
{
  "consultationFee": 600,
  "clinicDetails": {
    "name": "Updated Clinic Name",
    "address": "New Address"
  }
}
```

**Response:** `200 OK`

---

## Admin Endpoints

### Authentication

#### Admin Login
```http
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@medai.com",
  "password": "AdminPass123"
}
```

**Response:** `200 OK`

### Dashboard

#### Get Dashboard Data
```http
GET /admin/dashboard
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalUsers": 5000,
    "totalDoctors": 250,
    "totalLabs": 50,
    "totalAppointments": 12000,
    "totalRevenue": 6000000,
    "recentActivities": [],
    "systemHealth": {
      "status": "healthy",
      "uptime": "99.9%"
    }
  }
}
```

### Medicine Management

#### Add Medicine
```http
POST /admin/medicine
```

**Request Body:**
```json
{
  "name": "Paracetamol",
  "genericName": "Acetaminophen",
  "category": "Analgesic",
  "dosage": "500mg",
  "manufacturer": "PharmaCo",
  "price": 50,
  "sideEffects": ["Nausea", "Allergic reactions"],
  "usage": "Pain relief and fever reduction"
}
```

**Response:** `201 Created`

#### Get Medicines
```http
GET /admin/medicine
```

**Query Parameters:**
- `search` (optional): Search by name
- `category` (optional): Filter by category

**Response:** `200 OK`

### Doctor Approval

#### Approve Doctor
```http
POST /admin/approve-doctor
```

**Request Body:**
```json
{
  "doctorId": "doctor_id",
  "approved": true,
  "comments": "All documents verified"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Doctor approved successfully"
}
```

### Notifications

#### Get Notifications
```http
GET /admin/notifications
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notif_id",
        "type": "doctor_registration",
        "message": "New doctor registration pending approval",
        "priority": "high",
        "read": false,
        "createdAt": "2024-01-25T10:00:00.000Z"
      }
    ]
  }
}
```

---

## Maps Endpoints

### Find Nearby Facilities
```http
POST /maps/nearby
```

**Request Body:**
```json
{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "radius": 5000,
  "type": "hospital"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "facilities": [
      {
        "id": "place_id",
        "name": "City Hospital",
        "location": "123 Main Street, Mumbai",
        "distance": "2.5 km",
        "rating": 4.5,
        "phone": "022-12345678",
        "services": ["Emergency", "ICU", "Surgery"],
        "availability": true
      }
    ]
  }
}
```

### Search Facilities
```http
POST /maps/search
```

**Request Body:**
```json
{
  "query": "cardiology hospital",
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

**Response:** `200 OK`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development)"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  }
}
```

---

## Webhooks (Future)

Webhook support for real-time notifications is planned for Phase 2.

---

For more information, see the [main documentation](../README.md).
