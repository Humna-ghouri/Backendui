<<<<<<< HEAD

=======
>>>>>>> 49f9b3b4d4196c59baace9323a82247a59811bf8
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
<<<<<<< HEAD
=======
import Todo from './models/Todo.js'; // Add this if not already
>>>>>>> 49f9b3b4d4196c59baace9323a82247a59811bf8

dotenv.config();

const app = express();

<<<<<<< HEAD
=======
// ✅ Allowed Origins
>>>>>>> 49f9b3b4d4196c59baace9323a82247a59811bf8
const allowedOrigins = [
  'https://frontendui-qw57.onrender.com'
  
];

<<<<<<< HEAD

const corsOptions = {
  origin: allowedOrigins,
  credentials: true
};

app.use(cors(corsOptions)); // ✅ This is enough
// app.options('*', cors(corsOptions));


// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://humnaghouri001:pakistan@cluster0.ppshr.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
=======
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
>>>>>>> 49f9b3b4d4196c59baace9323a82247a59811bf8
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

<<<<<<< HEAD
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
=======
// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
>>>>>>> 49f9b3b4d4196c59baace9323a82247a59811bf8
