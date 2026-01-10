import { asyncHandler } from '../../../middlewares/errorHandler.js';
import { UserService } from '../services/userService.js';



export const getUserDocumentCounts = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  // Count scannedDocuments by category only
  const scannedDocuments = Array.isArray(user.scannedDocuments) ? user.scannedDocuments : [];
  const scannedCounts = {
    'medical-history': 0,
    'prescription': 0,
    'lab-report': 0,
    'other': 0
  };
  scannedDocuments.forEach(doc => {
    if (doc.category && scannedCounts.hasOwnProperty(doc.category)) {
      scannedCounts[doc.category]++;
    } else {
      scannedCounts['other']++;
    }
  });

  res.status(200).json({
    success: true,
    data: scannedCounts
  });
});

export default { getUserDocumentCounts };
