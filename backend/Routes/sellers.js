// const express = require('express');
// const router = express.Router();
// const sellersDatabase = require('../modules/sellersDatabase');

// router.get('/', (req, res) => {
//   const { category, lat, lng } = req.query;

//   console.log(`Received request for category: ${category} at location: lat=${lat}, lng=${lng}`);

//   if (!category || !lat || !lng) {
//     console.log('Missing parameters in request.');
//     return res.status(400).json({ error: 'Category, lat, and lng are required.' });
//   }

//   const userLat = parseFloat(lat);
//   const userLng = parseFloat(lng);

//   let filteredSellers;

//   if (category === 'Popular Categories') {
//     filteredSellers = sellersDatabase.filter(seller => 
//       seller.categories.includes('Popular Categories')
//     );
//   } else {
//     filteredSellers = sellersDatabase.filter(seller => 
//       seller.categories.includes(category)
//     );
//   }
  
//   console.log(`Found ${filteredSellers.length} sellers for category "${category}".`);
//   res.json(filteredSellers);
// });

// router.post('/', (req, res) => {
//   const { shopName, businessCategory, shopAddress, cityStatePincode, latitude, longitude } = req.body;

//   if (!shopName || !businessCategory || !shopAddress || !cityStatePincode || !latitude || !longitude) {
//     console.log('Missing parameters in POST request.');
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   const newSeller = {
//     id: sellersDatabase.length + 1,
//     name: shopName,
//     categories: Array.isArray(businessCategory) ? businessCategory : [businessCategory],
//     location: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
//     address: shopAddress,
//     cityStatePincode,
//   };

//   sellersDatabase.push(newSeller);
//   console.log(`Added new seller: ${shopName}`);
//   res.status(201).json({ message: 'Seller added successfully', seller: newSeller });
// });

// module.exports = router;





























const express = require('express');
const router = express.Router();
const Vendor = require('../modules/Vender'); // use MongoDB vendor model

// GET sellers filtered by category
router.get('/', async (req, res) => {
  const { category, lat, lng } = req.query;

  console.log(`Received request for category: ${category} at location: lat=${lat}, lng=${lng}`);

  if (!category || !lat || !lng) {
    return res.status(400).json({ error: 'Category, lat, and lng are required.' });
  }

  try {
    // Find vendors whose businessCategory array contains the selected category (case-insensitive)
    const vendors = await Vendor.find({
      businessCategory: { $regex: new RegExp(`^${category}$`, 'i') }
    }).select(
      'shopName businessCategory latitude longitude offerActive'
    );

    // Transform vendors into the marker format the frontend expects
    const markers = vendors.map(vendor => ({
      id: vendor._id,
      name: vendor.shopName,
      categories: vendor.businessCategory,
      location: { lat: vendor.latitude, lng: vendor.longitude },
      offerActive: vendor.offerActive
    }));

    console.log(`Found ${markers.length} vendors for category "${category}".`);
    res.json(markers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new seller (optional, for adding vendors manually if needed)
router.post('/', async (req, res) => {
  const { shopName, businessCategory, shopAddress, cityStatePincode, latitude, longitude } = req.body;

  if (!shopName || !businessCategory || !shopAddress || !cityStatePincode || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const vendor = new Vendor({
      shopName,
      businessCategory: Array.isArray(businessCategory) ? businessCategory : [businessCategory],
      shopAddress,
      cityStatePincode,
      latitude,
      longitude
    });

    await vendor.save();
    res.status(201).json({ message: 'Vendor added successfully', vendor });
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
