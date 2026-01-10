import React, { useState, useEffect } from 'react';
import { FileText, Pill, FlaskConical, Download, Eye, Shield, Upload } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { MedicalHistory, Prescription, LabReport, ScannedDocument } from '../../../shared/types';
import { FileUploadModal, DocumentViewModal } from './HealthVault/Components';

const HealthVault: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  useEffect(() => {
    fetchHealthVaultData();
  }, []);

  const fetchHealthVaultData = async () => {
    try {
      const [medicalResponse, prescriptionsResponse, labReportsResponse, scannedDocsResponse] = await Promise.all([
        userAPI.getMedicalHistory(),
        userAPI.getPrescriptions(),
        userAPI.getLabReports(),
        userAPI.getScannedDocuments()
      ]);

      setMedicalHistory(medicalResponse.data?.medicalHistory || []);
      setPrescriptions(prescriptionsResponse.data?.prescriptions || []);
      setLabReports(labReportsResponse.data?.labReports || []);
      setScannedDocuments(scannedDocsResponse.data?.scannedDocuments || []);
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
    { id: 'lab-reports', name: 'Lab Reports', icon: <FlaskConical className="h-4 w-4" /> },
    { id: 'scanned-documents', name: 'Scanned Documents', icon: <Upload className="h-4 w-4" /> }
  ];

  const handleSaveExtractedData = (extractedText: string) => {
    // TODO: later we will implement it to save data
    console.log('Saving extracted text:', extractedText);
    alert('Extracted text saved successfully!');
    // for refresh
    fetchHealthVaultData();
  };

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };


  const renderOverview = () => {
    const scannedMedicalHistory = scannedDocuments.filter(doc => doc.category === 'medical-history');
    const scannedPrescriptions = scannedDocuments.filter(doc => doc.category === 'prescription');
    const scannedLabReports = scannedDocuments.filter(doc => doc.category === 'lab-report');
    const otherScannedDocs = scannedDocuments.filter(doc => doc.category === 'other');

    const totalMedicalHistory = medicalHistory.length + scannedMedicalHistory.length;
    // const totalPrescriptions = prescriptions.length + scannedPrescriptions.length;
    const totalLabReports = labReports.length + scannedLabReports.length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="bg-blue-600 text-white p-3 rounded-full inline-block mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Medical Records</h3>
            <p className="text-2xl font-bold text-blue-600">{totalMedicalHistory}</p>
            {scannedMedicalHistory.length > 0 && (
              <p className="text-xs text-blue-500 mt-1">{scannedMedicalHistory.length} scanned</p>
            )}
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="bg-green-600 text-white p-3 rounded-full inline-block mb-3">
              <Pill className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Active Prescriptions</h3>
            <p className="text-2xl font-bold text-green-600">
              {prescriptions.filter(p => p.isActive).length}
            </p>
            {scannedPrescriptions.length > 0 && (
              <p className="text-xs text-green-500 mt-1">{scannedPrescriptions.length} scanned</p>
            )}
          </div>

          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="bg-purple-600 text-white p-3 rounded-full inline-block mb-3">
              <FlaskConical className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Lab Reports</h3>
            <p className="text-2xl font-bold text-purple-600">{totalLabReports}</p>
            {scannedLabReports.length > 0 && (
              <p className="text-xs text-purple-500 mt-1">{scannedLabReports.length} scanned</p>
            )}
          </div>

          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <div className="bg-orange-600 text-white p-3 rounded-full inline-block mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Other Documents</h3>
            <p className="text-2xl font-bold text-orange-600">{otherScannedDocs.length}</p>
            {otherScannedDocs.length > 0 && (
              <p className="text-xs text-orange-500 mt-1">scanned documents</p>
            )}
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
  };

  const renderMedicalHistory = () => {
    const scannedMedicalHistory = scannedDocuments.filter(doc => doc.category === 'medical-history');
    const allMedicalHistory = [...medicalHistory, ...scannedMedicalHistory];

    return (
      <div className="space-y-4">
        {allMedicalHistory.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Medical History</h3>
            <p className="text-gray-500">Your medical records will appear here.</p>
          </div>
        ) : (
          allMedicalHistory.map((record) => {
            // Check if it's a scanned document or regular medical history
            const isScannedDoc = 'category' in record;
            
            return (
              <div key={isScannedDoc ? record._id : record._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isScannedDoc ? (
                      // Scanned document display
                      <>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{record.fileName}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Scanned
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">
                          {(record.fileSize / 1024 / 1024).toFixed(2)} MB • {record.fileType}
                        </p>
                        {record.aiAnalysis && (
                          <div className="space-y-1 text-sm text-gray-500">
                            {record.aiAnalysis.diagnosis && (
                              <div><span className="font-medium">Diagnosis:</span> {record.aiAnalysis.diagnosis}</div>
                            )}
                            {record.aiAnalysis.doctorName && (
                              <div><span className="font-medium">Doctor:</span> {record.aiAnalysis.doctorName}</div>
                            )}
                            {record.aiAnalysis.patientName && (
                              <div><span className="font-medium">Patient:</span> {record.aiAnalysis.patientName}</div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <span>{new Date(record.uploadDate).toLocaleDateString()}</span>
                          <span>Confidence: {Math.round((record.confidence || 0) * 100)}%</span>
                        </div>
                      </>
                    ) : (
                      // Regular medical history display
                      <>
                        <h3 className="font-semibold text-gray-900 mb-2">{record.condition}</h3>
                        <p className="text-gray-600 mb-3">{record.diagnosis}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(record.dateRecorded).toLocaleDateString()}</span>
                          {record.doctorName && <span>Dr. {record.doctorName}</span>}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewDocument(record)}
                      className="text-blue-600 hover:text-blue-700"
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewDocument(record)}
                      className="text-green-600 hover:text-green-700"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderPrescriptions = () => {
    const scannedPrescriptions = scannedDocuments.filter(doc => doc.category === 'prescription');
    const allPrescriptions = [...prescriptions, ...scannedPrescriptions];

    return (
      <div className="space-y-4">
        {allPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Prescriptions</h3>
            <p className="text-gray-500">Your prescriptions will appear here.</p>
          </div>
        ) : (
          allPrescriptions.map((prescription) => {
            // Check if it's a scanned document or regular prescription
            const isScannedDoc = 'category' in prescription;
            
            return (
              <div key={isScannedDoc ? prescription._id : prescription._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isScannedDoc ? (
                      // Scanned document display
                      <>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{prescription.fileName}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Scanned
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">
                          {(prescription.fileSize / 1024 / 1024).toFixed(2)} MB • {prescription.fileType}
                        </p>
                        {prescription.aiAnalysis && (
                          <div className="space-y-1 text-sm text-gray-500">
                            {prescription.aiAnalysis.doctorName && (
                              <div><span className="font-medium">Doctor:</span> {prescription.aiAnalysis.doctorName}</div>
                            )}
                            {prescription.aiAnalysis.patientName && (
                              <div><span className="font-medium">Patient:</span> {prescription.aiAnalysis.patientName}</div>
                            )}
                            {prescription.aiAnalysis.medications && prescription.aiAnalysis.medications.length > 0 && (
                              <div><span className="font-medium">Medications:</span> {prescription.aiAnalysis.medications.length} found</div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <span>{new Date(prescription.uploadDate).toLocaleDateString()}</span>
                          <span>Confidence: {Math.round((prescription.confidence || 0) * 100)}%</span>
                        </div>
                      </>
                    ) : (
                      // Regular prescription display
                      <>
                        <h3 className="font-semibold text-gray-900 mb-2">{prescription.medicationName}</h3>
                        <p className="text-gray-600 mb-2">{prescription.dosage} • {prescription.frequency}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                          <span>By: {prescription.prescribedBy}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isScannedDoc && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${prescription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {prescription.isActive ? 'Active' : 'Completed'}
                      </span>
                    )}
                    <button 
                      onClick={() => handleViewDocument(prescription)}
                      className="text-blue-600 hover:text-blue-700"
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewDocument(prescription)}
                      className="text-green-600 hover:text-green-700"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderLabReports = () => {
    const scannedLabReports = scannedDocuments.filter(doc => doc.category === 'lab-report');
    const allLabReports = [...labReports, ...scannedLabReports];

    return (
      <div className="space-y-4">
        {allLabReports.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Lab Reports</h3>
            <p className="text-gray-500">Your lab reports will appear here.</p>
          </div>
        ) : (
          allLabReports.map((report) => {
            // Check if it's a scanned document or regular lab report
            const isScannedDoc = 'category' in report;
            
            return (
              <div key={isScannedDoc ? report._id : report._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isScannedDoc ? (
                      // Scanned document display
                      <>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.fileName}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Scanned
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">
                          {(report.fileSize / 1024 / 1024).toFixed(2)} MB • {report.fileType}
                        </p>
                        {report.aiAnalysis && (
                          <div className="space-y-1 text-sm text-gray-500">
                            {report.aiAnalysis.labName && (
                              <div><span className="font-medium">Lab:</span> {report.aiAnalysis.labName}</div>
                            )}
                            {report.aiAnalysis.patientName && (
                              <div><span className="font-medium">Patient:</span> {report.aiAnalysis.patientName}</div>
                            )}
                            {report.aiAnalysis.testResults && report.aiAnalysis.testResults.length > 0 && (
                              <div><span className="font-medium">Test Results:</span> {report.aiAnalysis.testResults.length} found</div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <span>{new Date(report.uploadDate).toLocaleDateString()}</span>
                          <span>Confidence: {Math.round((report.confidence || 0) * 100)}%</span>
                        </div>
                      </>
                    ) : (
                      // Regular lab report display
                      <>
                        <h3 className="font-semibold text-gray-900 mb-2">{report.testName}</h3>
                        <p className="text-gray-600 mb-2">{report.testType}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                          <span>{report.labName}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewDocument(report)}
                      className="text-blue-600 hover:text-blue-700"
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewDocument(report)}
                      className="text-green-600 hover:text-green-700"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderScannedDocuments = () => {
    const otherScannedDocs = scannedDocuments.filter(doc => doc.category === 'other');

    return (
      <div className="space-y-4">
        {otherScannedDocs.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Other Documents</h3>
            <p className="text-gray-500">Documents that don't fit into specific categories will appear here.</p>
          </div>
        ) : (
          otherScannedDocs.map((document) => (
          <div key={document._id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{document.fileName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    document.category === 'prescription' ? 'bg-green-100 text-green-800' :
                    document.category === 'lab-report' ? 'bg-purple-100 text-purple-800' :
                    document.category === 'medical-history' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {document.category.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-2 text-sm">
                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB • {document.fileType}
                </p>
                {document.aiAnalysis && (
                  <div className="space-y-1 text-sm text-gray-500">
                    {document.aiAnalysis.patientName && (
                      <div>Patient: {document.aiAnalysis.patientName}</div>
                    )}
                    {document.aiAnalysis.doctorName && (
                      <div>Doctor: {document.aiAnalysis.doctorName}</div>
                    )}
                    {document.aiAnalysis.diagnosis && (
                      <div>Diagnosis: {document.aiAnalysis.diagnosis}</div>
                    )}
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                  <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                  <span>Confidence: {Math.round((document.confidence || 0) * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleViewDocument(document)}
                  className="text-blue-600 hover:text-blue-700"
                  title="View Document"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleViewDocument(document)}
                  className="text-green-600 hover:text-green-700"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      </div>
    );
  };

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
                    {activeTab === 'scanned-documents' && renderScannedDocuments()}
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

      {/* Document View Modal */}
      <DocumentViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        document={selectedDocument}
      />
    </div>
  );
};

export default HealthVault; 