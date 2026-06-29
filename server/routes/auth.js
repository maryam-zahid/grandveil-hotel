const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ user, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });
    res.json({ user, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;