// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   email: { 
//     type: String, 
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//   },
//   password: { 
//     type: String, 
//     required: true,
//     minlength: 6,
//     select: false
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false
//   }
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   try {
//     if (!this.password) {
//       throw new Error('User password not found');
//     }
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     console.error('Password comparison error:', error);
//     throw error;
//   }
// };

// // Create and export the model
// const User = mongoose.model('User', userSchema);
// export { User };

// // models/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   email: { 
//     type: String, 
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//   },
//   password: { 
//     type: String, 
//     required: true,
//     minlength: 6,
//     select: false
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false
//   },
//   todos: [{
//     title: {
//       type: String,
//       required: true
//     },
//     description: {
//       type: String
//     },
//     completed: {
//       type: Boolean,
//       default: false
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   try {
//     if (!this.password) {
//       throw new Error('User password not found');
//     }
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     console.error('Password comparison error:', error);
//     throw error;
//   }
// };

// const User = mongoose.model('User', userSchema);
// export { User };

// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Todo } from './Todo.js';  // Import the Todo model

const todoSubSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,  // Unique index here
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'https://i.imgur.com/JQW9z5O.png'
  },
  todos: [todoSubSchema],
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Removed duplicate index definition for email field
// userSchema.index({ email: 1 }, { unique: true }); // Not needed anymore

userSchema.index({ 'todos.status': 1 });
userSchema.index({ 'todos.priority': 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp for todos when modified
userSchema.pre('save', function(next) {
  if (this.isModified('todos')) {
    this.todos.forEach(todo => {
      if (todo.isModified()) {
        todo.updatedAt = new Date();
      }
    });
  }
  next();
});

// Virtual for incomplete todos count
userSchema.virtual('incompleteTodos').get(function() {
  return this.todos.filter(todo => !todo.completed).length;
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method for logging
userSchema.statics.logAction = function(userId, action, metadata = {}) {
  console.log('👤 User Action:', {
    timestamp: new Date().toISOString(),
    userId,
    action,
    ...metadata
  });
};

const User = mongoose.model('User', userSchema);

export { User };
