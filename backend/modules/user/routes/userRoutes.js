import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getMedicalHistory,
  addMedicalHistory,
  getPrescriptions,
  addPrescription,
  getLabReports,
  addLabReport,
  getInsuranceDetails,
  updateInsurance,
  verifyUserEmail,
  resendCode,
  getScannedDocuments,
  addScannedDocument,
  deleteScannedDocument,
  getActiveMedicine,
  updateActiveMedicine
} from '../controllers/userController.js';
import upload from '../../../middlewares/multer.middleware.js';
import { authenticate } from '../../../middlewares/authMiddleware.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate
} from '../../../middlewares/validation.js';

const router = express.Router();

// Authentication routes
router.post('/register', validateUserRegistration, upload.single("aadhar"), registerUser);
router.post('/login', validateUserLogin, loginUser);

router.post('/logout', logoutUser);
router.post('/verifyEmail', verifyUserEmail);
router.post('/resendCode', resendCode);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

// Profile management
router.get('/profile', getUserProfile);
router.put('/profile', validateProfileUpdate, updateUserProfile);


// Medical history
router.get('/medical-history', getMedicalHistory);
router.post('/medical-history', addMedicalHistory);


// Prescriptions
router.get('/prescriptions', getPrescriptions);
router.post('/prescriptions', addPrescription);

// Lab reports
router.get('/lab-reports', getLabReports);
router.post('/lab-reports', addLabReport);

// Insurance
router.get('/insurance', getInsuranceDetails);
router.put('/insurance', updateInsurance);

// Scanned Documents
router.get('/scanned-documents', getScannedDocuments);
router.post('/scanned-documents', addScannedDocument);
router.delete('/scanned-documents/:documentId', deleteScannedDocument);

// Active Medicines
router.get('/active-medicine', authenticate, getActiveMedicine);
router.put('/active-medicine', authenticate, updateActiveMedicine);

export default router;