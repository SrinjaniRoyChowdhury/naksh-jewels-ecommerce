const Product = require('../models/Product');
const connectDB = require('../config/db');

const products = [
  {
    name: 'Diamond Solitaire Ring',
    description: 'Elegant 18K white gold ring with a brilliant cut diamond',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
    category: 'rings',
    stock: 15,
    isAvailable: true,
  },
  {
    name: 'Gold Pearl Necklace',
    description: 'Classic pearl necklace with 22K gold clasp',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
    category: 'necklaces',
    stock: 20,
    isAvailable: true,
  },
  {
    name: 'Ruby Tennis Bracelet',
    description: 'Stunning ruby and diamond tennis bracelet in platinum',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
    category: 'bracelets',
    stock: 10,
    isAvailable: true,
  },
  {
    name: 'Emerald Drop Earrings',
    description: 'Exquisite emerald drop earrings with diamond accents',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
    category: 'earrings',
    stock: 25,
    isAvailable: true,
  },
  {
    name: 'Sapphire Pendant',
    description: 'Royal blue sapphire pendant on white gold chain',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500',
    category: 'pendants',
    stock: 18,
    isAvailable: true,
  },
  {
    name: 'Rose Gold Band Ring',
    description: 'Delicate rose gold band with intricate filigree work',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
    category: 'rings',
    stock: 30,
    isAvailable: true,
  },
  {
    name: 'Kundan Choker Necklace',
    description: 'Traditional kundan choker with meenakari work',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500',
    category: 'necklaces',
    stock: 12,
    isAvailable: true,
  },
  {
    name: 'Diamond Bangle Set',
    description: 'Set of two diamond-studded gold bangles',
    price: 78000,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500',
    category: 'bracelets',
    stock: 8,
    isAvailable: true,
  },
  {
    name: 'Pearl Stud Earrings',
    description: 'Classic freshwater pearl studs in 14K gold',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500',
    category: 'earrings',
    stock: 40,
    isAvailable: true,
  },
  {
    name: 'Amethyst Heart Pendant',
    description: 'Heart-shaped amethyst pendant with silver chain',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=500',
    category: 'pendants',
    stock: 22,
    isAvailable: true,
  },
  {
    name: 'Platinum Wedding Band',
    description: 'Simple yet elegant platinum wedding band',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500',
    category: 'rings',
    stock: 20,
    isAvailable: true,
  },
  {
    name: 'Temple Jewellery Necklace',
    description: 'South Indian temple jewellery necklace with goddess motif',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500',
    category: 'necklaces',
    stock: 10,
    isAvailable: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    await Product.deleteMany({});
    console.log('Existing products deleted');
    
    await Product.insertMany(products);
    console.log('Sample products added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts();