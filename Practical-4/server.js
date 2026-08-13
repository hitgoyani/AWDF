import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

const requireJsonHeader = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Bad Request: Content-Type header must be application/json'
      });
    }
  }
  next();
};

app.use(requireJsonHeader);

const validateTaskId = (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Bad Request: Task ID must be a valid integer number' });
  }
  req.parsedTaskId = taskId;
  next();
};

let tasks = [
  { id: 1, title: 'Complete Practical 4 Express API', completed: false },
  { id: 2, title: 'Review Middleware Pipeline Concepts', completed: true },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Task Manager API is running.' });
});

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', validateTaskId, (req, res) => {
  const taskId = req.parsedTaskId;
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }
  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const { title, completed } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required and must be a valid string' });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    title: title.trim(),
    completed: Boolean(completed),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', validateTaskId, (req, res) => {
  const taskId = req.parsedTaskId;
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }

  const { title, completed } = req.body;
  if (title !== undefined) {
    tasks[taskIndex].title = title.trim();
  }
  if (completed !== undefined) {
    tasks[taskIndex].completed = Boolean(completed);
  }

  res.status(200).json(tasks[taskIndex]);
});

app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const taskId = req.parsedTaskId;
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({
    message: `Task ${taskId} deleted successfully`,
    task: deletedTask
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: '404 Not Found: The requested endpoint does not exist'
  });
});

app.use((err, req, res, next) => {
  console.error('[ERROR HANDLER]:', err.stack || err.message);
  res.status(500).json({
    error: '500 Internal Server Error: Something went wrong on the server'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
