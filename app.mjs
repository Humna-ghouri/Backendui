
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();

// import userRoutes from './routes/userRoutes.js';
// import todoRoutes from './routes/todoRoutes.js';
// import verifyToken from './Middlewares/auth.js';

// app.use('/api/auth', userRoutes);
// app.use('/api/todos', todoRoutes);
// app.use('/api/todos', userRoutes);

// app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
// app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found' }));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();

// import userRoutes from './routes/userRoutes.js';
// import todoRoutes from './routes/todoRoutes.js';

// const app = express();

// // CORS Configuration for Render
// const allowedOrigins = [
//   process.env.FRONTEND_URL, // Using env variable
//   'http://localhost:5173'   // Local development
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());

// // MongoDB Connection with error handling
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => {
//     console.error('❌ MongoDB Connection Error:', err.message);
//     process.exit(1);
//   });

// // Routes
// app.use('/api/auth', userRoutes);
// app.use('/api/todos', todoRoutes);

// // Health Check Endpoint
// app.get('/api/health', (req, res) => res.json({ 
//   status: 'ok',
//   backend: process.env.BACKEND_URL,
//   frontend: process.env.FRONTEND_URL
// }));

// // 404 Handler
// app.use((req, res) => res.status(404).json({ 
//   success: false, 
//   message: 'Endpoint not found' 
// }));


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  'https://frontendui-qw57.onrender.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/todos', todoRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'CorsError') {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS policy: Not allowed' 
    });
  }
  next(err);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});