const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/auth');

// Create reservation
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests, paymentMethod } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (totalNights < 1) return res.status(400).json({ message: 'Invalid dates' });

    // Check availability
    const conflict = await Reservation.findOne({
      room: roomId,
      status: { $in: ['confirmed', 'checked-in', 'pending'] },
      $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }]
    });
    if (conflict) return res.status(409).json({ message: 'Room not available for selected dates' });

    const reservation = await Reservation.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalNights,
      pricePerNight: room.price,
      totalAmount: room.price * totalNights,
      specialRequests,
      paymentMethod,
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    await reservation.populate(['user', 'room']);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my reservations
router.get('/my', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single reservation
router.get('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(['user', 'room']);
    if (!reservation) return res.status(404).json({ message: 'Not found' });
    if (reservation.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel reservation
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Not found' });
    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    reservation.status = 'cancelled';
    reservation.cancelledAt = new Date();
    reservation.cancelReason = req.body.reason || 'Cancelled by user';
    reservation.paymentStatus = 'refunded';
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all reservations
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total = await Reservation.countDocuments(filter);
    const reservations = await Reservation.find(filter)
      .populate(['user', 'room'])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ reservations, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update reservation status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate(['user', 'room']);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;