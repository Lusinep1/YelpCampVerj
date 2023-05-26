// express
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// require model
const Campground = require("./models/campground");

// mongoose
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection; // or chgrem mongoose.connection.on kam once
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// setter
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "Cheap Camping",
  });
  await camp.save();
  res.send("camp");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
