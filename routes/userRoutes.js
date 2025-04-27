import express from 'express';
import { signup, signin, getUser } from '../controllers/authController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/user', authMiddleware, getUser);

export default router;