export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'patient' | 'doctor' | 'lab' | 'insurance' | 'admin' | 'manager';
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  healthId?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  insurance: Insurance;
  profilePicture?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface MedicalHistory {
  _id: string;
  condition: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  doctorName: string;
  hospitalName: string;
  dateRecorded: Date;
  severity: 'low' | 'medium' | 'high';
  notes: string;
}

export interface Prescription {
  _id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedDate: Date;
  instructions: string;
  isActive: boolean;
}

export interface LabReport {
  _id: string;
  testName: string;
  testType: string;
  reportDate: Date;
  results: string;
  normalRange: string;
  labName: string;
  doctorReferred: string;
  fileUrl: string;
  status: 'pending' | 'completed' | 'reviewed';
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  validUntil: Date;
  coverageAmount: number;
  deductible: number;
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  description: string;
  dosageForm: string;
  strength: string;
  price: number;
  availability: boolean;
  prescriptionRequired: boolean;
  sideEffects: string[];
  contraindications: string[];
  uses: string[];
  image: string;
}

export interface Paramedic {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  phone: string;
  services: string[];
  availability: boolean;
  emergencyContact: boolean;
}