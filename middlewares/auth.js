const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing. You must be authenticated first.' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid authorization format. Use "Bearer <token>".' });
    }

    const token = tokenParts[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use an environment variable for the secret key
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
