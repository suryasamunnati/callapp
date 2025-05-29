const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Get user by phone number
router.get('/:phoneNumber', userController.getUserByPhone);

// Update user status
router.put('/:userId/status', userController.updateStatus);

// Add contact
router.post('/:userId/contacts', userController.addContact);

module.exports = router;