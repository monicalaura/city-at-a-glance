import getSingleReview from "../../lib/getSingleReview";
import EditForm from "../../components/EditForm";
import React from "react";

export default async function EditReview({ params: { id } }) {
  const review = await getSingleReview(id);
  return (
    <>
      <EditForm review={review} />
    </>
  );
}