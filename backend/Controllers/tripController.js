const Trip = require('../Models/Trip');
const User = require('../Models/User');

// Get all trips with filtering, sorting, and pagination
exports.getAllTrips = async (req, res) => {
  try {
    const {
      destination,
      maxPrice,
      minPrice,
      duration,
      difficulty,
      sort,
      page = 1,
      limit = 10,
      featured
    } = req.query;

    // Build query object
    let query = { active: true };
    
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    
    if (maxPrice || minPrice) {
      query.price = {};
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
      if (minPrice) query.price.$gte = parseInt(minPrice);
    }
    
    if (duration) {
      query.duration = parseInt(duration);
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Build sort object
    let sortObj = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortObj[field.substring(1)] = -1;
        } else {
          sortObj[field] = 1;
        }
      });
    } else {
      sortObj = { createdAt: -1 }; // Default sort by newest
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const trips = await Trip.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'userName email');

    // Get total count for pagination
    const totalTrips = await Trip.countDocuments(query);
    const totalPages = Math.ceil(totalTrips / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        trips,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalTrips,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error fetching trips',
      error: error.message
    });
  }
};

// Get single trip by ID
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('createdBy', 'userName email')
      .populate('reviews');

    if (!trip) {
      return res.status(404).json({
        success: false,
        msg: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error fetching trip',
      error: error.message
    });
  }
};

// Create new trip (Admin only)
exports.createTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      destination,
      duration,
      price,
      maxGroupSize,
      difficulty,
      startDates,
      images,
      included,
      excluded,
      itinerary,
      featured
    } = req.body;

    // Validate required fields
    if (!title || !description || !destination || !duration || !price || !maxGroupSize || !startDates) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide all required fields'
      });
    }

    // Create trip
    const trip = await Trip.create({
      title,
      description,
      destination,
      duration,
      price,
      maxGroupSize,
      difficulty,
      startDates,
      images,
      included,
      excluded,
      itinerary,
      featured,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      msg: 'Trip created successfully',
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error creating trip',
      error: error.message
    });
  }
};

// Update trip (Admin only)
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        msg: 'Trip not found'
      });
    }

    // Check if the user is the creator or admin
    if (trip.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'You are not authorized to update this trip'
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      msg: 'Trip updated successfully',
      data: updatedTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error updating trip',
      error: error.message
    });
  }
};

// Delete trip (Admin only)
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        msg: 'Trip not found'
      });
    }

    // Check if the user is the creator or admin
    if (trip.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'You are not authorized to delete this trip'
      });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      msg: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error deleting trip',
      error: error.message
    });
  }
};

// Get featured trips
exports.getFeaturedTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ featured: true, active: true })
      .sort({ ratingsAverage: -1 })
      .limit(6)
      .populate('createdBy', 'userName email');

    res.status(200).json({
      success: true,
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error fetching featured trips',
      error: error.message
    });
  }
};

// Get trips by destination
exports.getTripsByDestination = async (req, res) => {
  try {
    const { destination } = req.params;
    
    const trips = await Trip.find({ 
      destination: { $regex: destination, $options: 'i' },
      active: true 
    })
      .sort({ ratingsAverage: -1 })
      .populate('createdBy', 'userName email');

    res.status(200).json({
      success: true,
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error fetching trips by destination',
      error: error.message
    });
  }
};