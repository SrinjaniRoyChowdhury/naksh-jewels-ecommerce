import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        loading: false,
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // persistent session (no login needed)
  const getSessionId = () => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('sessionId', id);
    }
    return id;
  };

  // FETCH CART
  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const sessionId = getSessionId();

      const res = await fetch(`/api/cart/${sessionId}`);
      if (!res.ok) throw new Error('Failed to fetch cart');

      const data = await res.json();

      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data.data });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // ADD TO CART
  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          productId,
          quantity,
        }),
      });

      if (!res.ok) throw new Error('Add to cart failed');

      const data = await res.json();

      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data.data });
        return { success: true };
      }

      throw new Error(data.message);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, message: err.message };
    }
  };

  // UPDATE QUANTITY
  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          productId,
          quantity,
        }),
      });

      if (!res.ok) throw new Error('Update failed');

      const data = await res.json();

      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data.data });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // REMOVE ITEM
  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          productId,
        }),
      });

      if (!res.ok) throw new Error('Remove failed');

      const data = await res.json();

      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data.data });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const sessionId = getSessionId();

      const res = await fetch(`/api/cart/${sessionId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Clear failed');

      const data = await res.json();

      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data.data });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // load cart on start
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        totalAmount: state.totalAmount,
        loading: state.loading,
        error: state.error,
        cartItemCount: state.items.length,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);