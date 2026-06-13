const express = require("express");
const router = express.Router();
const axios = require("axios");
const ChatHistory = require("../models/ChatHistory");
const auth = require("../middleware/authMiddleware");

// Send message
router.post("/message", auth, async (req, res) => {
  const { message, history } = req.body;
  const userId = req.user.id;
  if (!message) return res.status(400).json({ error: "Message required hai!" });

  try {
    // Call Python Groq ML service with full history for context
    const mlResponse = await axios.post("http://localhost:5001/chat", {
      message,
      history: history || []
    });

    const { reply, ml_predictions } = mlResponse.data;

    // Save to MongoDB
    let chat = await ChatHistory.findOne({ userId });
    if (!chat) chat = new ChatHistory({ userId, messages: [] });
    chat.messages.push({ role: "user", text: message });
    chat.messages.push({ role: "bot", text: reply });
    await chat.save();

    res.json({ reply, ml_predictions });
  } catch (err) {
    console.error("ML service error:", err.message);
    res.status(500).json({ error: "ML service down hai yaar! Python server start karo." });
  }
});

// Get history
router.get("/history", auth, async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ userId: req.user.id });
    res.json(chat ? chat.messages : []);
  } catch (err) {
    res.status(500).json({ error: "History nahi mili!" });
  }
});

// Clear history
router.delete("/history", auth, async (req, res) => {
  try {
    await ChatHistory.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Chat clear ho gayi! 🧹" });
  } catch (err) {
    res.status(500).json({ error: "Clear nahi hua!" });
  }
});

module.exports = router;
