const User = require('../models/User');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      console.log('Fetching all users...');
      const users = await User.find({});
      console.log('Users found:', users.length);
      
      if (!users || users.length === 0) {
        console.log('No users found in database');
        return res.status(404).json({ message: 'No users found' });
      }
      
      res.json(users);
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get user by phone number
  getUserByPhone: async (req, res) => {
    try {
      const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user status
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { status, lastSeen: Date.now() },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add contact
  addContact: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const contactToAdd = await User.findOne({ phoneNumber: req.body.phoneNumber });
      
      if (!user || !contactToAdd) {
        return res.status(404).json({ message: 'User or contact not found' });
      }
      
      if (!user.contacts.includes(contactToAdd._id)) {
        user.contacts.push(contactToAdd._id);
        await user.save();
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;