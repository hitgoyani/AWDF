/**
 * Request Logging Middleware (Practical 4)
 * Logs HTTP method, requested URL, and an ISO timestamp for every incoming request.
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[LOG] ${req.method} ${req.originalUrl || req.url} - ${timestamp}`);
  next();
};
