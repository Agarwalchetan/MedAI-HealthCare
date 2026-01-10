import { UserService } from '../services/userService.js';
import { asyncHandler } from '../../../middlewares/errorHandler.js';
import cloudinary from "cloudinary" 
import User from '../models/User.js';


export const registerUser = asyncHandler(async (req, res) => {
  const user = await UserService.createUser(req.body);
  const token = UserService.generateToken(user._id);
  await UserService.sendVerificationEmail(user.email,user.emailVerificationCode)
try{if(req.file){
  const aadharPhoto=await cloudinary.v2.uploader.upload(req.file.path,{
    folder:"user aadhar",
    widdth:250,
    height:250,
  
    crop:"fill"
})
if(aadharPhoto){
    user.aadhar.public_id=aadharPhoto.public_id;
    user.aadhar.secure_url=aadharPhoto.secure_url 
    // remove from local server
    fs.rm(`uploads/${req.file.filename}`)
}
}


}catch(e){
  res.status(400).json({
    success: false,
    message: 'failed to upload aadhar photo ',

  });
}
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token }
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await UserService.authenticateUser(email, password);
  const token = UserService.generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, token }
  });
});






export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

export const verifyUserEmail=asyncHandler(async(req,res)=>{
  try {
    const { userId, code } = req.body;

    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    // 2. Check if the code is correct and not expired
    if (user.emailVerificationCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    if (new Date() > user.emailVerificationExpires) {
      return res.status(400).json({ success: false, message: 'Verification code has expired.' });
    }

    // 3. Update the user's status
    user.isEmailVerified = true;
    user.emailVerificationCode = null; // Clear the code
    user.emailVerificationExpires = null; // Clear the expiration
    await user.save();
    
    // 4. Respond with success
    // You can also generate and send a JWT token here for automatic login
    res.status(200).json({ success: true, message: 'Email verified successfully!' });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
})

export const resendCode=asyncHandler(async(req,res)=>{
try {
  const {userId}=req.body
     const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ success: false, message: 'This email is already verified.' });
        }

        // 1. Generate a new code and expiration
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 2. Update user document
        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = verificationExpires;
        await user.save();
try{ await UserService.sendVerificationEmail(user.email,verificationCode)
    res.status(200).json({ success: true, message: 'A new verification code has been sent.' });

}
catch(e){
   console.error('Resend Code Error:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });

}
} catch (error) {
  throw error 
}
})

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { user }
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const updatedUser = await UserService.updateUser(req.user._id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser }
  });
});

export const getMedicalHistory = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { medicalHistory: user.medicalHistory }
  });
});

export const addMedicalHistory = asyncHandler(async (req, res) => {
  const medicalRecord = await UserService.addMedicalHistory(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Medical history added successfully',
    data: { medicalRecord }
  });
});

export const getPrescriptions = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { prescriptions: user.prescriptions }
  });
});

export const addPrescription = asyncHandler(async (req, res) => {
  const prescription = await UserService.addPrescription(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Prescription added successfully',
    data: { prescription }
  });
});

export const getLabReports = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { labReports: user.labReports }
  });
});

export const addLabReport = asyncHandler(async (req, res) => {
  const labReport = await UserService.addLabReport(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Lab report added successfully',
    data: { labReport }
  });
});

export const getInsuranceDetails = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { insurance: user.insurance }
  });
});

export const updateInsurance = asyncHandler(async (req, res) => {
  const insurance = await UserService.updateInsurance(req.user._id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Insurance details updated successfully',
    data: { insurance }
  });
});

// Scanned Documents endpoints
export const getScannedDocuments = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { scannedDocuments: user.scannedDocuments }
  });
});

export const addScannedDocument = asyncHandler(async (req, res) => {
  const scannedDocument = await UserService.addScannedDocument(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Scanned document saved successfully',
    data: { scannedDocument }
  });
});

export const deleteScannedDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  await UserService.deleteScannedDocument(req.user._id, documentId);
  
  res.status(200).json({
    success: true,
    message: 'Scanned document deleted successfully'
  });
});

export const getActiveMedicine = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  res.status(200).json({
    success: true,
    data: { active_medicine: user.active_medicine || [] }
  });
});

export const updateActiveMedicine = asyncHandler(async (req, res) => {
  // req.body should be an array of active medicine objects
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ success: false, message: 'Body must be an array.' });
  }
  // Optionally add field validation here.
  const updatedUser = await UserService.updateUser(req.user._id, { active_medicine: req.body });
  res.status(200).json({
    success: true,
    message: 'Active medicines updated successfully',
    data: { active_medicine: updatedUser.active_medicine }
  });
});