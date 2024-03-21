"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function EditForm({ review }) {
  const router = useRouter();
  const [newText, setNewText] = useState(review.text);

  async function handleSubmit(e) {
    e.preventDefault();
    const newReview = { newText };

    const response = await fetch(
      `https://city-at-a-glance.vercel.app/api/edit/${review._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      }
    );
    if (response.status == 201) {
      alert("Your review was updated!");
      router.push("/favorites");
      router.refresh();
    }
    console.log(newReview);
  }
  return (
    <div className="container mx-auto max-w-full my-8 text-center edit-form mt-5">
      <form
        onSubmit={handleSubmit}
        className="max-w-full text-center p-7 shadow-md rounded-md"
      >
        <textarea
          type="text"
          rows="8"
          placeholder="Enter review text"
          onChange={(e) => setNewText(e.target.value)}
          value={newText}
          className=" bg-text-white text-justify textarea p-5"
        />
        <button
          type="submit"
          className="mt-6 bg-brand-primary text-white p-2 rounded-md w-full hover:bg-brand-accent transition-all duration-300 btn-edit"
        >
          Update review
        </button>
      </form>
    </div>
  );
}
