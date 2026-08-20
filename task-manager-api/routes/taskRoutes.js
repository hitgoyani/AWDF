import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { validateTaskId } from '../middleware/validator.js';

const router = express.Router();

// Temporary in-memory storage for Practical 4 (used as seamless fallback if MongoDB is not connected)
export let inMemoryTasks = [
  {
    _id: '1',
    id: 1,
    title: 'Complete Practical 4 Express API Pipeline',
    description: 'Implement request logger, Content-Type validator, and CRUD routes',
    completed: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    id: 2,
    title: 'Complete Practical 5 MongoDB Mongoose Schema',
    description: 'Design validated schema with priority enums and pre-save trim hooks',
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
];

/**
 * 1. GET /tasks
 * Retrieve all tasks
 */
router.get('/', async (req, res, next) => {
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
 * Retrieve a single task by ID (with 404 handling)
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
 * Create a new task (validates schema)
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    if (mongoose.connection.readyState === 1) {
      const newTask = new Task({
        title,
        description,
        completed,
        priority,
      });
      const savedTask = await newTask.save();
      return res.status(201).json(savedTask);
    }

    // In-memory fallback validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: ['Task title is required and cannot be empty'],
      });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: [`${priority} is not a valid priority. Allowed values: low, medium, high`],
      });
    }

    const newTask = {
      _id: String(Date.now()),
      id: inMemoryTasks.length > 0 ? Math.max(...inMemoryTasks.map((t) => Number(t.id) || 0)) + 1 : 1,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
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
 * Update an existing task by ID
 */
router.put('/:id', validateTaskId, async (req, res, next) => {
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
