// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import userRoutes from './routes/userRoutes.js';
// import todoRoutes from './routes/todoRoutes.js';
// import Todo from './models/Todo.js';

// dotenv.config();

// const app = express();

// // Allowed Origins
// const allowedOrigins = [
//   'https://frontendui-qw57.onrender.com'
// ];

// // Custom CORS Logic
// const corsOptionsDelegate = function (req, callback) {
//   const origin = req.header('Origin');
//   console.log(`⚙️ Incoming request from origin: ${origin}`);

//   if (!origin || allowedOrigins.includes(origin)) {
//     callback(null, {
//       origin: true,
//       credentials: true,
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//       allowedHeaders: ['Content-Type', 'Authorization']
//     });
//   } else {
//     console.warn(`❌ Origin not allowed by CORS: ${origin}`);
//     callback(new Error('Not allowed by CORS'));
//   }
// };

// // Apply CORS Middleware Globally
// app.use(cors(corsOptionsDelegate));

// // Handle Preflight Requests
// app.options('*', cors(corsOptionsDelegate));

// // Body Parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', userRoutes);
// app.use('/api/todos', todoRoutes);

// // Public Todos Route
// app.get('/api/public/todos', async (req, res) => {
//   try {
//     const todos = await Todo.find().sort({ createdAt: -1 });
//     res.json({ success: true, todos });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Health Check Endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
//     timestamp: new Date().toISOString()
//   });
// });

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ 
//     success: false, 
//     message: 'Endpoint not found' 
//   });
// });

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://humnaghouri001:pakistan@cluster0.ppshr.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => {
//     console.error('❌ MongoDB Connection Error:', err);
//     process.exit(1);
//   });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
// });
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import Todo from './models/Todo.js';

dotenv.config();
const app = express();

// Allowed Origins
const allowedOrigins = ['https://frontendui-qw57.onrender.com'];

// CORS Middleware with extra manual header support (for Render)
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');
  console.log(`⚙️ Incoming request from origin: ${origin}`);
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });
  } else {
    console.warn(`❌ Origin not allowed by CORS: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate));

// ⬅️ ADD THIS — manual headers for Render to always return CORS
app.use((req, res, next) => {
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  next();
});

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/todos', todoRoutes);

// Public Todos Route
app.get('/api/public/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, todos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
