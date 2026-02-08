import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import '../styles/CartItem.css';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      alert(`Only ${item.product.stock} items available in stock`);
      return;
    }
    updateCartItem(item.product._id, newQuantity);
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(item.product._id);
    }
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={getImageUrl(item.product.image)}
          alt={item.product.name}
        />
      </div>
      
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.product.name}</h3>
        <p className="cart-item-price">{formatPrice(item.product.price)} each</p>
      </div>
      
      <div className="cart-item-quantity">
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span className="quantity-value">{item.quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
        >
          +
        </button>
      </div>
      
      <div className="cart-item-subtotal">
        <p className="subtotal-label">Subtotal</p>
        <p className="subtotal-amount">{formatPrice(subtotal)}</p>
      </div>
      
      <button className="remove-btn" onClick={handleRemove} title="Remove item">
        ✕
      </button>
    </div>
  );
};

export default CartItem;