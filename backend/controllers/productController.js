import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT) || 8;
  const page = Number(req.query.pageNumber) || 1;
  const { keyword, category, brand } = req.query;

  const query = {};

  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' }; // Tìm kiếm theo tên sản phẩm
  }
  if (category) {
    query.category = category; // Lọc theo danh mục
  }
  if (brand) {
    query.brand = brand; // Lọc theo thương hiệu
  }

  try {
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error retrieving products', error: error.message });
  }
});

// @desc    Get categories and brands
// @route   GET /api/products/categories-brands
// @access  Public
const getCategoriesAndBrands = asyncHandler(async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    res.json({ categories, brands });
  } catch (error) {
    res.status(500).send({
      message: 'Error retrieving categories and brands',
      error: error.message,
    });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Sản phẩm không tồn tại');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    description,
    colors,
    countInStock,
  } = req.body;

  // Tiếp tục tạo sản phẩm
  const product = new Product({
    name,
    price,
    image,
    brand,
    category,
    description,
    countInStock, // Sử dụng tổng số lượng từ màu sắc
    user: req.user._id,
  });

  // Thêm thông tin về màu sắc và số lượng vào sản phẩm
  if (colors && colors.length > 0) {
    product.colors = colors.map((color) => ({
      title: color.title, // Thay vì sử dụng title, bạn sử dụng color
      colorCode: color.colorCode,
      quantity: color.quantity,
    }));
  }

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, description, colors } = req.body;

  // Tính tổng số lượng từng màu sắc để cập nhật vào tổng số lượng sản phẩm
  const totalQuantity = colors.reduce(
    (total, color) => total + color.quantity,
    0
  );

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = totalQuantity;

      // Cập nhật thông tin về màu sắc và số lượng
      if (colors && colors.length > 0) {
        product.colors = colors.map((color) => ({
          title: color.title, // Thay vì sử dụng title, bạn sử dụng color
          colorCode: color.colorCode, // Thêm trường colorCode
          quantity: color.quantity || 0, // Số lượng mặc định là 0 nếu không được cung cấp
        }));
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Sản phẩm không tồn tại');
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Cập nhật lỗi', error: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Đã xóa sản phẩm' });
  } else {
    res.status(404);
    throw new Error('Sản phẩm không tồn tại');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body; // Lấy rating và comment từ req.body

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Kiểm tra xem người dùng đã mua sản phẩm này và đã thanh toán chưa
  const userHasPurchased = await Order.findOne({
    user: req.user._id,
    'orderItems.product': req.params.id,
    isPaid: true,
  });

  if (!userHasPurchased) {
    res.status(403);
    throw new Error(
      'Chỉ những khách hàng đã mua sản phẩm mới có thể đánh giá nó'
    );
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Bạn đã viết đánh giá rồi');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating), // Sử dụng biến rating đã được khai báo
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Đã tạo đánh giá' });
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getCategoriesAndBrands,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
