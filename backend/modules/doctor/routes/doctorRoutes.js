import express from 'express';
import {
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  createPrescription,
  getDoctorPrescriptions,
  getDoctorEarnings,
  getDoctorStats,
  getAvailableDoctors
} from '../controllers/doctorController.js';
import { authenticate } from '../../../middlewares/authMiddleware.js';
import { 
  validateDoctorRegistration, 
  validateDoctorLogin,
  validatePrescription
} from '../../../middlewares/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateDoctorRegistration, registerDoctor);
router.post('/login', validateDoctorLogin, loginDoctor);
router.get('/available', getAvailableDoctors);

// Authentication routes
router.post('/logout', logoutDoctor);

// Protected routes (require authentication)
router.use(authenticate);

// Profile management
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);

// Appointments
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:appointmentId/status', updateAppointmentStatus);

// Prescriptions
router.get('/prescriptions', getDoctorPrescriptions);
router.post('/prescriptions', validatePrescription, createPrescription);

// Earnings
router.get('/earnings', getDoctorEarnings);
router.get('/stats', getDoctorStats);

export default router;