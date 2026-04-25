import { calculateRoutes } from "@/lib/Traderules";
import { haversineKm, mapboxRoadKm } from "@/lib/services/geoService";
import { getAirports, getCountries, getPorts, getTradeRoutes } from "@/lib/services/dataService";

const RATE_PER_KM_TONNE = { Ocean: 0.022, Rail: 0.04, Road: 0.065, Air: 0.29 };
const MODE_SPEEDS_KMH = { Ocean: 30, Rail: 55, Road: 65, Air: 820 };
const HANDLING_FEE_USD = { Ocean: 280, Rail: 160, Road: 120, Air: 240 };

function normaliseContinent(continent) {
  if (continent === "Europe/Asia") return "Europe";
  return continent;
}

function pickNearestNode(nodes, origin) {
  if (!nodes.length) return null;

  return nodes
    .map((node) => ({
      node,
      distance: haversineKm(origin.lat, origin.lng, node.lat, node.lon),
    }))
    .sort((a, b) => a.distance - b.distance)[0].node;
}

function uniqueNodes(path) {
  const seen = new Set();
  return path.filter((item) => {
    if (!item) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function toWaypoint(node) {
  return {
    id: node.id,
    lat: node.lat,
    lng: node.lon,
    name: node.name,
    code: node.countryCode,
    nodeType: node.type,
  };
}

function corridorMatch(corridor, fromRegion, toRegion) {
  if (corridor.fromRegion === "*" && corridor.toRegion === "*") return true;
  return (
    (corridor.fromRegion === fromRegion && corridor.toRegion === toRegion) ||
    (corridor.fromRegion === toRegion && corridor.toRegion === fromRegion)
  );
}

export async function computeRouteOptions({ origin, destination, product, quantity = 1000 }) {
  const [countries, ports, airports, corridorData] = await Promise.all([
    getCountries(),
    getPorts(),
    getAirports(),
    getTradeRoutes(),
  ]);

  const originCountry = countries[origin];
  const destinationCountry = countries[destination];

  if (!originCountry || !destinationCountry) {
    return { error: "Unknown country code", status: 400 };
  }

  const originRegion = normaliseContinent(originCountry.continent);
  const destinationRegion = normaliseContinent(destinationCountry.continent);

  const base = calculateRoutes(origin, destination, product, Number(quantity));
  const restrictionsByMode = new Map(
    base.routes.map((route) => [route.mode, { warnings: route.warnings, requirements: route.requirements }])
  );

  const originSeaNode =
    pickNearestNode(ports.filter((p) => p.countryCode === origin), originCountry) ||
    pickNearestNode(ports.filter((p) => p.region === originRegion), originCountry);

  const destinationSeaNode =
    pickNearestNode(ports.filter((p) => p.countryCode === destination), destinationCountry) ||
    pickNearestNode(ports.filter((p) => p.region === destinationRegion), destinationCountry);

  const originAirNode =
    pickNearestNode(airports.filter((p) => p.countryCode === origin), originCountry) ||
    pickNearestNode(airports.filter((p) => p.region === originRegion), originCountry);

  const destinationAirNode =
    pickNearestNode(airports.filter((p) => p.countryCode === destination), destinationCountry) ||
    pickNearestNode(airports.filter((p) => p.region === destinationRegion), destinationCountry);

  const candidateCorridors = corridorData.filter((corridor) => corridorMatch(corridor, originRegion, destinationRegion));

  const routes = await Promise.all(
    candidateCorridors.map(async (corridor, index) => {
      const isAir = corridor.mode === "Air";
      const pathPorts = corridor.portPath.map((id) => ports.find((port) => port.id === id)).filter(Boolean);

      const networkNodes = isAir
        ? uniqueNodes([originAirNode, ...pathPorts, destinationAirNode])
        : uniqueNodes([originSeaNode, ...pathPorts, destinationSeaNode]);

      const waypoints = [
        { lat: originCountry.lat, lng: originCountry.lng, name: originCountry.name, code: origin, nodeType: "country", continent: originCountry.continent },
        ...networkNodes.map(toWaypoint),
        { lat: destinationCountry.lat, lng: destinationCountry.lng, name: destinationCountry.name, code: destination, nodeType: "country", continent: destinationCountry.continent },
      ];

      let totalKm = 0;
      for (let i = 0; i < waypoints.length - 1; i += 1) {
        const from = waypoints[i];
        const to = waypoints[i + 1];

        let segmentKm = haversineKm(from.lat, from.lng, to.lat, to.lng);
        if (corridor.mode === "Road" && segmentKm < 5000) {
          const roadKm = await mapboxRoadKm(from, to);
          if (roadKm) segmentKm = roadKm;
        }

        totalKm += segmentKm;
      }

      const distanceKm = Math.round(totalKm);
      const quantityTonnes = Math.max(Number(quantity) / 1000, 0.5);
      const rate = RATE_PER_KM_TONNE[corridor.mode] ?? 0.03;

      const routeCost = Math.round(distanceKm * rate * quantityTonnes);
      const handlingCost = HANDLING_FEE_USD[corridor.mode] + networkNodes.length * 45;
      const estimatedCostUSD = routeCost + handlingCost;

      const speed = MODE_SPEEDS_KMH[corridor.mode] ?? 45;
      const travelDays = distanceKm / speed / 24;
      const minDays = Math.max(corridor.baselineDays[0], Math.round(travelDays * 0.8));
      const maxDays = Math.max(corridor.baselineDays[1], Math.round(travelDays * 1.35 + (networkNodes.length - 1)));

      const reliabilityScore = Math.round((corridor.reliability ?? 0.8) * 100);
      const distancePenalty = Math.min(25, Math.round(distanceKm / 1200));
      const score = Math.max(35, reliabilityScore - distancePenalty - corridor.chokepoints.length * 4);
      const restriction = restrictionsByMode.get(corridor.mode) ?? { warnings: [], requirements: [] };

      return {
        id: index + 1,
        corridorId: corridor.id,
        label: corridor.label,
        mode: corridor.mode,
        transit: pathPorts.map((p) => p.countryCode),
        chokepoints: corridor.chokepoints,
        days: [minDays, maxDays],
        estimatedCostUSD,
        distanceKm,
        score,
        blocked: false,
        warnings: restriction.warnings,
        requirements: restriction.requirements,
        waypoints,
      };
    })
  );

  return {
    routes: routes.sort((a, b) => b.score - a.score),
    blockedCountries: base.blockedCountries,
    warnings: base.warnings,
    originCoords: { lat: originCountry.lat, lng: originCountry.lng, name: originCountry.name },
    destCoords: { lat: destinationCountry.lat, lng: destinationCountry.lng, name: destinationCountry.name },
  };
}
