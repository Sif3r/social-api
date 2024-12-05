const pool = require('../db/config');

class Post {
  async createPost(content, userId) {
    try {
      const query = `
        INSERT INTO posts (content, user_id, created_at, updated_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
      const values = [content, userId,];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating post:', error.message);
      throw new Error('Failed to create post');
    }
  }

  async getPostById(postId) {
    try {
      const query = `SELECT * FROM posts WHERE id = $1`;
      const result = await pool.query(query, [postId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching post:', error.message);
      throw new Error('Failed to fetch post');
    }
  }
}

module.exports = Post;
