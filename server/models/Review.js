const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  cleanliness: { type: Number, min: 1, max: 5 },
  service: { type: Number, min: 1, max: 5 },
  comfort: { type: Number, min: 1, max: 5 },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);