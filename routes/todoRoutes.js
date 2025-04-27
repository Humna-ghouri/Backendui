import express from 'express';
import { 
  getTodos, 
  addTodo, 
  updateTodo, 
  deleteTodo 
} from '../controllers/todoController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Using User embedded approach
router.get('/', authMiddleware, getTodos);
router.post('/', authMiddleware, addTodo);
router.put('/:id', authMiddleware, updateTodo);
router.delete('/:id', authMiddleware, deleteTodo);

export default router;