

// //------------saveing step 2 and step 3 data in one file
// const mongoose = require('mongoose');

// const vendorSchema = new mongoose.Schema({
//   // Step 2 fields
//   fullName: String,
//   email: String,
//   password: String,
//   confirmPassword: String,
//   phoneNumber: String,

//   // Step 3 fields
//   shopName: String,
//   businessCategory: [String], // array since you allow multiple selections
//   shopAddress: String,
//   cityStatePincode: String,
//   latitude: Number,
//   longitude: Number,
//   detailsConfirmed: Boolean,
//   agreedToTerms: Boolean,
// });

// const Vendor = mongoose.model('Vendor', vendorSchema);

// module.exports = Vendor;












const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  confirmPassword: String,
  phoneNumber: String,

  shopName: String,
  businessCategory: [String],
  shopAddress: String,
  cityStatePincode: String,
  latitude: Number,
  longitude: Number,
  detailsConfirmed: Boolean,
  agreedToTerms: Boolean,

  // ✅ New field for the Offer switch
  offerActive: { type: Boolean, default: false }
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
