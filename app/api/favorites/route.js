// app/api/favorites/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import CityModel from '@/app/models/city'; 
import mongoose from "mongoose";

export async function POST(req) {
  const { name, image } = await req.json();

  try {
    await connectDB();

     // Check if the city already exists in the database
     const existingCity = await CityModel.findOne({ name });

     if (existingCity) {
       // City already exists, return a response indicating this to the user
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
