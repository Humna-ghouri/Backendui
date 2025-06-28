import express from 'express';
import verifyToken from '../Middlewares/auth.js';
import {
  getAllTodos,
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} from '../controllers/todoController.js';

const router = express.Router();

// ✅ Protect all routes below with verifyToken middleware
router.use(verifyToken);

// ✅ Admin or general use — Get all todos with user info populated (if needed)
router.get('/all', getAllTodos);

// ✅ Create a new todo for the logged-in user
router.post('/', createTodo);

// ✅ Get all todos of the logged-in user
router.get('/', getTodos);

// ✅ Get a single todo by ID (must belong to the user)
router.get('/:id', getTodoById);

// ✅ Update a specific todo (only if it belongs to the user)
router.put('/:id', updateTodo);

// ✅ Delete a specific todo (only if it belongs to the user)
router.delete('/:id', deleteTodo);

export default router;
