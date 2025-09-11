import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, FlaskConical, Mail, Lock } from 'lucide-react';
import { labAPI } from '../services/labAPI';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface LoginFormData {
  email: string;
  password: string;
}

const LabLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await labAPI.login(data.email, data.password);
      const { lab, token } = response.data || {};
      
      if (lab && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('lab', JSON.stringify(lab));
        toast.success('Login successful!');
        navigate('/lab/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      // Mock authentication for development
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock lab authentication');
        const mockLab = {
          _id: 'mock-lab-id',
          name: 'Demo Diagnostic Lab',
          email: data.email,
          licenseNumber: 'LAB123456',
          registrationNumber: 'REG789012',
          accreditation: 'NABL',
          contactInfo: {
            phone: '+1234567890',
            website: 'www.demolab.com'
          },
          address: {
            street: '123 Lab Street',
            city: 'Demo City',
            state: 'Demo State',
            zipCode: '12345',
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
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const mockToken = 'mock-lab-jwt-token';
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('lab', JSON.stringify(mockLab));
        toast.success('Login successful! (Demo Mode)');
        navigate('/lab/dashboard');
        return;
      }
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lab Portal
          </h1>
          <p className="text-gray-600">
            Sign in to your laboratory account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Demo Credentials */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Demo Credentials</h4>
              <p className="text-sm text-purple-800">
                Email: lab@demolab.com<br />
                Password: lab123
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Lab Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter lab email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter lab password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Signing In...' : 'Access Lab Portal'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/lab/signup" className="text-purple-600 hover:text-purple-500 font-medium">
                Register Lab
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Role Selection */}
        <div className="mt-6 text-center">
          <Link
            to="/auth"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Back to role selection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LabLogin;