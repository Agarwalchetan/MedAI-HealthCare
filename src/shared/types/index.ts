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
    user?: User;
    doctor?: Doctor;
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
  id: number;
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
  image?: string;
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

export interface Doctor {
  _id: string;
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualifications: Qualification[];
  phone: string;
  address: Address;
  clinicDetails: ClinicDetails;
  consultationFee: number;
  isVerified: boolean;
  isActive: boolean;
  rating: Rating;
  totalPatients: number;
  totalEarnings: number;
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  subscriptionExpiry: Date;
  profilePicture: string;
  availability: WeeklyAvailability;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
}

export interface ClinicDetails {
  name: string;
  address: string;
  phone: string;
  timings: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface Rating {
  average: number;
  count: number;
}

export interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface DayAvailability {
  start: string;
  end: string;
  available: boolean;
}

export interface Appointment {
  _id: string;
  doctor: Doctor | string;
  patient: User | string;
  appointmentDate: Date;
  timeSlot: {
    start: string;
    end: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup';
  symptoms: string;
  notes: string;
  diagnosis: string;
  prescription: string;
  consultationFee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  meetingLink: string;
  cancelReason: string;
  rating: {
    score: number;
    feedback: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorPrescription {
  _id: string;
  doctor: Doctor | string;
  patient: User | string;
  appointment: Appointment | string;
  medications: Medication[];
  diagnosis: string;
  symptoms: string;
  recommendations: string;
  followUpDate: Date;
  labTestsRecommended: LabTest[];
  status: 'active' | 'completed' | 'discontinued';
  digitalSignature: string;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  beforeFood: boolean;
}

export interface LabTest {
  testName: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface DoctorStats {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
  totalPrescriptions: number;
  totalEarnings: number;
  rating: Rating;
}

export interface Earnings {
  _id: string;
  doctor: string;
  appointment: string;
  patient: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'cash';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payoutStatus: 'pending' | 'processed' | 'failed';
  payoutDate: Date;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lab {
  _id: string;
  name: string;
  email: string;
  licenseNumber: string;
  registrationNumber: string;
  accreditation: string;
  contactInfo: {
    phone: string;
    alternatePhone?: string;
    fax?: string;
    website?: string;
  };
  address: Address;
  services: string[];
  isApproved: boolean;
  isActive: boolean;
  rating: Rating;
  totalReports: number;
  qualityMetrics: {
    averageTurnaroundTime: number;
    reportAccuracy: number;
    patientSatisfaction: number;
    onTimeDelivery: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LabReportData {
  _id: string;
  reportNumber: string;
  patient: User | string;
  doctor?: Doctor | string;
  lab: Lab | string;
  testType: string;
  testName: string;
  testCategory: string;
  sampleCollectionDate: Date;
  reportDate: Date;
  status: string;
  priority: string;
  files: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
  results: {
    summary: string;
    findings: string;
    normalValues: string;
    abnormalValues: string;
    interpretation: string;
    recommendations: string;
  };
  testParameters: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    isAbnormal: boolean;
    flagType: string;
  }[];
  sharing: {
    sharedWithPatient: boolean;
    sharedWithDoctor: boolean;
    accessPermissions: {
      patient: boolean;
      doctor: boolean;
      admin: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}