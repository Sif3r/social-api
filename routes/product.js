const express = require('express');
const router = express.Router()
const Product = require('../models/Product');

const product = new Product();

const handleServerError = (res, error, message) => {
  console.error(error);
  res.status(500).json({ error: message });
};

router.route('/')
// Create a new product
  .post(async (req, res) => {
    try {
      const {name, description, price, stock} = req.body;
      const newProduct = await product.createProduct(name, description,
        parseInt(price), parseInt(stock));
      res.json(newProduct);
    } catch (error) {
      handleServerError(res, error, "Unable to create the product");
    }
  })

// Get all products
  .get(async (req, res) => {
    try {
      const products = await product.getProducts();
      res.json(products);
    } catch (error) {
      handleServerError(res, error, "Unable to fetch these products");
    }
  })

router.route('/:id(\\d+)')
// Get a specific product
  .get(async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const targetedProduct = await product.getProduct(productId);
      res.json(targetedProduct);
    } catch (error) {
      handleServerError(res, error, "Unable to fetch the product");
    }
  })

// Update a product
  .put(async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updates = req.body;
      const updatedProduct = await product.updateProduct(productId, updates);
      res.json(updatedProduct);
    } catch (error) {
      handleServerError(res, error, "Unable to update the product");
    }
  })

// Delete a product
  .delete(async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      await product.deleteProduct(productId);
      res.sendStatus(204);
    } catch (error) {
      handleServerError(res, error, "Unable to delete the product");
    }
  })

module.exports = router
