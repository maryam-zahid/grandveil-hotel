const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { adults: { type: Number, default: 1 }, children: { type: Number, default: 0 } },
  totalNights: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'card' },
  specialRequests: { type: String, default: '' },
  confirmationCode: { type: String, unique: true },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
}, { timestamps: true });

reservationSchema.pre('save', function(next) {
  if (!this.confirmationCode) {
    this.confirmationCode = 'GV' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);