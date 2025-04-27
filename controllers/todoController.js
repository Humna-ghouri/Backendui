import { User } from '../models/User.js';

// Enhanced logging helper
const logTodoAction = (action, userId, todoId = null, additionalData = {}) => {
  console.log('📝 Todo Action:', {
    timestamp: new Date().toISOString(),
    action,
    userId,
    todoId,
    ...additionalData
  });
};

export const getTodos = async (req, res) => {
  try {
    const startTime = Date.now();
    const user = await User.findById(req.user._id).lean();
    
    if (!user) {
      logTodoAction('get_todos_failed', req.user._id, null, { error: 'User not found' });
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    logTodoAction('get_todos_success', req.user._id, null, {
      count: user.todos.length,
      duration: Date.now() - startTime
    });
    
    res.json({
      success: true,
      count: user.todos.length,
      todos: user.todos
    });
  } catch (error) {
    logTodoAction('get_todos_error', req.user._id, null, { error: error.message });
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch todos',
      error: error.message 
    });
  }
};

export const addTodo = async (req, res) => {
  try {
    const startTime = Date.now();
    const { title, description } = req.body;
    
    if (!title) {
      logTodoAction('add_todo_validation_failed', req.user._id, null, { error: 'Title is required' });
      return res.status(400).json({ 
        success: false,
        message: 'Title is required' 
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      logTodoAction('add_todo_user_not_found', req.user._id, null, { error: 'User not found' });
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const newTodo = { 
      title, 
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    };

    user.todos.push(newTodo);
    await user.save();

    const addedTodo = user.todos[user.todos.length - 1];
    
    logTodoAction('add_todo_success', req.user._id, addedTodo._id, {
      title,
      duration: Date.now() - startTime
    });

    res.status(201).json({
      success: true,
      message: 'Todo added successfully',
      todo: addedTodo
    });
  } catch (error) {
    logTodoAction('add_todo_error', req.user._id, null, { error: error.message });
    res.status(500).json({ 
      success: false,
      message: 'Failed to add todo',
      error: error.message 
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const startTime = Date.now();
    const { id } = req.params;
    const { title, description, completed, status } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      logTodoAction('update_todo_user_not_found', req.user._id, id, { error: 'User not found' });
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const todo = user.todos.id(id);
    if (!todo) {
      logTodoAction('update_todo_not_found', req.user._id, id, { error: 'Todo not found' });
      return res.status(404).json({ 
        success: false,
        message: 'Todo not found' 
      });
    }

    const updateData = {
      title: title !== undefined ? title : todo.title,
      description: description !== undefined ? description : todo.description,
      completed: completed !== undefined ? completed : todo.completed,
      status: status !== undefined ? status : todo.status,
      updatedAt: new Date()
    };

    todo.set(updateData);
    await user.save();

    logTodoAction('update_todo_success', req.user._id, id, {
      changes: updateData,
      duration: Date.now() - startTime
    });

    res.json({
      success: true,
      message: 'Todo updated successfully',
      todo
    });
  } catch (error) {
    logTodoAction('update_todo_error', req.user._id, req.params.id, { error: error.message });
    res.status(500).json({ 
      success: false,
      message: 'Failed to update todo',
      error: error.message 
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const startTime = Date.now();
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      logTodoAction('delete_todo_user_not_found', req.user._id, id, { error: 'User not found' });
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Find the index of the todo to remove
    const todoIndex = user.todos.findIndex(todo => todo._id.toString() === id);
    
    if (todoIndex === -1) {
      logTodoAction('delete_todo_not_found', req.user._id, id, { error: 'Todo not found' });
      return res.status(404).json({ 
        success: false,
        message: 'Todo not found' 
      });
    }

    // Remove the todo from the array using splice
    user.todos.splice(todoIndex, 1);
    await user.save();

    logTodoAction('delete_todo_success', req.user._id, id, {
      duration: Date.now() - startTime
    });

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    logTodoAction('delete_todo_error', req.user._id, req.params.id, { error: error.message });
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete todo',
      error: error.message 
    });
  }
};