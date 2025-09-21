const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");

const Contact = require("./models/Contact");
const Query = require("./models/Query");
const Crop = require("./models/Crop");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.post("/recommend", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5001/predict", {
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
  const crops = await Crop.find();
  res.json(crops);
});

app.get("/techniques", (req, res) => {
  res.json([
    { name: "Drip Irrigation", desc: "An efficient method that delivers water directly to the plant's root zone, minimizing evaporation and saving water." },
    { name: "Organic Farming", desc: "A holistic system that avoids synthetic fertilizers and pesticides, focusing on soil health and biodiversity." },
    { name: "Precision Agriculture", desc: "Uses technology like GPS and sensors to observe, measure, and respond to variability in crops, optimizing returns and preserving resources." },
    { name: "Hydroponics", desc: "A soilless farming technique where plants are grown in a nutrient-rich water solution, allowing for higher yields in smaller spaces." },
    { name: "Vertical Farming", desc: "Growing crops in vertically stacked layers, often indoors, to maximize space and control the growing environment." },
    { name: "Conservation Tillage", desc: "A farming method that reduces the amount of tillage, which helps prevent soil erosion and improves soil health over time." },
    { name: "Integrated Pest Management (IPM)", desc: "An eco-friendly approach to pest control that combines biological, cultural, and chemical methods to minimize economic and health risks." },
    { name: "Agroforestry", desc: "The intentional integration of trees and shrubs into crop and animal farming systems to create environmental and economic benefits." },
    { name: "Crop Rotation", desc: "The practice of planting different crops sequentially on the same plot of land to improve soil health and help control pests and weeds." },
    { name: "Aeroponics", desc: "An advanced form of hydroponics where plant roots are suspended in the air and misted with a nutrient solution, requiring even less water." }
  ]);
});

app.get("/schemes", (req, res) => {
  res.json([
    { name: "PM-Kisan Samman Nidhi", benefit: "₹6000 per year direct income support", desc: "A central government scheme that provides income support to all landholding farmer families in the country.", link: "https://pmkisan.gov.in/" },
    { name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", benefit: "Insurance cover against crop failure", desc: "Provides comprehensive insurance coverage against crop loss due to non-preventable natural calamities.", link: "https://pmfby.gov.in/" },
    { name: "Soil Health Card Scheme", benefit: "Free soil testing and nutrient report", desc: "Farmers are issued Soil Health Cards which provide information on the nutrient status of their soil along with recommendations on fertilizer dosage.", link: "https://soilhealth.dac.gov.in/" },
    { name: "Kisan Credit Card (KCC) Scheme", benefit: "Low-interest institutional credit", desc: "Ensures that farmers have access to timely and affordable credit for their agricultural needs without the constraints of location or complex procedures.", link: "https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card" },
    { name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)", benefit: "Financial support for irrigation", desc: "Aims to enhance water access by expanding cultivable area under assured irrigation, improving water use efficiency, and promoting sustainable water conservation practices.", link: "https://pmksy.gov.in/" },
    { name: "e-NAM (National Agriculture Market)", benefit: "Online commodity trading platform", desc: "A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.", link: "https://www.enam.gov.in/web/" },
    { name: "Rashtriya Krishi Vikas Yojana (RKVY)", benefit: "Funding for agri-infrastructure projects", desc: "Allows states to choose their own agriculture and allied sector development activities as per their district/state agriculture plans.", link: "https://rkvy.nic.in/" },
    { name: "Paramparagat Krishi Vikas Yojana (PKVY)", benefit: "Promotion of organic farming", desc: "Aims to support and promote organic farming, which results in improvement of soil health and organic matter content.", link: "https://pgsindia-ncof.gov.in/pkvy/index.html" },
    { name: "National Mission for Sustainable Agriculture (NMSA)", benefit: "Promotes climate-resilient practices", desc: "Formulated to enhance agricultural productivity especially in rainfed areas focusing on integrated farming, soil health management, and synergizing resource conservation.", link: "https://nmsa.dac.gov.in/" },
    { name: "Machinery and Equipment Subsidy", benefit: "Subsidy on purchase of farm machinery", desc: "Sub-Mission on Agricultural Mechanization (SMAM) provides subsidies to farmers for the purchase of modern agricultural equipment to improve efficiency.", link: "https://farmech.dac.gov.in/" }
  ]);
});

app.get("/diseases", (req, res) => {
  res.json([
    { crop: "Wheat", disease: "Rust", solution: "Use resistant varieties and timely fungicide application." },
    { crop: "Rice", disease: "Blast", solution: "Use resistant varieties, proper field spacing, and fungicide." },
    { crop: "Potato", disease: "Late Blight", solution: "Apply fungicides preventively and ensure good field drainage." },
    { crop: "Tomato", disease: "Leaf Curl Virus", solution: "Control the whitefly population (vector) and remove infected plants." },
    { crop: "Cotton", disease: "Bollworm", solution: "Use pest-resistant (Bt) varieties and Integrated Pest Management (IPM)." },
    { crop: "Maize", disease: "Stalk Rot", solution: "Practice crop rotation and use resistant hybrid seeds." }
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

app.listen(PORT, () => console.log(`🚀 Express running at http://localhost:${PORT}`));