import type { RouteEstimate } from "@/lib/logistics/types";
import { overallScore } from "@/lib/logistics/routing/scorer";

export function rankRoutes(routes: RouteEstimate[]) {
  if (!routes.length) return [];
  const sortedByCost = [...routes].sort((a,b)=>a.totalCost-b.totalCost);
  const sortedBySpeed = [...routes].sort((a,b)=>a.estimatedTransitDays-b.estimatedTransitDays);
  const sortedByReliability = [...routes].sort((a,b)=>b.scores.reliability-a.scores.reliability);
  const sortedBalanced = [...routes].sort((a,b)=>overallScore(b.scores)-overallScore(a.scores));

  const tags = new Map<string, string>();
  tags.set(sortedByCost[0].routeId, "Cheapest");
  tags.set(sortedBySpeed[0].routeId, tags.get(sortedBySpeed[0].routeId) ?? "Fastest");
  tags.set(sortedByReliability[0].routeId, tags.get(sortedByReliability[0].routeId) ?? "Most Reliable");
  tags.set(sortedBalanced[0].routeId, tags.get(sortedBalanced[0].routeId) ?? "Best Balanced");

  return sortedBalanced.map((r)=> ({...r, label: `${tags.get(r.routeId) ?? "Option"} · ${r.label}`}));
}
