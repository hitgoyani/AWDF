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

  // Check if ID is a valid MongoDB ObjectId or a valid numeric integer
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
