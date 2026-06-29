const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalRooms, totalReservations, reviews] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Room.countDocuments(),
      Reservation.countDocuments(),
      Review.countDocuments(),
    ]);

    const revenue = await Reservation.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const statusBreakdown = await Reservation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyRevenue = await Reservation.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const recentReservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('room', 'name type')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalRooms,
        totalReservations,
        totalReviews: reviews,
        totalRevenue: revenue[0]?.total || 0,
      },
      statusBreakdown,
      monthlyRevenue,
      recentReservations,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle user active status
router.put('/users/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;