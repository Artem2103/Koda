import type { RiskLevel, RouteEstimate } from "@/lib/logistics/types";

const clamp = (v:number,min=0,max=100)=>Math.min(max,Math.max(min,v));

export function classifyRisk(score:number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function scoreRoute(params:{cost:number;transitDays:number;reliability:number;congestion:number;geoRisk:number;customs:number;seasonality:number}) {
  return {
    totalCost: clamp(100 - params.cost / 120),
    speed: clamp(100 - params.transitDays * 3.2),
    reliability: clamp(params.reliability * 100),
    congestionExposure: clamp(100 - params.congestion * 100),
    geopoliticalStability: clamp(100 - params.geoRisk * 100),
    customsComplexity: clamp(100 - params.customs * 100),
    seasonalVolatility: clamp(100 - params.seasonality * 100),
  };
}

export function overallScore(scores:RouteEstimate["scores"]) {
  return clamp(
    scores.totalCost * 0.22 +
    scores.speed * 0.2 +
    scores.reliability * 0.2 +
    scores.congestionExposure * 0.12 +
    scores.geopoliticalStability * 0.12 +
    scores.customsComplexity * 0.08 +
    scores.seasonalVolatility * 0.06,
  );
}
