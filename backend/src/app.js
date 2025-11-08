import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import contactRoutes from './routes/contactRoute.js';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('src/config/config.env') });

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(cookieParser());

app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });
}

connectDB();
const port = process.env.PORT;

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
