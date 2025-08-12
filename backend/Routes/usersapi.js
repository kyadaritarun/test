const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../modules/usersDatabase');
const router = express.Router();

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, gender, city, password, agreedToTerms } = req.body;

    if (!fullName || !email || !phoneNumber || !gender || !city || !password || !agreedToTerms) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      phoneNumber,
      gender,
      city,
      password: hashedPassword,
      agreedToTerms,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

module.exports = router;