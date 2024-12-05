const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

const user = new User();

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user in the system.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 isPrivate:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
 *       400:
 *         description: Username and password are required.
 *       500:
 *         description: Failed to create user.
 */
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

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     isPrivate:
 *                       type: boolean
 *                     isAdmin:
 *                       type: boolean
 *       400:
 *         description: Username and password are required.
 *       401:
 *         description: Invalid username or password.
 */
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

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Protected route.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   isPrivate:
 *                     type: boolean
 *                   isAdmin:
 *                     type: boolean
 *       500:
 *         description: Failed to fetch users.
 */
router.get('/', auth, async (req, res) => {
  try {
    const users = await user.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a specific user
 *     description: Retrieve a user by their ID. Protected route.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: The requested user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 isPrivate:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to fetch user.
 */
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

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user's details by their ID. Protected route.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: No updates provided.
 *       500:
 *         description: Failed to update user.
 */
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

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID. Protected route.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID.
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       500:
 *         description: Failed to delete user.
 */
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
