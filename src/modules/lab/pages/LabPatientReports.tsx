import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  FileText, 
  Calendar, 
  Download,
  Share2,
  Eye,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import LabNavbar from '../components/LabNavbar';
import LabSidebar from '../components/LabSidebar';
import { labAPI, LabReport } from '../services/labAPI';
import toast from 'react-hot-toast';

interface PatientReportSummary {
  patientId: string;
  patientName: string;
  patientEmail: string;
  age: number;
  gender: string;
  totalReports: number;
  lastReportDate: Date;
  reports: LabReport[];
}

const LabPatientReports: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientReports, setPatientReports] = useState<PatientReportSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientReportSummary | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientReports();
  }, []);

  const fetchPatientReports = async () => {
    try {
      const response = await labAPI.getReports();
      const reports = response.data?.reports || [];
      
      // Group reports by patient
      const patientMap = new Map<string, PatientReportSummary>();
      
      reports.forEach((report: LabReport) => {
        const patientId = report.patient._id;
        
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            patientId,
            patientName: report.patient.fullName,
            patientEmail: report.patient.email,
            age: report.patient.age,
            gender: report.patient.gender,
            totalReports: 0,
            lastReportDate: new Date(report.reportDate),
            reports: []
          });
        }
        
        const patientData = patientMap.get(patientId)!;
        patientData.reports.push(report);
        patientData.totalReports++;
        
        if (new Date(report.reportDate) > patientData.lastReportDate) {
          patientData.lastReportDate = new Date(report.reportDate);
        }
      });
      
      setPatientReports(Array.from(patientMap.values()));
    } catch (error) {
      console.error('Error fetching patient reports:', error);
      // Mock data for development
      setPatientReports([
        {
          patientId: 'patient-1',
          patientName: 'John Smith',
          patientEmail: 'john@example.com',
          age: 35,
          gender: 'male',
          totalReports: 3,
          lastReportDate: new Date(),
          reports: []
        },
        {
          patientId: 'patient-2',
          patientName: 'Sarah Johnson',
          patientEmail: 'sarah@example.com',
          age: 28,
          gender: 'female',
          totalReports: 2,
          lastReportDate: new Date(),
          reports: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const shareReportWithDoctor = async (reportId: string, doctorId: string) => {
    try {
      await labAPI.shareReportWithDoctor(reportId, doctorId);
      toast.success('Report shared with doctor successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to share report');
    }
  };

  const viewPatientReports = async (patient: PatientReportSummary) => {
    try {
      const response = await labAPI.getPatientReports(patient.patientId);
      setSelectedPatient({
        ...patient,
        reports: response.data?.reports || []
      });
      setShowPatientModal(true);
    } catch (error) {
      console.error('Error fetching patient reports:', error);
      setSelectedPatient(patient);
      setShowPatientModal(true);
    }
  };

  const filteredPatients = patientReports.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const testTypes = ['Blood Test', 'Urine Test', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'Pathology'];

  return (
    <div className="h-screen bg-gray-50 flex">
      <LabSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <LabNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Patient Reports</h1>
              <p className="text-gray-600 mt-1">Manage and share patient lab reports</p>
            </div>

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
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={testTypeFilter}
                    onChange={(e) => setTestTypeFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Test Types</option>
                    {testTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading patient reports...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Patient Reports</h3>
                  <p className="text-gray-500">Patient reports will appear here once you upload lab results.</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div key={patient.patientId} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.patientName}</h3>
                        <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{patient.patientEmail}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Reports:</span>
                        <span className="font-medium text-purple-600">{patient.totalReports}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Report:</span>
                        <span className="font-medium">
                          {format(patient.lastReportDate, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewPatientReports(patient)}
                        className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Reports</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Patient Reports Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.patientName}'s Reports</h2>
                  <p className="text-gray-600">{selectedPatient.totalReports} reports • {selectedPatient.patientEmail}</p>
                </div>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedPatient.reports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reports found for this patient.</p>
                  </div>
                ) : (
                  selectedPatient.reports.map((report) => (
                    <div key={report._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{report.testName}</h3>
                              <p className="text-sm text-gray-600">{report.testType} • #{report.reportNumber}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">
                                Report Date: {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">
                                Files: {report.files.length}
                              </span>
                            </div>
                          </div>

                          {report.results.summary && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">Results Summary</h4>
                              <p className="text-sm text-gray-700">{report.results.summary}</p>
                            </div>
                          )}

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                report.sharing.sharedWithPatient ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                              <span className="text-gray-600">
                                {report.sharing.sharedWithPatient ? 'Shared with Patient' : 'Not shared with Patient'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                report.sharing.sharedWithDoctor ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                              <span className="text-gray-600">
                                {report.sharing.sharedWithDoctor ? 'Shared with Doctor' : 'Not shared with Doctor'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                            <Download className="h-4 w-4" />
                          </button>
                          {report.doctor && (
                            <button
                              onClick={() => shareReportWithDoctor(report._id, report.doctor._id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabPatientReports;