import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendWelcomeEmail } from '../utils/emailSender.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email and password' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered. Please use a different email.' 
      });
    }

    // Create new user
    const user = new User({ 
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });
    
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: '7d',
    });

    // Send welcome email (async - don't wait for it to complete)
    sendWelcomeEmail(user.name, user.email)
      .catch(err => console.error('Welcome email error:', err));

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome email sent.',
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin 
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message 
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: '7d',
    });

    // Remove password before sending response
    user.password = undefined;

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin 
      },
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message 
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user data',
      error: error.message 
    });
  }
};