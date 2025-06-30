 import mongoose from 'mongoose';

// // const todSchema = new mongoose.Schema({
// //   title: { type: String, required: true, trim: true },
// //   description: String,
// //   priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
// //   dueDate: Date,
// //   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// //   createdAt: { type: Date, default: Date.now }
// // });

// const todSchema = new mongoose.Schema({
//   title: { type: String, required: true, trim: true },
//   description: String,
//   priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
//   dueDate: Date,
//   user: mongoose.Schema.Types.Mixed, // 👈 temporarily mixed type
//   createdAt: { type: Date, default: Date.now }
// });

// const Todo = mongoose.model('Todo', todSchema);
// export default Todo;

// models/Todo.js

const todSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todSchema);
export default Todo;