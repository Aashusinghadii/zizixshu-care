const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected — Zizixshu_care DB ready!"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));

app.get("/", (req, res) => res.json({ status: "Zizixshu_care Node server running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
