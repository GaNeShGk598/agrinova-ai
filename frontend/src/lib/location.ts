export interface Coords {
  lat: number;
  lon: number;
  source: "gps" | "fallback";
}

const FALLBACK: Coords = { lat: 20.5937, lon: 78.9629, source: "fallback" };

export function getUserLocation(): Promise<Coords> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(FALLBACK);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          source: "gps",
        }),
      () => resolve(FALLBACK),
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  });
}
