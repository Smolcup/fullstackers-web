const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const isAuth = require('../Middleware/isAuth');
const isAutho = require('../Middleware/isAutho');

// All user routes require authentication
router.use(isAuth);

// Get current user dashboard
router.get('/dashboard', userController.getDashboard);

// Get current user profile
router.get('/profile', (req, res) => {
  // This is handled by authController.getProfile
  res.redirect('/api/auth/profile');
});

// Update current user profile
router.put('/profile', userController.updateUser);

// Admin only routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id/role', isAutho(['admin']), userController.updateUserRole);
router.delete('/:id', userController.deleteUser); // Users can delete themselves, admins can delete anyone

module.exports = router;