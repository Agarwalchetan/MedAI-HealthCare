import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  User, 
  Stethoscope, 
  Calendar,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LabNavbar from '../components/LabNavbar';
import LabSidebar from '../components/LabSidebar';
import { labAPI } from '../services/labAPI';
import { userAPI } from '../../user/services/userAPI';
import { doctorAPI } from '../../doctor/services/doctorAPI';
import toast from 'react-hot-toast';

const schema = yup.object({
  patient: yup.string().required('Patient is required'),
  doctor: yup.string().optional(),
  testType: yup.string().required('Test type is required'),
  testName: yup.string().required('Test name is required'),
  testCategory: yup.string().optional(),
  sampleCollectionDate: yup.date().required('Sample collection date is required'),
  priority: yup.string().optional(),
  results: yup.object({
    summary: yup.string().required('Results summary is required'),
    findings: yup.string().optional(),
    interpretation: yup.string().optional(),
    recommendations: yup.string().optional()
  }).required(),
  technicianName: yup.string().required('Technician name is required'),
  technicianId: yup.string().required('Technician ID is required'),
  pathologistName: yup.string().optional(),
  pathologistLicense: yup.string().optional()
});

interface UploadFormData {
  patient: string;
  doctor?: string;
  testType: string;
  testName: string;
  testCategory?: string;
  sampleCollectionDate: Date;
  priority?: string;
  results: {
    summary: string;
    findings?: string;
    interpretation?: string;
    recommendations?: string;
  };
  technicianName: string;
  technicianId: string;
  pathologistName?: string;
  pathologistLicense?: string;
}

const LabUploadReport: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [testParameters, setTestParameters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testTypes = [
    'Blood Test', 'Urine Test', 'X-Ray', 'MRI', 'CT Scan', 
    'Ultrasound', 'ECG', 'Pathology', 'Microbiology', 
    'Biochemistry', 'Hematology', 'Immunology', 'Molecular Diagnostics', 'Other'
  ];

  const testCategories = ['Routine', 'Emergency', 'Specialized', 'Screening'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<UploadFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      // In production, this would fetch patients from lab's network
      setPatients([
        { _id: '1', fullName: 'John Smith', email: 'john@example.com' },
        { _id: '2', fullName: 'Sarah Johnson', email: 'sarah@example.com' }
      ]);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAvailableDoctors();
      setDoctors(response.data?.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Mock data for development
      setDoctors([
        { _id: '1', fullName: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
        { _id: '2', fullName: 'Dr. Michael Chen', specialization: 'Neurology' }
      ]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTestParameter = () => {
    setTestParameters(prev => [...prev, {
      parameter: '',
      value: '',
      unit: '',
      normalRange: '',
      isAbnormal: false,
      flagType: 'Normal'
    }]);
  };

  const removeTestParameter = (index: number) => {
    setTestParameters(prev => prev.filter((_, i) => i !== index));
  };

  const updateTestParameter = (index: number, field: string, value: any) => {
    setTestParameters(prev => prev.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    ));
  };

  const onSubmit = async (data: UploadFormData) => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Add form data
      Object.keys(data).forEach(key => {
        if (key === 'results') {
          formData.append('results', JSON.stringify(data.results));
        } else {
          formData.append(key, data[key] as string);
        }
      });

      // Add technician info
      formData.append('technician', JSON.stringify({
        name: data.technicianName,
        id: data.technicianId
      }));

      // Add pathologist info if provided
      if (data.pathologistName && data.pathologistLicense) {
        formData.append('pathologist', JSON.stringify({
          name: data.pathologistName,
          licenseNumber: data.pathologistLicense
        }));
      }

      // Add test parameters
      if (testParameters.length > 0) {
        formData.append('testParameters', JSON.stringify(testParameters));
      }

      // Add files
      selectedFiles.forEach(file => {
        formData.append('reportFiles', file);
      });

      await labAPI.uploadReport(formData);
      toast.success('Lab report uploaded successfully!');
      
      // Reset form
      setSelectedFiles([]);
      setTestParameters([]);
      // Navigate back or reset form as needed
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <LabSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <LabNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Upload Lab Report</h1>
              <p className="text-gray-600 mt-1">Upload and process new laboratory reports</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Patient & Doctor Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Patient & Doctor Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('patient')}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select patient</option>
                        {patients.map((patient) => (
                          <option key={patient._id} value={patient._id}>
                            {patient.fullName} - {patient.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.patient && <p className="mt-1 text-sm text-red-600">{errors.patient.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referring Doctor <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Stethoscope className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('doctor')}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select doctor (if referred)</option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.fullName} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                    <select
                      {...register('testType')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select test type</option>
                      {testTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.testType && <p className="mt-1 text-sm text-red-600">{errors.testType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                    <input
                      {...register('testName')}
                      type="text"
                      placeholder="e.g., Complete Blood Count"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.testName && <p className="mt-1 text-sm text-red-600">{errors.testName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      {...register('testCategory')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {testCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      {...register('priority')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select priority</option>
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sample Collection Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('sampleCollectionDate')}
                        type="datetime-local"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    {errors.sampleCollectionDate && <p className="mt-1 text-sm text-red-600">{errors.sampleCollectionDate.message}</p>}
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Files</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors duration-200">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your report files here, or click to browse</p>
                  <p className="text-sm text-gray-500 mb-4">Supports PDF, JPG, PNG, DICOM files up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Select Files</span>
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h3>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-purple-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Test Results */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Results</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Results Summary</label>
                    <textarea
                      {...register('results.summary')}
                      rows={4}
                      placeholder="Provide a comprehensive summary of the test results..."
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.results?.summary && <p className="mt-1 text-sm text-red-600">{errors.results.summary.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Findings</label>
                      <textarea
                        {...register('results.findings')}
                        rows={3}
                        placeholder="Key findings and observations..."
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interpretation</label>
                      <textarea
                        {...register('results.interpretation')}
                        rows={3}
                        placeholder="Clinical interpretation of results..."
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                    <textarea
                      {...register('results.recommendations')}
                      rows={3}
                      placeholder="Clinical recommendations based on results..."
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Test Parameters */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Test Parameters</h2>
                  <button
                    type="button"
                    onClick={addTestParameter}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                {testParameters.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No test parameters added yet. Click "Add Parameter" to include specific test values.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testParameters.map((param, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">Parameter {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeTestParameter(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parameter</label>
                            <input
                              type="text"
                              value={param.parameter}
                              onChange={(e) => updateTestParameter(index, 'parameter', e.target.value)}
                              placeholder="e.g., Hemoglobin"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) => updateTestParameter(index, 'value', e.target.value)}
                              placeholder="e.g., 12.5"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <input
                              type="text"
                              value={param.unit}
                              onChange={(e) => updateTestParameter(index, 'unit', e.target.value)}
                              placeholder="e.g., g/dL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Normal Range</label>
                            <input
                              type="text"
                              value={param.normalRange}
                              onChange={(e) => updateTestParameter(index, 'normalRange', e.target.value)}
                              placeholder="e.g., 12-16"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Staff Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Staff Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technician Name</label>
                    <input
                      {...register('technicianName')}
                      type="text"
                      placeholder="Name of the technician"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.technicianName && <p className="mt-1 text-sm text-red-600">{errors.technicianName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technician ID</label>
                    <input
                      {...register('technicianId')}
                      type="text"
                      placeholder="Technician ID/License"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {errors.technicianId && <p className="mt-1 text-sm text-red-600">{errors.technicianId.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pathologist Name <span className="text-gray-400">(If applicable)</span>
                    </label>
                    <input
                      {...register('pathologistName')}
                      type="text"
                      placeholder="Pathologist name"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pathologist License <span className="text-gray-400">(If applicable)</span>
                    </label>
                    <input
                      {...register('pathologistLicense')}
                      type="text"
                      placeholder="Pathologist license number"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Uploading...' : 'Upload Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LabUploadReport;