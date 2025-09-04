import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin,
  Clock,
  Star,
  Edit3,
  Save,
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { doctorAPI } from '../services/doctorAPI';
import { useAuth } from '../../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const schema = yup.object({
  fullName: yup.string().min(2).max(50).required('Full name is required'),
  specialization: yup.string().required('Specialization is required'),
  experience: yup.number().min(0).required('Experience is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
  consultationFee: yup.number().min(0).required('Consultation fee is required'),
  clinicName: yup.string(),
  clinicAddress: yup.string(),
  clinicPhone: yup.string()
});

interface ProfileFormData {
  fullName: string;
  specialization: string;
  experience: number;
  phone: string;
  consultationFee: number;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
}

const DoctorProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { doctor } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: doctor?.fullName || '',
      specialization: doctor?.specialization || '',
      experience: doctor?.experience || 0,
      phone: doctor?.phone || '',
      consultationFee: doctor?.consultationFee || 0,
      clinicName: doctor?.clinicDetails?.name || '',
      clinicAddress: doctor?.clinicDetails?.address || '',
      clinicPhone: doctor?.clinicDetails?.phone || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updateData = {
        fullName: data.fullName,
        specialization: data.specialization,
        experience: data.experience,
        phone: data.phone,
        consultationFee: data.consultationFee,
        clinicDetails: {
          name: data.clinicName,
          address: data.clinicAddress,
          phone: data.clinicPhone,
          timings: doctor?.clinicDetails?.timings || { start: '09:00', end: '17:00', days: [] }
        }
      };

      await doctorAPI.updateProfile(updateData);
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
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: <User className="h-4 w-4" /> },
    { id: 'documents', name: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { id: 'availability', name: 'Availability', icon: <Clock className="h-4 w-4" /> },
    { id: 'verification', name: 'Verification Status', icon: <CheckCircle className="h-4 w-4" /> }
  ];

  const specializations = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery', 'Gynecology'
  ];

  const renderProfileTab = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            {...register('fullName')}
            type="text"
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
          <select
            {...register('specialization')}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
          <input
            {...register('experience')}
            type="number"
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            {...register('phone')}
            type="tel"
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={doctor?.email || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
          <input
            {...register('consultationFee')}
            type="number"
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
              isEditing 
                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {errors.consultationFee && <p className="mt-1 text-sm text-red-600">{errors.consultationFee.message}</p>}
        </div>
      </div>

      {/* Clinic Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
            <input
              {...register('clinicName')}
              type="text"
              disabled={!isEditing}
              placeholder="Your clinic name"
              className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Phone</label>
            <input
              {...register('clinicPhone')}
              type="tel"
              disabled={!isEditing}
              placeholder="Clinic phone number"
              className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address</label>
            <textarea
              {...register('clinicAddress')}
              rows={3}
              disabled={!isEditing}
              placeholder="Complete clinic address"
              className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                isEditing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
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
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      )}
    </form>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">Medical License</p>
          <p className="text-sm text-gray-500 mb-4">Upload your medical license document</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Upload License
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">Degree Certificates</p>
          <p className="text-sm text-gray-500 mb-4">Upload your degree certificates</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Upload Certificates
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-900">Document Verification</h3>
            <p className="text-sm text-yellow-800">
              Upload all required documents for account verification. This process typically takes 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAvailabilityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Weekly Availability</h3>
      
      <div className="space-y-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="w-24">
              <span className="font-medium text-gray-900">{day}</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked={day !== 'Sunday'}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="time"
                defaultValue="09:00"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                defaultValue="17:00"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </div>

      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
        Save Availability
      </button>
    </div>
  );

  const renderVerificationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border-2 ${
          doctor?.isVerified ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            {doctor?.isVerified ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
            <h3 className={`font-semibold ${
              doctor?.isVerified ? 'text-green-900' : 'text-yellow-900'
            }`}>
              Account Verification
            </h3>
          </div>
          <p className={`text-sm ${
            doctor?.isVerified ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {doctor?.isVerified 
              ? 'Your account has been verified by our medical team.'
              : 'Your account is pending verification. Please ensure all documents are uploaded.'
            }
          </p>
        </div>

        <div className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Professional Rating</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              {doctor?.rating?.average?.toFixed(1) || '0.0'}
            </span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= (doctor?.rating?.average || 0) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({doctor?.rating?.count || 0} reviews)
            </span>
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
            {doctor?.isVerified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="text-gray-700">Medical license verification</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white p-4 rounded-full">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{doctor?.fullName}</h1>
                    <p className="text-gray-600">{doctor?.specialization}</p>
                    <p className="text-sm text-gray-500">License: {doctor?.licenseNumber}</p>
                  </div>
                </div>
                {activeTab === 'profile' && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isEditing
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'documents' && renderDocumentsTab()}
                {activeTab === 'availability' && renderAvailabilityTab()}
                {activeTab === 'verification' && renderVerificationTab()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorProfile;