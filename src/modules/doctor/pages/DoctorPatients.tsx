import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  FlaskConical
} from 'lucide-react';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { doctorAPI } from '../services/doctorAPI';
import { labAPI } from '../../lab/services/labAPI';
import { User, MedicalHistory } from '../../../shared/types';
import toast from 'react-hot-toast';

const DoctorPatients: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [showHealthVault, setShowHealthVault] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchPatients();
    fetchAccessRequests();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await doctorAPI.getPatients();
      setPatients(response.data?.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Mock data for development
      setPatients([
        {
          _id: '1',
          fullName: 'John Smith',
          email: 'john@example.com',
          age: 35,
          gender: 'male',
          phone: '9876543210',
          role: 'patient',
          address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Jane Smith',
            phone: '9876543211',
            relationship: 'spouse'
          },
          medicalHistory: [],
          prescriptions: [],
          labReports: [],
          insurance: {
            provider: 'Health Insurance Co',
            policyNumber: 'POL123456',
            groupNumber: 'GRP789',
            validUntil: new Date('2025-12-31'),
            coverageAmount: 500000,
            deductible: 5000,
            isActive: true
          },
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessRequests = async () => {
    try {
      const response = await doctorAPI.getHealthVaultAccessRequests();
      setAccessRequests(response.data?.requests || []);
    } catch (error) {
      console.error('Error fetching access requests:', error);
    }
  };

  const requestHealthVaultAccess = async (patientId: string) => {
    try {
      await doctorAPI.requestHealthVaultAccess(patientId);
      toast.success('Health vault access requested. Awaiting approval.');
      fetchAccessRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request access');
    }
  };

  const viewHealthVault = async (patient: User) => {
    try {
      const [healthVaultResponse, labReportsResponse] = await Promise.all([
        doctorAPI.getPatientHealthVault(patient._id),
        labAPI.getPatientReports(patient._id)
      ]);
      
      setSelectedPatient({
        ...patient,
        medicalHistory: healthVaultResponse.data?.medicalHistory || [],
        prescriptions: healthVaultResponse.data?.prescriptions || [],
        labReports: [
          ...(healthVaultResponse.data?.labReports || []),
          ...(labReportsResponse.data?.reports || []).map(report => ({
            _id: report._id,
            testName: report.testName,
            testType: report.testType,
            reportDate: report.reportDate,
            results: report.results?.summary || '',
            normalRange: report.results?.normalValues || '',
            labName: report.lab?.name || 'Lab',
            doctorReferred: report.doctor?.fullName || '',
            fileUrl: report.files?.[0]?.fileUrl || '',
            status: report.status.toLowerCase()
          }))
        ]
      });
      setShowHealthVault(true);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Access denied. Please request health vault access.');
      } else {
        toast.error('Failed to load health vault');
      }
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-1">Manage your patients and access their health records</p>
            </div>

            {/* Access Requests Alert */}
            {accessRequests.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Pending Access Requests</h3>
                    <p className="text-sm text-yellow-800">
                      You have {accessRequests.length} health vault access requests pending approval.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patients by name or email..."
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Patients</option>
                    <option value="recent">Recent Consultations</option>
                    <option value="follow-up">Follow-up Required</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Patients Found</h3>
                  <p className="text-gray-500">Patients will appear here once they book appointments with you.</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div key={patient._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.fullName}</h3>
                        <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{patient.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{patient.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">{patient.address?.city || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewHealthVault(patient)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Health Vault</span>
                      </button>
                      <button
                        onClick={() => requestHealthVaultAccess(patient._id)}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Health Vault Modal */}
      {showHealthVault && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.fullName}'s Health Vault</h2>
                  <p className="text-gray-600">Secure access to patient's medical records</p>
                </div>
                <button
                  onClick={() => setShowHealthVault(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <span className="ml-2 font-medium">{selectedPatient.age} years</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <span className="ml-2 font-medium capitalize">{selectedPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedPatient.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Emergency Contact:</span>
                      <span className="ml-2 font-medium">{selectedPatient.emergencyContact?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Medical Records */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Medical History */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Medical History</h3>
                      {selectedPatient.medicalHistory?.length === 0 ? (
                        <p className="text-gray-500 text-sm">No medical history available</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedPatient.medicalHistory?.map((record) => (
                            <div key={record._id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{record.condition}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  record.severity === 'high' ? 'bg-red-100 text-red-800' :
                                  record.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {record.severity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{record.diagnosis}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(record.dateRecorded).toLocaleDateString()} • Dr. {record.doctorName}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Current Prescriptions */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Active Prescriptions</h3>
                      {selectedPatient.prescriptions?.filter(p => p.isActive).length === 0 ? (
                        <p className="text-gray-500 text-sm">No active prescriptions</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedPatient.prescriptions?.filter(p => p.isActive).map((prescription) => (
                            <div key={prescription._id} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">{prescription.medicationName}</h4>
                              <p className="text-sm text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                              <p className="text-xs text-gray-500">
                                Prescribed by {prescription.prescribedBy} on {new Date(prescription.prescribedDate).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Lab Reports */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Recent Lab Reports</h3>
                      {selectedPatient.labReports?.length === 0 ? (
                        <p className="text-gray-500 text-sm">No lab reports available</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedPatient.labReports?.slice(0, 3).map((report) => (
                            <div key={report._id} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">{report.testName}</h4>
                              <p className="text-sm text-gray-600">{report.testType}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(report.reportDate).toLocaleDateString()} • {report.labName}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowHealthVault(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Add AI Remarks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;