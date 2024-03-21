"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { FaTrash } from "react-icons/fa";

export default function DeleteReview({ id }) {
  const router = useRouter();

  async function handleDeleteReview() {
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (confirmed) {
      console.log(`Deleting review with ID: ${id}`);
      await fetch(
        `https://city-at-a-glance-aylb0vcvd-monica-laura-burns-projects.vercel.app/api/edit/${id}`,
        {
          method: "DELETE",
        }
      );
      alert("Review deleted successfully");
      router.push("/favorites");
      router.refresh();
    }
  }
  return (
    <button
      onClick={handleDeleteReview}
      className="bg-brand-accent text-white p-2 rounded-md hover:bg-brand-primary transition-all duration-300"
    >
      <FaTrash className="text-sm" />
    </button>
  );
}
