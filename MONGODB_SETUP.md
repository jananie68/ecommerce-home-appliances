# MongoDB Connection Guide

## Current MongoDB Setup

The e-commerce application uses MongoDB as the database for storing all data (users, products, orders, etc.).

### Connection Details

**File:** `backend/server.js`

```javascript
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
```

### Configuration Options

1. **Local MongoDB (Default)**
   - URI: `mongodb://localhost:27017/ecommerce`
   - Used when `MONGO_URI` environment variable is not set
   - Requires MongoDB to be installed and running locally

2. **MongoDB Atlas (Cloud)**
   - Add `MONGO_URI` to your `.env` file
   - Example: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce`
   - Recommended for production environments

### Setting Up MongoDB

#### Option 1: Local MongoDB Installation
```bash
# Windows
# Download and install from https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

#### Option 2: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add it to your `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

### Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
```

### Database Collections

The application uses the following MongoDB collections:

1. **users**
   - Stores user account information
   - Fields: name, email, password, phone, address, role, createdAt, updatedAt

2. **products**
   - Stores product information
   - Fields: name, description, price, images, category, stock, rating

3. **orders**
   - Stores order information
   - Fields: user, orderItems, shippingAddress, totalPrice, status, isPaid, etc.

4. **categories**
   - Stores product categories
   - Fields: name, description

### Verifying MongoDB Connection

When the backend server starts, you should see:
```
MongoDB connected
```

If connection fails, check:
- MongoDB is running (for local setup)
- Connection string is correct
- Network access is allowed (for MongoDB Atlas)
- Firewall settings

### Mongoose Schema References

**User Model** (`backend/models/User.js`)
- Stores user profile information including address

**Order Model** (`backend/models/Order.js`)
- References User model
- Stores shipping address for order tracking

**Product Model** (`backend/models/Product.js`)
- Stores product details

**Category Model** (`backend/models/Category.js`)
- Stores product categories

### Queries Used

- User: `User.findById()`, `User.findOne()`, `User.save()`
- Orders: `Order.find()`, `Order.findById()`, `Order.populate()`
- Products: `Product.find()`, `Product.findById()`

### Data Relationships

```
User (1) ---- (Many) Orders
       \
        \---- Profile Data
             (address, phone)

Order (1) ---- (Many) OrderItems
      \
       \---- Product References
             (via orderItems.product)
```

### Troubleshooting

**Error: "MongoNetworkError: connect ECONNREFUSED"**
- MongoDB service is not running
- For local: Start MongoDB service
- For Atlas: Check internet connection and firewall

**Error: "MongoAuthenticationError"**
- Incorrect username/password in connection string
- Check credentials in MongoDB Atlas

**Error: "Cannot connect to MongoDB Atlas"**
- IP address not whitelisted in Atlas
- Add your IP in Atlas -> Network Access
- Or allow access from anywhere (0.0.0.0)

### Production Considerations

1. Use MongoDB Atlas for better reliability
2. Enable backups and monitoring
3. Use strong passwords and IP whitelisting
4. Enable encryption at rest and in transit
5. Use dedicated database user with limited privileges
6. Regular backups and disaster recovery plan