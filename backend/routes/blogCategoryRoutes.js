import express from 'express';
const router = express.Router();
import {
  getBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from '../controllers/blogCategoryController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getBlogCategories).post(protect, admin, createBlogCategory);
router
  .route('/:id')
  .get(checkObjectId, getBlogCategoryById)
  .put(protect, admin, checkObjectId, updateBlogCategory)
  .delete(protect, admin, checkObjectId, deleteBlogCategory);

export default router;