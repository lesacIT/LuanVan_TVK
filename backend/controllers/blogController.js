import asyncHandler from '../middleware/asyncHandler.js';
import Blog from '../models/blogModel.js';

const getBlogs = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT1;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Blog.countDocuments({ ...keyword });
  const blogs = await Blog.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
});

const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(404);
    throw new Error('Bài viết không tồn tại');
  }

  // Tăng số lượt xem của bài đăng lên 1
  await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } });

  res.json(blog);
});

const createBlog = asyncHandler(async (req, res) => {
  const { title, image, category, description, author } = req.body;

  const blog = new Blog({
    title,
    image,
    category,
    description,
    author: req.user._id,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, description, image, category } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.title = title;
    blog.description = description;
    blog.image = image;
    blog.category = category;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Bài viết không tồn tại');
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    await Blog.deleteOne({ _id: blog._id });
    res.json({ message: 'Đã xóa bài viết' });
  } else {
    res.status(404);
    throw new Error('Bài viết không tồn tại');
  }
});

const createBlogReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (Blog) {
    const alreadyReviewed = blog.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Bài viết đã được bạn đánh giá');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    blog.reviews.push(review);

    blog.numReviews = blog.reviews.length;

    blog.rating =
      blog.reviews.reduce((acc, item) => item.rating + acc, 0) /
      blog.reviews.length;

    await blog.save();
    res.status(201).json({ message: 'Đã thêm đánh giá' });
  } else {
    res.status(404);
    throw new Error('Bài viết không tồn tại');
  }
});

const getTopBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ rating: -1 }).limit(3);

  res.json(blogs);
});

export {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  createBlogReview,
  getTopBlogs,
};
