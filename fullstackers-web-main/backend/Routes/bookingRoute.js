const express = require('express');
const router = express.Router();
const Booking = require('../Models/Booking');
const Trip   = require('../Models/Trip');
const isAuth = require('../Middleware/isAuth');   // your existing JWT middleware

// POST /api/bookings  – create a booking (user or admin)
router.post('/', isAuth, async (req, res) => {
  try {
    const {
      tripId,
      participants,
      selectedDate,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      paymentMethod
    } = req.body;

    // basic validation
    if (!tripId || !participants || !selectedDate || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ success: false, msg: 'Missing required fields' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, msg: 'Trip not found' });

    // simple availability check – you can expand later
    const existing = await Booking.countDocuments({
      tripId,
      selectedDate: new Date(selectedDate),
      status: { $in: ['pending', 'confirmed'] }
    });
    const slotsLeft = trip.maxGroupSize - existing;
    if (slotsLeft < participants) {
      return res.status(409).json({ success: false, msg: `Only ${slotsLeft} spots left on this date` });
    }

    const totalAmount = trip.price * participants;

    const booking = await Booking.create({
      tripId,
      tripTitle: trip.title,
      userId: req.user.id,               // logged-in user
      customerName,
      customerEmail,
      customerPhone,
      participants,
      selectedDate,
      specialRequests,
      paymentMethod,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
});

// GET /api/bookings/my  – own bookings (user or admin)
router.get('/my', isAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
                                  .populate('tripId', 'title images')
                                  .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// GET /api/bookings  – all bookings (admin only)
router.get('/', isAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, msg: 'Admins only' });
  try {
    const bookings = await Booking.find()
                                  .populate('tripId userId', 'title userName email')
                                  .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// PUT /api/bookings/:id/status  – admin changes status
router.put('/:id/status', isAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, msg: 'Admins only' });
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, msg: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;