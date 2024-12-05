const { PrismaClient } = require('@prisma/client');

class User{
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createCart(userId, productId, quantity) {
    try {
      const cart = await prisma.cart.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
          last_update: new Date(),
        },
      });
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  async getCart(id) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { id },
        include: { User: true, Product: true },
      });
      return cart;
    } catch (error) {
      console.error("Error getting cart:", error);
      throw error;
    }
  }

  async updateCart(id, quantity) {
    try {
      const cart = await prisma.cart.update({
        where: { id },
        data: { quantity, last_update: new Date() },
      });
      return cart;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  }

  async deleteCart(id) {
    try {
      const cart = await prisma.cart.delete({
        where: { id },
      });
      return cart;
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw error;
    }
  }
}

module.exports = User;
