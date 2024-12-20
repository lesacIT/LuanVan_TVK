import asyncHandler from '../middleware/asyncHandler.js';
import Brand from '../models/brandModel.js'; // Sửa đường dẫn tới model nếu cần thiết

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  res.json(brands);
});

// @desc    Get brand by ID
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    res.json(brand);
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body; // Sử dụng title thay vì name nếu mô hình dữ liệu sử dụng title

  const brand = new Brand({
    title,
  });

  const createdBrand = await brand.save();
  res.status(201).json(createdBrand);
});

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
  const { title } = req.body; // Sử dụng title thay vì name nếu mô hình dữ liệu sử dụng title

  const brand = await Brand.findById(req.params.id);

  if (brand) {
    brand.title = title;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    await Brand.deleteOne({ _id: brand._id });
    res.json({ message: 'Đã xóa thương hiệu' });
  } else {
    res.status(404);
    throw new Error('Thương hiệu không tồn tại');
  }
});

export { getBrands, getBrandById, createBrand, updateBrand, deleteBrand };
