import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import publicTodoRoutes from './routes/publicTodoRoutes.js';
import Todo from './models/Todo.js';

dotenv.config();

const app = express();

// ✅ CORS Config
const allowedOrigins = [
  'https://frontendui-qw57.onrender.com',
  'http://localhost:5173' // if you're testing locally too
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔍 Request Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // ✅ VERY IMPORTANT
};



app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Extra CORS Headers (for Render)
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

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/public', publicTodoRoutes); // ✅ THIS MUST BE ABOVE 404 HANDLER

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ✅ 404 Handler
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

// ✅ MongoDB Connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
});
