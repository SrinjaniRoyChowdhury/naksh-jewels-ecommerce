const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public
const addToCart = async (req, res, next) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (!product.isAvailable) {
      const error = new Error('Product is not available');
      error.statusCode = 400;
      throw error;
    }
    
    if (product.stock < quantity) {
      const error = new Error(`Only ${product.stock} items available in stock`);
      error.statusCode = 400;
      throw error;
    }
    
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      cart = new Cart({
        sessionId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
      
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
        
        if (cart.items[existingItemIndex].quantity > product.stock) {
          const error = new Error(`Cannot add more than ${product.stock} items`);
          error.statusCode = 400;
          throw error;
        }
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }
    
    await cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cart
// @route   GET /api/cart/:sessionId
// @access  Public
const getCart = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    let cart = await Cart.findOne({ sessionId }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
      await cart.save();
    }
    
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Public
const updateCartItem = async (req, res, next) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      throw error;
    }
    
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      
      if (product.stock < quantity) {
        const error = new Error(`Only ${product.stock} items available`);
        error.statusCode = 400;
        throw error;
      }
      
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');
    
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart
// @access  Public
const removeFromCart = async (req, res, next) => {
  try {
    const { sessionId, productId } = req.body;
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    
    await cart.calculateTotal();
    await cart.save();
    await cart.populate('items.product');
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/:sessionId
// @access  Public
const clearCart = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};