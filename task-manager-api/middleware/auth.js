import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware (Practical 7)
 * Extracts Bearer token from Authorization header and verifies it.
 * Attaches decoded payload (user id, email, role) to req.user.
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Authorization token required (Format: Bearer <token>)',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_practical_7_24dit021';

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token Expired',
        message: 'Your session has expired. Please login again.',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid Token',
      message: 'Token verification failed. Access denied.',
    });
  }
};

/**
 * Optional Auth Middleware:
 * If a token is supplied, verify it and attach req.user,
 * otherwise proceed as guest (useful for open read endpoints or fallback demos).
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_practical_7_24dit021';
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
    }
  } catch {
    // If token invalid, leave req.user undefined
  }
  next();
};
