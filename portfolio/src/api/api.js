/**
 * Central API Client for Practicals 6 & 7
 * Handles base URL configuration, JWT Bearer token attachment,
 * JSON serialization, and centralized response/error parsing.
 */

export const BASE_URL = 'http://localhost:5000';

/**
 * Helper to get stored auth token from localStorage
 */
export const getStoredToken = () => {
  return localStorage.getItem('task_auth_token') || null;
};

/**
 * Central fetch wrapper with auth header injection and error normalization
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // 401 Unauthorized handling (token expired / missing)
      if (res.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: data }));
      }

      const errorMessage =
        data.message ||
        data.error ||
        (Array.isArray(data.details) ? data.details.join(', ') : null) ||
        `Request failed with status ${res.status}`;

      const error = new Error(errorMessage);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        'Backend server connection failed. Ensure Express API is running on http://localhost:5000 (cd task-manager-api && npm run dev).'
      );
    }
    throw err;
  }
}

/* =========================================================================
   TASK API (Practical 6: Full-Stack CRUD)
   ========================================================================= */

/**
 * Fetch all tasks
 */
export const getTasks = () => request('/tasks');

/**
 * Fetch single task by ID
 */
export const getTaskById = (id) => request(`/tasks/${id}`);

/**
 * Create a new task
 */
export const createTask = (taskData) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });

/**
 * Update an existing task by ID
 */
export const updateTask = (id, taskData) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });

/**
 * Delete a task by ID
 */
export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE',
  });

/**
 * Health check endpoint
 */
export const checkApiHealth = () => request('/api/health');

/* =========================================================================
   AUTH API (Practical 7: JWT Authentication Pipeline)
   ========================================================================= */

/**
 * Register a new user
 */
export const registerUser = (userData) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

/**
 * Login user and receive JWT token
 */
export const loginUser = (credentials) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

/**
 * Get current authenticated user details (/auth/me)
 */
export const getCurrentUser = () => request('/auth/me');
