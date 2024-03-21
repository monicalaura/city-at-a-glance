//get a review by id

export default async function getSingleReview(id) {
  try {
    const response = await fetch(
      `https://city-at-a-glance.vercel.app/api/edit/${id}`,
      {
        cache: "no-store",
      }
    );
    const review = await response.json();
    return review.data;
  } catch (error) {
    console.log(error);
  }
}
