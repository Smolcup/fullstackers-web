const express = require('express');
const router = express.Router();
const tripController = require('../Controllers/tripController');
const bookingController = require('../Controllers/bookingController');
const chatbotController = require('../Controllers/chatbotController'); // This import is correct
const isAuth = require('../Middleware/isAuth');
const isAutho = require('../Middleware/isAutho');

// Public routes - no authentication required
router.get('/', tripController.getAllTrips);
router.get('/featured', tripController.getFeaturedTrips);
router.get('/destination/:destination', tripController.getTripsByDestination);
router.get('/search', tripController.searchTrips);
router.get('/:id', tripController.getTrip);

// Chatbot route (public - no auth required) - FIXED
router.post('/chatbot', chatbotController.handleChatMessage); // Use chatbotController, not tripController

// Booking routes (public but auth optional for guests)
router.post('/:id/book', bookingController.createBooking);

// Protected routes - authentication required
router.use(isAuth);

// Admin only routes
router.post('/', isAutho(['admin']), tripController.createTrip);
router.put('/:id', isAutho(['admin']), tripController.updateTrip);
router.delete('/:id', isAutho(['admin']), tripController.deleteTrip);

// Admin booking routes
router.get('/bookings/all', isAutho(['admin']), bookingController.getAllBookings);

module.exports = router;