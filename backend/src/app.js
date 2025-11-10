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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

const app = express();

// Enable CORS only in development
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDistPath));

  // Catch-all route to serve frontend for SPA routing
  app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: frontendDistPath });
  });
}

// Connect to database
connectDB();

// 404 handler for API routes
app.use('/api', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
