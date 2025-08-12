// // routes/searchapi.js
// const express = require('express');
// const router = express.Router();
// const Vendor = require('../modules/Vender');
// const User = require('../modules/usersDatabase');

// router.get('/', async (req, res) => {
//   const { term } = req.query;
//   if (!term) return res.status(400).json({ error: 'Search term is required' });

//   try {
//     const regex = new RegExp(term, 'i');

//     // Vendors
//     const vendors = await Vendor.find({
//       $or: [
//         { shopName: regex },
//         { businessCategory: { $elemMatch: { $regex: regex } } }
//       ]
//     }).select('shopName businessCategory profileImage');

//     // Users
//     const users = await User.find({
//       fullName: regex
//     }).select('fullName profileImage');

//     // Merge results
//     const results = [
//       ...vendors.map(v => ({
//         id: v._id,
//         name: v.shopName,
//         category: Array.isArray(v.businessCategory)
//           ? v.businessCategory.join(', ')
//           : v.businessCategory,
//         isVendor: true,
//         image: v.profileImage || null
//       })),
//       ...users.map(u => ({
//         id: u._id,
//         name: u.fullName,
//         category: 'User',
//         isVendor: false,
//         image: u.profileImage || null
//       }))
//     ];

//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;














const express = require('express');
const router = express.Router();
const Vendor = require('../modules/Vender');
const User = require('../modules/usersDatabase');

router.get('/', async (req, res) => {
  const { term } = req.query;
  if (!term) return res.status(400).json({ error: 'Search term is required' });

  try {
    const regex = new RegExp(term, 'i');

    // Vendors: search by shopName, businessCategory, or fullName
    const vendors = await Vendor.find({
      $or: [
        { shopName: regex },
        { fullName: regex },
        { businessCategory: { $elemMatch: { $regex: regex } } }
      ]
    }).select('shopName fullName businessCategory profileImage');

    // Users: search by fullName
    const users = await User.find({
      fullName: regex
    }).select('fullName profileImage');

    // Format results
    const results = [
      ...vendors.map(v => ({
        id: v._id,
        name: v.fullName || v.shopName, // Prefer vendor name if available
        shopName: v.shopName,
        category: Array.isArray(v.businessCategory)
          ? v.businessCategory.join(', ')
          : v.businessCategory,
        isVendor: true,
        image: v.profileImage || null
      })),
      ...users.map(u => ({
        id: u._id,
        name: u.fullName,
        category: 'User',
        isVendor: false,
        image: u.profileImage || null
      }))
    ];

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

