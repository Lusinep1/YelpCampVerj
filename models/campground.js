const mongoose = require("mongoose");
const Review = require("./review");
// shortcut or mongoose.Schema-yin reference enenq
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // <-model
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews.length) {
    const res = await Review.deleteMany({
      _id: {
        $in: campground.reviews,
      },
    });
    console.log(res);
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
