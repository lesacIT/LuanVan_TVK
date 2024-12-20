import asyncHandler from '../middleware/asyncHandler.js';
import Color from '../models/colorModel.js'; // Sửa đường dẫn tới model nếu cần thiết


const getColors = asyncHandler(async (req, res) => {
  const colors = await Color.find({});
  res.json(colors);
});


const getColorById = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);

  if (color) {
    res.json(color);
  } else {
    res.status(404);
    throw new Error('Color not found');
  }
});


const createColor = asyncHandler(async (req, res) => {
  const { title, colorCode } = req.body; 

  const color = new Color({
    title,
    colorCode
  });

  const createColor = await color.save();
  res.status(201).json(createColor);
});


const updateColor = asyncHandler(async (req, res) => {
  const { title, colorCode } = req.body; 

  const color = await Color.findById(req.params.id);

  if (color) {
    color.title = title;
    color.colorCode = colorCode;

    const updateColor = await color.save();
    res.json(updateColor);
  } else {
    res.status(404);
    throw new Error('Color not found');
  }
});


const deleteColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (color) {
    await Color.deleteOne({ _id: color._id });
    res.json({ message: 'Đã xóa màu' });
  } else {
    res.status(404);
    throw new Error('Màu không tồn tại');
  }
});

export { getColors, getColorById, createColor, updateColor, deleteColor };