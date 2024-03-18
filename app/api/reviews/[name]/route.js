//api/reviews/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import CityModel from '../../../models/city'; 
import Review from '../../../models/review';

//POST a review
export async function POST(request, { params }) {
  try {
    // Extract city name from the URL
    const { name } = params;

  console.log('Current city from params:'+ name);
  
  // Get the city by name
      const city = await CityModel.findOne({ name });

    if (!city) {
      console.log('City not found:', name);
      return NextResponse.json(
        {
          message: "City not found",
        },
        { status: 404 }
      );
    }

    //Get the data from the request
    const { text } = await request.json();
    console.log('Review text:', text);
  
      const newReview = {
       text,
       city: city._id, 
      };
  
    // Connect to DB
    await dbConnect();
    console.log('Connected to the database.');
  
    //Use the Model to create review 
    await Review.create(newReview);
    console.log('Review created successfully.');

    return NextResponse.json(
        {
          message: "Review created successfully",
          data: newReview,
        },
        { status: 201 }
      );

    } catch (error) {
      console.error('Error creating review:', error);
      
      return NextResponse.json(
        {
          message: "Failed to Create a Review",
          error,
        },
        {
          status: 500,
        }
      );
    }
  }

  //GET a review by the city name
  export async function GET(request, { params }) {
    try {
      await dbConnect();
      // Get the city by name
      const { name } = params;
      const city = await CityModel.findOne({ name });
  
      if (!city) {
        return NextResponse.json({ status: 404, message: 'City not found' });
      }
  
      // Fetch reviews associated with the city
      const reviews = await Review.find({ city: city._id });
  
      return NextResponse.json({
        status: 200,
        data: reviews,
        message: 'Success',
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({
        status: 500,
        message: 'Failed to fetch reviews',
        error: error.message,
      });
    }
  }

 
  
