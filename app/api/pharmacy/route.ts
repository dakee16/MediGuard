import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Haversine distance in miles
function distMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ pharmacies: [], demo: !apiKey });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=4000&type=pharmacy&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    const data = await res.json();

    if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("[pharmacy api]", data.status, data.error_message);
      return NextResponse.json(
        { pharmacies: [], error: data.error_message ?? data.status },
        { status: 500 }
      );
    }

    const pharmacies = (data.results ?? [])
      .map((p: any) => {
        const pLat = p.geometry?.location?.lat;
        const pLng = p.geometry?.location?.lng;
        if (typeof pLat !== "number" || typeof pLng !== "number") return null;
        const distance = distMiles(lat, lng, pLat, pLng);
        return {
          id: p.place_id,
          name: p.name,
          address: p.vicinity ?? "",
          rating: p.rating,
          open: p.opening_hours?.open_now ?? null,
          hours: p.opening_hours?.open_now === true ? "Open now" : p.opening_hours?.open_now === false ? "Closed" : undefined,
          distance: `${distance.toFixed(1)} mi`,
          lat: pLat,
          lng: pLng,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, 20);

    return NextResponse.json({ pharmacies });
  } catch (err) {
    console.error("[pharmacy]", err);
    return NextResponse.json({ pharmacies: [], error: String(err) }, { status: 500 });
  }
}
