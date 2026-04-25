import { COUNTRIES } from "@/lib/Traderules";
import { AIRPORTS, PORTS } from "@/lib/data/ports";
import { MAP_ROUTES, TRADE_ROUTES } from "@/lib/data/routes";

/**
 * Single data-provider abstraction for external/logistics datasets.
 *
 * Priority order:
 * 1) optional live providers (when API keys configured)
 * 2) deterministic curated fallback datasets
 */

async function fetchOpenStreetMapPlace(query) {
  const endpoint = "https://nominatim.openstreetmap.org/search";
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
  });

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    headers: {
      "Accept-Language": "en",
      "User-Agent": "Meridian-Logistics/1.0",
    },
  });

  if (!response.ok) return null;
  const payload = await response.json();
  if (!payload?.length) return null;

  return {
    lat: Number(payload[0].lat),
    lon: Number(payload[0].lon),
    displayName: payload[0].display_name,
  };
}

export async function getPorts() {
  return PORTS;
}

export async function getAirports() {
  return AIRPORTS;
}

export async function getTradeRoutes() {
  return TRADE_ROUTES;
}

export async function getMapRoutes() {
  return MAP_ROUTES;
}

export async function getCountries() {
  return COUNTRIES;
}

export async function resolveCountryCentroid(countryName) {
  try {
    return await fetchOpenStreetMapPlace(countryName);
  } catch {
    return null;
  }
}
