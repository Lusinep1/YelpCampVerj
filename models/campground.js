const mongoose = require("mongoose");
// shortcut or mongoose.Schema-yin reference enenq
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Campground", campgroundSchema);
