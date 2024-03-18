// api/edit/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Review from "../../../models/review";

// GET a review by ID
export async function GET(request, { params: { id } }) {
  try {
    // Connect to the DB
    await dbConnect();

    // Get the review by ID
    const review = await Review.findById(id);

    // If review is not found, return 404 Not Found
    if (!review) {
      return NextResponse.json(
        {
          message: "Review not found",
        },
        { status: 404 }
      );
    }

    // If review is found, return it with status 200 OK
    return NextResponse.json(
      {
        message: "Ok",
        data: review,
      },
      { status: 200 }
    );
  } catch (error) {
    // If an error occurs, return 500 Internal Server Error
    return NextResponse.json(
      {
        message: "Failed to fetch the review",
        error,
      },
      { status: 500 }
    );
  }
}

//EDIT a review
export async function PUT(request, { params: { id } }) {
  try {
    const { newText: text } = await request.json();
    const newReview = { text };

    // Connect to the DB
    await dbConnect();

    await Review.findByIdAndUpdate(id, newReview);
    return NextResponse.json(
      {
        message: "Review updated successfully",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update review",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE A REVIEW
export async function DELETE(request, { params: { id } }) {
  try {
    // Check if id is valid before proceeding
    if (!id) {
      return NextResponse.json(
        {
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    // Connect to the DB
    await dbConnect();

    // Use the model to delete
    const result = await Review.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        {
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Review deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to delete a review",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
