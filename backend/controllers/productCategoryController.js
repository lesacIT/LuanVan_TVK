import asyncHandler from '../middleware/asyncHandler.js';
import  ProductCategory from '../models/productCategoryModel.js'; // Sửa đường dẫn tới model nếu cần thiết

// @desc    Get all product categories
// @route   GET /api/productcategories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const productcategories = await ProductCategory.find({});
  res.json(productcategories);
});

// @desc    Get product category by ID
// @route   GET /api/productcategories/:id
// @access  Public
const getProductCategoryById = asyncHandler(async (req, res) => {
  const productcategory = await ProductCategory.findById(req.params.id);

  if (productcategory) {
    res.json(productcategory);
  } else {
    res.status(404);
    throw new Error('Product category not found');
  }
});

// @desc    Create a new product category
// @route   POST /api/productcategories
// @access  Private/Admin
const createProductCategory = asyncHandler(async (req, res) => {
  const { title } = req.body; // Sử dụng title thay vì name nếu mô hình dữ liệu sử dụng title

  const productcategory = new ProductCategory({
    title,
  });

  const createProductCategory = await productcategory.save();
  res.status(201).json(createProductCategory);
});

// @desc    Update a product category
// @route   PUT /api/productcategories/:id
// @access  Private/Admin
const updateProductCategory = asyncHandler(async (req, res) => {
  const { title } = req.body; // Sử dụng title thay vì name nếu mô hình dữ liệu sử dụng title

  const productcategory = await ProductCategory.findById(req.params.id);

  if (productcategory) {
    productcategory.title = title;

    const updateProductCategory = await productcategory.save();
    res.json(updateProductCategory);
  } else {
    res.status(404);
    throw new Error('Product category not found');
  }
});

// @desc    Delete a product category
// @route   DELETE /api/productcategories/:id
// @access  Private/Admin
const deleteProductCategory = asyncHandler(async (req, res) => {
  const productcategory = await ProductCategory.findById(req.params.id);
  if (productcategory) {
    await ProductCategory.deleteOne({ _id: productcategory._id });
    res.json({ message: 'Đã xóa phân loại sản phẩm' });
  } else {
    res.status(404);
    throw new Error('Phân loại sản phẩm không tồn tại');
  }
});

export { getProductCategories, getProductCategoryById, createProductCategory, updateProductCategory, deleteProductCategory };