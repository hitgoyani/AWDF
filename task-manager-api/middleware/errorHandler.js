/**
 * 404 Not Found Middleware for Undefined Endpoints (Practical 4 Supplementary Problem)
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `404 Not Found: Cannot ${req.method} ${req.originalUrl || req.url}`,
  });
};

/**
 * Centralized Global Error Handling Middleware (Practical 4 & Practical 5)
 * Must have 4 parameters (err, req, res, next) and be registered as the last middleware.
 * Intercepts Mongoose ValidationErrors and CastErrors to return clean, structured JSON.
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Log error for developer debugging on server console
  console.error('[GLOBAL ERROR HANDLER]:', err.message);

  // 1. Mongoose Schema Validation Error (Practical 5)
  if (err.name === 'ValidationError') {
    const errorDetails = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errorDetails,
    });
  }

  // 2. Mongoose Invalid ObjectId Error (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid resource ${err.path}: "${err.value}"`,
    });
  }

  // 3. Syntax error in incoming JSON payload
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request: Malformed JSON payload received',
    });
  }

  // 4. Default 500 Internal Server Error (without exposing raw stack trace)
  res.status(500).json({
    success: false,
    error: 'Internal Server Error: Something went wrong on the server',
  });
};
