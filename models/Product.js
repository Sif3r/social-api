const { PrismaClient } = require("@prisma/client");

class Product{
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createProduct(name, description, price, stock) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name,
          description,
          price,
          stock,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async getProduct(productId) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await this.prisma.product.findMany();
      return products;
    } catch (error) {
      console.error("Error retrieving products:", error);
      throw error;
    }
  }

  async updateProduct(productId, updates) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: {
          ...updates,
          updated_at: new Date(),
        },
      });
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: { id: productId },
      });
      return deletedProduct;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

module.exports = Product;
