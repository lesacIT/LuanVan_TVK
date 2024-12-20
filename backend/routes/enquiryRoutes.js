import express from 'express';
const router = express.Router();
import {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getMyEnquiries,
} from '../controllers/enquiryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getEnquiries).post(protect, createEnquiry);
router.route('/mine').get(protect, getMyEnquiries);
router
  .route('/:id')
  .get(checkObjectId, getEnquiryById)
  .put(protect, admin, checkObjectId, updateEnquiry)
  .delete(protect, admin, checkObjectId, deleteEnquiry);

export default router;
