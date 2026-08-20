# Task Manager API (Practicals 4 & 5)

**Student Name**: Hit Goyani  
**ID / Roll No**: 24DIT021  
**Course**: Advanced Web Development Frameworks (ITUE301)  
**Semester**: 5th Semester  
**University**: CHARUSAT  

---

## 📌 About this Project

This backend server is built using Node.js, Express, and MongoDB for Practicals 4 and 5:

- **Practical 4: Building a RESTful API with Node.js and Express**
  - Custom logging middleware logging method, URL, and timestamp.
  - Content-Type header validation middleware for POST and PUT requests.
  - In-memory CRUD endpoints (`GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`).
  - 404 handler for undefined routes and centralized global error handling middleware.

- **Practical 5: MongoDB Integration and Schema Design with Mongoose**
  - Connected MongoDB database using Mongoose ODM with connection string in `.env`.
  - Defined Task schema with required fields, defaults, and priority enum (`low`, `medium`, `high`).
  - Added pre-save hook to trim whitespace from the task title.
  - Handled Mongoose validation errors returning structured JSON.

---

## 🚀 How to Run

1. Navigate to the backend directory:
   ```bash
   cd task-manager-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start server:
   ```bash
   npm run dev
   ```

4. Server runs on [http://localhost:5000](http://localhost:5000).

---

## 📋 Endpoints

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `POST /tasks` - Create a new task (JSON body: `{ "title": "...", "description": "...", "priority": "medium" }`)
- `PUT /tasks/:id` - Update an existing task
- `DELETE /tasks/:id` - Delete a task by ID
