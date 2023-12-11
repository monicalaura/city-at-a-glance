// fetch city information from external APIs 

import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import CityModel from '../../models/city'; 
import mongoose from "mongoose";

// GET all favorite cities
export async function GET(req) {
  await dbConnect();
  try {
    const cities = await CityModel.find({});
   return NextResponse.json({status: 200, data: cities, message:"Success" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({status: 401, message: 'cities search could not be performed.' });
  }
}

//post favorite cities to db
export async function POST(req) {
  const { name, image } = await req.json();

  try {
    await dbConnect();

     const existingCity = await CityModel.findOne({ name });
     
     if (existingCity) {
       return NextResponse.json({
         msg: ["This city is already on the list of favorites"],
         success: false,
       });
     }
 
    const newCity = await CityModel.create({ name, image });

    console.log("City added to favorites:", newCity);

    return NextResponse.json({
      msg: ["City added to favorites"],
      success: true,
    });
  } catch (error) {
    console.error("Error adding city to favorites:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      console.log(errorList);
      return NextResponse.json({ msg: errorList });
    } else {
      return NextResponse.json({ msg: ["Unable to add city to favorites."] });
    }
  }
}
