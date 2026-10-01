import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { validateTaskId, validateTaskInput } from '../middleware/validator.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Seed initial tasks for fallback in-memory mode
export let inMemoryTasks = [
  {
    _id: '1',
    id: 1,
    title: 'Complete Practical 6 Full-Stack Integration',
    description: 'Wire React frontend with Node/Express/MongoDB with state synchronization & CORS',
    completed: true,
    priority: 'high',
    userEmail: '24dit021@charusat.edu.in',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    id: 2,
    title: 'Complete Practical 7 JWT Authentication Pipeline',
    description: 'Implement bcrypt password hashing, JWT token generation, auth middleware & server input validation',
    completed: true,
    priority: 'high',
    userEmail: '24dit021@charusat.edu.in',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    id: 3,
    title: 'Complete Practical 8 React Lazy Loading & Code Splitting',
    description: 'Optimize bundle size using React.lazy, Suspense fallback UI and measure network performance',
    completed: false,
    priority: 'medium',
    userEmail: '24dit021@charusat.edu.in',
    createdAt: new Date().toISOString(),
  },
];

/**
 * 1. GET /tasks
 * Retrieve all tasks (Supports optional user filtering or full list)
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    }
    // In-memory fallback
    res.status(200).json(inMemoryTasks);
  } catch (err) {
    next(err);
  }
});

/**
 * 2. GET /tasks/:id
 * Retrieve a single task by ID (with 404 handling and ID validation)
 */
router.get('/:id', validateTaskId, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: `Task with ID ${id} not found`,
        });
      }
      return res.status(200).json(task);
    }

    const task = inMemoryTasks.find((t) => String(t.id) === id || String(t._id) === id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`,
      });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

/**
 * 3. POST /tasks
 * Create a new task (validates input schema, attaches authenticated user if present)
 */
router.post('/', optionalAuth, validateTaskInput, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const userEmail = req.user ? req.user.email : req.body.userEmail || 'guest@example.com';
    const userId = req.user && mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : null;

    if (mongoose.connection.readyState === 1) {
      const newTask = new Task({
        title,
        description,
        completed: Boolean(completed),
        priority: priority || 'medium',
        user: userId,
        userEmail,
      });
      const savedTask = await newTask.save();
      return res.status(201).json(savedTask);
    }

    const newTask = {
      _id: String(Date.now()),
      id: inMemoryTasks.length > 0 ? Math.max(...inMemoryTasks.map((t) => Number(t.id) || 0)) + 1 : 1,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      userEmail,
      createdAt: new Date().toISOString(),
    };

    inMemoryTasks.unshift(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

/**
 * 4. PUT /tasks/:id
 * Update an existing task by ID (validates ID and input payload)
 */
router.put('/:id', validateTaskId, validateTaskInput, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          error: `Task with ID ${id} not found`,
        });
      }
      return res.status(200).json(updatedTask);
    }

    const idx = inMemoryTasks.findIndex((t) => String(t.id) === id || String(t._id) === id);
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`,
      });
    }

    inMemoryTasks[idx] = {
      ...inMemoryTasks[idx],
      ...req.body,
      title: req.body.title !== undefined ? req.body.title.trim() : inMemoryTasks[idx].title,
      description: req.body.description !== undefined ? req.body.description.trim() : inMemoryTasks[idx].description,
    };

    res.status(200).json(inMemoryTasks[idx]);
  } catch (err) {
    next(err);
  }
});

/**
 * 5. DELETE /tasks/:id
 * Delete a task by ID
 */
router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          error: `Task with ID ${id} not found`,
        });
      }
      return res.status(200).json({
        success: true,
        message: `Task ${id} deleted successfully`,
        task: deletedTask,
      });
    }

    const idx = inMemoryTasks.findIndex((t) => String(t.id) === id || String(t._id) === id);
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`,
      });
    }

    const deleted = inMemoryTasks.splice(idx, 1)[0];
    res.status(200).json({
      success: true,
      message: `Task ${id} deleted successfully`,
      task: deleted,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
