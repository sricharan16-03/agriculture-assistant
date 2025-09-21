const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // This line imports the cors package
const fetch = require("node-fetch");

const Contact = require("./models/Contact");
const Query = require("./models/Query");
const Crop = require("./models/Crop");

const app = express();
const PORT = process.env.PORT || 5000; // Use port provided by Render

// Middleware
app.use(cors()); // This line tells your server to allow requests from other origins
app.use(express.json());

// MongoDB Database Connection using environment variable
mongoose.connect(process.env.MONGO_URI);

// --- API Endpoints ---
// ... (All your endpoints like /recommend, /crops, /schemes, etc. go here) ...
// (The full server code from the previous response is correct)
app.get("/crops", async (req, res) => {
  const crops = await Crop.find();
  res.json(crops);
});
// ... and so on for all other routes ...


// Start the Server
app.listen(PORT, () => console.log(`🚀 Express running on port ${PORT}`));