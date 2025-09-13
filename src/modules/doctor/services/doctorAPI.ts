import api from '../../../shared/utils/api';
import { AuthResponse, ApiResponse, Doctor, Appointment, DoctorPrescription, DoctorStats, Earnings, User, DayAvailability } from '../../../shared/types';


export const doctorAPI = {
  // Authentication
  register: async (doctorData: any): Promise<AuthResponse> => {
    const response = await api.post('/doctors/register', doctorData);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/doctors/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/doctors/logout');
    return response.data;
  },

  // Profile management
  getProfile: async (): Promise<ApiResponse<{ doctor: Doctor }>> => {
    const response = await api.get('/doctors/profile');
    return response.data;
  },

  updateProfile: async (doctorData: Partial<Doctor>): Promise<ApiResponse<{ doctor: Doctor }>> => {
    const response = await api.put('/doctors/profile', doctorData);
    return response.data;
  },

  // Appointments
  getAppointments: async (status?: string): Promise<ApiResponse<{ appointments: Appointment[] }>> => {
    const response = await api.get(`/doctors/appointments${status ? `?status=${status}` : ''}`);
  console.log("response Data: ",response.data)
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId: string, status: string, notes?: string): Promise<ApiResponse<{ appointment: Appointment }>> => {
    const response = await api.put(`/doctors/appointments/${appointmentId}/status`, { status, notes });
    return response.data;
  },

  // Availability 
  updateAvailability:async(availability:DayAvailability[]):Promise<ApiResponse>=>{
   
    const response=await api.post('/doctors/updateAvailability',{availability});
    return response.data;
  },


  // Prescriptions
  getPrescriptions: async (): Promise<ApiResponse<{ prescriptions: DoctorPrescription[] }>> => {
    const response = await api.get('/doctors/prescriptions');
    return response.data;
  },

  createPrescription: async (prescriptionData: Partial<DoctorPrescription>): Promise<ApiResponse<{ prescription: DoctorPrescription }>> => {
    const response = await api.post('/doctors/prescriptions', prescriptionData);
    return response.data;
  },
 
  // Stats and earnings
  getStats: async (): Promise<ApiResponse<{ stats: DoctorStats }>> => {
    const response = await api.get(`/doctors/stats`);
 
    return response.data;
  },

  getEarnings: async (month?: number, year?: number): Promise<ApiResponse<{ earnings: Earnings[] }>> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await api.get(`/doctors/earnings?${params.toString()}`);
    return response.data;
  },

  // Available doctors (for patients)
  getAvailableDoctors: async (specialization?: string): Promise<ApiResponse<{ doctors: Doctor[] }>> => {
    const response = await api.get(`/doctors/available${specialization ? `?specialization=${specialization}` : ''}`);
    return response.data;
  },

  // Patient management
  getPatients: async (): Promise<ApiResponse<{ patients: User[] }>> => {
    const response = await api.get(`/doctors/patients`);
    return response.data;
  },

  getPatientHealthVault: async (patientId: string): Promise<ApiResponse<{ medicalHistory: any[], prescriptions: any[], labReports: any[] }>> => {
    const response = await api.get(`/doctors/patients/${patientId}/health-vault`);
    return response.data;
  },

  requestHealthVaultAccess: async (patientId: string): Promise<ApiResponse> => {
    const response = await api.post(`/doctors/patients/${patientId}/request-access`);
    return response.data;
  },

  getHealthVaultAccessRequests: async (): Promise<ApiResponse<{ requests: any[] }>> => {
    const response = await api.get('/doctors/health-vault-requests');
    return response.data;
  },

  // Prescription management
  generatePrescriptionQR: async (prescriptionId: string): Promise<ApiResponse> => {
    const response = await api.post(`/doctors/prescriptions/${prescriptionId}/qr`);
    return response.data;
  },

  sendPrescriptionToPharmacy: async (prescriptionId: string): Promise<ApiResponse> => {
    const response = await api.post(`/doctors/prescriptions/${prescriptionId}/send-pharmacy`);
    return response.data;
  },

  // Lab integration
  orderLabTests: async (labRequestData: any): Promise<ApiResponse> => {
    const response = await api.post('/labs/requests', labRequestData);
    return response.data;
  },

  getOrderedLabReports: async (): Promise<ApiResponse<{ reports: any[] }>> => {
    const response = await api.get('/labs/doctors/my-reports');
    return response.data;
  },

  // Get all lab requests for monitoring
  getAllLabRequests: async (): Promise<ApiResponse<{ requests: any[] }>> => {
    const response = await api.get('/labs/requests/all');
    return response.data;
  }
};
