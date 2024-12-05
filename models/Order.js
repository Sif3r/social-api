const Cart = require('./Cart');

class Order {
  constructor() {
    this.cart = new Cart();
  }

  async create(userId, productId, quantity, status) {
    try {
      const order = await this.cart.createOrder(userId,
                                                productId, quantity, status);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async get(orderId) {
    try {
      const order = await this.cart.getOrder(orderId);
      return order;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  async update(orderId, quantity, status) {
    try {
      const order = await this.cart.updateOrder(orderId, quantity, status);
      return order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async delete(orderId) {
    try {
      await this.cart.deleteOrder(orderId);
      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}

module.exports = Order;
