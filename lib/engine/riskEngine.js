const REGION_BASE_RISK = {
  Europe: 18,
  Asia: 26,
  Americas: 20,
  Africa: 34,
  "Middle East": 38,
  Oceania: 14,
};

const CHOKEPOINT_RISK = {
  "Suez Canal": 14,
  "Malacca Strait": 10,
  "Strait of Gibraltar": 6,
};

function normaliseContinent(continent) {
  if (continent === "Europe/Asia") return "Europe";
  return continent;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function classifyRisk(score) {
  if (score >= 65) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export async function applyRiskAnalysis(routeResult) {
  const routes = (routeResult.routes ?? []).map((route) => {
    const firstCountryPoint = route.waypoints?.find((wp) => wp.nodeType === "country");
    const lastCountryPoint = [...(route.waypoints ?? [])].reverse().find((wp) => wp.nodeType === "country");

    const originRegion = normaliseContinent(firstCountryPoint?.continent || "Unknown");
    const destinationRegion = normaliseContinent(lastCountryPoint?.continent || "Unknown");

    const originRegionRisk = REGION_BASE_RISK[originRegion] ?? 22;
    const destinationRegionRisk = REGION_BASE_RISK[destinationRegion] ?? 22;
    const regionRisk = (originRegionRisk + destinationRegionRisk) / 2;
    const chokepointRisk = (route.chokepoints ?? []).reduce(
      (sum, point) => sum + (CHOKEPOINT_RISK[point] ?? 4),
      0
    );

    const distanceRisk = route.distanceKm > 16000 ? 14 : route.distanceKm > 9000 ? 8 : 3;
    const modeRisk = route.mode === "Air" ? 4 : route.mode === "Ocean" ? 9 : 6;
    const warningRisk = (route.warnings?.length ?? 0) * 3;

    const totalRiskScore = clamp(Math.round(regionRisk + chokepointRisk + distanceRisk + modeRisk + warningRisk), 5, 95);
    const riskBand = classifyRisk(totalRiskScore);

    return {
      ...route,
      riskScore: totalRiskScore,
      riskBand,
      riskDrivers: [
        ...(route.chokepoints?.map((point) => `Chokepoint exposure: ${point}`) ?? []),
        `Distance profile: ${route.distanceKm} km`,
        `Mode sensitivity: ${route.mode}`,
      ],
      score: clamp(route.score - Math.round(totalRiskScore / 5), 20, 99),
    };
  });

  return {
    ...routeResult,
    routes: routes.sort((a, b) => b.score - a.score),
  };
}
