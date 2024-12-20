import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import blogCategoryRoutes from './routes/blogCategoryRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js'
import statsRoutes from './routes/statsRoutes.js';
import colorRoutes from './routes/colorRoutes.js';
import vnpayRoutes from './routes/vnpayRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cors from 'cors';


const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/productcategories', productCategoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/blogcategories', blogCategoryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payment', vnpayRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);


app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
