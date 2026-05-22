const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Use environment variables for secret key
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);

            const userId = decoded.id || decoded.sub;

            // Fetch user's role from the database if not explicitly present or if it is a Supabase JWT
            let role = decoded.role;
            if (!role || role === 'authenticated') {
                const userResult = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
                if (userResult.rows.length > 0) {
                    role = userResult.rows[0].role;
                } else {
                    role = 'tenant';
                }
            }

            // Attach the user ID and role to the request object
            req.user = {
                id: userId,
                role: role
            };
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