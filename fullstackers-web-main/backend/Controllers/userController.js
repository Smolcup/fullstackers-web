const User = require('../Models/User');
const Trip = require('../Models/Trip');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error fetching users',
      error: error.message
    });
  }
};

// Get single user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const { userName, email, currentPassword, newPassword } = req.body;
    
    // Find user by ID from token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    // Check if user is trying to change password
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          msg: 'Current password is incorrect'
        });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update other fields
    if (userName) user.userName = userName;
    if (email) user.email = email;

    await user.save();

    // Return updated user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      msg: 'User updated successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user (Admin only or self)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;
    const requestingUserRole = req.user.role;

    // Check if user is trying to delete themselves or is admin
    if (userId !== requestingUserId && requestingUserRole !== 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'You are not authorized to delete this user'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      msg: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error deleting user',
      error: error.message
    });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid role. Role must be either "user" or "admin"'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      msg: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error updating user role',
      error: error.message
    });
  }
};

// Get user dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let dashboardData = {};

    if (userRole === 'admin') {
      // Admin dashboard data
      const totalUsers = await User.countDocuments();
      const totalTrips = await Trip.countDocuments();
      const activeTrips = await Trip.countDocuments({ active: true });
      const featuredTrips = await Trip.countDocuments({ featured: true });

      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('-password');

      const recentTrips = await Trip.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('createdBy', 'userName');

      dashboardData = {
        stats: {
          totalUsers,
          totalTrips,
          activeTrips,
          featuredTrips
        },
        recentUsers,
        recentTrips
      };
    } else {
      // Regular user dashboard data
      const userTrips = await Trip.find({ createdBy: userId });
      const totalUserTrips = userTrips.length;
      const activeUserTrips = userTrips.filter(trip => trip.active).length;
      const featuredUserTrips = userTrips.filter(trip => trip.featured).length;

      dashboardData = {
        stats: {
          totalTrips: totalUserTrips,
          activeTrips: activeUserTrips,
          featuredTrips: featuredUserTrips
        },
        myTrips: userTrips
      };
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error fetching dashboard data',
      error: error.message
    });
  }
};