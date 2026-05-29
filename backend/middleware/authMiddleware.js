import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_dermascan_jwt_key_2026_portfolio');

      if (global.isMockDB) {
        // Mock DB is active, inject a simulated user object
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Demo User',
          email: decoded.email || 'demo@dermascan.ai'
        };
        return next();
      }

      // Standard MongoDB flow
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found, authorization failed.' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('[AUTH] Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export default protect;
