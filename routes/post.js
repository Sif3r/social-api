const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const router = express.Router();

const post = new Post();

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post associated with the authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: [] # JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post.
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *       400:
 *         description: Content is required.
 *       500:
 *         description: Failed to create post.
 */
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const newPost = await post.createPost(content, userId);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a specific post
 *     description: Retrieve a post by its ID.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: [] # JWT authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post.
 *     responses:
 *       200:
 *         description: The requested post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Failed to fetch post.
 */
router.get('/:id(\\d+)', auth, async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const foundPost = await post.getPostById(postId);

    if (!foundPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json(foundPost);
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({ error: 'Failed to fetch post.' });
  }
});

module.exports = router;
