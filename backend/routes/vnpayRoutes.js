import express from "express";
import { 
 vnpayPaymentItems, vnpayPaymentCheck
} from "../controllers/vnpayController.js";
// import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/vnpay').get(vnpayPaymentItems)
router.route('/vnpay_check').get(vnpayPaymentCheck)


export default router