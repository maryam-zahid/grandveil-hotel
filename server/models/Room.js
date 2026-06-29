const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'], required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 2 },
  size: { type: Number }, // sq ft
  floor: { type: Number },
  roomNumber: { type: String, required: true, unique: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  view: { type: String, enum: ['Ocean', 'City', 'Garden', 'Pool', 'Mountain'], default: 'City' },
  bedType: { type: String, enum: ['Single', 'Double', 'Queen', 'King', 'Twin'], default: 'King' },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);