const Cart = require('../models/Cart');
const Product = require('../models/Product');

// helper to recalc total
const calculateTotal = (cart) => {
  return cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
      .populate('items.product');

    if (!cart) {
      return res.json({
        success: true,
        data: { items: [], totalAmount: 0 },
      });
    }

    res.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= ADD =================
exports.addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ sessionId }).populate('items.product');

    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existing = cart.items.find(
      item => item.product._id.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.populate('items.product');

    cart.totalAmount = calculateTotal(cart);
    await cart.save();

    res.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE =================
exports.updateCartItem = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart)
      return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(
      i => i.product._id.toString() === productId
    );

    if (!item)
      return res.status(404).json({ success: false, message: 'Item not found' });

    item.quantity = quantity;

    cart.totalAmount = calculateTotal(cart);
    await cart.save();

    res.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= REMOVE =================
exports.removeFromCart = async (req, res) => {
  try {
    const { sessionId, productId } = req.body;

    const cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart)
      return res.json({ success: true, data: { items: [], totalAmount: 0 } });

    cart.items = cart.items.filter(
      item => item.product._id.toString() !== productId
    );

    cart.totalAmount = calculateTotal(cart);
    await cart.save();

    res.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= CLEAR =================
exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteOne({ sessionId: req.params.sessionId });

    res.json({
      success: true,
      data: { items: [], totalAmount: 0 },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};