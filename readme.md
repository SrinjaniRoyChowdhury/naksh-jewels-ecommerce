# Naksh Jewels E-Commerce Platform

A full-stack e-commerce application built with React.js and Node.js, featuring product browsing, shopping cart functionality, and MongoDB integration. Fully containerized with Docker.

## 🚀 Features

### Frontend (React.js)
- Product listing with search and category filters
- Responsive product cards with images
- Shopping cart with quantity management
- Context API for global state management
- Clean, modern UI without external libraries
- Mobile-responsive design

### Backend (Node.js + Express)
- RESTful API architecture
- MongoDB database integration
- Express-validator for request validation
- Comprehensive error handling
- Environment-based configuration
- Proper MVC structure

### DevOps
- Dockerized application (frontend, backend, database)
- Docker Compose for orchestration
- Health checks for all services
- Production-ready configuration

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (if running locally without Docker)
- Git

## 🛠️ Installation & Setup

### Option 1: Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd naksh-jewels-ecommerce
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Seed the database** (in a new terminal)
   ```bash
   docker exec -it naksh-jewels-backend node utils/seedData.js
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

5. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 2: Running Locally (Development)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB connection string:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/naksh-jewels
   ```

4. **Seed the database**
   ```bash
   node utils/seedData.js
   ```

5. **Start the backend server**
   ```bash
   npm start
   # Or for development with auto-reload
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - The `.env` file is already configured for local development
   - API URL: http://localhost:5000/api

4. **Start the frontend**
   ```bash
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Update `MONGODB_URI` in backend `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/naksh-jewels?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - macOS: `brew install mongodb-community`
   - Ubuntu: Follow [official guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
   - Windows: Download from [MongoDB website](https://www.mongodb.com/try/download/community)

2. **Start MongoDB**
   ```bash
   # macOS/Linux
   mongod --dbpath ~/data/db
   
   # Windows
   mongod --dbpath C:\data\db
   ```

3. **Update backend .env**
   ```
   MONGODB_URI=mongodb://localhost:27017/naksh-jewels
   ```

### Option 3: Docker MongoDB (Already configured in docker-compose)

MongoDB is automatically set up when using `docker-compose up`.

## 📁 Project Structure

```
naksh-jewels-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── productController.js  # Product logic
│   │   └── cartController.js     # Cart logic
│   ├── middleware/
│   │   ├── errorHandler.js       # Error handling
│   │   └── validate.js           # Validation middleware
│   ├── models/
│   │   ├── Product.js            # Product schema
│   │   └── Cart.js               # Cart schema
│   ├── routes/
│   │   ├── productRoutes.js      # Product endpoints
│   │   └── cartRoutes.js         # Cart endpoints
│   ├── utils/
│   │   └── seedData.js           # Database seeding
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── ProductCard.js
│   │   │   ├── CartItem.js
│   │   │   └── Loading.js
│   │   ├── context/
│   │   │   └── CartContext.js    # Global state
│   │   ├── pages/
│   │   │   ├── ProductList.js
│   │   │   └── Cart.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── Header.css
│   │   │   ├── ProductList.css
│   │   │   ├── ProductCard.css
│   │   │   ├── Cart.css
│   │   │   ├── CartItem.css
│   │   │   └── Loading.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── .env.production
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
  - Query params: `category`, `minPrice`, `maxPrice`, `search`
- `GET /api/products/:id` - Get single product

### Cart
- `POST /api/cart` - Add item to cart
  - Body: `{ sessionId, productId, quantity }`
- `GET /api/cart/:sessionId` - Get cart
- `PUT /api/cart` - Update cart item quantity
  - Body: `{ sessionId, productId, quantity }`
- `DELETE /api/cart` - Remove item from cart
  - Body: `{ sessionId, productId }`
- `DELETE /api/cart/:sessionId` - Clear cart

### Health
- `GET /api/health` - Health check endpoint

## 🧪 Testing the Application

1. **Browse Products**
   - Visit http://localhost:3000
   - Use search and category filters
   - View product details

2. **Add to Cart**
   - Click "Add to Cart" on any product
   - View cart badge updating in header

3. **Manage Cart**
   - Navigate to cart page
   - Update quantities
   - Remove items
   - View total amount

4. **API Testing**
   ```bash
   # Get all products
   curl http://localhost:5000/api/products
   
   # Add to cart
   curl -X POST http://localhost:5000/api/cart \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"test-session","productId":"<product-id>","quantity":1}'
   ```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (clean database)
docker-compose down -v

# Restart a specific service
docker-compose restart backend

# Execute command in container
docker exec -it naksh-jewels-backend node utils/seedData.js
```

## 🎨 Key Technical Decisions

### Frontend
- **No UI libraries**: Custom CSS for all components
- **Context API**: Lightweight state management
- **Functional components**: Modern React patterns
- **Responsive design**: Mobile-first approach

### Backend
- **MVC architecture**: Separation of concerns
- **Validation middleware**: Request validation
- **Error handling**: Centralized error management
- **Environment variables**: Secure configuration

### Database
- **MongoDB**: Flexible schema for e-commerce
- **Mongoose**: ODM for data modeling
- **Indexes**: Optimized queries

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/naksh-jewels
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=http://backend:5000/api
```

## 🚨 Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port 3000 or 5000
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify connection string in .env
- For Atlas, check IP whitelist

### Docker Issues
```bash
# Clean Docker system
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 👨‍💻 Development Guidelines

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit with meaningful messages
git commit -m "feat: add product search functionality"

# Push to remote
git push origin feature/your-feature-name
```

### Code Quality
- Use meaningful variable names
- Add comments for complex logic
- Follow consistent formatting
- Handle errors gracefully

## 📦 Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas
- [ ] Configure CORS properly
- [ ] Set up SSL/TLS
- [ ] Enable security headers
- [ ] Set up monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is created for the Naksh Jewels internship assessment.

## 📧 Contact

For any questions or issues, please contact the development team.

---

**Built with ❤️ for Naksh Jewels**