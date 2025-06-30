// routes/publicTodoRoutes.js
import express from 'express';
import { getPublicTodos } from '../controllers/todoController.js';

const router = express.Router();

router.get('/', getPublicTodos); // ✅ Should respond to /api/public/

export default router;
