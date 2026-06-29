const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/auth');

// Get reviews for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create review
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, rating, title, comment, cleanliness, service, comfort, reservationId } = req.body;
    const review = await Review.create({
      user: req.user._id, room: roomId, reservation: reservationId,
      rating, title, comment, cleanliness, service, comfort
    });

    // Update room rating
    const reviews = await Review.find({ room: roomId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Room.findByIdAndUpdate(roomId, { rating: avgRating.toFixed(1), reviewCount: reviews.length });

    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all reviews
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('room', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete review
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;