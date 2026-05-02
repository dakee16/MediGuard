"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  ShoppingBag,
  Search,
  Phone,
  Clock,
  Star,
  Navigation,
  Loader2,
} from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { LiquidGlass } from "../../../components/ui/liquid-glass";
import { cn } from "../../../lib/utils";
import { AuthGate } from "../../../components/auth/auth-gate";
import type { Pharmacy, MarketListing } from "../../../types";

// Default center — State College, PA (matches the app's current city context)
const DEFAULT_CENTER = { lat: 40.7934, lng: -77.86 };

const FALLBACK_PHARMACIES: Pharmacy[] = [
  { id: "1", name: "CVS Pharmacy", address: "120 W College Ave", distance: "0.4 mi", rating: 4.2, open: true, hours: "Open until 10 PM", phone: "(814) 234-1980", lat: 40.7934, lng: -77.86 },
  { id: "2", name: "Rite Aid", address: "224 W Beaver Ave", distance: "0.6 mi", rating: 4.0, open: true, hours: "Open until 9 PM", phone: "(814) 237-9900", lat: 40.7938, lng: -77.8624 },
  { id: "3", name: "Wegmans Pharmacy", address: "345 Colonnade Way", distance: "1.2 mi", rating: 4.7, open: true, hours: "Open until 9 PM", phone: "(814) 235-4400", lat: 40.8003, lng: -77.8765 },
  { id: "4", name: "Giant Pharmacy", address: "2222 N Atherton St", distance: "2.1 mi", rating: 4.3, open: false, hours: "Opens at 9 AM", phone: "(814) 234-9620", lat: 40.8245, lng: -77.8735 },
];

const MARKETPLACE_LISTINGS: MarketListing[] = [
  { id: "1", medicationName: "Atorvastatin 10mg", vendor: "Costco", price: 9.99, unit: "30 tablets", shipping: "Members" },
  { id: "2", medicationName: "Atorvastatin 10mg", vendor: "Amazon Pharmacy", price: 12.49, unit: "30 tablets", shipping: "Free Prime" },
  { id: "3", medicationName: "Vitamin D3 2000IU", vendor: "CVS", price: 11.99, unit: "60 capsules" },
  { id: "4", medicationName: "Vitamin D3 2000IU", vendor: "Amazon Pharmacy", price: 8.99, unit: "60 capsules", shipping: "Free Prime" },
  { id: "5", medicationName: "Metformin 500mg", vendor: "Walgreens", price: 18.99, unit: "60 tablets" },
  { id: "6", medicationName: "Metformin 500mg", vendor: "Costco", price: 14.49, unit: "60 tablets", shipping: "Members" },
  { id: "7", medicationName: "Omega-3 1000mg", vendor: "Amazon Pharmacy", price: 18.49, unit: "60 capsules", shipping: "Free Prime" },
  { id: "8", medicationName: "Levothyroxine 50mcg", vendor: "GoodRx", price: 7.99, unit: "30 tablets" },
  { id: "9", medicationName: "Lisinopril 10mg", vendor: "CVS", price: 12.99, unit: "30 tablets" },
  { id: "10", medicationName: "Albuterol Inhaler", vendor: "GoodRx", price: 24.99, unit: "1 inhaler" },
  { id: "11", medicationName: "Sertraline 50mg", vendor: "Amazon Pharmacy", price: 9.99, unit: "30 tablets", shipping: "Free Prime" },
  { id: "12", medicationName: "Levothyroxine 50mcg", vendor: "Costco", price: 6.49, unit: "30 tablets", shipping: "Members" },
];

type Tab = "nearby" | "buy";

export default function PharmacyPage() {
  return (
    <AuthGate>
      <PharmacyContent />
    </AuthGate>
  );
}

function PharmacyContent() {
  const [tab, setTab] = useState<Tab>("nearby");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-2">
          Live data · Powered by Google Places
        </p>
        <h1 className="font-display text-display-md text-ink-950">Pharmacy</h1>
      </header>

      <LiquidGlass variant="strong" className="!rounded-full p-1 grid grid-cols-2 gap-1 max-w-md">
        <button
          onClick={() => setTab("nearby")}
          className={cn(
            "py-2.5 rounded-full font-medium text-sm transition-all relative",
            tab === "nearby" ? "bg-white text-ink-900 shadow-soft" : "text-ink-600"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Nearby
          </span>
        </button>
        <button
          onClick={() => setTab("buy")}
          className={cn(
            "py-2.5 rounded-full font-medium text-sm transition-all relative",
            tab === "buy" ? "bg-white text-ink-900 shadow-soft" : "text-ink-600"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Buy online
          </span>
        </button>
      </LiquidGlass>

      {tab === "nearby" && <NearbyTab />}
      {tab === "buy" && <BuyTab search={search} onSearch={setSearch} />}
    </div>
  );
}

// =============================================================================
// NEARBY (real Google Maps + Places)
// =============================================================================

function NearbyTab() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(FALLBACK_PHARMACIES);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "mediguard-maps",
  });

  // Get user location on mount
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        // Permission denied — keep default center
        setLocating(false);
      },
      { timeout: 6000 }
    );
  }, []);

  // Fetch nearby pharmacies whenever center changes
  useEffect(() => {
    let cancelled = false;
    async function fetchNearby() {
      setLoadingNearby(true);
      try {
        const res = await fetch(`/api/pharmacy?lat=${center.lat}&lng=${center.lng}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.pharmacies && data.pharmacies.length > 0) {
          setPharmacies(
            data.pharmacies.map((p: any, i: number) => ({
              ...p,
              distance: p.distance ?? "",
            }))
          );
        }
      } catch (err) {
        console.error("[pharmacy fetch]", err);
      } finally {
        if (!cancelled) setLoadingNearby(false);
      }
    }
    fetchNearby();
    return () => {
      cancelled = true;
    };
  }, [center]);

  const mapContainerStyle = { width: "100%", height: "480px", borderRadius: "1.5rem" };

  return (
    <div className="grid md:grid-cols-5 gap-4">
      {/* Map */}
      <div className="md:col-span-3 relative">
        {loadError && (
          <LiquidGlass variant="strong" className="p-8 min-h-[420px] flex items-center justify-center">
            <div className="text-center">
              <p className="font-display text-lg text-ink-950">Maps couldn't load</p>
              <p className="text-sm text-ink-600 mt-2 max-w-xs">
                Check that NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set and Maps JavaScript API is enabled.
              </p>
            </div>
          </LiquidGlass>
        )}

        {!loadError && !apiKey && (
          <LiquidGlass variant="strong" className="p-8 min-h-[420px] flex items-center justify-center">
            <div className="text-center max-w-xs">
              <MapPin className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <p className="font-display text-lg text-ink-950">Map demo mode</p>
              <p className="text-sm text-ink-600 mt-2">
                Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your env to enable the live map.
              </p>
            </div>
          </LiquidGlass>
        )}

        {!loadError && apiKey && !isLoaded && (
          <LiquidGlass variant="strong" className="p-8 min-h-[420px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
          </LiquidGlass>
        )}

        {isLoaded && (
          <LiquidGlass variant="strong" className="!p-1 overflow-hidden relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                styles: MAP_STYLES,
                gestureHandling: "greedy",
              }}
            >
              {/* User pin */}
              <Marker
                position={center}
                icon={{
                  path: typeof google !== "undefined" ? google.maps.SymbolPath.CIRCLE : 0,
                  scale: 8,
                  fillColor: "#e35d45",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 3,
                }}
              />

              {/* Pharmacy pins */}
              {pharmacies.map((p) => (
                <Marker
                  key={p.id}
                  position={{ lat: p.lat, lng: p.lng }}
                  onClick={() => setActiveId(p.id)}
                  icon={{
                    path: typeof google !== "undefined" ? google.maps.SymbolPath.CIRCLE : 0,
                    scale: 10,
                    fillColor: "#349990",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }}
                />
              ))}

              {activeId && (() => {
                const p = pharmacies.find((x) => x.id === activeId);
                if (!p) return null;
                return (
                  <InfoWindow
                    position={{ lat: p.lat, lng: p.lng }}
                    onCloseClick={() => setActiveId(null)}
                  >
                    <div style={{ minWidth: 160, fontFamily: "system-ui" }}>
                      <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: "#6f6759", margin: "2px 0 0" }}>
                        {p.address}
                      </p>
                    </div>
                  </InfoWindow>
                );
              })()}
            </GoogleMap>

            {loadingNearby && (
              <div className="absolute top-4 left-4 glass-strong px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-ink-700 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Finding pharmacies…
              </div>
            )}

            {locating && (
              <div className="absolute top-4 right-4 glass-strong px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-ink-700">
                Locating…
              </div>
            )}
          </LiquidGlass>
        )}
      </div>

      {/* List */}
      <div className="md:col-span-2 space-y-3 max-h-[calc(100vh-12rem)] md:overflow-y-auto md:pr-1 no-scrollbar">
        {pharmacies.length === 0 && !loadingNearby && (
          <p className="text-sm text-ink-500 italic p-4">No pharmacies found nearby.</p>
        )}
        {pharmacies.map((p) => (
          <LiquidGlass
            key={p.id}
            variant="default"
            className={cn(
              "p-5 cursor-pointer transition-all",
              activeId === p.id && "shadow-glass-lg !bg-teal-50/40"
            )}
            onClick={() => setActiveId(p.id)}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg text-ink-950 truncate">{p.name}</p>
                <p className="text-xs text-ink-600 truncate">{p.address}</p>
              </div>
              {p.distance && (
                <span className="font-mono text-xs text-teal-700 shrink-0">{p.distance}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-ink-600 mb-3 flex-wrap">
              {p.rating !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-coral-400 stroke-coral-400" />
                  {p.rating.toFixed(1)}
                </span>
              )}
              {p.hours && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className={cn(p.open ? "text-teal-700" : "text-coral-700")}>
                    {p.hours}
                  </span>
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="glass-button px-3 py-1.5 text-xs flex-1 !justify-center"
              >
                <Navigation className="w-3 h-3" />
                Directions
              </a>
              {p.phone && (
                <a
                  href={`tel:${p.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-button px-3 py-1.5 text-xs flex-1 !justify-center"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              )}
            </div>
          </LiquidGlass>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// BUY (marketplace)
// =============================================================================

function BuyTab({ search, onSearch }: { search: string; onSearch: (s: string) => void }) {
  const filtered = search
    ? MARKETPLACE_LISTINGS.filter((l) =>
        l.medicationName.toLowerCase().includes(search.toLowerCase())
      )
    : MARKETPLACE_LISTINGS;

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, MarketListing[]>>((acc, l) => {
      if (!acc[l.medicationName]) acc[l.medicationName] = [];
      acc[l.medicationName].push(l);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div className="space-y-5">
      <LiquidGlass variant="default" className="p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-ink-500 ml-2" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search any medication…"
          className="flex-1 bg-transparent border-none outline-none text-sm text-ink-900 placeholder:text-ink-500"
        />
      </LiquidGlass>

      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-500">
        {Object.keys(grouped).length} medications · {filtered.length} listings
      </p>

      <div className="space-y-5">
        {Object.entries(grouped).map(([med, options]) => (
          <div key={med}>
            <h3 className="font-display text-xl text-ink-950 mb-3 px-1">{med}</h3>
            <div className="grid gap-2">
              {options
                .sort((a, b) => a.price - b.price)
                .map((listing, i) => (
                  <LiquidGlass key={listing.id} variant="default" className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display text-sm text-ink-950">{listing.vendor}</p>
                        {i === 0 && (
                          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal-600 text-white">
                            Best price
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {listing.unit}
                        {listing.shipping && (
                          <span className="text-teal-700"> · {listing.shipping}</span>
                        )}
                      </p>
                    </div>
                    <p className="font-mono text-base tabular-nums text-ink-900">
                      ${listing.price.toFixed(2)}
                    </p>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(med + " " + listing.vendor)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary !py-2 !px-4 !text-xs"
                    >
                      Buy
                    </a>
                  </LiquidGlass>
                ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(grouped).length === 0 && (
        <LiquidGlass variant="tint" className="p-12 text-center">
          <Search className="w-8 h-8 text-ink-400 mx-auto mb-4" />
          <p className="font-display text-xl text-ink-950">No listings match "{search}"</p>
          <p className="text-sm text-ink-600 mt-1">Try a different search term.</p>
        </LiquidGlass>
      )}
    </div>
  );
}

// =============================================================================
// MAP STYLES — soft warm theme matching the design system
// =============================================================================

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f3f1ec" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5a5347" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#faf9f7" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e6e2d8" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8a8170" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d7f1ec" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#287872" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#5a5347" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fbd3ca" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#8f2f1d" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e6e2d8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b1e3d9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#287872" }] },
];
