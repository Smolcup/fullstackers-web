const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const isAuth = require('../Middleware/isAuth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);



// Protected routes
router.get('/profile', isAuth, authController.getProfile);

module.exports = router;