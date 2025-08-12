require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const sellersRoutes = require('./Routes/sellers');
const vendorRoutes = require('./Routes/venderapi');
const usersRoutes = require('./Routes/usersapi');
const authRoutes = require('./Routes/authapi');
const searchRoute = require('./Routes/searchapi');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL ;
const MONGODB_URI = process.env.MONGODB_URI;

// Configure CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.cookies ? 'Cookies present' : 'No cookies');
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined });
  }
  next();
});

// Mount routes with distinct base paths
app.use('/api/sellers', sellersRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/searchapi', searchRoute);

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`MongoDB URI: ${MONGODB_URI}`);
});