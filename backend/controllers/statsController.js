import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// import mongoose from 'mongoose';

export const getStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Đặt thời gian kết thúc vào cuối ngày

  // Tính tổng số người dùng
  const totalUsers = await User.countDocuments();

  // Tính tổng số sản phẩm
  const totalProducts = await Product.countDocuments();

  // console.log("Start Date:", startDate, "End Date:", endDate);
  // console.log("Data returned:", { totalOrders, totalRevenue });

  res.json({
    totalUsers,
    totalProducts,
  });
});

// Tính tổng số tiền đặt hàng tích lũy từ thời điểm ban đầu
export const calculateTotalRevenue = asyncHandler(async (req, res) => {
  const totalRevenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }, // Sử dụng $sum để tính tổng doanh thu
      },
    },
  ]);

  res.json({ totalRevenue: totalRevenue[0]?.totalRevenue || 0 });
});

// Tính tổng số doanh thu tích lũy từ thời điểm ban đầu
export const TotalRevenuePaid = asyncHandler(async (req, res) => {
  const totalRevenue = await Order.aggregate([
    {
      $match: {
        isPaid: true, // chỉ xét những đơn hàng đã thanh toán
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }, // Sử dụng $sum để tính tổng doanh thu
      },
    },
  ]);

  res.json({ totalRevenue: totalRevenue[0]?.totalRevenue || 0 });
});

// Tính tổng số đơn hàng tích lũy từ thời điểm ban đầu
export const getTotalOrdersCumulative = asyncHandler(async (req, res) => {
  const ordersCumulative = await Order.countDocuments();

  res.json({ totalOrdersCumulative: ordersCumulative || 0 });
});

// Tính tổng số đơn hàng đã thanh toán tích lũy từ thời điểm ban đầu
export const TotalOrdersCumulativePaid = asyncHandler(async (req, res) => {
  const ordersCumulativePaid = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        totalOrdersCumulativePaid: { $sum: 1 }, // Sử dụng $sum để tính tổng số đơn hàng
      },
    },
  ]);

  res.json({
    totalOrdersCumulativePaid:
      ordersCumulativePaid[0]?.totalOrdersCumulativePaid || 0,
  });
});

// Tính tổng doanh thu theo khoảng thời gian
export const getTotalRevenueByTimeRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Đặt thời gian kết thúc vào cuối ngày

  const totalRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        isPaid: true, // chỉ xét những đơn hàng đã thanh toán
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }, // Sử dụng $sum để tính tổng doanh thu
      },
    },
  ]);

  res.json({ totalRevenue: totalRevenue[0]?.totalRevenue || 0 });
});

// Tổng số đơn hàng theo thời gian
export const getTotalOrders = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 }, // Sử dụng $sum để tính tổng số lượng đơn đặt hàng
      },
    },
  ]);

  res.json({ totalOrders: orders[0]?.total || 0 });
});

//Sản phẩm bán chạy nhất
export const getBestSellingProduct = asyncHandler(async (req, res) => {
  const bestSelling = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.qty' },
        name: { $first: '$orderItems.name' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 1 },
  ]);

  if (bestSelling.length === 0) {
    res.status(404).send({ message: 'No products found' });
  } else {
    res.json(bestSelling[0]);
  }
});

//Thống kê doanh thu theo phân loại
export const getRevenueByCategory = asyncHandler(async (req, res) => {
  const revenueByCategory = await Order.aggregate([
    { $match: { isPaid: true } }, // Chỉ xét những đơn hàng đã được thanh toán

    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $group: {
        _id: '$productDetails.category',
        totalRevenue: {
          $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] },
        },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  res.json(revenueByCategory);
});

//Tính tổng doanh thu theo từng ngày, tháng, năm
export const getGrowthData = asyncHandler(async (req, res) => {
  const { type } = req.query;

  let groupBy = {};
  if (type === 'daily') {
    groupBy = {
      day: { $dayOfMonth: '$createdAt' },
      month: { $month: '$createdAt' },
      year: { $year: '$createdAt' },
    };
  } else if (type === 'monthly') {
    groupBy = {
      month: { $month: '$createdAt' },
      year: { $year: '$createdAt' },
    };
  } else if (type === 'yearly') {
    groupBy = { year: { $year: '$createdAt' } };
  }

  const growthData = await Order.aggregate([
    { $match: { isPaid: true } }, // Only consider paid orders
    {
      $group: {
        _id: groupBy,
        totalRevenue: { $sum: '$totalPrice' },
        countOrders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  res.json(growthData);
});
