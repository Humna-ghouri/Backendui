import express from 'express';
import Task from '../models/taskModel.js';
import verifyToken from '../Middlewares/auth.js';

const router = express.Router();

// Create new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      user: req.user.id  // from token
    });

    await task.save();

    res.status(201).json({ success: true, message: 'Task created', task });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
