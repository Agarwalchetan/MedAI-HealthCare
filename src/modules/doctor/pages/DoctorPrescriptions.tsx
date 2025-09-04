import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  User, 
  Calendar, 
  FileText,
  QrCode,
  Download,
  Send,
  Search
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { doctorAPI } from '../services/doctorAPI';
import { DoctorPrescription, User as PatientType } from '../../../shared/types';
import toast from 'react-hot-toast';

const medicationSchema = yup.object({
  name: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required'),
  duration: yup.string().required('Duration is required'),
  instructions: yup.string(),
  beforeFood: yup.boolean()
});

const prescriptionSchema = yup.object({
  patient: yup.string().required('Patient is required'),
  diagnosis: yup.string().required('Diagnosis is required'),
  symptoms: yup.string().required('Symptoms are required'),
  medications: yup.array().of(medicationSchema).min(1, 'At least one medication is required'),
  recommendations: yup.string(),
  followUpDate: yup.date()
});

interface PrescriptionFormData {
  patient: string;
  diagnosis: string;
  symptoms: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    beforeFood: boolean;
  }[];
  recommendations: string;
  followUpDate?: Date;
}

const DoctorPrescriptions: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<DoctorPrescription[]>([]);
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<PrescriptionFormData>({
    resolver: yupResolver(prescriptionSchema),
    defaultValues: {
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '', beforeFood: false }]
    }
  });

  const medications = watch('medications');

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await doctorAPI.getPrescriptions();
      setPrescriptions(response.data?.prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await doctorAPI.getPatients();
      setPatients(response.data?.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    try {
      await doctorAPI.createPrescription(data);
      toast.success('Prescription created successfully!');
      reset();
      setShowCreateForm(false);
      fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    }
  };

  const addMedication = () => {
    setValue('medications', [
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '', instructions: '', beforeFood: false }
    ]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setValue('medications', medications.filter((_, i) => i !== index));
    }
  };

  const generateQRCode = async (prescriptionId: string) => {
    try {
      const response = await doctorAPI.generatePrescriptionQR(prescriptionId);
      toast.success('QR code generated successfully');
    } catch (error: any) {
      toast.error('Failed to generate QR code');
    }
  };

  const sendToPharmacy = async (prescriptionId: string) => {
    try {
      await doctorAPI.sendPrescriptionToPharmacy(prescriptionId);
      toast.success('Prescription sent to pharmacy');
    } catch (error: any) {
      toast.error('Failed to send to pharmacy');
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const patientName = typeof prescription.patient === 'object' 
      ? prescription.patient.fullName 
      : '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Digital Prescriptions</h1>
                <p className="text-gray-600 mt-1">Create and manage digital prescriptions</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>New Prescription</span>
              </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search prescriptions by patient name or diagnosis..."
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading prescriptions...</p>
                </div>
              ) : filteredPrescriptions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Prescriptions</h3>
                  <p className="text-gray-500 mb-6">Create your first digital prescription to get started.</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Prescription</span>
                  </button>
                </div>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <div key={prescription._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                            <Pill className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {typeof prescription.patient === 'object' ? prescription.patient.fullName : 'Patient'}
                            </h3>
                            <p className="text-sm text-gray-600">{prescription.diagnosis}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {prescription.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {new Date(prescription.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Pill className="h-4 w-4" />
                            <span className="text-sm">
                              {prescription.medications.length} medication(s)
                            </span>
                          </div>
                        </div>

                        {/* Medications */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Medications</h4>
                          <div className="space-y-2">
                            {prescription.medications.map((med, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium text-gray-900">{med.name}</span>
                                <span className="text-gray-600 ml-2">
                                  {med.dosage} • {med.frequency} • {med.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => generateQRCode(prescription._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Generate QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sendToPharmacy(prescription._id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          title="Send to Pharmacy"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Prescription Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Digital Prescription</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Patient Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <select
                      {...register('patient')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select patient</option>
                      {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.fullName} - {patient.email}
                        </option>
                      ))}
                    </select>
                    {errors.patient && <p className="mt-1 text-sm text-red-600">{errors.patient.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                    <input
                      {...register('followUpDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Diagnosis & Symptoms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                    <input
                      {...register('diagnosis')}
                      type="text"
                      placeholder="Primary diagnosis"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.diagnosis && <p className="mt-1 text-sm text-red-600">{errors.diagnosis.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                    <input
                      {...register('symptoms')}
                      type="text"
                      placeholder="Patient symptoms"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.symptoms && <p className="mt-1 text-sm text-red-600">{errors.symptoms.message}</p>}
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">Medications</label>
                    <button
                      type="button"
                      onClick={addMedication}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Medication
                    </button>
                  </div>

                  <div className="space-y-4">
                    {medications.map((_, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                          {medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedication(index)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                            <input
                              {...register(`medications.${index}.name`)}
                              type="text"
                              placeholder="e.g., Paracetamol"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                            <input
                              {...register(`medications.${index}.dosage`)}
                              type="text"
                              placeholder="e.g., 500mg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                            <select
                              {...register(`medications.${index}.frequency`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select frequency</option>
                              <option value="Once daily">Once daily</option>
                              <option value="Twice daily">Twice daily</option>
                              <option value="Three times daily">Three times daily</option>
                              <option value="Four times daily">Four times daily</option>
                              <option value="As needed">As needed</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                              {...register(`medications.${index}.duration`)}
                              type="text"
                              placeholder="e.g., 7 days"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                          <input
                            {...register(`medications.${index}.instructions`)}
                            type="text"
                            placeholder="Special instructions for this medication"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="mt-3">
                          <label className="flex items-center space-x-2">
                            <input
                              {...register(`medications.${index}.beforeFood`)}
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Take before food</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                  <textarea
                    {...register('recommendations')}
                    rows={3}
                    placeholder="Additional recommendations for the patient"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;