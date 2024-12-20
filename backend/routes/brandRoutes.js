import express from 'express';
const router = express.Router();
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getBrands).post(protect, admin, createBrand);
router
  .route('/:id')
  .get(checkObjectId, getBrandById)
  .put(protect, admin, checkObjectId, updateBrand)
  .delete(protect, admin, checkObjectId, deleteBrand);

export default router;

