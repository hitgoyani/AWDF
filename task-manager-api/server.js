import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { requireJsonHeader } from './middleware/validator.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

// 1. Load Environment Variables (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManagerDB';

// 2. Core Middlewares
app.use(cors());
app.use(express.json());

// 3. Custom Pipeline Middlewares (Practical 4)
app.use(requestLogger);
app.use(requireJsonHeader);

// 4. Database Connection (Practical 5)
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
    practicals: 'Practicals 4 & 5',
    database: isMongoConnected ? 'Connected (MongoDB)' : 'In-Memory Pipeline (Fallback)',
    timestamp: new Date().toISOString(),
  });
});

// 6. Mount Task Routes (/tasks)
app.use('/tasks', taskRoutes);

// 7. 404 Handler for Undefined Endpoints
app.use(notFoundHandler);

// 8. Global Centralized Error Handling Middleware (must be registered last)
app.use(globalErrorHandler);

// 9. Start Server
app.listen(PORT, () => {
  console.log(`[SERVER] Task Manager API running on http://localhost:${PORT}`);
});
