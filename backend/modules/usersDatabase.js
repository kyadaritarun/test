const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true }, // Hash later in production
  agreedToTerms: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
