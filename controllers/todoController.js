import Todo from '../models/Todo.js';
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find()
      .populate('user', 'name email') // Include user details
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: todos.length,
      todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching todos'
    });
  }
};

// ✅ Create new todo
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newTodo = new Todo({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id  // ✅ use _id here
    });

    await newTodo.save();

    res.status(201).json({ success: true, message: 'Task created successfully', todo: newTodo });
  } catch (err) {
    console.error('Create Todo Error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating task' });
  }
};
// ✅ Get all todos
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Get Todos Error:', error);
    res.status(500).json({ message: 'Failed to get todos' });
  }
};

// ✅ Get single todo by ID
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo' });
  }
};

// Update the updateTodo function:
export const updateTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title is required' 
      });
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: title.trim(),
        description: description?.trim() || '',
        status,
        priority,
        dueDate
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Todo not found' 
      });
    }

    res.status(200).json({
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
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to update todo',
      error: error.message 
    });
  }
};

// ✅ Delete todo
export const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};




