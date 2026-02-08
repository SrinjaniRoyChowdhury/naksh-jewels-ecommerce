import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { fetchProducts } from '../utils/api';
import '../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(filters);
      setProducts(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: '', search: '' });
  };

  if (loading) return <Loading />;

  return (
    <div className="product-list-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Our Collection</h1>
          <p className="page-subtitle">
            Discover exquisite jewelry crafted with precision and passion
          </p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search jewelry..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">All Categories</option>
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="bracelets">Bracelets</option>
              <option value="earrings">Earrings</option>
              <option value="pendants">Pendants</option>
            </select>
          </div>

          {(filters.category || filters.search) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={loadProducts} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}

        {!error && products.length > 0 && (
          <>
            <p className="product-count">{products.length} products found</p>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;