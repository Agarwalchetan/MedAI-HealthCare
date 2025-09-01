import React, { useState, useEffect } from 'react';
import { Plus, FlaskConical, Calendar, Download, Upload, FileText, Eye } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { LabReport } from '../../../shared/types';
import toast from 'react-hot-toast';

const LabReportsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchLabReports();
  }, []);

  const fetchLabReports = async () => {
    try {
      const response = await userAPI.getLabReports();
      setLabReports(response.data.labReports || []);
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      toast.error('Failed to load lab reports');
    } finally {
      setLoading(false);
    }
  };

  // Sample lab reports for demonstration
  const sampleLabReports: LabReport[] = [
    {
      _id: '1',
      testName: 'Complete Blood Count (CBC)',
      testType: 'Blood Test',
      reportDate: new Date('2024-01-15'),
      results: 'All parameters within normal limits. Hemoglobin: 14.2 g/dL, WBC: 7,200/μL, Platelets: 280,000/μL',
      normalRange: 'Hemoglobin: 12.0-16.0 g/dL, WBC: 4,000-11,000/μL',
      labName: 'City Diagnostic Center',
      doctorReferred: 'Dr. Sarah Johnson',
      fileUrl: '',
      status: 'completed'
    },
    {
      _id: '2',
      testName: 'Lipid Profile',
      testType: 'Blood Test',
      reportDate: new Date('2024-01-10'),
      results: 'Total Cholesterol: 195 mg/dL, LDL: 120 mg/dL, HDL: 45 mg/dL, Triglycerides: 150 mg/dL',
      normalRange: 'Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL',
      labName: 'HealthCare Labs',
      doctorReferred: 'Dr. Michael Chen',
      fileUrl: '',
      status: 'reviewed'
    },
    {
      _id: '3',
      testName: 'HbA1c',
      testType: 'Blood Test',
      reportDate: new Date('2024-01-05'),
      results: '6.8% - Indicates good diabetes control',
      normalRange: 'Non-diabetic: <5.7%, Good control: <7.0%',
      labName: 'Advanced Diagnostics',
      doctorReferred: 'Dr. Emily Rodriguez',
      fileUrl: '',
      status: 'completed'
    }
  ];

  const displayReports = labReports.length > 0 ? labReports : sampleLabReports;

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
                <h1 className="text-3xl font-bold text-gray-900">Lab Reports</h1>
                <p className="text-gray-600 mt-1">View and manage your laboratory test results</p>
              </div>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Report</span>
              </button>
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
              ) : displayReports.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Reports</h3>
                  <p className="text-gray-500 mb-6">Upload your first lab report to get started.</p>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload First Report</span>
                  </button>
                </div>
              ) : (
                displayReports.map((report) => (
                  <div key={report._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-purple-600 text-white p-2 rounded-lg">
                            <FlaskConical className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{report.testName}</h3>
                            <p className="text-gray-600">{report.testType}</p>
                          </div>
                          <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            <span className="capitalize">{report.status}</span>
                          </span>
                        </div>

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
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary Cards */}
            {displayReports.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Total Reports</h3>
                  <p className="text-2xl font-bold text-purple-600">{displayReports.length}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Completed</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {displayReports.filter(r => r.status === 'completed').length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reviewed</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {displayReports.filter(r => r.status === 'reviewed').length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full inline-block mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">This Month</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {displayReports.filter(r => 
                      new Date(r.reportDate).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportsPage;