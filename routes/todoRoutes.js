
import express from 'express';
import verifyToken from '../Middlewares/auth.js';
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} from '../controllers/todoController.js';

const router = express.Router();

router.use(verifyToken); // Apply auth middleware to all routes

router.post('/', createTodo);           // Create a new Todo
router.get('/', getTodos);              // Get all Todos for the authenticated user
router.get('/:id', getTodoById);        // Get single Todo by ID
router.put('/:id', updateTodo);         // Update Todo by ID
router.delete('/:id', deleteTodo);      // Delete Todo by ID

export default router;
