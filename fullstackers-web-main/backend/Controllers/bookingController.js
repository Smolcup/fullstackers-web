const Booking = require('../Models/Booking');
const Trip   = require('../Models/Trip');

// POST /api/bookings
exports.createBooking = async (req, res) => {
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

    if (!tripId || !participants || !selectedDate || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ success: false, msg: 'Missing required fields' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, msg: 'Trip not found' });

    const existing = await Booking.countDocuments({
      tripId,
      selectedDate: new Date(selectedDate),
      status: { $in: ['pending', 'confirmed'] }
    });
    const slotsLeft = trip.maxGroupSize - existing;
    if (slotsLeft < participants) {
      return res.status(409).json({ success: false, msg: `Only ${slotsLeft} spots left` });
    }

    const booking = await Booking.create({
      tripId,
      tripTitle: trip.title,
      userId: req.user.id,
      customerName,
      customerEmail,
      customerPhone,
      participants,
      selectedDate,
      specialRequests,
      paymentMethod,
      totalAmount: trip.price * participants,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const list = await Booking.find({ userId: req.user.id })
                              .populate('tripId', 'title images')
                              .sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// GET /api/bookings   (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const list = await Booking.find()
                              .populate('tripId userId', 'title userName email')
                              .sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// PUT /api/bookings/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, msg: 'Not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};