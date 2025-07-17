const jwt = require('jsonwebtoken');
const { Admin, Student } = require('../models/schema'); // Import models

// Middleware to check authentication and authorization
const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];

      // Verify and decode token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "key"); // Use .env in production

      // Find user from DB based on role
      let user;
      if (decoded.role === 'admin' || decoded.role === 'superadmin') {
        user = await Admin.findById(decoded.id);
      } else if (decoded.role === 'student') {
        user = await Student.findById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found or unauthorized' });
      }

      // Attach user info to request object for further use
      req.user = {
        id: user._id,
        role: decoded.role,
      };

      // Check if user role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Not allowed for this role.' });
      }

      console.log("Decoded Token:", decoded);
console.log("User found:", user);
console.log("Role Allowed:", allowedRoles);

      // User is authenticated and authorized
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = auth;
