// express
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// require models
const Campground = require("./models/campground");
const Review = require("./models/review");

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

// reauire schemas
const { campgroundSchema, reviewSchema } = require("./schemas.js");

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

// defining middleware function for Joi
const vallidateCampgound = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// defining middleware function for Joi for reviewSchema to Validate
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

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
  vallidateCampgound,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    // throw new ExpressError(400, "Invalid Campground Data");
    //above: so that you can't add new campground through Postman:

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
  vallidateCampgound,
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
    const campground = await Campground.findById(id).populate("reviews");
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

// Review route
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

// Delete Review
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

// to add statuscode and message for wrong url
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found, 404"));
});

// basic error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.messgae = "app.use error";
  res.status(statusCode).render("error.ejs", { err });
});

// Postmanov krnas orinak taza campground stexces u kstexcvi

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
