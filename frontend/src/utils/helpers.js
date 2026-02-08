const API_BASE = "http://localhost:5000";

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/300x300?text=No+Image';

  if (path.startsWith('http')) return path;

  return `${API_BASE}${path}`;
};