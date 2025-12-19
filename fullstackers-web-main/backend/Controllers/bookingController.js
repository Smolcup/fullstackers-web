const Booking = require('../Models/Booking');
const Trip = require('../Models/Trip');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      tripId,
      tripTitle,
      participants,
      selectedDate,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      paymentMethod,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!tripId || !tripTitle || !participants || !selectedDate || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide all required fields'
      });
    }

    // Check if trip exists and has availability
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        msg: 'Trip not found'
      });
    }

    // Create booking
    const booking = await Booking.create({
      tripId,
      tripTitle,
      userId: req.user?.id || null, // Optional for guests
      customerName,
      customerEmail,
      customerPhone,
      participants,
      selectedDate,
      totalAmount,
      specialRequests,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      msg: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      msg: 'Error creating booking',
      error: error.message
    });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tripId', 'title destination price')
      .populate('userId', 'userName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      msg: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      $or: [
        { userId: req.user.id },
        { customerEmail: req.user.email }
      ]
    })
    .populate('tripId', 'title destination images duration')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      msg: 'Error fetching user bookings',
      error: error.message
    });
  }
};

// Update booking status (admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: 'Booking not found'
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    
    await booking.save();

    res.status(200).json({
      success: true,
      msg: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      msg: 'Error updating booking',
      error: error.message
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        msg: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.userId?.toString() !== req.user.id && booking.customerEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      msg: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      msg: 'Error cancelling booking',
      error: error.message
    });
  }
};