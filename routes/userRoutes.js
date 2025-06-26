// // import express from 'express';
// // import { getAllTodos } from '../controllers/todoController.js';
// // import { signup, signin, getMe } from '../controllers/authController.js';
// // import verifyToken from '../Middlewares/auth.js';

// // const router = express.Router();

// // // ✅ Authentication routes
// // router.post('/api/auth/signup', signup);
// // router.post('/api/auth/signin', signin);
// // router.get('/api/auth/user', verifyToken, getMe);

// // // ✅ Public route to get all todos
// // router.get('/api/todos/all', getAllTodos); // 🛠️ Moved under /api/todos for clarity

// // export default router;
// import express from 'express';
// import { getAllTodos } from '../controllers/todoController.js';
// import { signup, signin, getMe, verifyToken } from '../controllers/authController.js';
// import verifyTokenMiddleware from '../Middlewares/auth.js';

// const router = express.Router();

// // Auth routes
// router.post('/api/auth/signup', signup);
// router.post('/api/auth/signin', signin);
// router.get('/api/auth/me', verifyTokenMiddleware, getMe);
// router.get('/api/auth/verify', verifyTokenMiddleware, verifyToken); // Add this new route

// // Todo routes
// router.get('/api/todos/all', getAllTodos);

// export default router;
import express from 'express';
import { 
  signup, 
  signin, 
  getMe, 
  verifyToken 
} from '../controllers/authController.js';
import verifyTokenMiddleware from '../Middlewares/auth.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', verifyTokenMiddleware, getMe);
router.get('/verify', verifyTokenMiddleware, verifyToken);

export default router;