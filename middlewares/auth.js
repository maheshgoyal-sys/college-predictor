// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            // No token, user is not authenticated
            req.isAuthenticated = false;
            return next(); // Proceed, but mark as not authenticated
        }

        jwt.verify(token, "swfwcfwc", (err, decoded) => {
            if (err) {
                req.isAuthenticated = false;
                res.clearCookie('token'); // Clear invalid token
                return next();
            }
            req.isAuthenticated = true;
            req.user = decoded; // Store decoded user info (e.g., email)
            next();
        });
    } catch (err) {
        req.isAuthenticated = false;
        res.clearCookie('token');
        next();
    }
};

module.exports = auth;