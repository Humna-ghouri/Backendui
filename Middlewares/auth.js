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
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please log in again.' 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

export default verifyToken;