# Quick Start Guide - Profile Features Testing

## What's New

### 1. Navbar Profile Dropdown
- Click on your name in the navbar to see dropdown menu
- Options: "My Dashboard", "Profile Settings", "Logout"

### 2. Profile Settings Page (`/profile`)
- Edit your personal information
- Update phone number
- Manage shipping address
- See account creation and update dates

### 3. Enhanced Dashboard
- View all your orders with details
- See shipping address for each order
- View product images and quantities
- Check order status with color badges

### 4. MongoDB Connection
- User profiles now store address information
- Orders linked to users and shipping addresses
- All data persisted in MongoDB

---

## How to Test

### Test 1: Update Profile
1. Sign up or log in
2. Click your name in navbar
3. Select "Profile Settings"
4. Click "Edit Profile" button
5. Update name, phone, and address
6. Click "Save Changes"
7. Verify success message appears
8. Refresh page - data should persist

### Test 2: View Orders with Address
1. Go to "My Dashboard" from navbar dropdown
2. View your orders (if any exist)
3. Look for shipping address in each order card
4. Verify order items show images and prices

### Test 3: MongoDB Connection
1. Start backend: `cd backend && npm start`
2. Watch for: "MongoDB connected" message
3. Check if you can see this in console

### Test 4: Navbar Dropdown
1. Click on your profile name in navbar
2. Verify dropdown appears
3. Check all links work
4. Click outside to close dropdown

---

## API Endpoints

### Get User Profile
```
GET /api/auth/profile
Headers: Authorization: Bearer {token}
```

### Update User Profile
```
PUT /api/auth/profile
Headers: Authorization: Bearer {token}
Body: {
  "name": "John Doe",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

---

## Troubleshooting

**Issue: Profile changes not saving**
- Solution: Check backend is running on port 5000
- Check MongoDB is connected
- Check browser console for errors

**Issue: Address not showing in orders**
- Solution: Orders must have shippingAddress field in MongoDB
- Create new order to test

**Issue: Dropdown menu not appearing**
- Solution: Clear browser cache
- Check if JavaScript is enabled
- Try a different browser

**Issue: MongoDB not connecting**
- Solution: See MONGODB_SETUP.md
- Make sure MongoDB service is running
- Check connection string in .env file

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection (with address)
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  orderItems: [{
    product: ObjectId,
    name: String,
    qty: Number,
    price: Number,
    image: String
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  status: String,
  totalPrice: Number,
  isPaid: Boolean,
  createdAt: Date
}
```

---

## File Changes Summary

### Backend Changes
- `models/User.js` - Added address fields
- `routes/auth.js` - Added PUT /profile endpoint

### Frontend Changes
- `components/Navbar.js` - Added user dropdown
- `pages/ProfileSettings.js` - New profile page
- `pages/ProfileSettings.css` - New styling
- `pages/UserDashboard.js` - Enhanced order display
- `pages/UserDashboard.css` - Enhanced styling
- `services/api.js` - Added updateProfile function
- `styles/style.css` - Added navbar dropdown styles
- `App.js` - Added /profile route

---

## Key Features

✅ User can edit profile information
✅ User can manage shipping address
✅ Orders show shipping address
✅ Orders show product details
✅ Professional UI with gradients
✅ Responsive design
✅ Form validation
✅ Success/error messages
✅ Protected routes
✅ MongoDB integration

---

## Next Steps (Optional)

1. Upload profile picture
2. Add multiple addresses
3. Set default address
4. Email notifications for orders
5. Download order invoices
6. Product reviews and ratings

---

## Support Documents

- `MONGODB_SETUP.md` - Database setup guide
- `PROFILE_ENHANCEMENT_GUIDE.md` - Detailed documentation
- `README.md` - Project overview