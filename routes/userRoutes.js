import express from 'express';
import {
  signup,
  signin,
  getMe,
  verifyToken // Make sure this exists in your authController.js
} from '../controllers/authController.js';

import verifyTokenMiddleware from '../Middlewares/auth.js';

const router = express.Router();

// ✅ Auth routes
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', verifyTokenMiddleware, getMe);
router.get('/verify', verifyTokenMiddleware, verifyToken); // Optional: Token validation route

export default router;

