import express from 'express';
import { getPublicTodos } from '../controllers/todoController.js';

const router = express.Router();

// ✅ No token required here
router.get('/', getPublicTodos);

export default router;
