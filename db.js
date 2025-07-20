const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;

const connectDB = () => {
  return mongoose.connect(mongoUrl);
};

module.exports = connectDB;
