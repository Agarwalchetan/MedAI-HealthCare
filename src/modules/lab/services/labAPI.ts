import api from '../../../shared/utils/api';
import { AuthResponse, ApiResponse } from '../../../shared/types';

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
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  services: string[];
  isApproved: boolean;
  isActive: boolean;
  rating: {
    average: number;
    count: number;
  };
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

export interface LabReport {
  _id: string;
  reportNumber: string;
  patient: any;
  doctor?: any;
  lab: any;
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

export interface LabRequest {
  _id: string;
  requestNumber: string;
  patient: any;
  doctor: any;
  lab?: any;
  testsRequested: {
    testName: string;
    testType: string;
    urgency: string;
    instructions?: string;
    fasting: boolean;
    estimatedCost?: number;
  }[];
  status: string;
  priority: string;
  requestDate: Date;
  sampleCollection: {
    method: string;
    address?: string;
    collectionDate?: Date;
  };
  billing: {
    totalAmount?: number;
    finalAmount?: number;
    paymentStatus: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const labAPI = {
  // Authentication
  register: async (labData: any): Promise<AuthResponse> => {
    const response = await api.post('/labs/register', labData);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/labs/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/labs/logout');
    return response.data;
  },

  // Profile management
  getProfile: async (): Promise<ApiResponse<{ lab: Lab }>> => {
    const response = await api.get('/labs/profile');
    return response.data;
  },

  updateProfile: async (labData: Partial<Lab>): Promise<ApiResponse<{ lab: Lab }>> => {
    const response = await api.put('/labs/profile', labData);
    return response.data;
  },

  // Report management
  uploadReport: async (reportData: FormData): Promise<ApiResponse<{ report: LabReport }>> => {
    const response = await api.post('/labs/reports/upload', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReports: async (filters?: any): Promise<ApiResponse<{ reports: LabReport[] }>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.testType) params.append('testType', filters.testType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await api.get(`/labs/reports?${params.toString()}`);
    return response.data;
  },

  updateReportStatus: async (reportId: string, status: string): Promise<ApiResponse<{ report: LabReport }>> => {
    const response = await api.put(`/labs/reports/${reportId}/status`, { status });
    return response.data;
  },

  shareReportWithDoctor: async (reportId: string, doctorId: string): Promise<ApiResponse> => {
    const response = await api.post(`/labs/reports/${reportId}/share-doctor`, { doctorId });
    return response.data;
  },

  performQualityControl: async (reportId: string, qualityData: any): Promise<ApiResponse<{ report: LabReport }>> => {
    const response = await api.put(`/labs/reports/${reportId}/quality-control`, qualityData);
    return response.data;
  },

  // Analytics and stats
  getStats: async (): Promise<ApiResponse<{ stats: any }>> => {
    const response = await api.get('/labs/stats');
    return response.data;
  },

  getAnalytics: async (period?: string): Promise<ApiResponse<{ analytics: any }>> => {
    const response = await api.get(`/labs/analytics?period=${period || 'month'}`);
    return response.data;
  },

  // Lab requests
  createLabRequest: async (requestData: any): Promise<ApiResponse<{ request: LabRequest }>> => {
    const response = await api.post('/labs/requests', requestData);
    return response.data;
  },

  getLabRequests: async (status?: string): Promise<ApiResponse<{ requests: LabRequest[] }>> => {
    const response = await api.get(`/labs/requests${status ? `?status=${status}` : ''}`);
    return response.data;
  },

  assignLabToRequest: async (requestId: string, labId: string): Promise<ApiResponse<{ request: LabRequest }>> => {
    const response = await api.put(`/labs/requests/${requestId}/assign`, { labId });
    return response.data;
  },

  // Public endpoints
  getAvailableLabs: async (location?: string, testType?: string): Promise<ApiResponse<{ labs: Lab[] }>> => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (testType) params.append('testType', testType);

    const response = await api.get(`/labs/available?${params.toString()}`);
    return response.data;
  },

  getPatientReports: async (patientId: string, labId?: string): Promise<ApiResponse<{ reports: LabReport[] }>> => {
    const response = await api.get(`/labs/patients/${patientId}/reports${labId ? `?labId=${labId}` : ''}`);
    return response.data;
  },

  getDoctorOrderedReports: async (doctorId: string, labId?: string): Promise<ApiResponse<{ reports: LabReport[] }>> => {
    const response = await api.get(`/labs/doctors/${doctorId}/reports${labId ? `?labId=${labId}` : ''}`);
    return response.data;
  }
};