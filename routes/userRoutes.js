// import express from 'express';
// import { signup, signin, getUser } from '../controllers/authController.js';
// import verifyToken from '../Middlewares/auth.js'; // ✅ updated import name

// const router = express.Router();

// router.post('/signup', signup);
// router.post('/signin', signin);
// router.get('/user', verifyToken, getUser);

// export default router;
import express from 'express';
import { signup, signin, getUser } from '../controllers/authController.js';
import verifyToken from '../Middlewares/auth.js';

const router = express.Router();

// Make sure these match your frontend requests
router.post('/api/auth/signup', signup);
router.post('/api/auth/signin', signin);
router.get('/api/auth/user', verifyToken, getUser);

export default router;