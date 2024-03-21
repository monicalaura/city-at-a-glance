"use client";

//add review form & show review

import { useState, useEffect } from "react";
import Link from "next/link";
import fetchReview from "../lib/fetchReview";
import { FaEdit } from "react-icons/fa";
import DeleteReview from "./DeleteReview";

export default function AddReviewForm({ cityName }) {
  const [showForm, setShowForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [text, setText] = useState("");
  const [review, setReview] = useState(null);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newReview = { text };

    try {
      const response = await fetch(
        `https://city-at-a-glance.vercel.app/api/reviews/${encodeURIComponent(
          cityName
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);

      if (response.status === 201) {
        setReviewSubmitted(true);
        alert("Your review was successfully created!");
        setShowForm(false);
        // Reset reviewSubmitted to false after a delay
        setTimeout(() => setReviewSubmitted(false), 1000);
      } else {
        console.error("Error submitting review:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const reviewData = await fetchReview(cityName);
        console.log("Review data:", reviewData);
        console.log("Review data.data[0]:", reviewData.data[0]);

        setReview(reviewData.data.length > 0 ? reviewData.data[0] : null);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    if (reviewSubmitted || review === null) {
      fetchReviewData();
    }
  }, [cityName, reviewSubmitted, review]);

  const truncatedReview = review?.text.substring(0, 1000);

  return (
    <div className="container mx-auto my-8 flex justify-center items-center">
      {review ? (
        <div className="max-w-full lg:max-w-full">
          <h2 className="text-brand-primary text-2xl font-bold mb-4 text-center">
            Your Review
          </h2>
          <div className="text-center controls">
            <Link href={`/edit-review/${review._id}`} title="Edit">
              <button className="edit bg-brand-primary text-white p-2 rounded-md hover:bg-brand-accent transition-all duration-300 mr-2 ">
                <FaEdit className="text-sm" />
              </button>
            </Link>
            <DeleteReview id={review._id} />
            {console.log("Review id:" + review._id)}
          </div>
          <p className="max-w-full lg:max-w-screen-xl overflow-x-hidden overflow-y-auto mx-auto text-lg lg:text-xl mt-5 text-justify p-3 description">
            {truncatedReview}
          </p>
        </div>
      ) : (
        <button
          onClick={handleShowForm}
          className={`bg-brand-primary text-white p-3 rounded-md hover:bg-brand-accent transition-all duration-300 ${
            showForm ? "hidden" : ""
          }`}
        >
          {" "}
          Add a Review
        </button>
      )}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-lg w-full text-center p-8 bg-white shadow-md rounded-md"
        >
          <h2 className="text-brand-primary text-2xl font-bold mb-4">
            Your Review
          </h2>
          <textarea
            id="review"
            name="review"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-4 p-2 border rounded-md w-full resize-none"
            placeholder="Write your review"
          />
          <button
            type="submit"
            className="mt-6 bg-brand-primary text-white p-3 rounded-md w-full hover:bg-brand-accent transition-all duration-300"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
