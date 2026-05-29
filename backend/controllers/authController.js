import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// In-memory user database for Demo/Offline Mode
const mockUsers = [
  {
    _id: '60c72b2f9b1d8b23c4a242f1',
    name: 'Demo Admin',
    email: 'demo@dermascan.ai',
    passwordHash: '$2a$10$3Yd4.pX.dMv9WjI2cT4BdeFpQzG2p27f8V52n4uH26gUqgW.QjGWe', // 'password123'
    createdAt: new Date()
  }
];

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'super_secret_dermascan_jwt_key_2026_portfolio',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    if (global.isMockDB) {
      // Demo Offline mode logic
      const userExists = mockUsers.find(u => u.email === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: `mock_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        createdAt: new Date()
      };

      mockUsers.push(newUser);
      console.log(`[DEMO DB] Signed up user: ${email} (${name})`);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser)
      });
    }

    // Standard MongoDB flow
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('[AUTH] Signup error:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    if (global.isMockDB) {
      // Demo Offline mode logic
      const user = mockUsers.find(u => u.email === email.toLowerCase());
      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        console.log(`[DEMO DB] Logged in user: ${email}`);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user)
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Standard MongoDB flow
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    if (global.isMockDB) {
      return res.json(req.user);
    }
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('[AUTH] Get profile error:', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

export default { signupUser, loginUser, getUserProfile };
