import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Earnings from '../models/Earnings.js';

export class DoctorService {
  static generateToken(doctorId) {
    return jwt.sign({ id: doctorId, role: 'doctor' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  static async createDoctor(doctorData) {
    try {
      const existingDoctor = await Doctor.findOne({ email: doctorData.email });
      if (existingDoctor) {
        throw new Error('Doctor already exists with this email');
      }

      const existingLicense = await Doctor.findOne({ licenseNumber: doctorData.licenseNumber });
      if (existingLicense) {
        throw new Error('Doctor already exists with this license number');
      }

      const doctor = new Doctor(doctorData);
      await doctor.save();
      
      return doctor;
    } catch (error) {
      throw error;
    }
  }

  static async authenticateDoctor(email, password) {
    try {
      const doctor = await Doctor.findOne({ email }).select('+password');
      if (!doctor) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await doctor.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      doctor.lastLogin = new Date();
      await doctor.save();

      return doctor;
    } catch (error) {
      throw error;
    }
  }

  static async getDoctorById(doctorId) {
    try {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      return doctor;
    } catch (error) {
      throw error;
    }
  }

  static async updateDoctor(doctorId, updateData) {
    try {
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId, 
        updateData, 
        { new: true, runValidators: true }
      );
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      return doctor;
    } catch (error) {
      throw error;
    }
  }

  static async getDoctorAppointments(doctorId, status = null) {
    try {
      const query = { doctor: doctorId };
      if (status) query.status = status;

      const appointments = await Appointment.find(query)
        .populate('patient', 'fullName email phone age gender')
        .sort({ appointmentDate: 1 });
      
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  static async updateAppointmentStatus(appointmentId, status, notes = '') {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status, notes },
        { new: true }
      ).populate('patient', 'fullName email phone');
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      return appointment;
    } catch (error) {
      throw error;
    }
  }

  static async createPrescription(prescriptionData) {
    try {
      const prescription = new Prescription(prescriptionData);
      await prescription.save();
      
      // Update appointment with prescription reference
      if (prescriptionData.appointment) {
        await Appointment.findByIdAndUpdate(
          prescriptionData.appointment,
          { prescription: prescription._id }
        );
      }
      
      return prescription;
    } catch (error) {
      throw error;
    }
  }

  static async getDoctorPrescriptions(doctorId) {
    try {
      const prescriptions = await Prescription.find({ doctor: doctorId })
        .populate('patient', 'fullName email phone')
        .populate('appointment', 'appointmentDate')
        .sort({ createdAt: -1 });
      
      return prescriptions;
    } catch (error) {
      throw error;
    }
  }

  static async getDoctorEarnings(doctorId, month = null, year = null) {
    try {
      const query = { doctor: doctorId };
      if (month) query.month = month;
      if (year) query.year = year;

      const earnings = await Earnings.find(query)
        .populate('appointment', 'appointmentDate')
        .populate('patient', 'fullName')
        .sort({ createdAt: -1 });
      
      return earnings;
    } catch (error) {
      throw error;
    }
  }

  static async getDoctorStats(doctorId) {
    try {
      const doctor = await Doctor.findById(doctorId);
      const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });
      const completedAppointments = await Appointment.countDocuments({ 
        doctor: doctorId, 
        status: 'completed' 
      });
      const todayAppointments = await Appointment.countDocuments({
        doctor: doctorId,
        appointmentDate: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      });
      const totalPrescriptions = await Prescription.countDocuments({ doctor: doctorId });

      return {
        totalPatients: doctor.totalPatients,
        totalAppointments,
        completedAppointments,
        todayAppointments,
        totalPrescriptions,
        totalEarnings: doctor.totalEarnings,
        rating: doctor.rating
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAvailableDoctors(specialization = null) {
    try {
      const query = { isVerified: true, isActive: true };
      if (specialization) query.specialization = specialization;

      const doctors = await Doctor.find(query)
        .select('fullName specialization consultationFee rating experience clinicDetails')
        .sort({ 'rating.average': -1 });
      
      return doctors;
    } catch (error) {
      throw error;
    }
  }
}