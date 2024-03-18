import mongoose, { Schema } from "mongoose";


// Check if the CityModel already exists before defining it
const CityModel =
  mongoose.models.CityModel ||
  mongoose.model("CityModel", {
    name: {
      type: String,  
    },
    image: {
      type: String,
      required: false,      
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  });


export default CityModel;
