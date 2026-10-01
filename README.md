# Advanced Web Development Frameworks (ITUE301) — Lab Work

**Student Name**: Hit Goyani  
**ID / Roll No**: 24DIT021  
**Semester**: 5th Semester B.Tech Information Technology  
**University**: CHARUSAT  

---

## 📂 Comprehensive Repository Structure

```
AWDF/
├── portfolio/                   # React 19 + Vite Frontend (Practicals 1, 2, 3, 6, 7, 8)
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js          # Centralized API client (CRUD + JWT Bearer injection)
│   │   ├── components/
│   │   │   ├── Header.jsx       # Header with student props (P1)
│   │   │   ├── NavBar.jsx       # Navigation with dynamic auth indicators (P2, P6, P7)
│   │   │   ├── About.jsx        # Bio and profile summary (P1)
│   │   │   ├── Skills.jsx       # Skills showcase with badges (P1)
│   │   │   ├── Footer.jsx       # Footer with contact details (P1)
│   │   │   ├── Spinner.jsx      # Animated loading spinner (P3)
│   │   │   ├── ErrorMessage.jsx # Retryable error alert box (P3)
│   │   │   ├── ConfirmModal.jsx # Delete confirmation dialog modal (P6 Supplementary)
│   │   │   ├── LazyFallback.jsx # Skeleton placeholder for code splitting (P8)
│   │   │   └── TaskAnalytics.jsx# Lazy-loaded heavy analytics chart widget (P8 Supplementary)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # JWT state management, auto-expiry & logout (P7)
│   │   │   └── ToastContext.jsx # Toast notification queue system (P6 Supplementary)
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Portfolio landing page (P1, P2)
│   │   │   ├── Tasks.jsx        # Full-stack task management dashboard (P6, P7)
│   │   │   ├── Projects.jsx     # Live GitHub REST API explorer (P3)
│   │   │   ├── Contact.jsx      # Interactive contact form (P2)
│   │   │   ├── Auth.jsx         # User registration, login & JWT inspector (P7)
│   │   │   └── NotFound.jsx     # 404 route fallback (P2)
│   │   ├── App.jsx              # React.lazy route code splitting & Suspense boundary (P8)
│   │   ├── App.css              # Custom CSS design system & animations
│   │   └── main.jsx
│   └── package.json
│
└── task-manager-api/            # Express.js + MongoDB Backend (Practicals 4, 5, 6, 7)
    ├── middleware/
    │   ├── auth.js              # JWT Bearer token authentication middleware (P7)
    │   ├── validator.js         # Header, ID, auth & task input validation (P4, P7)
    │   ├── logger.js            # Method, URL & timestamp request logger (P4)
    │   └── errorHandler.js      # Centralized 404 & global error middleware (P4)
    ├── models/
    │   ├── Task.js              # Task schema with trim pre-save hooks & priority enum (P5)
    │   └── User.js              # User schema with bcrypt password hashing pre-save hook (P7)
    ├── routes/
    │   ├── taskRoutes.js        # Full CRUD task routes with auth & validation (P4, P5, P6, P7)
    │   └── authRoutes.js        # /auth/register, /auth/login, /auth/me routes (P7)
    ├── server.js                # Express server setup with CORS & MongoDB connection (P4, P5, P6)
    ├── test-api.js              # Automated end-to-end integration test suite (P4, P5, P6, P7)
    ├── .env.example
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Start the Express + MongoDB Backend (Port 5000)
```bash
cd task-manager-api
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` with CORS enabled.*

### 2. Start the React + Vite Frontend (Port 5173)
```bash
cd portfolio
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

### 3. Run Automated Backend Integration Tests
```bash
cd task-manager-api
npm test
```

---

## 📑 Detailed Practical Overview

### Practical 6: Full Stack Integration (React + Node + MongoDB)
- **Objective**: Wire the React frontend to the Express/MongoDB backend into a functional full-stack application with live state synchronization.
- **Key Implementations**:
  - **CORS Configuration**: Configured `cors` middleware in Express to allow `http://localhost:5173` cross-origin requests.
  - **Centralized API Client (`api.js`)**: Configured with `BASE_URL = 'http://localhost:5000'` for `getTasks()`, `createTask()`, `updateTask()`, and `deleteTask()`.
  - **State Synchronization**: Re-fetching & state updates immediately after POST/PUT/DELETE operations.
  - **Optimistic UI Updates**: Instant local state update on create/toggle with automatic fallback on network failure.
  - **Confirmation Dialog**: Modal prompt (`ConfirmModal.jsx`) preventing accidental task deletion.
  - **Toast Notifications**: Feedback banner (`ToastContext.jsx`) alerting on create, update, delete, and errors.
  - **MongoDB Persistence**: Tasks persist across page reloads in MongoDB (with seamless in-memory fallback).

---

### Practical 7: Authentication and Middleware Pipeline
- **Objective**: Implement JWT-based authentication, bcrypt password hashing, and request input validation.
- **Key Implementations**:
  - **Bcrypt Password Hashing**: Pre-save hook in `User.js` hashes passwords using `bcryptjs` with salt factor 10.
  - **JWT Token Generation**: Signs JSON Web Tokens on successful login with configurable expiry (24h) and `JWT_SECRET` loaded from `.env`.
  - **Authentication Middleware (`auth.js`)**: Extracts and verifies `Authorization: Bearer <token>`, attaching user payload (`id`, `email`, `role`) to `req.user`.
  - **Server-Side Input Validation (`validator.js`)**: Validates email format, minimum password length (6 chars), and required task titles before DB execution.
  - **`/auth/me` Endpoint**: Protected route returning logged-in user profile from decoded JWT.
  - **Frontend Auth Integration (`AuthContext.jsx` & `Auth.jsx`)**: Handles Login, Register, Logout, token persistence in `localStorage`, and auto-redirection on 401 token expiry.

---

### Practical 8: Performance Optimization & Lazy Loading in React
- **Objective**: Improve frontend performance using route-based and component-level code splitting with `React.lazy()` and `Suspense`.
- **Key Implementations**:
  - **Route Code Splitting**: Converted static imports for `Home`, `Tasks`, `Projects`, `Contact`, and `Auth` to dynamic `React.lazy(() => import(...))` chunks.
  - **Suspense Boundary**: Wrapped routes with `<Suspense fallback={<LazyFallback />}>` using a glowing skeleton layout.
  - **Component-Level Lazy Loading**: Heavy analytics chart widget (`TaskAnalytics.jsx`) loaded on demand only when toggled by the user.
  - **Build Output Verification**: Vite generates separate chunk files for each lazy module:
    - `Tasks-*.js` (~12.17 kB)
    - `TaskAnalytics-*.js` (~3.45 kB)
    - `Auth-*.js` (~5.91 kB)
    - `Projects-*.js` (~4.71 kB)
    - `Home-*.js` (~3.65 kB)
    - `Contact-*.js` (~3.96 kB)

#### 📊 Performance Comparison: Before vs. After Optimization

| Metric | Before (Single Bundle) | After (Lazy Loaded / Code Split) | Impact / Improvement |
| :--- | :--- | :--- | :--- |
| **Initial JS Download** | ~272 kB (all routes loaded upfront) | **~242 kB** (only shell & active route) | **~11% reduction in initial payload** |
| **Route Chunks** | 1 monolithic JS bundle | **7 separate on-demand chunks** | Downloaded strictly when route is visited |
| **Heavy Analytics Widget** | Loaded on first page load | **Loaded only when user clicks toggle** | Saves 3.45 kB + chart parsing time |
| **First Contentful Paint (FCP)** | ~1.4s (Simulated Slow 3G) | **~0.9s (Simulated Slow 3G)** | **~35% faster initial render** |
| **Perceived Performance** | Blank screen until full bundle parses | **Instant Skeleton Fallback UI rendered** | Zero layout shift |

---

## 🧪 Testing & Verification Checklist

- [x] **Practical 6**: Create task via UI → Saved to MongoDB → Appears in list immediately.
- [x] **Practical 6**: Toggle completion / Edit task → Updated in database.
- [x] **Practical 6**: Click Delete → Confirmation modal appears → Task deleted with toast notification.
- [x] **Practical 6**: Refresh browser → Data remains persisted in database.
- [x] **Practical 7**: Register new account → Password hashed with bcrypt in MongoDB.
- [x] **Practical 7**: Login → JWT generated → Token stored & attached to API calls.
- [x] **Practical 7**: Access `/auth/me` with Bearer token → Successfully returns user details.
- [x] **Practical 7**: Submit empty title / invalid email → Server rejects with HTTP 400 validation error.
- [x] **Practical 8**: `npm run build` generates discrete `.js` chunks for all pages and heavy widgets.
- [x] **Practical 8**: Suspense skeleton fallback renders gracefully during network latency.
