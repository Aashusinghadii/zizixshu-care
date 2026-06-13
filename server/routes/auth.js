const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Sab fields bharo yaar! 😅" });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Ye email already registered hai bhai!" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.json({ message: "Registration ho gayi! Ab login karo! 🎉" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email aur password dono chahiye!" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User nahi mila yaar!" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Wrong password bhai! 😬" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
