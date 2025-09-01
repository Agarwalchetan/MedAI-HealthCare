import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './shared/hooks/useAuth';
import Navbar from './shared/components/Navbar';
import Footer from './shared/components/Footer';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';

// User Module
import UserLogin from './modules/user/pages/UserLogin';
import UserSignup from './modules/user/pages/UserSignup';
import UserDashboard from './modules/user/pages/UserDashboard';
import UserProfile from './modules/user/components/UserProfile';
import MedicalHistory from './modules/user/pages/MedicalHistory';
import AIChatbot from './modules/user/pages/AIChatbot';
import Prescriptions from './modules/user/pages/Prescriptions';
import LabReports from './modules/user/pages/LabReports';
import Insurance from './modules/user/pages/Insurance';
import Paramedics from './modules/user/pages/Paramedics';
import Medicines from './modules/user/pages/Medicines';

// Coming Soon Components
import DoctorComingSoon from './modules/doctor/components/ComingSoon';
import LabComingSoon from './modules/lab/components/ComingSoon';
import InsuranceComingSoon from './modules/insurance/components/ComingSoon';
import AdminComingSoon from './modules/admin/components/ComingSoon';
import ManagerComingSoon from './modules/manager/components/ComingSoon';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Layout Component for public pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            } />
            <Route path="/features" element={
              <PublicLayout>
                <FeaturesPage />
              </PublicLayout>
            } />
            <Route path="/about" element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            } />
            <Route path="/auth" element={
              <PublicLayout>
                <AuthPage />
              </PublicLayout>
            } />

            {/* User Authentication Routes */}
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/signup" element={<UserSignup />} />

            {/* Protected User Routes */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/user/medical-history" element={
              <ProtectedRoute>
                <MedicalHistory />
              </ProtectedRoute>
            } />
            <Route path="/user/ai-chatbot" element={
              <ProtectedRoute>
                <AIChatbot />
              </ProtectedRoute>
            } />
            <Route path="/user/prescriptions" element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            } />
            <Route path="/user/lab-reports" element={
              <ProtectedRoute>
                <LabReports />
              </ProtectedRoute>
            } />
            <Route path="/user/insurance" element={
              <ProtectedRoute>
                <Insurance />
              </ProtectedRoute>
            } />
            <Route path="/user/paramedics" element={
              <ProtectedRoute>
                <Paramedics />
              </ProtectedRoute>
            } />
            <Route path="/user/medicines" element={
              <ProtectedRoute>
                <Medicines />
              </ProtectedRoute>
            } />

            {/* Coming Soon Routes */}
            <Route path="/doctor/*" element={<DoctorComingSoon />} />
            <Route path="/lab/*" element={<LabComingSoon />} />
            <Route path="/insurance/*" element={<InsuranceComingSoon />} />
            <Route path="/admin/*" element={<AdminComingSoon />} />
            <Route path="/manager/*" element={<ManagerComingSoon />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;