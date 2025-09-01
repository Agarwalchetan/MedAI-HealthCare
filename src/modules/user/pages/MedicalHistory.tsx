import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { MedicalHistory } from '../../../shared/types';
import toast from 'react-hot-toast';

const schema = yup.object({
  condition: yup.string().required('Condition is required'),
  diagnosis: yup.string().required('Diagnosis is required'),
  treatment: yup.string(),
  medications: yup.string(),
  doctorName: yup.string(),
  hospitalName: yup.string(),
  severity: yup.string().oneOf(['low', 'medium', 'high']).required('Severity is required'),
  notes: yup.string(),
});

interface MedicalHistoryFormData {
  condition: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  doctorName: string;
  hospitalName: string;
  severity: 'low' | 'medium' | 'high';
  notes: string;
}

const MedicalHistoryPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MedicalHistoryFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const response = await userAPI.getMedicalHistory();
      setMedicalHistory(response.data.medicalHistory || []);
    } catch (error) {
      console.error('Error fetching medical history:', error);
      toast.error('Failed to load medical history');
    }
  };

  const onSubmit = async (data: MedicalHistoryFormData) => {
    setIsLoading(true);
    try {
      const medicalData = {
        ...data,
        medications: data.medications ? data.medications.split(',').map(med => med.trim()) : []
      };

      await userAPI.addMedicalHistory(medicalData);
      toast.success('Medical record added successfully!');
      reset();
      setShowForm(false);
      fetchMedicalHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add medical record');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      
      <div className="flex">
        <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 md:ml-64">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
                <p className="text-gray-600 mt-1">Manage your medical records and health information</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Add Record</span>
              </button>
            </div>

            {/* Add Medical Record Form */}
            {showForm && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Medical Record</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                      <input
                        {...register('condition')}
                        type="text"
                        placeholder="e.g., Hypertension, Diabetes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                      <input
                        {...register('diagnosis')}
                        type="text"
                        placeholder="Medical diagnosis"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.diagnosis && <p className="mt-1 text-sm text-red-600">{errors.diagnosis.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
                      <input
                        {...register('treatment')}
                        type="text"
                        placeholder="Treatment received"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                      <select
                        {...register('severity')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select severity</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      {errors.severity && <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                      <input
                        {...register('doctorName')}
                        type="text"
                        placeholder="Attending physician"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Clinic</label>
                      <input
                        {...register('hospitalName')}
                        type="text"
                        placeholder="Healthcare facility"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medications (comma-separated)</label>
                    <input
                      {...register('medications')}
                      type="text"
                      placeholder="e.g., Lisinopril 10mg, Metformin 500mg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      placeholder="Any additional notes or observations"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      {isLoading ? 'Adding...' : 'Add Record'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Medical History List */}
            <div className="space-y-4">
              {medicalHistory.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records</h3>
                  <p className="text-gray-500 mb-6">Start building your medical history by adding your first record.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add First Record</span>
                  </button>
                </div>
              ) : (
                medicalHistory.map((record) => (
                  <div key={record._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(record.severity)}`}>
                            {getSeverityIcon(record.severity)}
                            <span className="capitalize">{record.severity}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(record.dateRecorded).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{record.condition}</h3>
                        <p className="text-gray-600 mb-3">{record.diagnosis}</p>
                        
                        {record.treatment && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Treatment: </span>
                            <span className="text-sm text-gray-600">{record.treatment}</span>
                          </div>
                        )}
                        
                        {record.medications && record.medications.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Medications: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {record.medications.map((med, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {med}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {record.doctorName && (
                            <span>Dr. {record.doctorName}</span>
                          )}
                          {record.hospitalName && (
                            <span>{record.hospitalName}</span>
                          )}
                        </div>
                        
                        {record.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{record.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;