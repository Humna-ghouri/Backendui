import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import Todo from './models/Todo.js'; // Add this if not already

dotenv.config();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  'https://frontendui-qw57.onrender.com'
  
];

// ✅ Custom CORS Logic
const corsOptionsDelegate = function (req, callback) {
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

// ✅ Apply CORS Middleware Globally
app.use(cors(corsOptionsDelegate));

// ✅ Handle Preflight Requests
app.options('*', cors(corsOptionsDelegate));

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', userRoutes);
app.use('/api/todos', todoRoutes);

// ✅ Public Todos Route
app.get('/api/public/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, todos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
