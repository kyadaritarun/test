const express = require('express');
const bcrypt = require('bcryptjs');
const Vendor = require('../modules/Vender');
const router = express.Router();

// POST /api/vendors
router.post('/', async (req, res) => {
  try {
    const {
      // Step 2 fields
      fullName,
      email,
      phoneNumber,
      password,

      // Step 3 fields
      shopName,
      businessCategory,
      shopAddress,
      cityStatePincode,
      latitude,
      longitude,
      detailsConfirmed,
      agreedToTerms
    } = req.body;

    // ✅ Step 2 required validation
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'Full name, email, phone, and password are required' });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save all fields in one go
    const vendor = new Vendor({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      shopName,
      businessCategory,
      shopAddress,
      cityStatePincode,
      latitude,
      longitude,
      detailsConfirmed,
      agreedToTerms
    });

    await vendor.save();
    res.status(201).json({ message: 'Vendor registered successfully', vendor });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({ message: 'Error registering vendor' });
  }
});



// PUT /api/vendors/:vendorId/offer
router.put('/:vendorId/offer', async (req, res) => {
  const { vendorId } = req.params;
  const { offerActive } = req.body;

  if (typeof offerActive !== 'boolean') {
    return res.status(400).json({ message: 'offerActive must be a boolean' });
  }

  try {
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { offerActive },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({
      message: 'Offer status updated successfully',
      offerActive: vendor.offerActive
    });
  } catch (error) {
    console.error('Error updating offer status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
