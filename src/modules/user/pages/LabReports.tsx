import React, { useState, useEffect } from 'react';
import { FlaskConical, Calendar, Download, Upload, FileText, Eye } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { labAPI } from '../../lab/services/labAPI';
import { LabReport, ScannedDocument } from '../../../shared/types';
import toast from 'react-hot-toast';
import { DocumentViewModal } from './HealthVault/DocumentViewModal';
import { FileUploadModal } from './HealthVault/Components';
import { LalPathLabModal } from './Lab report/lalPathLab';

const LabReportsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLalPathModal, setShowLalPathModal] = useState(false);

  useEffect(() => {
    fetchLabReportsData();
  }, []);

  const fetchLabReportsData = async () => {
    try {
      const [labReportsResponse, scannedDocsResponse] = await Promise.all([
        userAPI.getLabReports(),
        userAPI.getScannedDocuments()
      ]);

      setLabReports(labReportsResponse.data?.labReports || []);
      setScannedDocuments(scannedDocsResponse.data?.scannedDocuments || []);
      
      // Also fetch from labs
      await fetchLabReportsFromLabs();
    } catch (error) {
      console.error('Error fetching lab reports data:', error);
      toast.error('Failed to load lab reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchLabReportsFromLabs = async () => {
    try {
      // Get current user ID from auth context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        const response = await labAPI.getPatientReports(user._id);
        const labReports = response.data?.reports || [];
        
        // Convert lab reports to user lab report format
        const convertedReports = labReports.map(report => ({
          _id: report._id,
          testName: report.testName,
          testType: report.testType,
          reportDate: report.reportDate,
          results: report.results?.summary || '',
          normalRange: report.results?.normalValues || '',
          labName: report.lab?.name || 'Lab',
          doctorReferred: report.doctor?.fullName || '',
          fileUrl: report.files?.[0]?.fileUrl || '',
          status: report.status.toLowerCase() as 'pending' | 'completed' | 'reviewed'
        }));
        
        // Merge with existing reports, avoiding duplicates
        setLabReports(prev => {
          const existingIds = new Set(prev.map(r => r._id));
          const newReports = convertedReports.filter(r => !existingIds.has(r._id));
          return [...prev, ...newReports];
        });
      }
    } catch (error) {
      console.error('Error fetching lab reports from labs:', error);
    }
  };

  // Combine regular lab reports with scanned lab report documents
  const scannedLabReports = scannedDocuments.filter(doc => doc.category === 'lab-report');
  const allLabReports = [...labReports, ...scannedLabReports];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FlaskConical className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'pending': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleSaveExtractedData = (extractedText: string) => {
    // Refresh data after successful upload
    fetchLabReportsData();
    toast.success('Lab report uploaded and processed successfully!');
  };

  const handleLalPathReportFetched = (reportData: any) => {
    // The report is already added to the database by the backend
    // Just refresh the data to show the new report
    fetchLabReportsData();
    toast.success('LalPath Labs report added to your lab reports!');
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserNavbar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Lab Reports</h1>
                <p className="text-gray-600 mt-1">View and manage your laboratory test results</p>
              </div>
               <div className="flex items-center space-x-3">
                 <button
                   onClick={() => setShowLalPathModal(true)}
                   className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                 >
                   <Download className="h-5 w-5" />
                   <span>Fetch LalPath Report</span>
                 </button>
                 <button
                   onClick={() => setShowUploadModal(true)}
                   className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                 >
                   <Upload className="h-5 w-5" />
                   <span>Upload Report</span>
                 </button>
               </div>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Lab Report</h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Complete Blood Count"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select test type</option>
                        <option value="blood-test">Blood Test</option>
                        <option value="urine-test">Urine Test</option>
                        <option value="imaging">Imaging</option>
                        <option value="biopsy">Biopsy</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lab Name</label>
                      <input
                        type="text"
                        placeholder="Laboratory name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Referring Doctor</label>
                      <input
                        type="text"
                        placeholder="Doctor who ordered the test"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Drag and drop your report file here, or click to browse</p>
                      <p className="text-sm text-gray-500">Supports PDF, JPG, PNG files up to 10MB</p>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Upload Report
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lab Reports List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading lab reports...</p>
                </div>
              ) : allLabReports.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Reports</h3>
                  <p className="text-gray-500 mb-6">Upload your first lab report to get started.</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload First Report</span>
                  </button>
                </div>
              ) : (
                allLabReports.map((report) => {
                  // Check if it's a scanned document or regular lab report
                  const isScannedDoc = 'category' in report;
                  
                  return (
                  <div key={report._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-purple-600 text-white p-2 rounded-lg">
                            <FlaskConical className="h-5 w-5" />
                          </div>
                          <div>
                            {isScannedDoc ? (
                              // Scanned document display
                              <>
                                <h3 className="text-xl font-semibold text-gray-900">{report.fileName}</h3>
                                <p className="text-gray-600">
                                  {(report.fileSize / 1024 / 1024).toFixed(2)} MB • {report.fileType}
                                </p>
                              </>
                            ) : (
                              // Regular lab report display
                              <>
                                <h3 className="text-xl font-semibold text-gray-900">{report.testName}</h3>
                                <p className="text-gray-600">{report.testType}</p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {isScannedDoc && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Scanned
                              </span>
                            )}
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(isScannedDoc ? 'completed' : report.status)}`}>
                              {getStatusIcon(isScannedDoc ? 'completed' : report.status)}
                              <span className="capitalize">{isScannedDoc ? 'completed' : report.status}</span>
                            </span>
                          </div>
                        </div>

                        {isScannedDoc ? (
                          // Scanned document details
                          <>
                            {report.aiAnalysis && (
                              <div className="space-y-2 text-sm text-gray-500 mb-4">
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
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{new Date(report.uploadDate).toLocaleDateString()}</span>
                              <span>Confidence: {Math.round((report.confidence || 0) * 100)}%</span>
                            </div>
                          </>
                        ) : (
                          // Regular lab report details
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">Report Date: {new Date(report.reportDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">Lab: {report.labName}</span>
                              </div>
                            </div>

                            {report.doctorReferred && (
                              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                                <span className="text-sm">Referred by: {report.doctorReferred}</span>
                              </div>
                            )}

                            {report.results && (
                              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Results</h4>
                                <p className="text-sm text-gray-700 mb-2">{report.results}</p>
                                {report.normalRange && (
                                  <p className="text-xs text-gray-500">Normal Range: {report.normalRange}</p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button 
                          onClick={() => handleViewDocument(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="View Document"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewDocument(report)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
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

            {/* Summary Cards */}
            {allLabReports.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Total Reports</h3>
                  <p className="text-2xl font-bold text-purple-600">{allLabReports.length}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Completed</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {allLabReports.filter(r => {
                      if ('category' in r) return true; // Scanned docs are considered completed
                      return r.status === 'completed';
                    }).length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reviewed</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {allLabReports.filter(r => {
                      if ('category' in r) return false; // Scanned docs are not "reviewed" status
                      return r.status === 'reviewed';
                    }).length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full inline-block mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">This Month</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {allLabReports.filter(r => {
                      const date = 'category' in r ? r.uploadDate : r.reportDate;
                      return new Date(date).getMonth() === new Date().getMonth();
                    }).length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-orange-100 text-orange-600 p-3 rounded-full inline-block mb-3">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Scanned Docs</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {scannedLabReports.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={handleSaveExtractedData}
      />

      {/* LalPath Labs Modal */}
      <LalPathLabModal
        isOpen={showLalPathModal}
        onClose={() => setShowLalPathModal(false)}
        onReportFetched={handleLalPathReportFetched}
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

export default LabReportsPage;