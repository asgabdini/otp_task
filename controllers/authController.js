const redisClient = require("../redis");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const otpKey = `otp_${phone}`;

  const savedOtp = await redisClient.get(otpKey);
  if (savedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, registerDate: new Date() });
    await user.save();
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

  res.json({ token });
};

exports.requestOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone || !/^\d{11}$/.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number." });
  }

  const otpKey = `otp_${phone}`;

  const existingOtp = await redisClient.get(otpKey);
  if (existingOtp) {
    return res.status(429).json({
      message:
        "OTP has already been sent. Please wait two minutes to request a new code.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`OTP for ${phone}: ${otp}`);

  await redisClient.setEx(otpKey, 120, otp);

  res.json({ message: "OTP sent successfully." });
};
