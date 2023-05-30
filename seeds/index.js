// require model
const Campground = require("../models/campground");
// require cities
const cities = require("./cities");
// require seedHelpers
const { places, descriptors } = require("./seedHelpers");

// mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection; // or chgrem mongoose.connection.on kam once
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// pick random item from the array (seedHelpers)
// array[Math.floor(Math.random() * array.length)];

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 51; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "lorem ipsum dolor sit u esim inch, aunt multum legendum esim inch. multum, non multa",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
