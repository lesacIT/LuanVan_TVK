import asyncHandler from '../middleware/asyncHandler.js';
import  BlogCategory from '../models/blogCategoryModel.js'; // Sửa đường dẫn tới model nếu cần thiết

// @desc    Get all product categories
// @route   GET /api/productcategories
// @access  Public
const getBlogCategories = asyncHandler(async (req, res) => {
  const blogcategories = await BlogCategory.find({});
  res.json(blogcategories);
});

// @desc    Get product category by ID
// @route   GET /api/productcategories/:id
// @access  Public
const getBlogCategoryById = asyncHandler(async (req, res) => {
  const blogcategory = await BlogCategory.findById(req.params.id);

  if (blogcategory) {
    res.json(blogcategory);
  } else {
    res.status(404);
    throw new Error('Blog category not found');
  }
});

// @desc    Create a new product category
// @route   POST /api/productcategories
// @access  Private/Admin
const createBlogCategory = asyncHandler(async (req, res) => {
  const { title } = req.body; // Sử dụng title thay vì name nếu mô hình dữ liệu sử dụng title

  const blogcategory = new BlogCategory({
    title,
  });

  const createBlogCategory = await blogcategory.save();
  res.status(201).json(createBlogCategory);
});

// @desc    Update a product category
// @route   PUT /api/productcategories/:id
// @access  Private/Admin
const updateBlogCategory = asyncHandler(async (req, res) => {
  const { title } = req.body; // Sử dụng title thay vì name nếu mô hình dữ liệu sử dụng title

  const blogcategory = await BlogCategory.findById(req.params.id);

  if (blogcategory) {
    blogcategory.title = title;

    const updateBlogCategory = await blogcategory.save();
    res.json(updateBlogCategory);
  } else {
    res.status(404);
    throw new Error('Blog category not found');
  }
});

// @desc    Delete a product category
// @route   DELETE /api/productcategories/:id
// @access  Private/Admin
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const blogcategory = await BlogCategory.findById(req.params.id);
  if (blogcategory) {
    await BlogCategory.deleteOne({ _id: blogcategory._id });
    res.json({ message: 'Đã xóa chủ đề bài viết' });
  } else {
    res.status(404);
    throw new Error('Chủ đề không tồn tại');
  }
});

export { getBlogCategories, getBlogCategoryById, createBlogCategory, updateBlogCategory, deleteBlogCategory };