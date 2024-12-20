import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const BlogCatergorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogCategory = mongoose.model('BlogCategory', BlogCatergorySchema);

export default BlogCategory;
