// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) throw new Error('User not found');

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Token verification failed:', err.message);
//     return res.status(401).json({ success: false, message: 'Invalid token.' });
//   }
// };

// export default verifyToken;

import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY); // <--- This line
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(400).json({ success: false, message: 'Invalid token..' });
  }
};

export default verifyToken;