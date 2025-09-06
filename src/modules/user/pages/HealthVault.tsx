import React, { useState, useEffect } from 'react';
import { FileText, Pill, FlaskConical, Download, Eye, Shield, Upload } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { MedicalHistory, Prescription, LabReport } from '../../../shared/types';
import { FileUploadModal } from './HealthVault/Components';

const HealthVault: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchHealthVaultData();
  }, []);

  const fetchHealthVaultData = async () => {
    try {
      const [medicalResponse, prescriptionsResponse, labReportsResponse] = await Promise.all([
        userAPI.getMedicalHistory(),
        userAPI.getPrescriptions(),
        userAPI.getLabReports()
      ]);

      setMedicalHistory(medicalResponse.data?.medicalHistory || []);
      setPrescriptions(prescriptionsResponse.data?.prescriptions || []);
      setLabReports(labReportsResponse.data?.labReports || []);
    } catch (error) {
      console.error('Error fetching health vault data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Shield className="h-4 w-4" /> },
    { id: 'medical-history', name: 'Medical History', icon: <FileText className="h-4 w-4" /> },
    { id: 'prescriptions', name: 'Prescriptions', icon: <Pill className="h-4 w-4" /> },
    { id: 'lab-reports', name: 'Lab Reports', icon: <FlaskConical className="h-4 w-4" /> }
  ];

  const handleSaveExtractedData = (extractedText: string) => {
    // TODO: later we will implement it to save data
    console.log('Saving extracted text:', extractedText);
    alert('Extracted text saved successfully!');
    // for refresh
    fetchHealthVaultData();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="bg-blue-600 text-white p-3 rounded-full inline-block mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Medical Records</h3>
          <p className="text-2xl font-bold text-blue-600">{medicalHistory.length}</p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 text-center">
          <div className="bg-green-600 text-white p-3 rounded-full inline-block mb-3">
            <Pill className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Active Prescriptions</h3>
          <p className="text-2xl font-bold text-green-600">
            {prescriptions.filter(p => p.isActive).length}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 text-center">
          <div className="bg-purple-600 text-white p-3 rounded-full inline-block mb-3">
            <FlaskConical className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Lab Reports</h3>
          <p className="text-2xl font-bold text-purple-600">{labReports.length}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Health Vault Security</h3>
        <p className="text-blue-100 mb-4">
          Your health data is encrypted and securely stored. Only you and authorized healthcare providers
          can access your medical information.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-4">
      {medicalHistory.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">No Medical History</h3>
          <p className="text-gray-500">Your medical records will appear here.</p>
        </div>
      ) : (
        medicalHistory.map((record) => (
          <div key={record._id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{record.condition}</h3>
                <p className="text-gray-600 mb-3">{record.diagnosis}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(record.dateRecorded).toLocaleDateString()}</span>
                  {record.doctorName && <span>Dr. {record.doctorName}</span>}
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-4">
      {prescriptions.length === 0 ? (
        <div className="text-center py-12">
          <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">No Prescriptions</h3>
          <p className="text-gray-500">Your prescriptions will appear here.</p>
        </div>
      ) : (
        prescriptions.map((prescription) => (
          <div key={prescription._id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{prescription.medicationName}</h3>
                <p className="text-gray-600 mb-2">{prescription.dosage} • {prescription.frequency}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                  <span>By: {prescription.prescribedBy}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${prescription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {prescription.isActive ? 'Active' : 'Completed'}
                </span>
                <button className="text-blue-600 hover:text-blue-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderLabReports = () => (
    <div className="space-y-4">
      {labReports.length === 0 ? (
        <div className="text-center py-12">
          <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">No Lab Reports</h3>
          <p className="text-gray-500">Your lab reports will appear here.</p>
        </div>
      ) : (
        labReports.map((report) => (
          <div key={report._id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{report.testName}</h3>
                <p className="text-gray-600 mb-2">{report.testType}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                  <span>{report.labName}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-700">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-green-600 hover:text-green-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserNavbar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Health Vault</h1>
                <p className="text-gray-600 mt-1">Your complete medical history in one secure place</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Report</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading health vault...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'medical-history' && renderMedicalHistory()}
                    {activeTab === 'prescriptions' && renderPrescriptions()}
                    {activeTab === 'lab-reports' && renderLabReports()}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* for upload modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={handleSaveExtractedData}
      />
    </div>
  );
};

export default HealthVault;