import api from '../../../shared/utils/api';
import { ApiResponse } from '../../../shared/types';

interface AIAnalysisRequest {
  symptoms: string[];
  patientAge: number;
  patientGender: string;
  medicalHistory?: string[];
}

interface AIAnalysisResponse {
  primaryCondition: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  differentialDiagnoses: {
    condition: string;
    probability: number;
  }[];
}

interface DoctorReview {
  approved: boolean;
  modified: boolean;
  finalDiagnosis: string;
  notes: string;
}

export const aiDiagnosisService = {
  // Get AI analysis for symptoms
  analyzeSymptoms: async (analysisRequest: AIAnalysisRequest): Promise<ApiResponse<AIAnalysisResponse>> => {
    const response = await api.post('/ai/analyze-symptoms', analysisRequest);
    return response.data;
  },

  // Get pending AI analyses for doctor review
  getPendingAnalyses: async (): Promise<ApiResponse<{ analyses: any[] }>> => {
    const response = await api.get('/ai/pending-analyses');
    return response.data;
  },

  // Doctor review of AI analysis
  reviewAnalysis: async (analysisId: string, review: DoctorReview): Promise<ApiResponse> => {
    const response = await api.put(`/ai/analyses/${analysisId}/review`, review);
    return response.data;
  },

  // Get AI analysis history for a patient
  getPatientAnalysisHistory: async (patientId: string): Promise<ApiResponse<{ analyses: any[] }>> => {
    const response = await api.get(`/ai/patient/${patientId}/analyses`);
    return response.data;
  },

  // Get AI model performance metrics
  getModelMetrics: async (): Promise<ApiResponse<{ metrics: any }>> => {
    const response = await api.get('/ai/model-metrics');
    return response.data;
  },

  // Train AI model with doctor feedback
  submitFeedback: async (analysisId: string, feedback: any): Promise<ApiResponse> => {
    const response = await api.post(`/ai/analyses/${analysisId}/feedback`, feedback);
    return response.data;
  }
};

// Mock AI diagnosis logic for development
export const mockAIDiagnosis = {
  analyzeSymptoms: (symptoms: string[], patientAge: number, patientGender: string): AIAnalysisResponse => {
    const symptomText = symptoms.join(' ').toLowerCase();
    
    // Simple rule-based mock diagnosis
    if (symptomText.includes('chest pain') || symptomText.includes('heart')) {
      return {
        primaryCondition: 'Possible Cardiac Event',
        confidence: 0.85,
        riskLevel: 'high',
        recommendations: [
          'Immediate medical attention required',
          'ECG and cardiac enzymes',
          'Emergency department evaluation'
        ],
        urgency: 'emergency',
        differentialDiagnoses: [
          { condition: 'Myocardial Infarction', probability: 0.4 },
          { condition: 'Angina', probability: 0.3 },
          { condition: 'Anxiety', probability: 0.15 }
        ]
      };
    } else if (symptomText.includes('headache') || symptomText.includes('head')) {
      return {
        primaryCondition: 'Tension Headache',
        confidence: 0.75,
        riskLevel: 'medium',
        recommendations: [
          'Rest and stress management',
          'Over-the-counter pain relievers',
          'Monitor symptoms for 48 hours'
        ],
        urgency: 'routine',
        differentialDiagnoses: [
          { condition: 'Tension Headache', probability: 0.6 },
          { condition: 'Migraine', probability: 0.25 },
          { condition: 'Cluster Headache', probability: 0.1 }
        ]
      };
    } else if (symptomText.includes('fever') || symptomText.includes('temperature')) {
      return {
        primaryCondition: 'Viral Infection',
        confidence: 0.70,
        riskLevel: 'medium',
        recommendations: [
          'Rest and hydration',
          'Monitor temperature',
          'Symptomatic treatment'
        ],
        urgency: 'routine',
        differentialDiagnoses: [
          { condition: 'Viral Infection', probability: 0.5 },
          { condition: 'Bacterial Infection', probability: 0.3 },
          { condition: 'Flu', probability: 0.2 }
        ]
      };
    } else {
      return {
        primaryCondition: 'General Health Concern',
        confidence: 0.60,
        riskLevel: 'low',
        recommendations: [
          'Monitor symptoms',
          'Maintain healthy lifestyle',
          'Consult if symptoms persist'
        ],
        urgency: 'routine',
        differentialDiagnoses: [
          { condition: 'Stress-related symptoms', probability: 0.4 },
          { condition: 'Lifestyle factors', probability: 0.3 },
          { condition: 'Minor illness', probability: 0.3 }
        ]
      };
    }
  }
};