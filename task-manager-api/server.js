import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { requireJsonHeader } from './middleware/validator.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import { initializeEventListeners } from './listeners.js';
import { getCacheDiagnostics } from './cache.js';

// 1. Load Environment Variables (.env)
dotenv.config();

// 2. Initialize Practical 10 Asynchronous Event Listeners
initializeEventListeners();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManagerDB';

// 3. Core Middlewares (CORS configured for React dev server on 5173 / localhost)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// 4. Custom Pipeline Middlewares (Practicals 4 & 7)
app.use(requestLogger);
app.use(requireJsonHeader);

// 5. Database Connection (Practicals 5, 6, 7)
let isMongoConnected = false;

if (process.env.NODE_ENV !== 'test') {
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
}

// 6. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    server: 'Task Manager API',
    practicals: 'Practicals 4, 5, 6, 7, 9, 10, 11, 12, 13',
    database: isMongoConnected ? 'Connected (MongoDB)' : 'In-Memory Pipeline (Active)',
    timestamp: new Date().toISOString(),
  });
});

// 7. Practical 9: In-Memory Cache Stats & Metrics Endpoint
app.get('/api/cache-stats', (req, res) => {
  res.status(200).json(getCacheDiagnostics());
});

// 8. Mount Authentication Routes (/auth and /api/auth)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// 9. Mount Task Routes (/tasks and /api/tasks)
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// 10. Mount AI Assistant Routes (Practical 13)
app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// 11. 404 Handler for Undefined Endpoints
app.use(notFoundHandler);

// 12. Global Centralized Error Handling Middleware (must be registered last)
app.use(globalErrorHandler);

// 13. Start Server (guarded during test execution so Jest/Supertest can bind ports cleanly)
let serverInstance = null;
if (process.env.NODE_ENV !== 'test') {
  serverInstance = app.listen(PORT, () => {
    console.log(`[SERVER] Task Manager API running on http://localhost:${PORT}`);
  });
}

export { serverInstance };
export default app;
