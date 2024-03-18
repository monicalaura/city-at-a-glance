import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  text: String,
  city: {
    type: Schema.Types.ObjectId,
    ref: 'CityModel', // Reference to the CityModel
  },  
});

const Review =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);

export default Review;
