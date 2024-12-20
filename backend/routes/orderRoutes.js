import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  confirmOrder,
  completeOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
// Route mới để xác nhận đơn hàng
router.route('/:id/confirm').put(protect, admin, confirmOrder);

// Người dùng đánh dấu đã nhận được hàng.
router.route('/:id/complete').put(protect, completeOrder);
export default router;
