
// export default router;

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


// router.get('/all', getAllTodos); // Now it's protected
router.get('/all', getAllTodos);
router.use(verifyToken);
router.post('/', createTodo); // ✅
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;