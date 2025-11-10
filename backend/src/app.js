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
import { fileURLToPath } from 'url';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

const app = express();

// CORS for dev
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
}

// Body parser and cookies
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));

  // Catch-all route to serve index.html
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(frontendDist, 'index.html'));
  });
}

// Connect DB
connectDB();

const port = process.env.PORT || 3000;

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
