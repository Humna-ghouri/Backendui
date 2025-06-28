import Todo from '../models/Todo.js';

// ✅ GET ALL TODOS (Admin only or general listing)
export const getAllTodos = async (req, res) => {
  try {
    // Optional: Only show all todos if admin or certain role
    const todos = await Todo.find().populate('user', 'name email');
    res.status(200).json({ success: true, todos });
  } catch (err) {
    console.error('❌ getAllTodos error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// ✅ CREATE A TODO
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
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
      user: req.user?._id,
    });

    await newTodo.save();
    console.log("✅ Saved new todo:", newTodo);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      todo: newTodo,
    });
  } catch (err) {
    console.error('❌ Create Todo Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating task',
    });
  }
};

// ✅ GET LOGGED-IN USER’S TODOS
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error('❌ Get Todos Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get todos',
    });
  }
};

// ✅ GET SINGLE TODO BY ID
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    return res.status(200).json({ success: true, todo });
  } catch (error) {
    console.error('❌ Get Todo By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching todo',
    });
  }
};

// ✅ UPDATE TODO
export const updateTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      todo: updated,
    });
  } catch (error) {
    console.error('❌ Update Todo Error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message,
    });
  }
};

// ✅ DELETE TODO
export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete Todo Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
    });
  }
};
