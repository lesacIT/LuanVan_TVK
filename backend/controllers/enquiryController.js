import asyncHandler from '../middleware/asyncHandler.js';
import Enquiry from './../models/enquiryModel.js';

const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({});
  res.json(enquiries);
});

const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (enquiry) {
    res.json(enquiry);
  } else {
    res.status(404);
    throw new Error('Enquiry not found');
  }
});

const getMyEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({ user: req.user._id });
  res.json(enquiries);
});

const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, mobile, comment, status } = req.body;

  const enquiry = new Enquiry({
    name,
    email,
    mobile,
    comment,
    status,
    user: req.user._id,
  });

  const createdEnquiry = await enquiry.save();
  res.status(201).json(createdEnquiry);
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const enquiry = await Enquiry.findById(req.params.id);

  if (enquiry) {
    enquiry.status = status;

    const updatedEnquiry = await enquiry.save();
    res.json(updatedEnquiry);
  } else {
    res.status(404);
    throw new Error('Yêu cầu không tồn tại');
  }
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (enquiry) {
    await Enquiry.deleteOne({ _id: enquiry._id });
    res.json({ message: 'Đã xóa yêu cầu' });
  } else {
    res.status(404);
    throw new Error('Yêu cầu không tồn tại');
  }
});

export { getEnquiries, getMyEnquiries, getEnquiryById, createEnquiry, updateEnquiry, deleteEnquiry };
