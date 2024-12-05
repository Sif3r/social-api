const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth'); // Assuming you have an auth middleware
const router = express.Router();

const post = new Post();

// Create a new post
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

// Get a specific post by ID
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
