import type { PricingBreakdown, RouteEstimate, ShipmentRequest } from "@/lib/logistics/types";
import type { NormalizedCargo } from "@/lib/logistics/pricing/normalization";

const OCEAN_FCL_20FT = { short: 1800, medium: 2800, long: 4200 };
const OCEAN_FCL_40FT = { short: 2600, medium: 4200, long: 6800 };
const OCEAN_LCL_PER_CBM = { short: 65, medium: 95, long: 140 };
const AIR_PER_KG = { short: 3.8, medium: 5.6, long: 7.2 };

const round = (v: number) => Math.round(v);

function haulBand(distanceKm: number) {
  if (distanceKm < 2500) return "short";
  if (distanceKm < 9000) return "medium";
  return "long";
}

export function calculateBreakdown(input: {
  distanceKm: number;
  mode: string;
  request: ShipmentRequest;
  cargo: NormalizedCargo;
  congestion: number;
  riskScore: number;
  seasonality: number;
  tariffRate: number;
  customsComplexity: number;
}): PricingBreakdown {
  const band = haulBand(input.distanceKm) as "short" | "medium" | "long";
  let transport = 0;

  if (input.mode === "ocean") {
    if (input.request.containerSize || input.cargo.teuEquivalent >= 0.9 || input.cargo.isContainerized) {
      const teu = Math.max(1, Math.ceil(input.cargo.teuEquivalent));
      const forty = Math.floor(teu / 2);
      const twenty = teu % 2;
      transport = (forty * OCEAN_FCL_40FT[band]) + (twenty * OCEAN_FCL_20FT[band]);
    } else {
      transport = Math.max(280, input.cargo.volumeM3 * OCEAN_LCL_PER_CBM[band]);
    }
  } else if (input.mode === "air") {
    const chargeableKg = Math.max(input.cargo.weightKg, input.cargo.volumeM3 * 167);
    transport = chargeableKg * AIR_PER_KG[band];
  } else if (input.mode === "rail") {
    transport = input.cargo.weightKg * (0.22 + input.distanceKm / 70000);
  } else {
    transport = input.cargo.weightKg * (0.3 + input.distanceKm / 45000);
  }

  const fuel = round(transport * (input.mode === "air" ? 0.18 : 0.09));
  const handling = round((input.mode === "ocean" ? 260 : 120) + input.cargo.palletCount * 8 + (input.cargo.teuEquivalent * 120));
  const tariffs = round((transport + handling) * input.tariffRate);
  const congestion = round((transport + handling) * (input.congestion * 0.14));
  const seasonal = round(transport * input.seasonality);
  const riskPremium = round((transport + tariffs) * (input.riskScore / 650));
  const insurance = input.request.insurance ? round((transport + tariffs) * 0.012) : 0;
  const lastMile = round(140 + Math.min(720, input.cargo.palletCount * 24 + input.cargo.teuEquivalent * 160));
  const delayRisk = round((transport + fuel) * (0.01 + input.customsComplexity * 0.06));

  return { transport: round(transport), fuel, handling, tariffs, congestion, seasonal, riskPremium, insurance, lastMile, delayRisk };
}

export function computeTransitDays(distanceKm: number, mode: string, nodeCount: number) {
  const v = { ocean: 28, rail: 16, truck: 9, air: 2, multimodal: 18 }[mode] ?? 14;
  return Math.max(1, round((distanceKm / 1000) * (v / 8) + nodeCount * 1.4));
}

export function summarizeEstimate(
  route: Omit<RouteEstimate, "totalCost" | "estimatedTransitDays" | "breakdown"> & {
    breakdown: PricingBreakdown;
    distanceKm: number;
    mode: string;
    nodeCount: number;
  }
): RouteEstimate {
  const totalCost = Object.values(route.breakdown).reduce((a, b) => a + b, 0);
  const estimatedTransitDays = computeTransitDays(route.distanceKm, route.mode, route.nodeCount);
  return { ...route, totalCost, estimatedTransitDays };
}
