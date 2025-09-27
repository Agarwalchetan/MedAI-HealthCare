import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Edit3,
  Save,
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  Clock
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LabNavbar from '../components/LabNavbar';
import LabSidebar from '../components/LabSidebar';
import { labAPI } from '../services/labAPI';
import { useAuth } from '../../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().min(2).max(100).required('Lab name is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
  alternatePhone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').optional(),
  website: yup.string().url('Invalid website URL').optional(),
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  services: yup.array().min(1, 'At least one service must be selected').required()
});

interface ProfileFormData {
  name: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  services: string[];
}

const LabProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { lab } = useAuth();

  const availableServices = [
    'Blood Tests',
    'Urine Tests', 
    'X-Ray',
    'MRI',
    'CT Scan',
    'Ultrasound',
    'ECG',
    'Pathology',
    'Microbiology',
    'Biochemistry',
    'Hematology',
    'Immunology',
    'Molecular Diagnostics'
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: lab?.name || '',
      phone: lab?.contactInfo?.phone || '',
      alternatePhone: lab?.contactInfo?.alternatePhone || '',
      website: lab?.contactInfo?.website || '',
      street: lab?.address?.street || '',
      city: lab?.address?.city || '',
      state: lab?.address?.state || '',
      zipCode: lab?.address?.zipCode || '',
      services: lab?.services || []
    }
  });

  useEffect(() => {
    if (lab?.services) {
      setSelectedServices(lab.services);
    }
  }, [lab]);

  const handleServiceToggle = (service: string) => {
    const updatedServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    
    setSelectedServices(updatedServices);
    setValue('services', updatedServices);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updateData = {
        name: data.name,
        contactInfo: {
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          website: data.website
        },
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: lab?.address?.country || 'India'
        },
        services: selectedServices
      };

      await labAPI.updateProfile(updateData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedServices(lab?.services || []);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Lab Information', icon: <User className="h-4 w-4" /> },
    { id: 'services', name: 'Services', icon: <FileText className="h-4 w-4" /> },
    { id: 'performance', name: 'Performance', icon: <Star className="h-4 w-4" /> },
    { id: 'verification', name: 'Verification Status', icon: <CheckCircle className="h-4 w-4" /> }
  ];

  const renderProfileTab = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Name</label>
          <input
            {...register('name')}
            type="text"
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={lab?.email || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone</label>
          <input
            {...register('phone')}
            type="tel"
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
          <input
            {...register('alternatePhone')}
            type="tel"
            disabled={!isEditing}
            placeholder="Optional"
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.alternatePhone && <p className="mt-1 text-sm text-red-600">{errors.alternatePhone.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            {...register('website')}
            type="url"
            disabled={!isEditing}
            placeholder="https://www.yourlab.com"
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              {...register('street')}
              type="text"
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
            {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                {...register('city')}
                type="text"
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                {...register('state')}
                type="text"
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                {...register('zipCode')}
                type="text"
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
              {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      )}
    </form>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Services Offered</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Edit Services
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableServices.map((service) => (
          <label
            key={service}
            className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedServices.includes(service)
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
            } ${!isEditing ? 'cursor-default' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => isEditing && handleServiceToggle(service)}
              disabled={!isEditing}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm font-medium">{service}</span>
          </label>
        ))}
      </div>
      {errors.services && (
        <p className="text-sm text-red-600">{errors.services.message}</p>
      )}
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="bg-blue-600 text-white p-3 rounded-full inline-block mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total Reports</h3>
          <p className="text-2xl font-bold text-blue-600">{lab?.totalReports || 0}</p>
          <p className="text-sm text-gray-600">All time</p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 text-center">
          <div className="bg-green-600 text-white p-3 rounded-full inline-block mb-3">
            <Star className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Rating</h3>
          <p className="text-2xl font-bold text-green-600">
            {lab?.rating?.average?.toFixed(1) || '0.0'}
          </p>
          <p className="text-sm text-gray-600">({lab?.rating?.count || 0} reviews)</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 text-center">
          <div className="bg-purple-600 text-white p-3 rounded-full inline-block mb-3">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Avg Turnaround</h3>
          <p className="text-2xl font-bold text-purple-600">
            {lab?.qualityMetrics?.averageTurnaroundTime || 24}h
          </p>
          <p className="text-sm text-gray-600">Industry standard</p>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 text-center">
          <div className="bg-orange-600 text-white p-3 rounded-full inline-block mb-3">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Accuracy</h3>
          <p className="text-2xl font-bold text-orange-600">
            {lab?.qualityMetrics?.reportAccuracy || 98.5}%
          </p>
          <p className="text-sm text-gray-600">Quality score</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quality Metrics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average Turnaround Time</span>
            <span className="font-medium">{lab?.qualityMetrics?.averageTurnaroundTime || 24} hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Report Accuracy</span>
            <span className="font-medium text-green-600">{lab?.qualityMetrics?.reportAccuracy || 98.5}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Patient Satisfaction</span>
            <span className="font-medium text-blue-600">{lab?.qualityMetrics?.patientSatisfaction || 4.6}/5.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">On-Time Delivery</span>
            <span className="font-medium text-purple-600">{lab?.qualityMetrics?.onTimeDelivery || 95.2}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerificationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border-2 ${
          lab?.isApproved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            {lab?.isApproved ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
            <h3 className={`font-semibold ${
              lab?.isApproved ? 'text-green-900' : 'text-yellow-900'
            }`}>
              Lab Approval Status
            </h3>
          </div>
          <p className={`text-sm ${
            lab?.isApproved ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {lab?.isApproved 
              ? 'Your laboratory has been approved and verified by our medical team.'
              : 'Your laboratory registration is pending approval. Please ensure all documents are uploaded.'
            }
          </p>
        </div>

        <div className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Accreditation Status</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-800">Accreditation:</span>
              <span className="font-medium text-blue-900">{lab?.accreditation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">License Number:</span>
              <span className="font-medium text-blue-900 font-mono">{lab?.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Registration:</span>
              <span className="font-medium text-blue-900 font-mono">{lab?.registrationNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Verification Checklist</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-gray-700">Email verification completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-gray-700">Phone number verified</span>
          </div>
          <div className="flex items-center space-x-3">
            {lab?.isApproved ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="text-gray-700">Laboratory license verification</span>
          </div>
          <div className="flex items-center space-x-3">
            {lab?.isApproved ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="text-gray-700">Accreditation verification</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      <LabSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <LabNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white p-4 rounded-full">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{lab?.name}</h1>
                    <p className="text-gray-600">{lab?.accreditation} Accredited Laboratory</p>
                    <p className="text-sm text-gray-500">License: {lab?.licenseNumber}</p>
                  </div>
                </div>
                {activeTab === 'profile' && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isEditing
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                )}
              </div>
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
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'services' && renderServicesTab()}
                {activeTab === 'performance' && renderPerformanceTab()}
                {activeTab === 'verification' && renderVerificationTab()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LabProfile;