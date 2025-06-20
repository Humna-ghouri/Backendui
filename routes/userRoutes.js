import express from 'express';
import { getAllTodos } from '../controllers/todoController.js';
import { signup, signin, getMe } from '../controllers/authController.js';
import verifyToken from '../Middlewares/auth.js';

const router = express.Router();

// ✅ Authentication routes
router.post('/api/auth/signup', signup);
router.post('/api/auth/signin', signin);
router.get('/api/auth/user', verifyToken, getMe);

// ✅ Public route to get all todos
router.get('/api/todos/all', getAllTodos); // 🛠️ Moved under /api/todos for clarity

export default router;
