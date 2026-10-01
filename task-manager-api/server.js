import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { requireJsonHeader } from './middleware/validator.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

// 1. Load Environment Variables (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManagerDB';

// 2. Core Middlewares (CORS configured for React dev server on 5173 / localhost)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// 3. Custom Pipeline Middlewares (Practicals 4 & 7)
app.use(requestLogger);
app.use(requireJsonHeader);

// 4. Database Connection (Practicals 5, 6, 7)
let isMongoConnected = false;

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => {
    isMongoConnected = true;
    console.log(`[DATABASE] Connected to MongoDB at ${MONGO_URI}`);
  })
  .catch((err) => {
    isMongoConnected = false;
    console.log(`[DATABASE NOTE] Running in In-Memory fallback mode (${err.message})`);
  });

// 5. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    server: 'Task Manager API',
    practicals: 'Practicals 4, 5, 6, 7',
    database: isMongoConnected ? 'Connected (MongoDB)' : 'In-Memory Pipeline (Fallback)',
    timestamp: new Date().toISOString(),
  });
});

// 6. Mount Authentication Routes (/auth and /api/auth for flexibility)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// 7. Mount Task Routes (/tasks and /api/tasks)
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// 8. 404 Handler for Undefined Endpoints
app.use(notFoundHandler);

// 9. Global Centralized Error Handling Middleware (must be registered last)
app.use(globalErrorHandler);

// 10. Start Server
app.listen(PORT, () => {
  console.log(`[SERVER] Task Manager API running on http://localhost:${PORT}`);
});

export default app;
