import api from '../../../shared/utils/api';
import { ApiResponse, User, Doctor, Medicine } from '../../../shared/types';

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // User management
  getUsers: async (): Promise<ApiResponse<{ users: User[] }>> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean): Promise<ApiResponse> => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  getUserHealthVault: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/admin/users/${userId}/health-vault`);
    return response.data;
  },

  // Doctor management
  getDoctors: async (): Promise<ApiResponse<{ doctors: Doctor[] }>> => {
    const response = await api.get('/admin/doctors');
    return response.data;
  },

  getPendingDoctors: async (): Promise<ApiResponse<{ doctors: Doctor[] }>> => {
    const response = await api.get('/admin/doctors/pending');
    return response.data;
  },

  approveDoctorRegistration: async (doctorId: string, approved: boolean, comments?: string): Promise<ApiResponse> => {
    const response = await api.put(`/admin/doctors/${doctorId}/approve`, { approved, comments });
    return response.data;
  },

  updateDoctorStatus: async (doctorId: string, isActive: boolean): Promise<ApiResponse> => {
    const response = await api.put(`/admin/doctors/${doctorId}/status`, { isActive });
    return response.data;
  },

  // Medicine management
  getMedicines: async (): Promise<ApiResponse<{ medicines: Medicine[] }>> => {
    const response = await api.get('/admin/medicines');
    return response.data;
  },

  addMedicine: async (medicineData: Partial<Medicine>): Promise<ApiResponse<{ medicine: Medicine }>> => {
    const response = await api.post('/admin/medicines', medicineData);
    return response.data;
  },

  updateMedicine: async (medicineId: string, medicineData: Partial<Medicine>): Promise<ApiResponse<{ medicine: Medicine }>> => {
    const response = await api.put(`/admin/medicines/${medicineId}`, medicineData);
    return response.data;
  },

  deleteMedicine: async (medicineId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/medicines/${medicineId}`);
    return response.data;
  },

  // Appointments management
  getAllAppointments: async (): Promise<ApiResponse<{ appointments: any[] }>> => {
    const response = await api.get('/admin/appointments');
    return response.data;
  },

  getAppointmentAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/appointments/analytics');
    return response.data;
  },

  // Analytics
  getAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  exportReport: async (reportType: string): Promise<ApiResponse> => {
    const response = await api.get(`/admin/reports/export/${reportType}`);
    return response.data;
  },

  // System notifications
  getNotifications: async (): Promise<ApiResponse<{ notifications: any[] }>> => {
    const response = await api.get('/admin/notifications');
    return response.data;
  },

  getSystemLogs: async (): Promise<ApiResponse<{ logs: any[] }>> => {
    const response = await api.get('/admin/system-logs');
    return response.data;
  },

  // Settings
  getSystemSettings: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings: any): Promise<ApiResponse> => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  }
};