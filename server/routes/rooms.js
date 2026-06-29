const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const { protect, adminOnly } = require('../middleware/auth');

// Get all rooms with filters
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity, view, checkIn, checkOut } = req.query;
    const filter = { isAvailable: true };
    if (type) filter.type = type;
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };
    if (view) filter.view = view;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    let rooms = await Room.find(filter).sort({ isFeatured: -1, price: 1 });

    // Filter by availability if dates given
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const bookedRooms = await Reservation.find({
        status: { $in: ['confirmed', 'checked-in', 'pending'] },
        $or: [
          { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ]
      }).distinct('room');
      rooms = rooms.filter(r => !bookedRooms.map(id => id.toString()).includes(r._id.toString()));
    }

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create room
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update room
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete room
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;