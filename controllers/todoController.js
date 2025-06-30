import Todo from '../models/Todo.js';

// ✅ Public Todos - anyone can access
// ✅ Fetch all todos (remove isPublic condition)
// ✅ sabhi todos fetch karega
export const getPublicTodos = async (req, res) => {
  try {
    const allTodos = await Todo.find();
    console.log("✅ Todos Fetched:", allTodos); // 👈 add this
    res.json({ success: true, data: allTodos });
  } catch (err) {
    console.log("❌ Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Create new todo
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newTodo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      priority,
      dueDate,
      user: req.user._id
    });

    const savedTodo = await newTodo.save();

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: savedTodo
    });
  } catch (err) {
    console.error('❌ Create Todo Error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating todo' });
  }
};

// Get all todos for the logged-in user
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error('❌ Get Todos Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get todos' });
  }
};

// Get single todo by ID
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.status(200).json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching todo' });
  }
};

// Update todo
export const updateTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: title?.trim(),
        description: description?.trim(),
        status,
        priority,
        dueDate
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, message: 'Todo updated successfully', todo: updatedTodo });
  } catch (error) {
    console.error('❌ Update Todo Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update todo' });
  }
};

// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Todo Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete todo' });
  }
};