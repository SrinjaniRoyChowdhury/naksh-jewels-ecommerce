const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');

// Validation rules
const addToCartValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required')
    .isString()
    .withMessage('Session ID must be a string'),
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 }).toInt()
    .withMessage('Quantity must be at least 1'),
];

const updateCartValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required'),
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 }).toInt()
    .withMessage('Quantity must be 0 or greater'),
];

const removeFromCartValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required'),
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
];

const sessionIdValidation = [
  param('sessionId')
    .notEmpty()
    .withMessage('Session ID is required'),
];

// Routes
router.post('/', addToCartValidation, validate, addToCart);
router.get('/:sessionId', sessionIdValidation, validate, getCart);
router.put('/', updateCartValidation, validate, updateCartItem);
router.delete('/', removeFromCartValidation, validate, removeFromCart);
router.delete('/:sessionId', sessionIdValidation, validate, clearCart);

module.exports = router;