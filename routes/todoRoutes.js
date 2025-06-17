import express from 'express';
import verifyToken from '../Middlewares/auth.js';
import Todo from '../models/Todo.js';

const router = express.Router();

// Public route - Get all todos (no authentication needed)
router.get('/all', async (req, res) => {
  try {
    const todos = await Todo.find().populate('user', 'name email');
    res.json({ success: true, todos });
  } catch (err) {
    console.error('❌ Get All Todos Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get todos', 
      error: err.message 
    });
  }
});

// Protected routes (require authentication)
router.use(verifyToken); // This applies to all routes below

// Create Todo
router.post('/', async (req, res) => {
  console.log('🧠 createTodo hit 🧠, req.user:', req.user);
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const newTodo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      priority,
      dueDate,
      user: req.user._id,
    });

    const savedTodo = await newTodo.save();
    console.log('✅ Todo inserted in MongoDB:', savedTodo);

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: savedTodo,
    });
  } catch (err) {
    console.error('❌ Create Todo Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: err.message,
    });
  }
});

// Get authenticated user's todos
router.get('/', async (req, res) => {
  console.log('🟢 GET /api/todos hit by:', req.user);
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json({ success: true, todos });
  } catch (err) {
    console.error('❌ Get User Todos Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get user todos',
      error: err.message
    });
  }
});

// Update a Todo
router.put('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: req.user._id },
      {
        title: title?.trim(),
        description: description?.trim(),
        status,
        priority,
        dueDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Todo not found or not authorized' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Todo updated successfully', 
      todo: updatedTodo 
    });
  } catch (err) {
    console.error('❌ Update Todo Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update todo', 
      error: err.message 
    });
  }
});

// Delete a Todo
router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const deleted = await Todo.findOneAndDelete({ 
      _id: todoId, 
      user: req.user._id 
    });

    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Todo not found or not authorized' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Todo deleted successfully' 
    });
  } catch (err) {
    console.error('❌ Delete Todo Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete todo', 
      error: err.message 
    });
  }
});

export default router;