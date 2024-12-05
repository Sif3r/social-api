const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with the secret
    req.user = decoded; // Attach decoded user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Invalid token:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
