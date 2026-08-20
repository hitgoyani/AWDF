import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Task from './models/Task.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManagerDB';

app.use(cors());
app.use(express.json());

// Practical 4: Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Practical 4: Content-Type validation middleware
const checkJsonHeader = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Content-Type header must be application/json',
      });
    }
  }
  next();
};

app.use(checkJsonHeader);

// In-Memory Task Storage (Practical 4 Fallback)
let tasks = [
  {
    id: 1,
    title: 'Complete Practical 4 Express API',
    description: 'Implement middleware pipeline and CRUD routes',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Complete Practical 5 MongoDB Mongoose Schema',
    description: 'Define schema validation with priority enums',
    completed: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
];

let isMongoConnected = false;

// Connect to MongoDB using Mongoose (Practical 5)
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => {
    isMongoConnected = true;
    console.log(`MongoDB connected to ${MONGO_URI}`);
  })
  .catch((err) => {
    isMongoConnected = false;
    console.log(`MongoDB connection note: ${err.message}. Using in-memory array.`);
  });

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'Task Manager API',
    mongoConnected: isMongoConnected,
  });
});

// GET /tasks - Retrieve all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const dbTasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json(dbTasks);
    }
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id - Retrieve single task by ID
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
      }
      return res.status(200).json(task);
    }

    const task = tasks.find((t) => String(t.id) === id || String(t._id) === id);
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: 'Task title is required',
      });
    }

    if (isMongoConnected) {
      const newTask = new Task({ title, description, completed, priority });
      const savedTask = await newTask.save();
      return res.status(201).json(savedTask);
    }

    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map((t) => Number(t.id) || 0)) + 1 : 1,
      title: title.trim(),
      description: description || '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id - Update task by ID
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
      }
      return res.status(200).json(updated);
    }

    const idx = tasks.findIndex((t) => String(t.id) === id || String(t._id) === id);
    if (idx === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }

    tasks[idx] = {
      ...tasks[idx],
      ...req.body,
      title: req.body.title ? req.body.title.trim() : tasks[idx].title,
    };
    res.status(200).json(tasks[idx]);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - Delete task by ID
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
      }
      return res.status(200).json({ message: `Task ${id} deleted successfully`, task: deleted });
    }

    const idx = tasks.findIndex((t) => String(t.id) === id || String(t._id) === id);
    if (idx === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }

    const removed = tasks.splice(idx, 1)[0];
    res.status(200).json({ message: `Task ${id} deleted successfully`, task: removed });
  } catch (err) {
    next(err);
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling middleware (last in chain)
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: messages,
    });
  }

  res.status(500).json({
    error: 'Something went wrong on the server',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
