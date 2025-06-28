// import jwt from 'jsonwebtoken';

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRETKEY); // <--- This line
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error('Token verification failed:', err.message);
//     res.status(400).json({ success: false, message: 'Invalid token..' });
//   }
// };

// export default verifyToken;
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication token is required' 
    });
  }

  const token = authHeader.split(' ')[1];

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
  console.log("🔑 Decoded Token:", decoded); // ✅ Add this
  req.user = { _id: decoded.id };
  next();
} catch (err) {
  console.error('Token verification failed:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Session expired. Please log in again.' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authentication token' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

export default verifyToken;