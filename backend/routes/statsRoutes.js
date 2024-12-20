import express from 'express';
import {
  getStats,
  getBestSellingProduct,
  getRevenueByCategory,
  getGrowthData,
  getTotalOrders,
  getTotalOrdersCumulative,
  calculateTotalRevenue,
  getTotalRevenueByTimeRange,
  TotalOrdersCumulativePaid,
  TotalRevenuePaid,
} from '../controllers/statsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Định nghĩa route cho thống kê, bảo vệ bằng middleware xác thực và chỉ cho phép admin truy cập
router.route('/').get(protect, admin, getStats);

router
  .route('/revenue-by-time-range')
  .get(protect, admin, getTotalRevenueByTimeRange);

// Định nghĩa route mới cho tổng số đơn hàng tích lũy từ thời điểm ban đầu
router
  .route('/total-orders-cumulative')
  .get(protect, admin, getTotalOrdersCumulative);

router.route('/total-revenue').get(protect, admin, calculateTotalRevenue);

router.route('/total-orders').get(protect, admin, getTotalOrders);


router.route('/total-revenue-paid').get(protect, admin, TotalRevenuePaid);

router.route('/total-orders-paid').get(protect, admin, TotalOrdersCumulativePaid);

// sản phẩm bán chạy nhất
router.route('/best-selling').get(protect, admin, getBestSellingProduct);

// lấy thông tin doanh thu theo danh mục sản phẩm
router.route('/revenue-by-category').get(protect, admin, getRevenueByCategory);

// biểu đồ tăng trưởng
router.route('/growth').get(protect, admin, getGrowthData);

export default router;
