import mongoose from 'mongoose';

/**
 * Header Validation Middleware (Practical 4 Supplementary Problem)
 * Rejects POST, PUT, and PATCH requests if Content-Type is not application/json.
 */
export const requireJsonHeader = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request: Content-Type header must be application/json',
      });
    }
  }
  next();
};

/**
 * Route-Specific Task ID Validator Middleware (Practical 4 Supplementary Problem)
 * Validates task ID parameter format before the request reaches the controller.
 */
export const validateTaskId = (req, res, next) => {
  const { id } = req.params;

  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  const isValidInteger = !isNaN(parseInt(id, 10)) && String(parseInt(id, 10)) === id;

  if (!isValidObjectId && !isValidInteger) {
    return res.status(400).json({
      success: false,
      error: `Invalid task ID format: "${id}". ID must be a valid integer or MongoDB ObjectId.`,
    });
  }

  next();
};

/**
 * User Registration Validator Middleware (Practical 7)
 * Enforces server-side validation on email, password, and name.
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required and cannot be blank');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors,
    });
  }

  next();
};

/**
 * User Login Validator Middleware (Practical 7)
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors,
    });
  }

  next();
};

/**
 * Task Input Validator Middleware (Practical 6/7)
 * Ensures task title is provided and priority is valid before reaching DB.
 */
export const validateTaskInput = (req, res, next) => {
  const { title, priority } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('Task title is required and cannot be empty');
    }
  } else if (req.method === 'PUT' && title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      errors.push('Task title cannot be empty if provided');
    }
  }

  if (priority !== undefined) {
    const normalizedPriority = String(priority).toLowerCase();
    if (!['low', 'medium', 'high'].includes(normalizedPriority)) {
      errors.push(`"${priority}" is not a valid priority. Allowed values: low, medium, high`);
    } else {
      req.body.priority = normalizedPriority;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors,
    });
  }

  next();
};
