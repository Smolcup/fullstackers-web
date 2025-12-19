const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  tripTitle: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  selectedDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  specialRequests: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'transfer'],
    default: 'card'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;