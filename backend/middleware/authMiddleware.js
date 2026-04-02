const jwt = require('jsonwebtoken');

// Hardcoding the secret key
const JWT_SECRET = 'rentflow_super_secret_key_2026';

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach the user ID and role to the request object
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT Verification Failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect, JWT_SECRET };