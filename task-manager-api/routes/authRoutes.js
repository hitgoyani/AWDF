import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validator.js';

const router = express.Router();

// Fallback in-memory users for offline/local demonstration
export let inMemoryUsers = [];

// Seed an initial demo student user in memory
const seedInitialUser = async () => {
  const hashedPassword = await bcrypt.hash('student123', 10);
  inMemoryUsers = [
    {
      _id: 'user_1',
      name: 'Hit Goyani',
      email: '24dit021@charusat.edu.in',
      password: hashedPassword,
      role: 'student',
      createdAt: new Date().toISOString(),
    },
  ];
};
seedInitialUser();

// Helper to generate JWT token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_practical_7_24dit021';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'student',
    },
    secret,
    { expiresIn }
  );
};

/**
 * 1. POST /auth/register
 * Registers a new user with bcrypt password hashing
 */
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Conflict Error',
          message: `User with email "${normalizedEmail}" is already registered.`,
        });
      }

      // Password hashing happens automatically in User pre-save hook
      const newUser = new User({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role || 'student',
      });

      const savedUser = await newUser.save();
      const token = generateToken(savedUser);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          createdAt: savedUser.createdAt,
        },
      });
    }

    // In-memory fallback
    const existsInMemory = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (existsInMemory) {
      return res.status(409).json({
        success: false,
        error: 'Conflict Error',
        message: `User with email "${normalizedEmail}" is already registered.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const inMemoryUser = {
      _id: `user_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'student',
      createdAt: new Date().toISOString(),
    };

    inMemoryUsers.push(inMemoryUser);
    const token = generateToken(inMemoryUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully (In-Memory Fallback)',
      token,
      user: {
        id: inMemoryUser._id,
        name: inMemoryUser.name,
        email: inMemoryUser.email,
        role: inMemoryUser.role,
        createdAt: inMemoryUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 2. POST /auth/login
 * Verifies credentials using bcrypt and returns JWT token
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication Error',
          message: 'Invalid email or password',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Authentication Error',
          message: 'Invalid email or password',
        });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    // In-memory fallback
    const inMemoryUser = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (!inMemoryUser) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, inMemoryUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(inMemoryUser);
    res.status(200).json({
      success: true,
      message: 'Login successful (In-Memory Fallback)',
      token,
      user: {
        id: inMemoryUser._id,
        name: inMemoryUser.name,
        email: inMemoryUser.email,
        role: inMemoryUser.role,
        createdAt: inMemoryUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 3. GET /auth/me (Practical 7 Supplementary Problem)
 * Protected route returning current logged-in user details
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.user.id)) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    // Return decoded token info or in-memory user
    const inMemoryUser = inMemoryUsers.find((u) => u._id === req.user.id || u.email === req.user.email);
    if (inMemoryUser) {
      const { password, ...safeUser } = inMemoryUser;
      return res.status(200).json({
        success: true,
        user: safeUser,
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
