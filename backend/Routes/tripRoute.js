const express = require('express');
const router = express.Router();
const tripController = require('../Controllers/tripController');
const isAuth = require('../Middleware/isAuth');
const isAutho = require('../Middleware/isAutho');

// Public routes - no authentication required
router.get('/', tripController.getAllTrips);
router.get('/featured', tripController.getFeaturedTrips);
router.get('/destination/:destination', tripController.getTripsByDestination);
router.get('/:id', tripController.getTrip);

// Protected routes - authentication required
router.use(isAuth);

// Admin only routes
router.post('/', isAutho(['admin']), tripController.createTrip);
router.put('/:id', isAutho(['admin']), tripController.updateTrip);
router.delete('/:id', isAutho(['admin']), tripController.deleteTrip);

module.exports = router;