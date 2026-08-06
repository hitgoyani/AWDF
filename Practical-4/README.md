# Practical 4: Building a RESTful API with Node.js and Express

**Course**: AWDF (Advanced Web Development Framework)  
**Student Name**: Hit Goyani  
**ID / Roll No**: 24DIT021  
**Tech Stack**: Node.js (v18+), Express 5, CORS  

---

## 📌 Objective
To design and implement a RESTful backend server with complete CRUD endpoints using an Express middleware pipeline, global request logging, header validation, custom 404 handler, and centralized error handling.

---

## 🛠️ Express Middleware Pipeline Architecture
```text
Client (Postman / Thunder Client)
          │
          ▼
┌───────────────────────────────────┐
│ 1. express.json()                 │ Body Parser
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 2. Request Logger                 │ Logs Method, URL & Timestamp
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 3. Content-Type Validator         │ Enforces application/json on POST/PUT
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 4. Express Router (/tasks)        │ CRUD Handlers
│    ├── GET    /tasks              │ (200 OK)
│    ├── GET    /tasks/:id          │ (200 / 404)
│    ├── POST   /tasks              │ (201 Created)
│    ├── PUT    /tasks/:id          │ (200 / 404)
│    └── DELETE /tasks/:id          │ (200 / 404)
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 5. 404 Route Handler              │ Catches undefined endpoints
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│ 6. Global Error Handler           │ Catches uncaught server errors (500)
└───────────────────────────────────┘
```

---

## 📡 API Endpoints & Status Codes

| Method | Endpoint | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Retrieve all tasks | `200 OK` |
| **GET** | `/tasks/:id` | Retrieve task by ID | `200 OK` / `404 Not Found` |
| **POST** | `/tasks` | Create a new task | `201 Created` / `400 Bad Request` |
| **PUT** | `/tasks/:id` | Update an existing task | `200 OK` / `404 Not Found` |
| **DELETE**| `/tasks/:id` | Delete task by ID | `200 OK` / `404 Not Found` |

---

## 💡 Key Analysis & Reflection Questions

1. **Why must the error handling middleware be defined last in the middleware chain?**  
   Express identifies error handlers by their **4-parameter signature** `(err, req, res, next)`. When an error is passed via `next(err)`, Express looks downstream. If the error handler is placed before routes, it will never intercept errors thrown in route handlers.

2. **What is the difference between `app.use()` and route-specific middleware?**  
   `app.use()` executes globally for all incoming requests (or specified path prefix), while route-specific middleware runs only on a specific HTTP method and path definition.

3. **Why is it considered bad practice to send raw error stack traces to the client?**  
   Stack traces expose sensitive internal details (file paths, database schemes, runtime dependencies) which malicious actors could leverage to exploit vulnerabilities.

---

## 🚀 How to Run
```bash
npm install
npm run dev
```

Server runs on: `http://localhost:5000`
