import api from '../../../shared/utils/api';
import { AuthResponse, ApiResponse, User, MedicalHistory, Prescription, LabReport, Insurance, Appointment ,Doctor} from '../../../shared/types';

export const userAPI = {
  // Authentication
  register: async (userData: any): Promise<AuthResponse> => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/users/logout');
    return response.data;
  },

  // Profile management
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Medical history
  getMedicalHistory: async (): Promise<ApiResponse<{ medicalHistory: MedicalHistory[] }>> => {
    const response = await api.get('/users/medical-history');
    return response.data;
  },

  addMedicalHistory: async (medicalData: Partial<MedicalHistory>): Promise<ApiResponse<{ medicalRecord: MedicalHistory }>> => {
    const response = await api.post('/users/medical-history', medicalData);
    return response.data;
  },

  // Prescriptions
  getPrescriptions: async (): Promise<ApiResponse<{ prescriptions: Prescription[] }>> => {
    const response = await api.get('/users/prescriptions');
    return response.data;
  },

  addPrescription: async (prescriptionData: Partial<Prescription>): Promise<ApiResponse<{ prescription: Prescription }>> => {
    const response = await api.post('/users/prescriptions', prescriptionData);
    return response.data;
  },

  // Lab reports
  getLabReports: async (): Promise<ApiResponse<{ labReports: LabReport[] }>> => {
    const response = await api.get('/users/lab-reports');
    return response.data;
  },

  addLabReport: async (labReportData: Partial<LabReport>): Promise<ApiResponse<{ labReport: LabReport }>> => {
    const response = await api.post('/users/lab-reports', labReportData);
    return response.data;
  },

  // Insurance
  getInsurance: async (): Promise<ApiResponse<{ insurance: Insurance }>> => {
    const response = await api.get('/users/insurance');
    return response.data;
  },

  updateInsurance: async (insuranceData: Partial<Insurance>): Promise<ApiResponse<{ insurance: Insurance }>> => {
    const response = await api.put('/users/insurance', insuranceData);
    return response.data;
  },

  // Appointments
  getAppointments: async (): Promise<ApiResponse<{ appointments: Appointment[] }>> => {
    const response = await api.get('/appointments/my-appointments');
    return response.data;
  },

  bookAppointment: async (appointmentData: any): Promise<ApiResponse<{ appointment: Appointment }>> => {

    const response = await api.post('/appointments/book', appointmentData);
   
    return response.data;
  },

  cancelAppointment: async (appointmentId: string, cancelReason: string): Promise<ApiResponse<{ appointment: Appointment }>> => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`, { cancelReason });
    return response.data;
  },

  getAvailableDoctors: async (specialization?: string): Promise<ApiResponse<{ doctors: Doctor[] }>> => {
    const response = await api.get(`/appointments/doctors/available${specialization ? `?specialization=${specialization}` : ''}`);
    return response.data;
  },

  getAvailableTimeSlots: async (doctorId: string, date: string): Promise<ApiResponse<{ timeSlots: any[] }>> => {
    const response = await api.get(`/appointments/doctors/${doctorId}/slots?date=${date}`);
    console.log("response Data",response.data) 
    
    return response.data;
  }
};