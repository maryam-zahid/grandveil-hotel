require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const reservationRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'GrandVeil API running' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grandveil')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🏨 GrandVeil server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));