import mongoose, { Schema } from "mongoose";

const citySchema = new Schema({
  name: {
    type: String
  },

  image: {
    type: String
    
  }
});

const CityModel =
  mongoose.models.CityModel || mongoose.model("CityModel", citySchema);

export default CityModel;