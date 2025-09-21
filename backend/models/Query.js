const mongoose = require("mongoose");
const QuerySchema = new mongoose.Schema({ N: Number, P: Number, K: Number, temperature: Number, humidity: Number, ph: Number, rainfall: Number, recommended: [String] });
module.exports = mongoose.model("Query", QuerySchema);