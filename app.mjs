
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();

// import userRoutes from './routes/userRoutes.js';
// import todoRoutes from './routes/todoRoutes.js';
// import verifyToken from './Middlewares/auth.js';

// const app = express();
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://frontendui-qw57.onrender.com'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps, Postman)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => {
//     console.error('❌ MongoDB Error:', err.message);
//     process.exit(1);
//   });

// app.use('/api/auth', userRoutes);
// app.use('/api/todos', todoRoutes);
// app.use('/api/todos', userRoutes);

// app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
// app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found' }));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();

// CORS Configuration for Render
const allowedOrigins = [
  process.env.FRONTEND_URL, // Using env variable
  'http://localhost:5173'   // Local development
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/todos', todoRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => res.json({ 
  status: 'ok',
  backend: process.env.BACKEND_URL,
  frontend: process.env.FRONTEND_URL
}));

// 404 Handler
app.use((req, res) => res.status(404).json({ 
  success: false, 
  message: 'Endpoint not found' 
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));