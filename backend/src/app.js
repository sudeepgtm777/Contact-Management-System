import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import contactRoutes from './routes/contactRoute.js';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import globalErrorHandler from './controllers/errorController.js';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('src/config/config.env') });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

connectDB();
const port = process.env.PORT;

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
