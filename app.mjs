

// import express from 'express';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import todoRoutes from './routes/todoRoutes.js';
// import dotenv from 'dotenv';
// import connectDB from './db/db.js';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import morgan from 'morgan';
// import mongoose from 'mongoose';

// dotenv.config();

// // Configure __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Database connection and server start in sequence
// const startServer = async () => {
//   try {
//     // Wait for DB connection
//     await connectDB();

//     // Enhanced CORS configuration
//     app.use(cors({
//       origin: ['https://backendui.onrender.com', 'https://frontend-ui-rose.vercel.app'],
//       credentials: true,
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//       allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
//     }));

//     // Request logging with morgan
//     app.use(morgan('dev'));

//     // Enhanced body parsing
//     app.use(express.json({ limit: '50mb' }));
//     app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//     // Custom request logging middleware
//     app.use((req, res, next) => {
//       console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
//         body: req.body,
//         headers: req.headers
//       });
//       next();
//     });

//     // Routes
//     app.use('/api/auth', userRoutes);
//     app.use('/api/todos', todoRoutes);

//     // Health check endpoint
//     app.get('/api/health', (req, res) => {
//       const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
//       res.json({
//         status: 'OK',
//         dbStatus,
//         uptime: process.uptime(),
//         memoryUsage: process.memoryUsage(),
//         routes: ['/api/auth', '/api/todos']
//       });
//     });

//     // Start the server
//     const server = app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       console.log(`📊 MongoDB connected: ${mongoose.connection.readyState === 1 ? '✅' : '❌'}`);
//     });

//     // Graceful shutdown
//     process.on('SIGTERM', () => {
//       console.log('🛑 SIGTERM received. Shutting down gracefully...');
//       server.close(() => {
//         mongoose.connection.close(false, () => {
//           console.log('🔴 MongoDB connection closed');
//           process.exit(0);
//         });
//       });
//     });

//   } catch (error) {
//     console.error('🚨 Server failed to start due to DB connection error:', error.message);
//     process.exit(1);
//   }
// };

// startServer();


import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import morgan from 'morgan';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'https://frontendui-qw57.onrender.com', // Your frontend URL
    'http://localhost:3000', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Headers',
    'Access-Control-Allow-Origin'
  ],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Request logging
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Custom headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
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
    memoryUsage: process.memoryUsage()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected: ${mongoose.connection.readyState === 1 ? '✅' : '❌'}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();