import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
// import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }

  // Lấy thông tin sản phẩm từ cơ sở dữ liệu
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  console.log('Trước:', orderItems);
  const updates = itemsFromDB.map(async (dbItem) => {
    const orderItem = orderItems.filter(
      (item) => item._id === dbItem._id.toString()
    );

    console.log('Sau:', orderItem);
    if (!orderItem) {
      // Nếu không tìm thấy mặt hàng trong orderItem, bỏ qua cập nhật
      return;
    }
    for (const item of orderItem) {
      for (const color of item.colors) {
        if (typeof color.quantity === 'number' && !isNaN(color.quantity)) {
          const productColor = dbItem.colors.find(
            (productColor) => productColor.title === color.title
          );
          if (productColor) {
            if (productColor.colorCode === item.color.colorCode) {
              // Trừ số lượng từ kho hàng chỉ cho màu cụ thể trong đơn hàng
              productColor.quantity -= item.qty;
            }
          }
        }
      }
    }

    // Cập nhật countInStock
    let totalStock = 0;
    for (const color of dbItem.colors) {
      if (typeof color.quantity === 'number' && !isNaN(color.quantity)) {
        totalStock += color.quantity;
      }
    }
    dbItem.countInStock = totalStock;
    // Lưu cập nhật vào cơ sở dữ liệu
    await dbItem.save();
  });

  // Đảm bảo tất cả cập nhật được hoàn tất trước khi tạo đơn hàng
  await Promise.all(updates);

  // Tiếp tục tạo đơn hàng sau khi đã cập nhật số lượng
  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );
    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
      _id: undefined,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // Lấy các tham số từ VNPay gửi về qua query string
  var vnp_Params = req.query;
  var secureHash = vnp_Params['vnp_SecureHash'];

  // Xóa các tham số không cần thiết cho việc tạo chữ ký
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sắp xếp các tham số theo key
  vnp_Params = sortObject(vnp_Params);

  // Chuẩn bị dữ liệu để tạo chữ ký
  var secretKey = 'SPMSQNNRVKXDGBVKJPUUWTTCYANNNRUK'; // Giả sử đây là secretKey của bạn
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac('sha512', secretKey);
  var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // Kiểm tra chữ ký
  if (secureHash === signed) {
    const orderId = vnp_Params['vnp_TxnRef']; // Sử dụng tham số này để xác định đơn hàng
    const rspCode = vnp_Params['vnp_ResponseCode']; // Mã phản hồi từ VNPay

    // Kiểm tra mã phản hồi và cập nhật đơn hàng
    if (rspCode === '00') {
      // Mã '00' nghĩa là giao dịch thành công
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = 'VNPay';
        order.paymentResult = {
          id: vnp_Params['vnp_TxnRef'],
          status: 'Completed',
          update_time: new Date().toISOString(),
          email_address: req.query.email, // Giả sử email được truyền như một tham số
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
      }
    } else {
      res.status(400);
      throw new Error('Giao dịch không thành công');
    }
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
  }
});

// Xác nhận đơn hàng bởi quản trị viên
const confirmOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Cập nhật trạng thái đơn hàng nhưng chưa cập nhật là đã thanh toán hay đã giao
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// Người dùng xác nhận đã nhận hàng
const completeOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  console.log('Order ID received:', orderId);

  if (order && req.user._id.equals(order.user)) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found or not authorized');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 });
  res.json(orders);
});

const getRevenueByDay = asyncHandler(async (req, res) => {
  const { year, month, day } = req.params;
  const startDate = new Date(year, month - 1, day);
  const endDate = new Date(year, month - 1, day + 1);
  const orders = await Order.find({
    createdAt: { $gte: startDate, $lt: endDate },
    isPaid: true,
  });
  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );
  res.json({ date: `${year}-${month}-${day}`, revenue: totalRevenue });
});

const getRevenueByMonth = asyncHandler(async (req, res) => {
  const { year, month } = req.params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    isPaid: true,
  });
  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );
  res.json({ year, month, revenue: totalRevenue });
});

const getRevenueByYear = asyncHandler(async (req, res) => {
  const { year } = req.params;
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);
  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    isPaid: true,
  });
  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );
  res.json({ year, revenue: totalRevenue });
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getRevenueByDay,
  getRevenueByYear,
  getRevenueByMonth,
  completeOrder,
  confirmOrder,
};
