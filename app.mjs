// import express from 'express';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import loanRoute from './routes/appRoutes.js';
// import pdfRoutes from './routes/pdfRoutes.js';
// import dotenv from 'dotenv';
// import connectDB from './db/db.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Configure __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Database connection
// connectDB();

// // Middleware
// app.use(cors({
// //   origin: 'http://localhost:5173',
// origin: ['http://localhost:5173', 'https://frontend-ui-rose.vercel.app'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

// // Routes
// app.use('/api/auth', userRoutes);
// app.use('/api/loans', loanRoute);
// app.use('/api/pdf', pdfRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     routes: ['/api/auth', '/api/loans', '/api/pdf'] 
//   });
// });

// // Error handling (must be last)
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({ error: 'Internal server error' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log('Available routes:');
//   console.log('- GET /api/health');
//   console.log('- GET /api/pdf/test');
//   console.log('- GET /api/pdf/:loanId');
// });

// server.js
// import express from 'express';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import loanRoute from './routes/todoRoutes.js'; // This seems misnamed, should be loanRoutes
// import todoRoutes from './routes/todoRoutes.js'; // Add this line
// import pdfRoutes from './routes/pdfRoutes.js';
// import dotenv from 'dotenv';
// import connectDB from './db/db.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Configure __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Database connection
// connectDB();

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://frontend-ui-rose.vercel.app'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

// // Routes
// app.use('/api/auth', userRoutes);
// app.use('/api/loans', loanRoute);
// app.use('/api/todos', todoRoutes); // Add this line
// app.use('/api/pdf', pdfRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     routes: ['/api/auth', '/api/loans', '/api/todos', '/api/pdf'] 
//   });
// });

// // Error handling (must be last)
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({ error: 'Internal server error' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log('Available routes:');
//   console.log('- GET /api/health');
//   console.log('- GET /api/todos');
//   console.log('- POST /api/todos');
//   console.log('- PUT /api/todos/:id');
//   console.log('- DELETE /api/todos/:id');
//   console.log('- GET /api/pdf/test');
//   console.log('- GET /api/pdf/:loanId');
// });

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import mongoose from 'mongoose';

dotenv.config();

// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection and server start in sequence
const startServer = async () => {
  try {
    // Wait for DB connection
    await connectDB();

    // Enhanced CORS configuration
    app.use(cors({
      origin: ['http://localhost:5173', 'https://frontend-ui-rose.vercel.app'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
    }));

    // Request logging with morgan
    app.use(morgan('dev'));

    // Enhanced body parsing
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Custom request logging middleware
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
        body: req.body,
        headers: req.headers
      });
      next();
    });

    // Routes
    app.use('/api/auth', userRoutes);
    app.use('/api/todos', todoRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
      res.json({
        status: 'OK',
        dbStatus,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        routes: ['/api/auth', '/api/todos']
      });
    });

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 MongoDB connected: ${mongoose.connection.readyState === 1 ? '✅' : '❌'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('🔴 MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('🚨 Server failed to start due to DB connection error:', error.message);
    process.exit(1);
  }
};

startServer();
