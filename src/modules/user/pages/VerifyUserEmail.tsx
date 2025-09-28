import React, { useState, useEffect } from 'react';
import { MemoryRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import axios from 'axios';
  const { user } = useAuth();


const schema = yup.object({
  code: yup.string()
    .required('Verification code is required')
    .matches(/^[0-9]{6}$/, 'Code must be exactly 6 digits'),
});

interface VerifyEmailFormData {
  code: string;
}

const VerifyUserEmail: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve email and _id from the navigation state
  const { email, _id } = user || { email: 'your-email@example.com', _id: 'usr_12345_mock' };

  useEffect(() => {
    if (!_id) {
      toast.error("No user specified. Redirecting to signup.");
      navigate('/signup');
    }
  }, [_id, navigate]);


  const { register, handleSubmit, formState: { errors } } = useForm<VerifyEmailFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users/verifyEmail",{userId:_id , code:data.code});
      if (response.data.success) {
        toast.success(response.data.message);
        // On success, navigate to the dashboard
        navigate('/user/dashboard');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
        const response =  await axios.post("http://localhost:5000/api/users/resendCode",{userId:_id });
        if (response.data.success) {
            toast.success(response.data.message);
        } else {
            throw new Error(response.data.message);
        }
    } catch (error: any) {
        toast.error(error.message || "Failed to resend code.");
    } finally {
        setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl">
                    <MailCheck className="h-8 w-8 text-white" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Verify Your Email
            </h1>
            <p className="text-gray-600">
                We've sent a 6-digit verification code to <br/>
                <strong className="text-gray-800">{email}</strong>
            </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                {...register('code')}
                type="text"
                id="code"
                maxLength={6}
                className={`block w-full text-center text-2xl tracking-[.5em] font-mono px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="_ _ _ _ _ _"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Didn't receive the code?{' '}
                    <button 
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? 'Sending...' : 'Resend Code'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyUserEmail
