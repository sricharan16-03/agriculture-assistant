require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");

const Contact = require("./models/Contact");
const Query = require("./models/Query");
const Crop = require("./models/Crop");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ IMPORTANT: Add your final hosted frontend URL here
const allowedOrigins = [
  "https://your-username.github.io", // Replace with your GitHub Pages URL
  "https://agriculture-assistant.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ===== ROUTES =====

app.post("/recommend", async (req, res) => {
  try {
    // Make sure this URL is your deployed ML API on Render
    const response = await fetch("https://agri-ml-api.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const result = await response.json();
    const query = new Query({ ...req.body, recommended: [result.crop] });
    await query.save();
    res.json({ recommended: [result.crop] });
  } catch (error) {
    console.error("Prediction API call failed:", error);
    res.status(500).json({ msg: "Prediction failed" });
  }
});

app.get("/crops", async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load crops" });
  }
});

app.get("/techniques", (req, res) => {
  res.json([
    { name: "Drip Irrigation", desc: "Efficient water use for crops" },
    { name: "Organic Farming", desc: "Eco-friendly farming techniques" }
    // ... other techniques
  ]);
});

app.get("/schemes", (req, res) => {
  res.json([
    { name: "PM-Kisan Samman Nidhi", benefit: "₹6000 per year direct income support", link: "https://pmkisan.gov.in/" },
    { name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", benefit: "Insurance cover against crop failure", link: "https://pmfby.gov.in/" }
    // ... other schemes
  ]);
});

app.get("/diseases", (req, res) => {
  res.json([
    { crop: "Wheat", disease: "Rust", solution: "Use resistant varieties and timely fungicide application." },
    { crop: "Rice", disease: "Blast", solution: "Use resistant varieties, proper field spacing, and fungicide." }
    // ... other diseases
  ]);
});

app.post("/npk-advisor", (req, res) => {
  const { N, P, K } = req.body;
  let advice = [];
  if (N < 50) advice.push("Add Urea (Nitrogen fertilizer)");
  if (P < 40) advice.push("Use DAP (Phosphorus fertilizer)");
  if (K < 40) advice.push("Apply MOP (Potassium fertilizer)");
  res.json({ advice });
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  const contact = new Contact({ name, email, message });
  await contact.save();
  res.json({ success: true, msg: "Message saved!" });
});

app.listen(PORT, () => console.log(`🚀 Express running on port ${PORT}`));