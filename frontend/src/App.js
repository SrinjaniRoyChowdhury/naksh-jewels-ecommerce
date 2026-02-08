import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";


function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;