import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Zap,
  Target,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { aiDiagnosisService } from '../services/aiDiagnosisService';
import { doctorAPI } from '../services/doctorAPI';

interface AIAnalysis {
  id: string;
  patientId: string;
  patientName: string;
  symptoms: string[];
  aiDiagnosis: {
    primaryCondition: string;
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
    urgency: 'routine' | 'urgent' | 'emergency';
  };
  doctorReview: {
    approved: boolean;
    modified: boolean;
    finalDiagnosis: string;
    notes: string;
  } | null;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'approved';
}

const DoctorAIDiagnosis: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAnalyses, setAiAnalyses] = useState<AIAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIAnalyses();
  }, []);

  const fetchAIAnalyses = async () => {
    try {
      const response = await aiDiagnosisService.getPendingAnalyses();
      setAiAnalyses(response.data?.analyses || []);
    } catch (error) {
      console.error('Error fetching AI analyses:', error);
      // Mock data for development
      setAiAnalyses([
        {
          id: '1',
          patientId: 'patient-1',
          patientName: 'John Smith',
          symptoms: ['persistent headache', 'fatigue', 'dizziness'],
          aiDiagnosis: {
            primaryCondition: 'Tension Headache',
            confidence: 0.85,
            riskLevel: 'medium',
            recommendations: [
              'Rest and stress management',
              'Over-the-counter pain relievers',
              'Monitor symptoms for 48 hours'
            ],
            urgency: 'routine'
          },
          doctorReview: null,
          timestamp: new Date(),
          status: 'pending'
        },
        {
          id: '2',
          patientId: 'patient-2',
          patientName: 'Sarah Johnson',
          symptoms: ['chest pain', 'shortness of breath', 'sweating'],
          aiDiagnosis: {
            primaryCondition: 'Possible Cardiac Event',
            confidence: 0.92,
            riskLevel: 'high',
            recommendations: [
              'Immediate medical attention required',
              'ECG and cardiac enzymes',
              'Emergency department evaluation'
            ],
            urgency: 'emergency'
          },
          doctorReview: null,
          timestamp: new Date(),
          status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const approveAIAnalysis = async (analysisId: string, approved: boolean) => {
    try {
      const reviewData = {
        approved,
        modified: finalDiagnosis !== selectedAnalysis?.aiDiagnosis.primaryCondition,
        finalDiagnosis: finalDiagnosis || selectedAnalysis?.aiDiagnosis.primaryCondition || '',
        notes: doctorNotes
      };

      await aiDiagnosisService.reviewAnalysis(analysisId, reviewData);
      
      // Update local state
      setAiAnalyses(prev => prev.map(analysis => 
        analysis.id === analysisId 
          ? { ...analysis, status: 'reviewed', doctorReview: reviewData }
          : analysis
      ));

      setShowReviewModal(false);
      setDoctorNotes('');
      setFinalDiagnosis('');
      
      toast.success(`AI analysis ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to review analysis');
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-orange-600 text-white';
      case 'routine': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">AI Diagnosis Monitoring</h1>
              <p className="text-gray-600 mt-1">Review and approve AI-generated preliminary diagnoses</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {aiAnalyses.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {aiAnalyses.filter(a => a.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">High Risk Cases</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {aiAnalyses.filter(a => a.aiDiagnosis.riskLevel === 'high').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {aiAnalyses.length > 0 
                        ? Math.round(aiAnalyses.reduce((acc, a) => acc + a.aiDiagnosis.confidence, 0) / aiAnalyses.length * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analyses List */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Analysis Queue</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading AI analyses...</p>
                </div>
              ) : aiAnalyses.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No AI Analyses</h3>
                  <p className="text-gray-500">AI analyses will appear here when patients use the AI chatbot.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiAnalyses.map((analysis) => (
                    <div key={analysis.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{analysis.patientName}</h3>
                              <p className="text-sm text-gray-600">
                                {format(new Date(analysis.timestamp), 'MMM dd, yyyy • HH:mm')}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(analysis.aiDiagnosis.riskLevel)}`}>
                                {analysis.aiDiagnosis.riskLevel} risk
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(analysis.aiDiagnosis.urgency)}`}>
                                {analysis.aiDiagnosis.urgency}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Symptoms</h4>
                              <div className="flex flex-wrap gap-1">
                                {analysis.symptoms.map((symptom, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">AI Diagnosis</h4>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{analysis.aiDiagnosis.primaryCondition}</span>
                                <span className={`font-bold ${getConfidenceColor(analysis.aiDiagnosis.confidence)}`}>
                                  ({Math.round(analysis.aiDiagnosis.confidence * 100)}%)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
                            <ul className="space-y-1">
                              {analysis.aiDiagnosis.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {analysis.doctorReview && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="font-medium text-green-900 mb-2">Doctor Review</h4>
                              <p className="text-sm text-green-800">
                                Status: {analysis.doctorReview.approved ? 'Approved' : 'Rejected'}
                                {analysis.doctorReview.modified && ' (Modified)'}
                              </p>
                              {analysis.doctorReview.finalDiagnosis && (
                                <p className="text-sm text-green-800 mt-1">
                                  Final Diagnosis: {analysis.doctorReview.finalDiagnosis}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2">
                          {analysis.status === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedAnalysis(analysis);
                                setFinalDiagnosis(analysis.aiDiagnosis.primaryCondition);
                                setShowReviewModal(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                            >
                              Review
                            </button>
                          )}
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                            View Patient
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Review AI Analysis</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Analysis */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">AI Analysis</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Patient: {selectedAnalysis.patientName}</h4>
                      <div className="text-sm text-gray-600">
                        <p><strong>Symptoms:</strong> {selectedAnalysis.symptoms.join(', ')}</p>
                        <p className="mt-2">
                          <strong>AI Diagnosis:</strong> {selectedAnalysis.aiDiagnosis.primaryCondition}
                        </p>
                        <p className="mt-1">
                          <strong>Confidence:</strong> 
                          <span className={`ml-1 font-bold ${getConfidenceColor(selectedAnalysis.aiDiagnosis.confidence)}`}>
                            {Math.round(selectedAnalysis.aiDiagnosis.confidence * 100)}%
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
                      <ul className="space-y-2">
                        {selectedAnalysis.aiDiagnosis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <Target className="h-3 w-3 text-blue-600" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Doctor Review */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Doctor Review</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Final Diagnosis
                      </label>
                      <input
                        type="text"
                        value={finalDiagnosis}
                        onChange={(e) => setFinalDiagnosis(e.target.value)}
                        placeholder="Confirm or modify the diagnosis"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doctor Notes
                      </label>
                      <textarea
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        rows={4}
                        placeholder="Add your professional notes and observations..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => approveAIAnalysis(selectedAnalysis.id, false)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => approveAIAnalysis(selectedAnalysis.id, true)}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve & Add to Vault</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAIDiagnosis;