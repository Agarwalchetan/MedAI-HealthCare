import React, { useState, useEffect } from 'react';
import { Shield, Edit3, Save, X, CreditCard, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { Insurance } from '../../../shared/types';
import toast from 'react-hot-toast';

const schema = yup.object({
  provider: yup.string().required('Insurance provider is required'),
  policyNumber: yup.string().required('Policy number is required'),
  groupNumber: yup.string(),
  validUntil: yup.date().required('Valid until date is required'),
  coverageAmount: yup.number().min(0).required('Coverage amount is required'),
  deductible: yup.number().min(0).required('Deductible amount is required'),
});

interface InsuranceFormData {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validUntil: Date;
  coverageAmount: number;
  deductible: number;
}

const InsurancePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insurance, setInsurance] = useState<Insurance | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InsuranceFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    try {
      const response = await userAPI.getInsurance();
      const insuranceData = response.data?.insurance;
      if (insuranceData && insuranceData.provider) {
        setInsurance(insuranceData);
        reset({
          provider: insuranceData.provider,
          policyNumber: insuranceData.policyNumber,
          groupNumber: insuranceData.groupNumber,
          validUntil: new Date(insuranceData.validUntil),
          coverageAmount: insuranceData.coverageAmount,
          deductible: insuranceData.deductible,
        });
      }
    } catch (error) {
      console.error('Error fetching insurance:', error);
    }
  };

  const onSubmit = async (data: InsuranceFormData) => {
    setIsLoading(true);
    try {
      const insuranceData = {
        ...data,
        isActive: true
      };

      const response = await userAPI.updateInsurance(insuranceData);
      setInsurance(response.data?.insurance || null);
      toast.success('Insurance details updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update insurance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const isInsuranceActive = insurance?.isActive && insurance?.validUntil && new Date(insurance.validUntil) > new Date();

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
                <h1 className="text-3xl font-bold text-gray-900">Insurance Details</h1>
                <p className="text-gray-600 mt-1">Manage your health insurance information</p>
              </div>
              {insurance && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isEditing
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  <span>{isEditing ? 'Cancel' : 'Edit Details'}</span>
                </button>
              )}
            </div>

            {/* Insurance Status Card */}
            {insurance && (
              <div className={`rounded-xl shadow-sm p-6 mb-6 ${
                isInsuranceActive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${
                    isInsuranceActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isInsuranceActive ? 'text-green-900' : 'text-red-900'
                    }`}>
                      Insurance Status: {isInsuranceActive ? 'Active' : 'Inactive/Expired'}
                    </h3>
                    <p className={`text-sm ${
                      isInsuranceActive ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isInsuranceActive 
                        ? `Your insurance is active and valid until ${new Date(insurance.validUntil).toLocaleDateString()}`
                        : 'Please update your insurance information or contact your provider'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Insurance Form/Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {!insurance && !isEditing ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Insurance Information</h3>
                  <p className="text-gray-500 mb-6">Add your insurance details to manage your coverage and claims.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Add Insurance Details</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {isEditing ? 'Edit Insurance Details' : 'Insurance Information'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                      <input
                        {...register('provider')}
                        type="text"
                        disabled={!isEditing}
                        placeholder="e.g., Blue Cross Blue Shield"
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                      {errors.provider && <p className="mt-1 text-sm text-red-600">{errors.provider.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
                      <input
                        {...register('policyNumber')}
                        type="text"
                        disabled={!isEditing}
                        placeholder="Policy number"
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                      {errors.policyNumber && <p className="mt-1 text-sm text-red-600">{errors.policyNumber.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Group Number</label>
                      <input
                        {...register('groupNumber')}
                        type="text"
                        disabled={!isEditing}
                        placeholder="Group number (if applicable)"
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                      <input
                        {...register('validUntil')}
                        type="date"
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                      {errors.validUntil && <p className="mt-1 text-sm text-red-600">{errors.validUntil.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Amount (₹)</label>
                      <input
                        {...register('coverageAmount')}
                        type="number"
                        disabled={!isEditing}
                        placeholder="Total coverage amount"
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                      {errors.coverageAmount && <p className="mt-1 text-sm text-red-600">{errors.coverageAmount.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deductible (₹)</label>
                      <input
                        {...register('deductible')}
                        type="number"
                        disabled={!isEditing}
                        placeholder="Annual deductible"
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                      {errors.deductible && <p className="mt-1 text-sm text-red-600">{errors.deductible.message}</p>}
                    </div>
                  </div>

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
              )}
            </div>

            {/* Insurance Benefits */}
            {insurance && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Coverage Amount</h3>
                  <p className="text-2xl font-bold text-green-600">₹{insurance.coverageAmount?.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Annual Deductible</h3>
                  <p className="text-2xl font-bold text-blue-600">₹{insurance.deductible?.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Days Remaining</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {insurance.validUntil 
                      ? Math.max(0, Math.ceil((new Date(insurance.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                      : 0
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Claims History Placeholder */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Claims</h2>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No Claims Found</h3>
                <p className="text-gray-500 text-sm">Your insurance claims will appear here once you submit them.</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Submit Claim</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Check Coverage</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Renewal</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-900">Policy Details</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InsurancePage;