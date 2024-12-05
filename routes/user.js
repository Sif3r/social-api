const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

const user = new User();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, password, isPrivate, isAdmin } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    const newUser = await user.createUser(username, password, isPrivate, isAdmin);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    const { token, user: loggedInUser } = await user.login(username, password);
    res.json({ token, user: loggedInUser });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(401).json({ error: 'Invalid username or password.' });
  }
});

// Get all users (protected route)
router.get('/', auth, async (req, res) => {
  try {
    const users = await user.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Get a specific user (protected route)
router.get('/:id(\\d+)', auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const foundUser = await user.find(userId);
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(foundUser);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// Update a user (protected route)
router.put('/:id(\\d+)', auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const updates = req.body;
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: 'No updates provided.' });
    }
    const updatedUser = await user.updateUser(userId, updates);
    res.json({ message: `User ${updatedUser.username} updated successfully.`, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Delete a user (protected route)
router.delete('/:id(\\d+)', auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    await user.deleteUser(userId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
