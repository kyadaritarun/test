// const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const cookieParser = require('cookie-parser');
// const User = require('../modules/usersDatabase');
// const Vendor = require('../modules/Vender');
// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// // Middleware to verify JWT from cookie
// const authenticateToken = (req, res, next) => {
//   const token = req.cookies.authToken;
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };

// // ================= LOGIN =================
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const trimmedEmail = email.trim().toLowerCase();
//     const trimmedPassword = password.trim();

//     let user = await User.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });
//     let userType = 'User';

//     if (!user) {
//       user = await Vendor.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });
//       userType = 'Vendor';
//     }

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     let isPasswordValid = false;
//     if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
//       isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
//     } else {
//       isPasswordValid = user.password === trimmedPassword; // For non-hashed demo
//     }

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign(
//       { id: user._id, email: user.email, type: userType },
//       JWT_SECRET,
//       { expiresIn: '7h' }
//     );

//     res.cookie('authToken', token, {
//       httpOnly: true,
//       secure: false, // true in production with HTTPS
//       sameSite: 'strict',
//       maxAge:  8 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: 'Login successful',
//       type: userType,
//       user: { id: user._id, email: user.email, fullName: user.fullName },
//     });

//   } catch (error) {
//     res.status(500).json({ message: 'Error during login', error: error.message });
//   }
// });

// // ================= PROFILE FETCH BY ID =================
// router.get('/profile/:type/:id', authenticateToken, async (req, res) => {
//   try {
//     const { type, id } = req.params;

//     if (req.user.type.toLowerCase() !== type || req.user.id !== id) {
//       return res.status(403).json({ message: 'Unauthorized access' });
//     }

//     let profile;
//     if (type === 'user') {
//       profile = await User.findById(id).select('fullName email phoneNumber gender city');
//       if (!profile) return res.status(404).json({ message: 'User not found' });
//       return res.status(200).json({ type: 'User', profile });
//     } else if (type === 'vendor') {
//       profile = await Vendor.findById(id).select('fullName email phoneNumber shopName businessCategory shopAddress cityStatePincode latitude longitude');
//       if (!profile) return res.status(404).json({ message: 'Vendor not found' });
//       return res.status(200).json({ type: 'Vendor', profile });
//     } else {
//       return res.status(400).json({ message: 'Invalid profile type' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching profile data', error: error.message });
//   }
// });

// // ================= NEW GENERIC "ME" ENDPOINT =================
// router.get('/profile/me', authenticateToken, async (req, res) => {
//   try {
//     const { id, type, exp } = req.user; // exp is in seconds
//     let profile;
//     if (type === 'User') {
//       profile = await User.findById(id).select('fullName email phoneNumber gender city');
//     } else if (type === 'Vendor') {
//       profile = await Vendor.findById(id).select('fullName email phoneNumber shopName businessCategory shopAddress cityStatePincode latitude longitude');
//     }
//     if (!profile) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json({ type, profile, tokenExpiry: exp * 1000 }); // send expiry in ms
//   } catch (error) {
//     res.status(500).json({ message: 'Error checking authentication', error: error.message });
//   }
// });

// // ================= LOGOUT =================
// router.post('/logout', (req, res) => {
//   res.clearCookie('authToken', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   });
//   return res.status(200).json({ message: 'Logged out successfully' });
// });

// module.exports = router;



















const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const User = require('../modules/usersDatabase');
const Vendor = require('../modules/Vender');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware to verify JWT from cookie
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    let user = await User.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });
    let userType = 'User';

    if (!user) {
      user = await Vendor.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });
      userType = 'Vendor';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let isPasswordValid = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
    } else {
      isPasswordValid = user.password === trimmedPassword; // For non-hashed demo
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, type: userType },
      JWT_SECRET,
      { expiresIn: '7h' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // set to true in production
      sameSite: 'strict',
      maxAge: 8 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      type: userType,
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });

  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// ================= PROFILE FETCH BY ID =================
router.get('/profile/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { type, id } = req.params;

    if (req.user.type.toLowerCase() !== type || req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    let profile;
    if (type === 'user') {
      profile = await User.findById(id).select(
        'fullName email phoneNumber gender city'
      );
      if (!profile) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ type: 'User', profile });
    } else if (type === 'vendor') {
      profile = await Vendor.findById(id).select(
        'fullName email phoneNumber shopName businessCategory shopAddress cityStatePincode latitude longitude offerActive'
      );
      if (!profile) return res.status(404).json({ message: 'Vendor not found' });
      return res.status(200).json({ type: 'Vendor', profile });
    } else {
      return res.status(400).json({ message: 'Invalid profile type' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile data', error: error.message });
  }
});

// ================= GENERIC "ME" ENDPOINT =================
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const { id, type, exp } = req.user;
    let profile;
    if (type === 'User') {
      profile = await User.findById(id).select(
        'fullName email phoneNumber gender city'
      );
    } else if (type === 'Vendor') {
      profile = await Vendor.findById(id).select(
        'fullName email phoneNumber shopName businessCategory shopAddress cityStatePincode latitude longitude offerActive'
      );
    }
    if (!profile) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ type, profile, tokenExpiry: exp * 1000 });
  } catch (error) {
    res.status(500).json({ message: 'Error checking authentication', error: error.message });
  }
});

// ================= LOGOUT =================
router.post('/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
