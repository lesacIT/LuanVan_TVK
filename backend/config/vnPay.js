import { config } from 'dotenv';
import vnpay from 'vn-payments';

config();

const vnpConfig = {
  vnp_TmnCode: process.env.VNPAY_TMNCODE,
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  vnp_ReturnUrl: 'http://localhost:3000/api/vnpay-return',
};

export default vnpConfig;
