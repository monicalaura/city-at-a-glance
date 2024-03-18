
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import CityModel from '../../../models/city';



// DELETE A CITY from favorites
export async function DELETE(request, { params: { id } }) {
  try {
    // Check if id is valid before proceeding
    if (!id) {
      return NextResponse.json({
        message: 'Invalid review ID',
      }, {
        status: 400,
      });
    }

    // Connect to the DB
    await dbConnect();

    // Use the model to delete
    const result = await CityModel.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({
        message: 'City not found',
      }, {
        status: 404,
      });
    }    

    return NextResponse.json({
      message: 'City deleted successfully',
    }, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Failed to delete the city',
      error: error.message,
    }, {
      status: 500,
    });
  }
}