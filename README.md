# Advanced Web Development Frameworks (ITUE301) — Comprehensive Lab Portfolio

[![CI Pipeline](https://github.com/hitgoyani/AWDF/actions/workflows/ci.yml/badge.svg)](https://github.com/hitgoyani/AWDF/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v24-green)
![React](https://img.shields.io/badge/React-19-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)

**Student Name**: Hit Goyani  
**ID / Roll No**: 24DIT021  
**Semester**: 5th Semester B.Tech (IT/CE/CSE/AIML)  
**Subject Code**: ITUE301 (Advanced Web Development Frameworks)  
**University**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)  
**Institute**: Chandubhai S. Patel Institute of Technology (CSPIT) / DEPSTAR  

---

## 📑 Complete Curriculum Practical Matrix (Practicals 1 to 13)

| Practical # | Title | Core Technologies | Status |
| :---: | :--- | :--- | :---: |
| **Practical 1** | Introduction to React & Component Architecture | React 19, Vite, JSX, Functional Components, Props | ✅ Verified |
| **Practical 2** | State Management & Multi-Page Routing in React | React Router v6, `useState`, Controlled Forms, Theme Toggle | ✅ Verified |
| **Practical 3** | REST API Integration & Data Rendering in React | Fetch API, `useEffect`, Async/Await, Loading Spinner, Error Retry | ✅ Verified |
| **Practical 4** | Building a RESTful API with Node.js and Express | Express.js, Custom Middleware Pipeline, HTTP Status Codes | ✅ Verified |
| **Practical 5** | MongoDB Integration & Schema Design with Mongoose | MongoDB, Mongoose ODM, Schema Validation, Pre-Save Hooks | ✅ Verified |
| **Practical 6** | Full Stack Integration (React + Node + MongoDB) | CORS, Centralized API Client, State Sync, Optimistic UI, Toasts | ✅ Verified |
| **Practical 7** | Authentication & Middleware Pipeline | Bcrypt Hashing, JWT Bearer Tokens, Auth Guards, `/auth/me` | ✅ Verified |
| **Practical 8** | Performance Optimization & Lazy Loading in React | `React.lazy()`, `Suspense`, Route Code Splitting, Bundle Profiling | ✅ Verified |
| **Practical 9** | In-Memory Caching & Query Optimization | `node-cache`, TTL Invalidation, Cache Diagnostics, Benchmark | ✅ Verified |
| **Practical 10**| Asynchronous Processing with Event-Driven Architecture | Node.js `EventEmitter`, Decoupled Background Listeners, Logs | ✅ Verified |
| **Practical 11**| Containerization with Docker & Docker Compose | Multi-Stage Dockerfiles, `docker-compose.yml`, Named Volumes | ✅ Verified |
| **Practical 12**| CI/CD Pipeline with GitHub Actions | Jest, Supertest, Automated Testing, `.github/workflows/ci.yml` | ✅ Verified |
| **Practical 13**| AI API Integration into a Web Application | Google Gemini 2.5 Flash API, Graceful Degradation, Rate Limiting | ✅ Verified |

---

## 📂 Unified Repository Structure

```
AWDF/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Practical 12: GitHub Actions Automated CI/CD Pipeline
├── docker-compose.yml             # Practical 11: Multi-Container Stack (Frontend + Backend + MongoDB)
├── README.md                      # Comprehensive Lab Report & Viva Guide
│
├── portfolio/                     # React 19 + Vite Frontend (Practicals 1, 2, 3, 6, 7, 8, 9, 13)
│   ├── Dockerfile                 # Practical 11: Multi-stage production container build
│   ├── .dockerignore
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js             # Central API client (CRUD, JWT injection, Cache & AI endpoints)
│   │   ├── components/
│   │   │   ├── Header.jsx          # Header with student props (P1)
│   │   │   ├── NavBar.jsx          # Router navigation bar (P2)
│   │   │   ├── About.jsx           # Student profile & background (P1)
│   │   │   ├── Skills.jsx          # Dynamic skills badge renderer (P1)
│   │   │   ├── Footer.jsx          # Footer & contact copyright (P1)
│   │   │   ├── Spinner.jsx         # Loading state animation (P3)
│   │   │   ├── ErrorMessage.jsx    # Retryable error boundary alert (P3)
│   │   │   ├── ConfirmModal.jsx    # Delete confirmation dialog (P6 Supplementary)
│   │   │   ├── LazyFallback.jsx    # Glowing skeleton suspense fallback (P8)
│   │   │   └── TaskAnalytics.jsx   # Lazy-loaded heavy analytics widget (P8 Supplementary)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # JWT state, login/register, token expiry (P7)
│   │   │   └── ToastContext.jsx    # Non-blocking toast feedback queue (P6 Supplementary)
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page (P1, P2)
│   │   │   ├── Tasks.jsx           # Full-Stack Dashboard + Cache Pill (P9) + AI Auto-Draft (P13)
│   │   │   ├── Projects.jsx        # Live GitHub REST API consumer (P3)
│   │   │   ├── Contact.jsx         # Controlled form with live character count (P2)
│   │   │   ├── Auth.jsx            # Register, Login & JWT Payload Inspector (P7)
│   │   │   └── NotFound.jsx        # 404 Route Fallback (P2 Supplementary)
│   │   ├── App.jsx                 # Route splitting via React.lazy & Suspense (P8)
│   │   ├── App.css                 # Responsive Glassmorphic Dark/Light Design System
│   │   └── main.jsx
│   └── package.json
│
└── task-manager-api/              # Node.js + Express Backend (Practicals 4, 5, 6, 7, 9, 10, 11, 12, 13)
    ├── Dockerfile                 # Practical 11: Node 18 Alpine Backend Container
    ├── .dockerignore
    ├── cache.js                   # Practical 9: In-memory node-cache with hit/miss telemetry
    ├── events.js                  # Practical 10: Native Node.js EventEmitter instance
    ├── listeners.js               # Practical 10: Non-blocking notification & audit handlers
    ├── middleware/
    │   ├── auth.js                # Practical 7: JWT Bearer token authentication guard
    │   ├── validator.js           # Practical 4 & 7: Headers, ObjectId & Task input validation
    │   ├── logger.js              # Practical 4: Method, URL & timestamp request logger
    │   └── errorHandler.js        # Practical 4: Centralized 404 & 500 error middleware
    ├── models/
    │   ├── Task.js                # Practical 5: Task schema with priority enum & trim pre-save hooks
    │   └── User.js                # Practical 7: User schema with bcrypt password hashing
    ├── routes/
    │   ├── taskRoutes.js          # Practicals 4-10: CRUD + Caching + Asynchronous event emission
    │   ├── authRoutes.js          # Practical 7: /register, /login, /me endpoints
    │   └── aiRoutes.js            # Practical 13: Google Gemini API with graceful degradation
    ├── tests/
    │   └── api.test.js            # Practical 12: Automated test suite (Jest + Supertest)
    ├── server.js                  # Express setup, CORS, MongoDB connection & route mounting
    ├── .env.example
    └── package.json
```

---

## ⚡ Quick Start Options

### Option A: Running with Docker Compose (Single Command — Practical 11)
```bash
# Starts MongoDB (port 27017), Backend (port 5000), and Frontend (port 5173)
docker compose up --build
```
- Open Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API Health: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Option B: Local Development (Separate Terminals)
#### 1. Backend Server
```bash
cd task-manager-api
npm install
npm run dev
```
*Runs on `http://localhost:5000` with automatic reloading.*

#### 2. Frontend React Application
```bash
cd portfolio
npm install
npm run dev
```
*Runs on `http://localhost:5173`.*

#### 3. Run Automated CI Test Suite
```bash
cd task-manager-api
npm test
```
*Executes all 7 automated Jest + Supertest suites in ESM mode.*

---

## 🔬 Detailed Implementation Breakdown (Practicals 1 to 13)

### Practical 1: Introduction to React and Component Architecture
- **Objective**: Scaffold a Vite React app and build a modular UI with reusable functional components.
- **Components Built**:
  - `Header.jsx`: Accepts `name` and `themeColor` props; applies styling dynamically.
  - `About.jsx`: Profile bio and academic details for student 24DIT021.
  - `Skills.jsx`: Accepts `skillList` array prop and renders dynamic interactive badges.
  - `Footer.jsx`: Contact links, university affiliation, and dynamic copyright year.
- **Key Concepts Tested**: JSX expression interpolation, props unidirectional data flow, component reusability.

---

### Practical 2: State Management and Multi-Page Routing in React
- **Objective**: Client-side single page navigation without browser reload and interactive state using `useState`.
- **Implementation**:
  - Configured `BrowserRouter`, `Routes`, and `Route` in `main.jsx` and `App.jsx`.
  - Built `NavBar.jsx` using `<Link>` and `<NavLink>` with active route highlighting.
  - **Routes**: `/` (Home), `/tasks` (Tasks), `/projects` (Projects), `/contact` (Contact), `/auth` (Auth), and `*` (`NotFound.jsx` 404 page).
  - Implemented **Theme Toggle** (`isDarkMode`) applying dark-mode CSS classes to the root DOM.
  - Controlled form inputs in `Contact.jsx` with real-time live character counter.

---

### Practical 3: API Integration and Data Rendering in React
- **Objective**: Consume public REST APIs and manage asynchronous network states (`loading`, `success`, `error`).
- **Implementation**:
  - Live GitHub API integration (`https://api.github.com/users/<username>/repos`) in `Projects.jsx`.
  - Conditional rendering:
    - `<Spinner />`: Shown while HTTP request is in-flight.
    - `<ErrorMessage message={...} onRetry={...} />`: Renders when network fails or API errors occur.
  - Supplementary search filtering by repository name, language tags, and star counts.

---

### Practical 4: Building a RESTful API with Node.js and Express
- **Objective**: Implement a complete backend CRUD server with middleware pipeline and standard HTTP status codes.
- **Implementation**:
  - Scaffolded Express server with JSON body parser (`express.json()`).
  - Request logging middleware (`logger.js`) recording HTTP method, path, and ISO timestamp.
  - Global error handler (`errorHandler.js`) catching unhandled exceptions and returning structured JSON.
  - Custom 404 middleware returning standardized JSON for undefined routes.
  - Content-Type verification middleware rejecting invalid POST/PUT payloads.

---

### Practical 5: MongoDB Integration and Schema Design with Mongoose
- **Objective**: Connect MongoDB to Express and enforce schema validation at the database layer.
- **Implementation**:
  - `Task.js` schema with field constraints:
    - `title`: String, required, trimmed via pre-save hook.
    - `description`: String, optional.
    - `completed`: Boolean, default `false`.
    - `priority`: Enum `['low', 'medium', 'high']`, default `'medium'`.
    - `createdAt`: Date, default `Date.now`.
  - Mongoose CRUD operations: `Task.find()`, `Task.create()`, `Task.findByIdAndUpdate()`, `Task.findByIdAndDelete()`.
  - Seamless in-memory fallback array when MongoDB is offline so evaluation never breaks.

---

### Practical 6: Full Stack Integration (React + Node + MongoDB)
- **Objective**: Connect the React frontend to the Node/MongoDB backend with bidirectional state synchronization.
- **Implementation**:
  - Configured `cors` middleware on Express allowing cross-origin calls from `http://localhost:5173`.
  - Centralized API client `portfolio/src/api/api.js` with `BASE_URL = 'http://localhost:5000'`.
  - **Optimistic UI Updates**: Created tasks immediately appear in the list with rollback on network failure.
  - **Delete Confirmation Modal** (`ConfirmModal.jsx`): Prevents accidental data deletion.
  - **Toast Notifications** (`ToastContext.jsx`): Real-time success and error banners.

---

### Practical 7: Authentication and Middleware Pipeline
- **Objective**: Implement JWT-based user authentication, password hashing with bcrypt, and protected routes.
- **Implementation**:
  - `User.js` schema with pre-save hook hashing passwords using `bcryptjs` (salt factor 10).
  - `/auth/register` and `/auth/login` signing JWT tokens with 1h/24h expiration and `JWT_SECRET`.
  - `auth.js` middleware extracting `Authorization: Bearer <token>` and injecting `req.user`.
  - Protected `/auth/me` endpoint verifying user session.
  - Frontend `AuthContext.jsx` auto-logging out and prompting on HTTP 401 response.

---

### Practical 8: Performance Optimization & Lazy Loading in React
- **Objective**: Code splitting via `React.lazy()` and `Suspense` to reduce initial bundle download size.
- **Implementation**:
  - Route code-splitting in `App.jsx` dynamically importing `Home`, `Tasks`, `Projects`, `Contact`, `Auth`.
  - Component-level lazy loading for heavy chart analytics (`TaskAnalytics.jsx`).
  - Skeleton fallback UI (`LazyFallback.jsx`) preventing layout shift during chunk fetching.

#### 📊 Measured Bundle Size & Performance Comparison:
| Metric | Monolithic Bundle (Before) | Code Split Bundle (After P8) | Improvement |
| :--- | :--- | :--- | :--- |
| **Initial Bundle Size** | ~272 kB | **243.35 kB** | **~11% initial payload reduction** |
| **Tasks Chunk** | Bundled in main | **14.00 kB** | Loaded strictly when visiting `/tasks` |
| **Analytics Widget** | Bundled in main | **3.45 kB** | Loaded only on user toggle |
| **Simulated 3G FCP** | ~1.40s | **~0.92s** | **~34% faster render time** |

---

### Practical 9: In-Memory Caching and Query Optimization
- **Objective**: Implement server-side caching using `node-cache` and measure response time impact.
- **Implementation**:
  - Created `task-manager-api/cache.js` wrapping `NodeCache` with standard TTL of 60 seconds.
  - `GET /tasks` checks cache key `'all_tasks'`. If present (Cache Hit), returns data in < 2ms without querying database.
  - **Cache Invalidation**: Any write operation (`POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`) immediately invalidates the cached key using `cache.del('all_tasks')` to guarantee zero stale data.
  - `GET /api/cache-stats` exposes real-time hits, misses, hit ratio %, and active keys.
  - Frontend displays real-time **Cache Hit Ratio Pill** in the Task Dashboard header.

#### ⏱️ Measured API Response Time Comparison (Postman / Supertest):
| Request Sequence | Cache Status | Execution Path | Response Time |
| :--- | :---: | :--- | :---: |
| **Request 1 (Initial)** | **MISS** | MongoDB Query / Data Fetch + Cache Set | **~34 ms** |
| **Request 2 (Repeated)** | **HIT** | In-Memory RAM Lookup (`node-cache`) | **~1 ms** |
| **Request 3 (Repeated)** | **HIT** | In-Memory RAM Lookup (`node-cache`) | **~1 ms** |
| **POST /tasks (Mutation)** | **INVALIDATE** | Cache key wiped; DB updated | ~28 ms |
| **Request 4 (Post-Write)** | **MISS** | Fresh DB Query + Cache Repopulated | **~31 ms** |

---

### Practical 10: Asynchronous Processing with Event-Driven Architecture
- **Objective**: Implement non-blocking background processing using native Node.js `EventEmitter`.
- **Implementation**:
  - `task-manager-api/events.js` exports a shared instance of `EventEmitter`.
  - `task-manager-api/listeners.js` registers event listeners:
    - `task-created`: Dispatches simulated background notification with a 400ms non-blocking delay and logs completion timestamp.
    - `task-deleted`: Writes audit trail to system event logs.
    - `error`: Centralized handler preventing unhandled event exceptions.
  - In `taskRoutes.js`, the HTTP 201 response is sent to the client **before** emitting the event.

#### 🕒 Console Timestamp Proof (Decoupled Non-Blocking Proof):
```
[API RESPONSE SENT] POST /tasks -> Status 201 at 2026-10-23T04:13:34.524Z
[EVENT RECEIVED: task-created] Task: "Docker Deploy" at 2026-10-23T04:13:34.527Z
[ASYNC NOTIFICATION COMPLETE] Dispatched at 2026-10-23T04:13:34.927Z (Completed 403ms AFTER HTTP Response Sent!)
```

---

### Practical 11: Containerization with Docker and Docker Compose
- **Objective**: Package the frontend, backend, and database into portable Docker containers and orchestrate them via Compose.
- **Implementation**:
  - `task-manager-api/Dockerfile`: Lightweight Node 18 Alpine runtime running Express server on port 5000.
  - `portfolio/Dockerfile`: Two-stage multi-stage build:
    - **Stage 1 (Build)**: Compiles React app using `npm run build`.
    - **Stage 2 (Runtime)**: Serves static preview on port 5173 with minimal image footprint.
  - `docker-compose.yml`:
    - Service `mongodb`: Official Mongo image with persistent volume `mongodb_data`.
    - Service `backend`: Connects to `mongodb://mongodb:27017/taskManagerDB` via service name.
    - Service `frontend`: Connects to backend on port 5000.
    - Isolated bridge network `app-network`.

---

### Practical 12: CI/CD Pipeline with GitHub Actions
- **Objective**: Automate testing and quality verification on every git push or pull request.
- **Implementation**:
  - Test framework: `jest` and `supertest` configured with ES Modules (`--experimental-vm-modules`).
  - Automated tests in `task-manager-api/tests/api.test.js`:
    - Health check `GET /api/health` status 200
    - Task listing `GET /tasks` with cache header verification (`X-Cache-Status`)
    - Cache metrics `GET /api/cache-stats`
    - Task creation `POST /tasks` status 201
    - Server validation rejection of missing title with status 400
    - 404 handler verification on unknown task ID
    - AI assistant endpoint graceful degradation test
  - `.github/workflows/ci.yml`:
    - Matrix testing on Node 18
    - Automated dependency install (`npm ci`)
    - Automated test runner (`npm test`)
    - Frontend bundle compilation validation (`npm run build`)

---

### Practical 13: AI API Integration into a Web Application
- **Objective**: Integrate a third-party Generative AI API (Google Gemini 2.5 Flash) with security, rate limiting, and graceful degradation.
- **Implementation**:
  - Secure Backend Endpoint: `POST /api/ai/generate-description` (API key stored server-side in `.env`, never exposed to browser).
  - Powered by `@google/genai` targeting Google Gemini 2.5 Flash model.
  - **Graceful Degradation**: If no API key is provided or third-party service times out, an intelligent heuristic template engine auto-generates structured task descriptions and suggested milestones with `fallback: true` so the application never crashes.
  - **Rate Limiting**: 3-second debounce per client IP preventing quota exhaustion.
  - **Frontend UI (`Tasks.jsx`)**:
    - `🤖 AI Auto-Draft` button with pulsing loading state.
    - Editable output: Students can freely tweak the generated text before saving.
    - Clear visible disclaimer badge: *"💡 AI-generated suggestion. Please review and customize before saving."*

---

## 🎯 Viva & Evaluation Question Bank (Faculty Rubrics)

### Q1: Why must the global error handler middleware be registered last in Express?
> Express identifies error-handling middleware by its 4-parameter signature `(err, req, res, next)`. If it is registered before routes, unhandled route errors cannot fall through to it because request processing traverses middleware in registration order.

### Q2: Why is `node-cache` suitable for single-instance applications but not horizontally scaled clusters?
> `node-cache` stores data in the local RAM memory heap of that specific Node.js operating process. If an app is scaled across 3 Docker containers or load-balanced servers, a cache write on Server A will not invalidate or populate the cache on Server B or C, leading to split-brain stale reads. Horizontally scaled apps use distributed caches like Redis.

### Q3: Why does emitting an event with `EventEmitter` not block the API response?
> `EventEmitter.emit()` executes synchronously or asynchronously depending on listener implementation, but placing `res.status(201).json(...)` before emitting ensures the HTTP socket write occurs immediately. Additionally, when listeners offload tasks using timers or Promises, the Node.js event loop prioritizes completing the response cycle before processing background microtasks.

### Q4: Why must database containers reference service names rather than `localhost` in Docker Compose?
> Inside a Docker bridge network, each container has its own isolated network namespace and its own loopback interface (`localhost` / `127.0.0.1`). Connecting to `localhost:27017` from the backend container refers to the backend container itself. Docker's embedded DNS server automatically maps Compose service names (e.g. `mongodb`) to the internal IP address of the target container.

### Q5: Why must AI API keys never be embedded in frontend client code?
> Any key bundled in client-side JavaScript can be inspected in plain text by opening browser DevTools, Network logs, or decompiling minified chunks. Routing requests through an Express backend keeps the API key protected in server environment variables and enables backend rate limiting, sanitization, and graceful degradation.

---

## 📜 Verification & Test Results Log

```bash
> task-manager-api-24dit021@1.0.0 test
> cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --runInBand --detectOpenHandles --forceExit

PASS tests/api.test.js
  Task Management API Test Suite (Practicals 4, 5, 9, 10, 12, 13)
    √ GET /api/health returns status 200 and operational status (108 ms)
    √ GET /tasks returns 200 and an array of tasks (31 ms)
    √ GET /api/cache-stats returns cache hit/miss diagnostic metrics (11 ms)
    √ POST /tasks creates a new task and returns status 201 (29 ms)
    √ POST /tasks rejects request with missing title (HTTP 400) (9 ms)
    √ GET /tasks/:id returns 404 for unknown task ID (10 ms)
    √ POST /api/ai/generate-description gracefully returns fallback suggestion (11 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.222 s
```

---
**Verified for Evaluation by Hit Goyani (24DIT021)**  
CHARUSAT University — Advanced Web Development Frameworks (ITUE301)
