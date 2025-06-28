
// export default router;
<<<<<<< HEAD
=======
// import express from 'express';
// import verifyToken from '../Middlewares/auth.js';
// import Todo from '../models/Todo.js';

// const router = express.Router();

// // Public route - Get all todos (no authentication needed)
// router.get('/all', async (req, res) => {
//   try {
//     const todos = await Todo.find().populate('user', 'name email');
//     res.json({ 
//       success: true, 
//       count: todos.length,
//       todos 
//     });
//   } catch (err) {
//     console.error('Get All Todos Error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to get todos',
//       error: err.message 
//     });
//   }
// });

// // Protected routes (require authentication)
// router.use(verifyToken);

// // Get authenticated user's todos
// router.get('/', async (req, res) => {
//   try {
//     const todos = await Todo.find({ user: req.user._id })
//       .sort({ createdAt: -1 }); // Newest first
//     res.json({ 
//       success: true, 
//       count: todos.length,
//       todos 
//     });
//   } catch (err) {
//     console.error('Get User Todos Error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get user todos',
//       error: err.message
//     });
//   }
// });

// // Create Todo
// router.post('/', async (req, res) => {
//   try {
//     const { title, description, status = 'pending', priority = 'medium', dueDate } = req.body;

//     // Validation
//     if (!title || typeof title !== 'string' || title.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid title is required',
//       });
//     }

//     const newTodo = new Todo({
//       title: title.trim(),
//       description: description?.trim() || '',
//       status,
//       priority,
//       dueDate,
//       user: req.user._id,
//     });

//     const savedTodo = await newTodo.save();
//     res.status(201).json({
//       success: true,
//       message: 'Todo created successfully',
//       todo: savedTodo,
//     });
//   } catch (err) {
//     console.error('Create Todo Error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create todo',
//       error: err.message,
//     });
//   }
// });

// // Update a Todo
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, status, priority, dueDate } = req.body;

//     const updateData = {};
//     if (title) updateData.title = title.trim();
//     if (description) updateData.description = description.trim();
//     if (status) updateData.status = status;
//     if (priority) updateData.priority = priority;
//     if (dueDate) updateData.dueDate = dueDate;

//     const updatedTodo = await Todo.findOneAndUpdate(
//       { _id: id, user: req.user._id },
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedTodo) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Todo not found or not authorized' 
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: 'Todo updated successfully', 
//       todo: updatedTodo 
//     });
//   } catch (err) {
//     console.error('Update Todo Error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to update todo', 
//       error: err.message 
//     });
//   }
// });

// // Delete a Todo
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedTodo = await Todo.findOneAndDelete({ 
//       _id: id, 
//       user: req.user._id 
//     });

//     if (!deletedTodo) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Todo not found or not authorized' 
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: 'Todo deleted successfully',
//       deletedTodo 
//     });
//   } catch (err) {
//     console.error('Delete Todo Error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to delete todo', 
//       error: err.message 
//     });
//   }
// });

// export default router;
>>>>>>> 49f9b3b4d4196c59baace9323a82247a59811bf8

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

<<<<<<< HEAD

// router.get('/all', getAllTodos); // Now it's protected
router.get('/all', getAllTodos);
router.use(verifyToken);
=======
router.use(verifyToken);
// router.get('/all', getAllTodos); // Now it's protected
router.get('/all', (req, res, next) => {
  console.log("✅ /all route hit");
  next();
}, getAllTodos);
>>>>>>> 49f9b3b4d4196c59baace9323a82247a59811bf8
router.post('/', createTodo); // ✅
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;