import express from 'express';
const router = express.Router();
import {
  getProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from '../controllers/productCategoryController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getProductCategories).post(protect, admin, createProductCategory);
router
  .route('/:id')
  .get(checkObjectId, getProductCategoryById)
  .put(protect, admin, checkObjectId, updateProductCategory)
  .delete(protect, admin, checkObjectId, deleteProductCategory);

export default router;
