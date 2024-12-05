const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(username, password, isPrivate, isAdmin) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          isPrivate: Boolean(isPrivate),
          isAdmin: Boolean(isAdmin),
        },
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Failed to create user');
    }
  }

  async login(username, password) {
    try {
      // Find the user
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET, // Use a secret key from environment variables
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      return { token, user };
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new Error(error.message || 'Failed to login');
    }
  }

  async find(id) {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error('Error finding user:', error.message);
      throw new Error('Failed to find user');
    }
  }

  async getUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      console.error('Error retrieving users:', error.message);
      throw new Error('Failed to retrieve users');
    }
  }

  async updateUser(id, updates) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { ...updates, updated_at: new Date() },
      });
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw new Error('Failed to delete user');
    }
  }
}

module.exports = User;
