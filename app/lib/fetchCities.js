//fetch all favorite cities

export default async function fetchCities() {
  try {
    const res = await fetch("../api/favorites", { cache: "no-store" });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}
