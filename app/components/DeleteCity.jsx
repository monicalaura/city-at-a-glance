"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { FaTrash } from "react-icons/fa";

export default function DeleteCity({ id }) {
  const router = useRouter();

  async function handleDeleteCity() {
    const confirmed = confirm("Are you sure you want to delete this city?");
    if (confirmed) {
      try {
        console.log(`Deleting city with ID: ${id}`);
        const response = await fetch(
          `https://city-at-a-glance-aylb0vcvd-monica-laura-burns-projects.vercel.app/api/del-city/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("City deleted successfully");

          window.location.reload();
          router.push("/favorites");
        } else {
          console.error("Failed to delete city");
        }
      } catch (error) {
        console.error("Error deleting city:", error);
      }
    }
  }

  return (
    <button
      onClick={handleDeleteCity}
      className="bg-brand-accent text-white p-2 rounded-md hover:bg-brand-primary transition-all duration-300"
    >
      <FaTrash className="text-sm" />
    </button>
  );
}
