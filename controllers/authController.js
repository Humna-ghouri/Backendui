import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../utils/emailSender.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email and password' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const user = new User({ 
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });
    
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: '7d',
    });

    sendWelcomeEmail(user.name, user.email)
      .catch(err => console.error('Welcome email error:', err));

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
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
    return res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: error.message 
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: '7d',
    });

    user.password = undefined;

    return res.json({
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
    return res.status(500).json({ 
      success: false,
      message: 'Login failed',
      error: error.message 
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = req.user; // assuming middleware set this
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};
