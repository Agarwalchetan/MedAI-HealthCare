import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Stethoscope, Mail, Lock } from 'lucide-react';
import { doctorAPI } from '../services/doctorAPI';
import { useAuth } from '../../../shared/hooks/useAuth';
import { Doctor } from '../../../shared/types';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface LoginFormData {
  email: string;
  password: string;
}

const DoctorLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setDoctorAuth } = useAuth();

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
      const response = await doctorAPI.login(data.email, data.password);
      const { doctor, token } = response.data || {};
      
      if (doctor && token) {
        console.log('Doctor login successful, setting auth:', doctor);
        // Use the auth context to set doctor authentication
        setDoctorAuth(doctor, token);
        toast.success('Login successful!');
        console.log('Navigating to doctor dashboard...');
        // Use setTimeout to ensure state update completes before navigation
        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 100);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      // If backend is not available, create a mock doctor for development
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock doctor authentication');
        const mockDoctor: Doctor = {
          _id: 'mock-doctor-id',
          fullName: 'Dr. Demo Doctor',
          email: data.email,
          specialization: 'General Medicine',
          licenseNumber: 'MD123456',
          experience: 10,
          qualifications: [
            { degree: 'MBBS', institution: 'Demo Medical College', year: 2010 },
            { degree: 'MD', institution: 'Demo University', year: 2014 }
          ],
          phone: '+1234567890',
          address: {
            street: '123 Medical St',
            city: 'Demo City',
            state: 'Demo State',
            zipCode: '12345',
            country: 'Demo Country'
          },
          clinicDetails: {
            name: 'Demo Clinic',
            address: '123 Clinic St, Demo City',
            phone: '+1234567890',
            timings: {
              start: '09:00',
              end: '17:00',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
          },
          consultationFee: 500,
          isVerified: true,
          isActive: true,
          rating: { average: 4.8, count: 150 },
          totalPatients: 500,
          totalEarnings: 250000,
          subscriptionPlan: 'pro',
          subscriptionExpiry: new Date('2025-12-31'),
          profilePicture: '',
          availability: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '09:00', end: '13:00', available: true },
            sunday: { start: '00:00', end: '00:00', available: false }
          },
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const mockToken = 'mock-doctor-jwt-token';
        
        console.log('Mock doctor login, setting auth:', mockDoctor);
        // Use the auth context to set doctor authentication
        setDoctorAuth(mockDoctor, mockToken);
        toast.success('Login successful! (Demo Mode)');
        console.log('Navigating to doctor dashboard...');
        // Use setTimeout to ensure state update completes before navigation
        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 100);
        return;
      }
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doctor Portal
          </h1>
          <p className="text-gray-600">
            Sign in to your doctor account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
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
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/doctor/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                Register as Doctor
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

export default DoctorLogin;