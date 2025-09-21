const mongoose = require("mongoose");
const CropSchema = new mongoose.Schema({ name: String, soil: String, climate: String, yield: String });
module.exports = mongoose.model("Crop", CropSchema);