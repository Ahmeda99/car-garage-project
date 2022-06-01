// we are adding mongoose to this file
const mongoose = require("mongoose");

// we are creating a new book schema object.
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  img: String,
  founded: Number,
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;