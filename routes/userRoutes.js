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
router.post('/signin', signin);
router.post('/signup', signup);
router.get('/user', verifyToken, getUser);

export default router;