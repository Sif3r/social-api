const pool = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
  async createUser(username, password, isPrivate, isAdmin) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (username, password, is_private, is_admin)
        RETURNING *;
      `;
      const values = [username, hashedPassword, isPrivate, isAdmin];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Failed to create user');
    }
  }

  async login(username, password) {
    try {
      const query = `SELECT * FROM users WHERE username = $1`;
      const result = await pool.query(query, [username]);
      const user = result.rows[0];

      if (!user) {
        throw new Error('Invalid username or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, user };
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new Error('Failed to login');
    }
  }

  async find(id) {
    try {
      const query = `SELECT * FROM users WHERE id = $1`;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user:', error.message);
      throw new Error('Failed to find user');
    }
  }

  async getUsers() {
    try {
      const query = `SELECT * FROM users`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error retrieving users:', error.message);
      throw new Error('Failed to retrieve users');
    }
  }

  async updateUser(id, updates) {
    try {
      const keys = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
      const query = `
        UPDATE users
        SET ${setClause}
        WHERE id = $1
        RETURNING *;
      `;
      const result = await pool.query(query, [id, ...values]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id) {
    try {
      const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw new Error('Failed to delete user');
    }
  }
}

module.exports = User;
