import express from 'express';
const router = express.Router();
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  createBlogReview,
  getTopBlogs,
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getBlogs).post(protect, admin, createBlog);
router.route('/:id/reviews').post(protect, checkObjectId, createBlogReview);
router.get('/top', getTopBlogs);
router
  .route('/:id')
  .get(checkObjectId, getBlogById)
  .put(protect, admin, checkObjectId, updateBlog)
  .delete(protect, admin, checkObjectId, deleteBlog);

export default router;
