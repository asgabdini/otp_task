const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{11}$/, "Phone number must be 11 digits"],
  },
  registerDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
