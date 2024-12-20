import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const ProductCatergorySchema = mongoose.Schema(
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

const ProductCategory = mongoose.model('ProductCategory', ProductCatergorySchema);

export default ProductCategory;
