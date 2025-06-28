import Todo from '../models/Todo.js';

export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().populate('user', 'name email'); // Make sure 'Todo' is imported correctly
    res.json({ todos });
  } catch (err) {
    console.error('❌ getAllTodos error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    console.log("👉 Create Todo Body:", req.body);
    console.log("👉 Authenticated user:", req.user);

    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title is required' 
      });
    }

    const newTodo = new Todo({
      title,
      description,
      priority,
      dueDate,
      user: req.user?._id  // ✅ Check if req.user exists
    });

    await newTodo.save();
    console.log("✅ Saved new todo:", newTodo);

    return res.status(201).json({ 
      success: true, 
      message: 'Task created successfully', 
      todo: newTodo 
    });
  } catch (err) {
    console.error('❌ Create Todo Error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while creating task' 
    });
  }
};


export const getTodos = async (req, res) => {
  try {
    // const todos = await Todo.find().sort({ createdAt: -1 });
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch (error) {
    console.error('Get Todos Error:', error);
    return res.status(500).json({ 
      message: 'Failed to get todos' 
    });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error fetching todo' 
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title is required' 
      });
    }

    // const updated = await Todo.findOneAndUpdate(
    //   { _id: req.params.id, user: req.user._id },
    //   {
    //     title: title.trim(),
    //     description: description?.trim() || '',
    //     status,
    //     priority,
    //     dueDate
    //   },
    //   { 
    //     new: true,
    //     runValidators: true
    //   }
    // );

    const updated = await Todo.findOneAndUpdate(
  { _id: req.params.id, user: req.user._id }, // Ensures only the owner can update
  { title, description, status, priority, dueDate },
  { new: true, runValidators: true }
);


    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Todo not found' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      todo: updated
    });
  } catch (error) {
    console.error('Update Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: messages 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Failed to update todo',
      error: error.message 
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    // const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    return res.status(200).json({ 
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to delete todo' 
    });
  }
};