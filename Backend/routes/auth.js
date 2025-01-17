const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const generateToken = (id, role) => {
 return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Sign-Up
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
    const user = new User({ name, email, password, role });
    await user.save();
    const token = generateToken(user._id, user.role);
    res.status(201).json({ token });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
   });
   // Sign-In
   router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(user._id, user.role);
    res.status(200).json({ token });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
   });
   module.exports = router;