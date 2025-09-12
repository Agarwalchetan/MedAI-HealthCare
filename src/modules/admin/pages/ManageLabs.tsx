import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Download,
  Star,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';
import toast from 'react-hot-toast';

interface Lab {
  _id: string;
  name: string;
  email: string;
  licenseNumber: string;
  registrationNumber: string;
  accreditation: string;
  contactInfo: {
    phone: string;
    alternatePhone?: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  services: string[];
  isApproved: boolean;
  isActive: boolean;
  rating: {
    average: number;
    count: number;
  };
  totalReports: number;
  qualityMetrics: {
    averageTurnaroundTime: number;
    reportAccuracy: number;
    patientSatisfaction: number;
    onTimeDelivery: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ManageLabs: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [pendingLabs, setPendingLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showLabModal, setShowLabModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const services = [
    'Blood Tests', 'Urine Tests', 'X-Ray', 'MRI', 'CT Scan', 
    'Ultrasound', 'ECG', 'Pathology', 'Microbiology'
  ];

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      // Mock data for development - in production, fetch from adminAPI
      const mockApprovedLabs: Lab[] = [
        {
          _id: '1',
          name: 'City Diagnostic Center',
          email: 'admin@citydiagnostic.com',
          licenseNumber: 'LAB123456',
          registrationNumber: 'REG789012',
          accreditation: 'NABL',
          contactInfo: {
            phone: '9876543210',
            alternatePhone: '9876543211',
            website: 'www.citydiagnostic.com'
          },
          address: {
            street: '123 Medical Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          services: ['Blood Tests', 'Urine Tests', 'X-Ray', 'Pathology'],
          isApproved: true,
          isActive: true,
          rating: { average: 4.6, count: 89 },
          totalReports: 1250,
          qualityMetrics: {
            averageTurnaroundTime: 24,
            reportAccuracy: 98.5,
            patientSatisfaction: 4.6,
            onTimeDelivery: 95.2
          },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date()
        }
      ];

      const mockPendingLabs: Lab[] = [
        {
          _id: '2',
          name: 'Advanced Diagnostics Lab',
          email: 'info@advanceddiag.com',
          licenseNumber: 'LAB654321',
          registrationNumber: 'REG210987',
          accreditation: 'ISO15189',
          contactInfo: {
            phone: '9876543212',
            website: 'www.advanceddiag.com'
          },
          address: {
            street: '456 Health Avenue',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India'
          },
          services: ['MRI', 'CT Scan', 'Ultrasound', 'Molecular Diagnostics'],
          isApproved: false,
          isActive: false,
          rating: { average: 0, count: 0 },
          totalReports: 0,
          qualityMetrics: {
            averageTurnaroundTime: 0,
            reportAccuracy: 0,
            patientSatisfaction: 0,
            onTimeDelivery: 0
          },
          createdAt: new Date('2024-03-10'),
          updatedAt: new Date()
        }
      ];

      setLabs(mockApprovedLabs);
      setPendingLabs(mockPendingLabs);
    } catch (error) {
      console.error('Error fetching labs:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveLabRegistration = async (labId: string, approved: boolean, comments?: string) => {
    try {
      // In production, call adminAPI.approveLabRegistration
      if (approved) {
        const approvedLab = pendingLabs.find(l => l._id === labId);
        if (approvedLab) {
          setLabs(prev => [...prev, { ...approvedLab, isApproved: true, isActive: true }]);
          setPendingLabs(prev => prev.filter(l => l._id !== labId));
        }
        toast.success('Lab approved successfully');
      } else {
        setPendingLabs(prev => prev.filter(l => l._id !== labId));
        toast.success('Lab registration rejected');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process approval');
    }
  };

  const toggleLabStatus = async (labId: string, currentStatus: boolean) => {
    try {
      // In production, call adminAPI.updateLabStatus
      setLabs(prev => prev.map(lab => 
        lab._id === labId ? { ...lab, isActive: !currentStatus } : lab
      ));
      toast.success(`Lab ${!currentStatus ? 'activated' : 'suspended'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update lab status');
    }
  };

  const viewLabDetails = (lab: Lab) => {
    setSelectedLab(lab);
    setShowLabModal(true);
  };

  const tabs = [
    { id: 'pending', name: 'Pending Approval', count: pendingLabs.length },
    { id: 'approved', name: 'Approved Labs', count: labs.length },
    { id: 'analytics', name: 'Lab Analytics', count: 0 }
  ];

  const currentLabs = activeTab === 'pending' ? pendingLabs : labs;
  
  const filteredLabs = currentLabs.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = serviceFilter === 'all' || lab.services.includes(serviceFilter);
    
    return matchesSearch && matchesService;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Laboratories</h1>
                <p className="text-gray-600 mt-1">Review lab applications and manage diagnostic partners</p>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Download className="h-5 w-5" />
                <span>Export Report</span>
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
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span>{tab.name}</span>
                      {tab.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          activeTab === tab.id ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab !== 'analytics' && (
                  <>
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search by name, email, or license number..."
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                          value={serviceFilter}
                          onChange={(e) => setServiceFilter(e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="all">All Services</option>
                          {services.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Labs Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Laboratory</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">License</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Accreditation</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Services</th>
                            {activeTab === 'approved' && (
                              <>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Reports</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Rating</th>
                              </>
                            )}
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLabs.map((lab) => (
                            <tr key={lab._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                                    <FlaskConical className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{lab.name}</p>
                                    <p className="text-sm text-gray-600">{lab.email}</p>
                                    <p className="text-xs text-gray-500">{lab.address.city}, {lab.address.state}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm">
                                  <p className="font-mono text-gray-900">{lab.licenseNumber}</p>
                                  <p className="text-gray-600">{lab.registrationNumber}</p>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {lab.accreditation}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-wrap gap-1">
                                  {lab.services.slice(0, 2).map((service, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      {service}
                                    </span>
                                  ))}
                                  {lab.services.length > 2 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      +{lab.services.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </td>
                              {activeTab === 'approved' && (
                                <>
                                  <td className="py-4 px-6">
                                    <span className="text-sm font-medium text-purple-600">{lab.totalReports}</span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="text-sm font-medium">{lab.rating.average.toFixed(1)}</span>
                                      <span className="text-xs text-gray-500">({lab.rating.count})</span>
                                    </div>
                                  </td>
                                </>
                              )}
                              <td className="py-4 px-6">
                                {activeTab === 'pending' ? (
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    Pending Review
                                  </span>
                                ) : (
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    lab.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {lab.isActive ? 'Active' : 'Suspended'}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => viewLabDetails(lab)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {activeTab === 'pending' ? (
                                    <>
                                      <button
                                        onClick={() => approveLabRegistration(lab._id, true)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                        title="Approve"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => approveLabRegistration(lab._id, false)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        title="Reject"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => toggleLabStatus(lab._id, lab.isActive)}
                                      className={`p-2 rounded-lg transition-colors duration-200 ${
                                        lab.isActive 
                                          ? 'text-red-600 hover:bg-red-50' 
                                          : 'text-green-600 hover:bg-green-50'
                                      }`}
                                      title={lab.isActive ? 'Suspend' : 'Activate'}
                                    >
                                      {lab.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-purple-50 rounded-xl p-6 text-center">
                        <div className="bg-purple-600 text-white p-3 rounded-full inline-block mb-3">
                          <FlaskConical className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Total Labs</h3>
                        <p className="text-2xl font-bold text-purple-600">{labs.length + pendingLabs.length}</p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-6 text-center">
                        <div className="bg-green-600 text-white p-3 rounded-full inline-block mb-3">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Approved</h3>
                        <p className="text-2xl font-bold text-green-600">{labs.length}</p>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-6 text-center">
                        <div className="bg-blue-600 text-white p-3 rounded-full inline-block mb-3">
                          <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Total Reports</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {labs.reduce((sum, lab) => sum + lab.totalReports, 0)}
                        </p>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-6 text-center">
                        <div className="bg-orange-600 text-white p-3 rounded-full inline-block mb-3">
                          <Star className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Avg Rating</h3>
                        <p className="text-2xl font-bold text-orange-600">
                          {labs.length > 0 
                            ? (labs.reduce((sum, lab) => sum + lab.rating.average, 0) / labs.length).toFixed(1)
                            : '0.0'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Labs</h3>
                      <div className="space-y-4">
                        {labs
                          .sort((a, b) => b.rating.average - a.rating.average)
                          .slice(0, 5)
                          .map((lab, index) => (
                            <div key={lab._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                                <div>
                                  <p className="font-medium text-gray-900">{lab.name}</p>
                                  <p className="text-sm text-gray-600">{lab.address.city}, {lab.address.state}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Rating</p>
                                  <p className="font-bold text-yellow-600">{lab.rating.average.toFixed(1)}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Reports</p>
                                  <p className="font-bold text-purple-600">{lab.totalReports}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Turnaround</p>
                                  <p className="font-bold text-blue-600">{lab.qualityMetrics.averageTurnaroundTime}h</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Lab Details Modal */}
      {showLabModal && selectedLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Laboratory Details</h2>
                <button
                  onClick={() => setShowLabModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedLab.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedLab.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">License:</span>
                        <span className="font-medium font-mono">{selectedLab.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration:</span>
                        <span className="font-medium font-mono">{selectedLab.registrationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accreditation:</span>
                        <span className="font-medium">{selectedLab.accreditation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedLab.contactInfo.phone}</span>
                      </div>
                      {selectedLab.contactInfo.alternatePhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{selectedLab.contactInfo.alternatePhone} (Alt)</span>
                        </div>
                      )}
                      {selectedLab.contactInfo.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <a href={selectedLab.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            {selectedLab.contactInfo.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p>{selectedLab.address.street}</p>
                          <p>{selectedLab.address.city}, {selectedLab.address.state} {selectedLab.address.zipCode}</p>
                          <p>{selectedLab.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services & Performance */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLab.services.map((service, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedLab.isApproved && (
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{selectedLab.totalReports}</p>
                          <p className="text-sm text-gray-600">Total Reports</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{selectedLab.rating.average.toFixed(1)}</p>
                          <p className="text-sm text-gray-600">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{selectedLab.qualityMetrics.averageTurnaroundTime}h</p>
                          <p className="text-sm text-gray-600">Avg Turnaround</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{selectedLab.qualityMetrics.onTimeDelivery}%</p>
                          <p className="text-sm text-gray-600">On-Time Delivery</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Approval Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedLab.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedLab.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedLab.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedLab.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Registered:</span>
                        <span className="font-medium">
                          {new Date(selectedLab.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowLabModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                {!selectedLab.isApproved ? (
                  <>
                    <button
                      onClick={() => approveLabRegistration(selectedLab._id, false)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => approveLabRegistration(selectedLab._id, true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Approve Lab
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleLabStatus(selectedLab._id, selectedLab.isActive)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedLab.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedLab.isActive ? 'Suspend Lab' : 'Activate Lab'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLabs;