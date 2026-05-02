import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Hits Google Places Nearby Search if a key is configured.
// Otherwise returns the demo data the UI seeds with.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || !lat || !lng) {
    return NextResponse.json({ pharmacies: [] });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=4000&type=pharmacy&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    const data = await res.json();

    const pharmacies = (data.results ?? []).map((p: any) => ({
      id: p.place_id,
      name: p.name,
      address: p.vicinity,
      rating: p.rating,
      open: p.opening_hours?.open_now ?? null,
      lat: p.geometry?.location?.lat,
      lng: p.geometry?.location?.lng,
    }));

    return NextResponse.json({ pharmacies });
  } catch (err) {
    console.error("[pharmacy]", err);
    return NextResponse.json({ pharmacies: [] }, { status: 500 });
  }
}
