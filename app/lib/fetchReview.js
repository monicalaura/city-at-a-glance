//get a review by city name

export default async function fetchReview(cityName) {
  try {
    const response = await fetch(
      `../api/reviews/${encodeURIComponent(cityName)}`
    );
    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      throw new Error(`Failed to fetch review: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
}
