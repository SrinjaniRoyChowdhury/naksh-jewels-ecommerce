import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice, truncateText } from '../utils/helpers';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    const result = await addToCart(product._id, 1);
    setIsAdding(false);
    
    if (result.success) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } else {
      alert(result.message || 'Failed to add item to cart');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {!product.isAvailable && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>
      
      <div className="product-details">
        <h3 className="product-name" title={product.name}>
          {truncateText(product.name, 40)}
        </h3>
        
        <p className="product-description">
          {truncateText(product.description, 60)}
        </p>
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isAdding || !product.isAvailable || product.stock === 0}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
        
        {showMessage && (
          <div className="success-message">Added to cart!</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;