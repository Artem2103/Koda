import { computeRouteOptions } from "@/lib/engine/routeEngine";
import { calculateBreakdown, summarizeEstimate } from "@/lib/logistics/pricing/engine";
import { normalizeCargo } from "@/lib/logistics/pricing/normalization";
import { logPricingEvent } from "@/lib/logistics/analytics/pricingEvents";
import { rankRoutes } from "@/lib/logistics/routing/ranker";
import { classifyRisk, scoreRoute } from "@/lib/logistics/routing/scorer";

const ENGINE_VERSION = "koda-logistics-v2.1.0";

function seasonality(date = new Date()) {
  const m = date.getUTCMonth() + 1;
  if (m === 1 || m === 2) return 0.14;
  if (m >= 9 && m <= 11) return 0.16;
  if (m >= 6 && m <= 8) return 0.09;
  return 0.05;
}

function modeFeasibility(mode, cargo, product) {
  let score = 100;
  const reasons = [];

  if (mode === "air") {
    if (cargo.weightKg > 18000 || cargo.volumeM3 > 120 || cargo.teuEquivalent > 1) {
      score -= 85;
      reasons.push("Cargo exceeds typical scheduled airfreight envelope");
    }
    if (product === "industrial" || product === "vehicles") {
      score -= 30;
      reasons.push("Commodity usually moved via ocean/rail");
    }
  }

  if (mode === "ocean" && cargo.volumeM3 < 1 && cargo.weightKg < 200) {
    score -= 25;
    reasons.push("Very small shipment; ocean minimums inefficient");
  }

  if ((mode === "rail" || mode === "truck") && cargo.teuEquivalent > 30) {
    score -= 35;
    reasons.push("Very high unit count for inland mode");
  }

  return { score: Math.max(0, score), reasons };
}

export async function getRouteDecision(request) {
  const cargo = normalizeCargo(request);

  const baseResult = await computeRouteOptions({
    origin: request.origin,
    destination: request.destination,
    product: request.cargoType,
    quantity: cargo.weightKg,
    quantityUnit: "kg",
  });

  if (baseResult?.error) return baseResult;

  const currentSeasonality = seasonality();

  const estimates = (baseResult.routes || [])
    .map((route, idx) => {
      const mode = route.mode.toLowerCase();
      const feasibility = modeFeasibility(mode, cargo, request.cargoType);
      if (feasibility.score < 20) return null;

      const congestion = Math.min(0.95, Math.max(0.15, ((route.waypoints?.[1]?.congestionFactor || 1.06) - 0.9)));
      const geoRisk = Math.min(0.95, Math.max(0.08, (route.chokepoints?.length || 0) * 0.12 + 0.13));
      const customs = Math.min(0.75, 0.14 + (route.warnings?.length || 0) * 0.07);
      const riskScore = Math.round((geoRisk * 50) + (congestion * 30) + (customs * 20));

      const breakdown = calculateBreakdown({
        distanceKm: route.distanceKm,
        mode,
        request,
        cargo,
        congestion,
        riskScore,
        seasonality: currentSeasonality,
        tariffRate: mode === "air" ? 0.05 : 0.032,
        customsComplexity: customs,
      });

      const cost = Object.values(breakdown).reduce((a, b) => a + b, 0);
      const scores = scoreRoute({
        cost,
        transitDays: route.days?.[1] || 12,
        reliability: (route.score || 70) / 100,
        congestion,
        geoRisk,
        customs,
        seasonality: currentSeasonality,
      });

      const confidencePenalty = (feasibility.score < 50 ? 0.18 : 0) + (cost > 250000 ? 0.2 : 0);

      return summarizeEstimate({
        routeId: route.corridorId || `route-${idx + 1}`,
        label: route.label,
        mode,
        currency: "USD",
        confidence: Math.max(0.25, Math.min(0.96, scores.reliability / 100 - currentSeasonality / 2 - geoRisk / 5 - confidencePenalty)),
        volatility: currentSeasonality > 0.1 ? "high" : currentSeasonality > 0.06 ? "medium" : "low",
        congestionIndicator: congestion > 0.6 ? "high" : congestion > 0.35 ? "moderate" : "low",
        breakdown,
        risk: { score: riskScore, level: classifyRisk(riskScore), drivers: [...(route.chokepoints || []), ...feasibility.reasons] },
        feasibilityScore: feasibility.score,
        scores,
        waypoints: route.waypoints || [],
        distanceKm: route.distanceKm,
        nodeCount: route.waypoints?.length || 2,
      });
    })
    .filter(Boolean);

  const ranked = rankRoutes(estimates);

  const event = {
    id: `evt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    engineVersion: ENGINE_VERSION,
    shipmentRequest: request,
    selectedRouteId: ranked[0]?.routeId,
    estimates: ranked,
    confidence: ranked[0]?.confidence || 0,
  };

  await logPricingEvent(event);

  return {
    engineVersion: ENGINE_VERSION,
    generatedAt: event.timestamp,
    routes: ranked,
    selected: ranked[0] || null,
    normalization: cargo,
  };
}
