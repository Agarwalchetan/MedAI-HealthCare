import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Heart, User, Mail, Lock, Phone, Calendar } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const schema = yup.object({
  fullName: yup.string().min(2).max(50).required('Full name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  age: yup.number().min(1).max(120).required('Age is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactPhone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Emergency contact phone is required'),
  emergencyContactRelationship: yup.string().required('Relationship is required'),
});

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  healthId?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

const UserSignup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const userData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        healthId: data.healthId || '',
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship,
        },
      };

      await registerUser(userData);
      toast.success('Account created successfully!');
      navigate('/user/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join MedAI to access your personalized healthcare dashboard
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('fullName')}
                    type="text"
                    id="fullName"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
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

              {/* Password */}
              <div className="mb-4">
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
                    placeholder="Create a strong password"
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

              {/* Confirm Password */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Basic Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('age')}
                      type="number"
                      id="age"
                      min="1"
                      max="120"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.age ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Age"
                    />
                  </div>
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    id="gender"
                    className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.gender ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="10-digit phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Health ID (Optional) */}
              <div className="mb-4">
                <label htmlFor="healthId" className="block text-sm font-medium text-gray-700 mb-2">
                  Health ID <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  {...register('healthId')}
                  type="text"
                  id="healthId"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your health ID if available"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Emergency Contact Name */}
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    {...register('emergencyContactName')}
                    type="text"
                    id="emergencyContactName"
                    className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContactName && (
                    <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>
                  )}
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    {...register('emergencyContactPhone')}
                    type="tel"
                    id="emergencyContactPhone"
                    className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyContactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
                  )}
                </div>
              </div>

              {/* Relationship */}
              <div className="mb-4">
                <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  {...register('emergencyContactRelationship')}
                  id="emergencyContactRelationship"
                  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.emergencyContactRelationship ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
                {errors.emergencyContactRelationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/user/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in here
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

export default UserSignup;