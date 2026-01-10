import React, { useState, useEffect } from 'react';
import { Pill, Plus, Calendar, Clock, User, Eye, Download } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { Prescription, ScannedDocument } from '../../../shared/types';
import toast from 'react-hot-toast';
import { DocumentViewModal } from './HealthVault/DocumentViewModal';
import { FileUploadModal } from './HealthVault/Components';

const PrescriptionsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchPrescriptionsData();
  }, []);

  const fetchPrescriptionsData = async () => {
    try {
      const [prescriptionsResponse, scannedDocsResponse] = await Promise.all([
        userAPI.getPrescriptions(),
        userAPI.getScannedDocuments()
      ]);

      setPrescriptions(prescriptionsResponse.data?.prescriptions || []);
      setScannedDocuments(scannedDocsResponse.data?.scannedDocuments || []);
    } catch (error) {
      console.error('Error fetching prescriptions data:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  // Combine regular prescriptions with scanned prescription documents
  const scannedPrescriptions = scannedDocuments.filter(doc => doc.category === 'prescription');
  const allPrescriptions = [...prescriptions, ...scannedPrescriptions];

  const filteredPrescriptions = allPrescriptions.filter(prescription => {
    if (filter === 'active') {
      // For scanned documents, we consider them as "active" if they're recent (within last 6 months)
      if ('category' in prescription) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return new Date(prescription.uploadDate) > sixMonthsAgo;
      }
      return prescription.isActive;
    }
    if (filter === 'completed') {
      // For scanned documents, we consider them as "completed" if they're older than 6 months
      if ('category' in prescription) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return new Date(prescription.uploadDate) <= sixMonthsAgo;
      }
      return !prescription.isActive;
    }
    return true;
  });

  const getStatusColor = (prescription: any) => {
    if ('category' in prescription) {
      // For scanned documents, determine status based on age
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const isRecent = new Date(prescription.uploadDate) > sixMonthsAgo;
      return isRecent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    }
    return prescription.isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (prescription: any) => {
    if ('category' in prescription) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return new Date(prescription.uploadDate) > sixMonthsAgo ? 'Active' : 'Completed';
    }
    return prescription.isActive ? 'Active' : 'Completed';
  };

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleSaveExtractedData = (extractedText: string) => {
    // Refresh data after successful upload
    fetchPrescriptionsData();
    toast.success('Prescription uploaded and processed successfully!');
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
                <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
                <p className="text-gray-600 mt-1">Manage your medications and prescriptions</p>
              </div>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Add Prescription</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-1 mb-6 inline-flex">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                All ({allPrescriptions.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Active ({allPrescriptions.filter(p => {
                  if ('category' in p) {
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    return new Date(p.uploadDate) > sixMonthsAgo;
                  }
                  return p.isActive;
                }).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Completed ({allPrescriptions.filter(p => {
                  if ('category' in p) {
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    return new Date(p.uploadDate) <= sixMonthsAgo;
                  }
                  return !p.isActive;
                }).length})
              </button>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading prescriptions...</p>
                </div>
              ) : filteredPrescriptions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Found</h3>
                  <p className="text-gray-500 mb-6">You don't have any prescriptions matching the selected filter.</p>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Prescription</span>
                  </button>
                </div>
              ) : (
                filteredPrescriptions.map((prescription) => {
                  // Check if it's a scanned document or regular prescription
                  const isScannedDoc = 'category' in prescription;
                  
                  return (
                    <div key={isScannedDoc ? prescription._id : prescription._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-blue-600 text-white p-2 rounded-lg">
                              <Pill className="h-5 w-5" />
                            </div>
                            <div>
                              {isScannedDoc ? (
                                // Scanned document display
                                <>
                                  <h3 className="text-xl font-semibold text-gray-900">{prescription.fileName}</h3>
                                  <p className="text-gray-600">
                                    {(prescription.fileSize / 1024 / 1024).toFixed(2)} MB • {prescription.fileType}
                                  </p>
                                </>
                              ) : (
                                // Regular prescription display
                                <>
                                  <h3 className="text-xl font-semibold text-gray-900">{prescription.medicationName}</h3>
                                  <p className="text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                                </>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {isScannedDoc && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Scanned
                                </span>
                              )}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription)}`}>
                                {getStatusText(prescription)}
                              </span>
                            </div>
                          </div>

                          {isScannedDoc ? (
                            // Scanned document details
                            <>
                              {prescription.aiAnalysis && (
                                <div className="space-y-2 text-sm text-gray-500 mb-4">
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
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{new Date(prescription.uploadDate).toLocaleDateString()}</span>
                                <span>Confidence: {Math.round((prescription.confidence || 0) * 100)}%</span>
                              </div>
                            </>
                          ) : (
                            // Regular prescription details
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">Duration: {prescription.duration}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <User className="h-4 w-4" />
                                  <span className="text-sm">By: {prescription.prescribedBy}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm">{new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {prescription.instructions && (
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                  <h4 className="font-medium text-blue-900 mb-1">Instructions</h4>
                                  <p className="text-blue-800 text-sm">{prescription.instructions}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            onClick={() => handleViewDocument(prescription)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="View Document"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleViewDocument(prescription)}
                            className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
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
            {filteredPrescriptions.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                    <Pill className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Active Medications</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredPrescriptions.filter(p => {
                      if ('category' in p) {
                        const sixMonthsAgo = new Date();
                        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                        return new Date(p.uploadDate) > sixMonthsAgo;
                      }
                      return p.isActive;
                    }).length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">This Month</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredPrescriptions.filter(p => {
                      const date = 'category' in p ? p.uploadDate : p.prescribedDate;
                      return new Date(date).getMonth() === new Date().getMonth();
                    }).length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Doctors</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(filteredPrescriptions.map(p => {
                      if ('category' in p && p.aiAnalysis?.doctorName) {
                        return p.aiAnalysis.doctorName;
                      }
                      return 'prescribedBy' in p ? p.prescribedBy : '';
                    }).filter(Boolean)).size}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-orange-100 text-orange-600 p-3 rounded-full inline-block mb-3">
                    <Pill className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Scanned Docs</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {scannedPrescriptions.length}
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

      {/* Document View Modal */}
      <DocumentViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        document={selectedDocument}
      />
    </div>
  );
};

export default PrescriptionsPage;