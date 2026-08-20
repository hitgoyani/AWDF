# Task Manager REST API — Practicals 4 & 5

**Student Name**: Hit Goyani  
**ID / Roll No**: 24DIT021  
**Course**: Advanced Web Development Frameworks (ITUE301)  
**Semester**: 5th Semester B.Tech Information Technology  
**University**: CHARUSAT  

---

## 📌 Architecture & Request Pipeline

```text
Client Request (Postman / Browser / cURL)
  │
  ▼
[Request Logger Middleware (middleware/logger.js)]
  │  Logs method, URL, and timestamp
  ▼
[Header Validator Middleware (middleware/validator.js)]
  │  Ensures Content-Type: application/json on POST/PUT
  ▼
Express Router (routes/taskRoutes.js)
  ├── GET    /tasks       ──► Retrieve all tasks (200 OK)
  ├── GET    /tasks/:id   ──► Retrieve task by ID (200 OK / 404 Not Found)
  ├── POST   /tasks       ──► Create new task (201 Created / 400 Bad Request)
  ├── PUT    /tasks/:id   ──► Update task (200 OK / 404 Not Found)
  └── DELETE /tasks/:id   ──► Delete task (200 OK / 404 Not Found)
  │
  ▼
Mongoose ODM & MongoDB Database (models/Task.js)
  ├── Schema Validation (title required, priority enum 'low'|'medium'|'high')
  └── Pre-save Hook (auto-trims whitespace from title)
  │
  ▼
[Centralized Global Error Handler (middleware/errorHandler.js)]
  ├── Mongoose ValidationError ──► 400 Bad Request with details array
  ├── Mongoose CastError       ──► 400 Bad Request
  └── Internal Server Error    ──► 500 without leaking stack traces
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd task-manager-api
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskManagerDB
```

### 3. Run the Server
```bash
# Development mode with hot-reloading:
npm run dev

# Or standard production start:
npm start
```
Server runs on **`http://localhost:5000`**.

### 4. Run Automated Tests
```bash
# With the server running, execute:
npm test
```

---

## 🧪 Sample cURL Commands

### 1. Create a Task (POST)
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Study Mongoose Schema Design", "description": "Complete lab assignment", "priority": "high"}'
```

### 2. Retrieve All Tasks (GET)
```bash
curl http://localhost:5000/tasks
```

### 3. Test Validation Error (Missing Title)
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "No title provided"}'
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation Error",
  "details": ["Task title is required and cannot be empty"]
}
```

### 4. Test Missing Header (400 Bad Request)
```bash
curl -X POST http://localhost:5000/tasks \
  -d '{"title": "No header"}'
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Bad Request: Content-Type header must be application/json"
}
```

---

## 🗣️ Key Viva Questions & Answers

**Q1: Why must the error handling middleware be defined last in the pipeline?**  
*Answer*: Express registers and checks middleware sequentially. An error handler takes 4 parameters `(err, req, res, next)` and is only triggered when preceding routes or middleware invoke `next(err)`. If placed before routes, downstream route errors will bypass it.

**Q2: What is the purpose of Mongoose schema validation in a NoSQL database?**  
*Answer*: While MongoDB itself is schema-less, application-level Mongoose schemas enforce data integrity, required fields, default values, and enum constraints before write queries reach the database.
