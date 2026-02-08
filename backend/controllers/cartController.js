const Cart = require('../models/Cart');
const Product = require('../models/Product');

// helper to recalc total
const calculateTotal = (cart) => {
  console.log('💰 Calculating total for', cart.items.length, 'items');
  
  const total = cart.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    console.log(`  - ${item.product?.name}: ${price} x ${item.quantity} = ${price * item.quantity}`);
    return sum + price * item.quantity;
  }, 0);
  
  console.log('💰 Total:', total);
  return total;
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

exports.addToCart = async (req, res) => {
  console.log('🛒 [1] addToCart called');
  console.log('📦 Request body:', req.body);
  
  try {
    const { sessionId, productId, quantity } = req.body;
    console.log('🛒 [2] Extracted values:', { sessionId, productId, quantity });

    console.log('🛒 [3] Finding product...');
    const product = await Product.findById(productId);
    console.log('🛒 [4] Product found:', product ? product.name : 'NOT FOUND');
    
    if (!product) {
      console.log('❌ Product not found');
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log('🛒 [5] Finding cart...');
    let cart = await Cart.findOne({ sessionId });
    console.log('🛒 [6] Cart found:', cart ? 'YES' : 'NO - will create new');

    if (!cart) {
      console.log('🛒 [7] Creating new cart...');
      cart = new Cart({ sessionId, items: [] });
      console.log('🛒 [8] New cart created');
    }

    console.log('🛒 [9] Looking for existing item...');
    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    console.log('🛒 [10] Existing item index:', existingIndex);

    if (existingIndex > -1) {
      console.log('🛒 [11] Updating existing item quantity');
      cart.items[existingIndex].quantity += quantity;
    } else {
      console.log('🛒 [12] Adding new item to cart');
      cart.items.push({ product: productId, quantity });
    }

    console.log('🛒 [13] Saving cart...');
    await cart.save();
    console.log('🛒 [14] Cart saved');

    console.log('🛒 [15] Populating cart items...');
    await cart.populate('items.product');
    console.log('🛒 [16] Cart populated');

    console.log('🛒 [17] Calculating total...');
    cart.totalAmount = calculateTotal(cart);
    console.log('🛒 [18] Total calculated:', cart.totalAmount);

    console.log('🛒 [19] Saving cart with total...');
    await cart.save();
    console.log('🛒 [20] Cart saved with total');

    console.log('✅ [21] Sending response...');
    res.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
      },
    });
    console.log('✅ [22] Response sent');
    
  } catch (err) {
    console.error('❌ Add to cart error:', err);
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