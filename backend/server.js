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

// ✅ This is the final, correct list of allowed frontends
const allowedOrigins = [
  "https://sricharan16-03.github.io", // Your live frontend URL
  "http://localhost:3000",           // For local development
  "http://127.0.0.1:5500"            // For local development
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
  res.json([ { name: "Drip Irrigation", desc: "Efficient water use for crops" }, { name: "Organic Farming", desc: "Eco-friendly farming techniques" }, { name: "Precision Agriculture", desc: "Uses technology like GPS and sensors to observe, measure, and respond to variability in crops." }, { name: "Hydroponics", desc: "A soilless farming technique where plants are grown in a nutrient-rich water solution." }, { name: "Vertical Farming", desc: "Growing crops in vertically stacked layers, often indoors, to maximize space." }, ]);
});

app.get("/schemes", (req, res) => {
  res.json([ { name: "PM-Kisan Samman Nidhi", benefit: "₹6000 per year direct income support", desc: "A central government scheme that provides income support to all landholding farmer families.", link: "https://pmkisan.gov.in/" }, { name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", benefit: "Insurance cover against crop failure", desc: "Provides comprehensive insurance coverage against crop loss due to non-preventable natural calamities.", link: "https://pmfby.gov.in/" }, { name: "Soil Health Card Scheme", benefit: "Free soil testing and nutrient report", desc: "Farmers are issued Soil Health Cards which provide information on the nutrient status of their soil.", link: "https://soilhealth.dac.gov.in/" }, ]);
});

app.get("/diseases", (req, res) => {
  res.json([ { crop: "Wheat", disease: "Rust", solution: "Use resistant varieties and timely fungicide application." }, { crop: "Rice", disease: "Blast", solution: "Use resistant varieties, proper field spacing, and fungicide." }, { crop: "Potato", disease: "Late Blight", solution: "Apply fungicides preventively and ensure good field drainage." }, ]);
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