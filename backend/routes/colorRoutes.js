import express from 'express';
const router = express.Router();
import {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
} from '../controllers/colorController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getColors).post(protect, admin, createColor);
router
  .route('/:id')
  .get(checkObjectId, getColorById)
  .put(protect, admin, checkObjectId, updateColor)
  .delete(protect, admin, checkObjectId, deleteColor);

export default router;
