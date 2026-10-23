import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { validateTaskId, validateTaskInput } from '../middleware/validator.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { getFromCache, setToCache, invalidateTaskCache, getCacheDiagnostics } from '../cache.js';
import taskEvents from '../events.js';

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
 * Practical 9: GET /tasks/cache/stats
 * Expose in-memory cache hit/miss statistics and diagnostic metrics
 */
router.get('/cache/stats', (req, res) => {
  res.status(200).json(getCacheDiagnostics());
});

/**
 * 1. GET /tasks
 * Retrieve all tasks with in-memory caching (TTL: 60s) for Practical 9
 */
router.get('/', optionalAuth, async (req, res, next) => {
  const startTime = Date.now();
  try {
    const cacheKey = 'all_tasks';
    const cachedTasks = getFromCache(cacheKey);

    if (cachedTasks) {
      const responseTime = Date.now() - startTime;
      res.setHeader('X-Cache-Status', 'HIT');
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      return res.status(200).json(cachedTasks);
    }

    let tasks;
    if (mongoose.connection.readyState === 1) {
      tasks = await Task.find().sort({ createdAt: -1 });
    } else {
      tasks = [...inMemoryTasks];
    }

    // Cache the tasks array with 60s TTL
    setToCache(cacheKey, tasks, 60);

    const responseTime = Date.now() - startTime;
    res.setHeader('X-Cache-Status', 'MISS');
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

/**
 * 2. GET /tasks/:id
 * Retrieve a single task by ID with individual key caching for Practical 9
 */
router.get('/:id', validateTaskId, async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { id } = req.params;
    const cacheKey = `task_${id}`;
    const cachedTask = getFromCache(cacheKey);

    if (cachedTask) {
      res.setHeader('X-Cache-Status', 'HIT');
      res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
      return res.status(200).json(cachedTask);
    }

    let foundTask = null;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      foundTask = await Task.findById(id);
    } else {
      foundTask = inMemoryTasks.find((t) => String(t.id) === id || String(t._id) === id);
    }

    if (!foundTask) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`,
      });
    }

    setToCache(cacheKey, foundTask, 60);
    res.setHeader('X-Cache-Status', 'MISS');
    res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
    return res.status(200).json(foundTask);
  } catch (err) {
    next(err);
  }
});

/**
 * 3. POST /tasks
 * Create a new task
 * - Invalidates cache (Practical 9)
 * - Emits 'task-created' event asynchronously AFTER response is returned (Practical 10)
 */
router.post('/', optionalAuth, validateTaskInput, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const userEmail = req.user ? req.user.email : req.body.userEmail || 'guest@example.com';
    const userId = req.user && mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : null;

    let createdTask;
    if (mongoose.connection.readyState === 1) {
      const newTask = new Task({
        title,
        description,
        completed: Boolean(completed),
        priority: priority || 'medium',
        user: userId,
        userEmail,
      });
      createdTask = await newTask.save();
    } else {
      createdTask = {
        _id: String(Date.now()),
        id: inMemoryTasks.length > 0 ? Math.max(...inMemoryTasks.map((t) => Number(t.id) || 0)) + 1 : 1,
        title: title.trim(),
        description: description ? description.trim() : '',
        completed: Boolean(completed),
        priority: priority || 'medium',
        userEmail,
        createdAt: new Date().toISOString(),
      };
      inMemoryTasks.unshift(createdTask);
    }

    // Practical 9: Invalidate cache immediately on write operation
    invalidateTaskCache();

    // Practical 10: Deliver API response first (immediate non-blocking cycle)
    const apiResponseTimestamp = new Date().toISOString();
    console.log(`[API RESPONSE SENT] POST /tasks -> Status 201 at ${apiResponseTimestamp}`);
    res.status(201).json(createdTask);

    // Practical 10: Emit event to background listeners AFTER response is already sent
    taskEvents.emit('task-created', createdTask);
  } catch (err) {
    next(err);
  }
});

/**
 * 4. PUT /tasks/:id
 * Update an existing task by ID
 * - Invalidates cache (Practical 9)
 */
router.put('/:id', validateTaskId, validateTaskInput, async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedTask = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      updatedTask = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      const idx = inMemoryTasks.findIndex((t) => String(t.id) === id || String(t._id) === id);
      if (idx !== -1) {
        inMemoryTasks[idx] = {
          ...inMemoryTasks[idx],
          ...req.body,
          title: req.body.title !== undefined ? req.body.title.trim() : inMemoryTasks[idx].title,
          description: req.body.description !== undefined ? req.body.description.trim() : inMemoryTasks[idx].description,
        };
        updatedTask = inMemoryTasks[idx];
      }
    }

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`,
      });
    }

    // Practical 9: Invalidate cache on update
    invalidateTaskCache(id);

    return res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

/**
 * 5. DELETE /tasks/:id
 * Delete a task by ID
 * - Invalidates cache (Practical 9)
 * - Emits 'task-deleted' event (Practical 10)
 */
router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const { id } = req.params;
    let deletedTask = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      deletedTask = await Task.findByIdAndDelete(id);
    } else {
      const idx = inMemoryTasks.findIndex((t) => String(t.id) === id || String(t._id) === id);
      if (idx !== -1) {
        deletedTask = inMemoryTasks.splice(idx, 1)[0];
      }
    }

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`,
      });
    }

    // Practical 9: Invalidate cache on delete
    invalidateTaskCache(id);

    // Deliver response immediately
    res.status(200).json({
      success: true,
      message: `Task ${id} deleted successfully`,
      task: deletedTask,
    });

    // Practical 10: Emit event to background listener
    taskEvents.emit('task-deleted', deletedTask);
  } catch (err) {
    next(err);
  }
});

export default router;
