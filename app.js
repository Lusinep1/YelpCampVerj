// express
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// require model
const Campground = require("./models/campground");

// require error handling routes
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

// require method-override
const methodOverride = require("method-override");

// require ejs-mate
const ejsMate = require("ejs-mate");

// require cities then seedHelpers
const cities = require("./seeds/cities");
const { descriptors, places } = require("./seeds/seedHelpers");

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
app.engine("ejs", ejsMate);

// uses
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// routes
app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

// index
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// new&create

// new
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// create
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// edit&update

// edit
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// update
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// show
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //kam const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// delete
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// basic error handler
app.use((err, req, res, next) => {
  // const {status=500, message=''} = err;
  res.send("Oh boi!, somthing went wrong");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
