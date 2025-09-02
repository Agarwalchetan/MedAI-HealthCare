import { DoctorService } from '../services/doctorService.js';
import { asyncHandler } from '../../../middlewares/errorHandler.js';

export const registerDoctor = asyncHandler(async (req, res) => {
  const doctor = await DoctorService.createDoctor(req.body);
  const token = DoctorService.generateToken(doctor._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'Doctor registered successfully. Verification pending.',
    data: { doctor, token }
  });
});

export const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const doctor = await DoctorService.authenticateDoctor(email, password);
  const token = DoctorService.generateToken(doctor._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { doctor, token }
  });
});

export const logoutDoctor = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

export const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await DoctorService.getDoctorById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { doctor }
  });
});

export const updateDoctorProfile = asyncHandler(async (req, res) => {
  const updatedDoctor = await DoctorService.updateDoctor(req.user._id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { doctor: updatedDoctor }
  });
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const appointments = await DoctorService.getDoctorAppointments(req.user._id, status);
  
  res.status(200).json({
    success: true,
    data: { appointments }
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status, notes } = req.body;
  
  const appointment = await DoctorService.updateAppointmentStatus(appointmentId, status, notes);
  
  res.status(200).json({
    success: true,
    message: 'Appointment status updated successfully',
    data: { appointment }
  });
});

export const createPrescription = asyncHandler(async (req, res) => {
  const prescriptionData = {
    ...req.body,
    doctor: req.user._id
  };
  
  const prescription = await DoctorService.createPrescription(prescriptionData);
  
  res.status(201).json({
    success: true,
    message: 'Prescription created successfully',
    data: { prescription }
  });
});

export const getDoctorPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await DoctorService.getDoctorPrescriptions(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { prescriptions }
  });
});

export const getDoctorEarnings = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const earnings = await DoctorService.getDoctorEarnings(req.user._id, month, year);
  
  res.status(200).json({
    success: true,
    data: { earnings }
  });
});

export const getDoctorStats = asyncHandler(async (req, res) => {
  const stats = await DoctorService.getDoctorStats(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { stats }
  });
});

export const getAvailableDoctors = asyncHandler(async (req, res) => {
  const { specialization } = req.query;
  const doctors = await DoctorService.getAvailableDoctors(specialization);
  
  res.status(200).json({
    success: true,
    data: { doctors }
  });
});