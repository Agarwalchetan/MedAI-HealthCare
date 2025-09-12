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
import Appointments from './modules/user/pages/Appointments';
import HealthVault from './modules/user/pages/HealthVault';

// Doctor Module
import DoctorLogin from './modules/doctor/pages/DoctorLogin';
import DoctorSignup from './modules/doctor/pages/DoctorSignup';
import DoctorDashboard from './modules/doctor/pages/DoctorDashboard';
import DoctorPatients from './modules/doctor/pages/DoctorPatients';
import DoctorAppointments from './modules/doctor/pages/DoctorAppointments';
import DoctorAIDiagnosis from './modules/doctor/pages/DoctorAIDiagnosis';
import DoctorPrescriptions from './modules/doctor/pages/DoctorPrescriptions';
import DoctorEarnings from './modules/doctor/pages/DoctorEarnings';
import DoctorProfile from './modules/doctor/pages/DoctorProfile';

// Coming Soon Components
import DoctorComingSoon from './modules/doctor/components/ComingSoon';
import LabComingSoon from './modules/lab/components/ComingSoon';
import InsuranceComingSoon from './modules/insurance/components/ComingSoon';
import ManagerComingSoon from './modules/manager/components/ComingSoon';

// Lab Module
import LabLogin from './modules/lab/pages/LabLogin';
import LabSignup from './modules/lab/pages/LabSignup';
import LabDashboard from './modules/lab/pages/LabDashboard';
import LabUploadReport from './modules/lab/pages/LabUploadReport';
import ManageLabs from './modules/admin/pages/ManageLabs';

// Admin Module
import AdminLogin from './modules/admin/pages/AdminLogin';
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import ManageUsers from './modules/admin/pages/ManageUsers';
import ManageDoctors from './modules/admin/pages/ManageDoctors';
import ManageMedicines from './modules/admin/pages/ManageMedicines';
import AdminAppointments from './modules/admin/pages/AdminAppointments';
import AdminAnalytics from './modules/admin/pages/AdminAnalytics';
import AdminNotifications from './modules/admin/pages/AdminNotifications';
import AdminSettings from './modules/admin/pages/AdminSettings';
import AdminComingSoon from './modules/admin/components/ComingSoon';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, doctor, lab, loading } = useAuth();

  console.log('ProtectedRoute - user:', user, 'doctor:', doctor, 'lab:', lab, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user, doctor, or lab is authenticated
  const isAuthenticated = !!(user || doctor || lab);
  
  if (!isAuthenticated) {
    console.log('No authentication found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('Authentication found, rendering protected content');
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
            
            {/* Doctor Authentication Routes */}
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/signup" element={<DoctorSignup />} />

            {/* Lab Authentication Routes */}
            <Route path="/lab/login" element={<LabLogin />} />
            <Route path="/lab/signup" element={<LabSignup />} />

            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

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
            <Route path="/user/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/user/health-vault" element={
              <ProtectedRoute>
                <HealthVault />
              </ProtectedRoute>
            } />

            {/* Protected Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/ai-diagnosis" element={<DoctorAIDiagnosis />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
            <Route path="/doctor/earnings" element={<DoctorEarnings />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />

            {/* Protected Lab Routes */}
            <Route path="/lab/dashboard" element={<LabDashboard />} />
            <Route path="/lab/dashboard" element={
              <ProtectedRoute>
                <LabDashboard />
              </ProtectedRoute>
            } />
            <Route path="/lab/upload-report" element={
              <ProtectedRoute>
                <LabUploadReport />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-doctors" element={<ManageDoctors />} />
            <Route path="/admin/manage-medicines" element={<ManageMedicines />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/manage-labs" element={<ManageLabs />} />
            <Route path="/admin/manage-insurance" element={<AdminComingSoon />} />

            {/* Coming Soon Routes */}
            <Route path="/lab/*" element={<LabComingSoon />} />
            <Route path="/insurance/*" element={<InsuranceComingSoon />} />
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