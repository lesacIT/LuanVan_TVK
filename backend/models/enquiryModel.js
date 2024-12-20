import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const enquirySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Đã gửi',
      enum: ['Đã gửi', 'Đã liên hệ', 'Đang giải quyết', 'Đã giải quyết'],
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry  = mongoose.model('Enquiry ', enquirySchema);

export default Enquiry ;
