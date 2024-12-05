const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const userInstance = new User();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const { token, user } = await userInstance.login(username, password);

    res.json({
      message: 'Login successful',
      token: token,
      user: user,
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

module.exports = router

