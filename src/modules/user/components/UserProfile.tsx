import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Phone, Calendar, MapPin, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { userAPI } from '../services/userAPI';
import toast from 'react-hot-toast';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';

const schema = yup.object({
  fullName: yup.string().min(2).max(50).required('Full name is required'),
  age: yup.number().min(1).max(120).required('Age is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
  street: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactPhone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Emergency contact phone is required'),
  emergencyContactRelationship: yup.string().required('Relationship is required'),
});

interface ProfileFormData {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

const UserProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || '',
      age: user?.age || 0,
      gender: user?.gender || 'male',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      emergencyContactName: user?.emergencyContact?.name || '',
      emergencyContactPhone: user?.emergencyContact?.phone || '',
      emergencyContactRelationship: user?.emergencyContact?.relationship || '',
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updateData = {
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: user?.address?.country || 'India'
        },
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship
        }
      };

      const response = await userAPI.updateProfile(updateData);
      updateUser(response.data.user);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      
      <div className="flex">
        <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 md:ml-64">
          <div className="p-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white p-4 rounded-full">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
                    <p className="text-gray-600">Patient ID: {user?._id?.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
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
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          {...register('age')}
                          type="number"
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                        {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          {...register('gender')}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          {...register('phone')}
                          type="tel"
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Address & Emergency Contact */}
                <div className="space-y-6">
                  {/* Address */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          {...register('street')}
                          type="text"
                          disabled={!isEditing}
                          placeholder="Enter street address"
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            {...register('city')}
                            type="text"
                            disabled={!isEditing}
                            placeholder="City"
                            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                              isEditing 
                                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            {...register('state')}
                            type="text"
                            disabled={!isEditing}
                            placeholder="State"
                            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                              isEditing 
                                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          {...register('zipCode')}
                          type="text"
                          disabled={!isEditing}
                          placeholder="ZIP Code"
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contact</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                        <input
                          {...register('emergencyContactName')}
                          type="text"
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                        {errors.emergencyContactName && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                        <input
                          {...register('emergencyContactPhone')}
                          type="tel"
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                        {errors.emergencyContactPhone && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                        <select
                          {...register('emergencyContactRelationship')}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <option value="spouse">Spouse</option>
                          <option value="parent">Parent</option>
                          <option value="child">Child</option>
                          <option value="sibling">Sibling</option>
                          <option value="friend">Friend</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.emergencyContactRelationship && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-4">
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

            {/* Account Information */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-sm text-gray-600">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Login</p>
                    <p className="text-sm text-gray-600">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;