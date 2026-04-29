import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { COUNTRIES as COUNTRY_DB } from "@/lib/Traderules";

// ─── ROUTE COLORS ─────────────────────────────────────────────────────────────
const ROUTE_COLORS = ["#005BFF", "#FF0000", "#00FF00"];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: "fresh_produce",   label: "Fresh Produce",       emoji: "🥦" },
  { id: "electronics",     label: "Electronics",          emoji: "📱" },
  { id: "pharmaceuticals", label: "Pharmaceuticals",      emoji: "💊" },
  { id: "confectionery",   label: "Confectionery",        emoji: "🍬" },
  { id: "alcohol",         label: "Alcohol & Beverages",  emoji: "🍷" },
  { id: "textiles",        label: "Textiles & Apparel",   emoji: "👕" },
  { id: "industrial",      label: "Industrial Chemicals", emoji: "⚗️"  },
  { id: "arms",            label: "Arms & Defence",       emoji: "🛡️"  },
  { id: "vehicles",        label: "Vehicles & Parts",     emoji: "🚗" },
  { id: "livestock",       label: "Livestock",            emoji: "🐄" },
  { id: "timber",          label: "Timber & Wood",        emoji: "🌲" },
  { id: "minerals",        label: "Minerals & Materials", emoji: "⛏️"  },
];

const UNITS = ["tonnes","kg","units","pallets","containers (20ft)","containers (40ft)","litres"];


const COUNTRY_NAME_TO_CODE = Object.fromEntries(
  Object.entries(COUNTRY_DB).map(([code, meta]) => [meta.name, code])
);

function toTerminalRoutes(apiRoutes = []) {
  return apiRoutes.slice(0, 3).map((route, i) => {
    const hubLabels = (route.waypoints || [])
      .filter((wp) => wp.nodeType !== "country")
      .map((wp) => wp.name);

    return {
      rank: i + 1,
      color: ROUTE_COLORS[i] || ROUTE_COLORS[0],
      label: route.label,
      mode: route.mode,
      waypoints: (route.waypoints || []).map((wp) => [wp.lng, wp.lat]),
      waypointNodes: route.waypoints || [],
      hubLabels,
      distance: route.distanceKm,
      days: route.days?.[0] ?? 0,
      cost: `$${Number(route.estimatedCostUSD || 0).toLocaleString()}`,
      score: Math.round(route.score || 0),
      note: route.riskBand ? `Risk: ${route.riskBand}` : "",
      warnings: route.warnings || [],
      requirements: route.requirements || [],
    };
  });
}

const THEMES = {
  light: {
    appBg: "#ffffff",
    panelBg: "#ffffff",
    panelBorder: "#d7dee7",
    textPrimary: "#111111",
    textSecondary: "#405160",
    textMuted: "#5f6c78",
    accent: "#007acc",
    accentStrong: "#00D4FF",
    surface: "#f9fbfd",
    mapBackdrop: "#000000",
    overlayBg: "rgba(255,255,255,0.92)",
    overlayBorder: "#d7dee7",
    overlayText: "#5d6771",
    statusPositive: "#2f7a27",
    routeCasing: "#111111",
    shadow: "0 0 0 4px rgba(0,122,204,0.12)",
  },
  dark: {
    appBg: "#05080e",
    panelBg: "#0b111a",
    panelBorder: "#1e2a3a",
    textPrimary: "#e7eef8",
    textSecondary: "#98a8bd",
    textMuted: "#7d8ea6",
    accent: "#4caeff",
    accentStrong: "#00D4FF",
    surface: "#111a26",
    mapBackdrop: "#000000",
    overlayBg: "rgba(6,10,16,0.86)",
    overlayBorder: "#223146",
    overlayText: "#9cb0c9",
    statusPositive: "#7fe08d",
    routeCasing: "#dce6f7",
    shadow: "0 0 0 4px rgba(76,174,255,0.14)",
  },
};

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
  "Belgium","Brazil","Canada","Chile","China","Colombia","Czech Republic","Denmark",
  "Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece","Hungary","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway",
  "Pakistan","Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia",
  "Singapore","South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland",
  "Taiwan","Thailand","Turkey","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Venezuela","Vietnam","Zimbabwe",
];

// ─── TRANSIT HUBS (lng, lat) ──────────────────────────────────────────────────
const HUBS = {
  rotterdam:    { coords: [4.4792,   51.9225], label: "Rotterdam"    },
  hamburg:      { coords: [9.9937,   53.5511], label: "Hamburg"      },
  antwerp:      { coords: [4.4024,   51.2194], label: "Antwerp"      },
  singapore:    { coords: [103.8198,  1.3521], label: "Singapore"    },
  shanghai:     { coords: [121.4737, 31.2304], label: "Shanghai"     },
  shenzhen:     { coords: [114.0579, 22.5431], label: "Shenzhen"     },
  hongkong:     { coords: [114.1694, 22.3193], label: "Hong Kong"    },
  dubai:        { coords: [55.2708,  25.2048], label: "Dubai"        },
  jeddah:       { coords: [39.1728,  21.4858], label: "Jeddah"       },
  mumbai:       { coords: [72.8777,  19.0760], label: "Mumbai"       },
  colombo:      { coords: [79.8612,   6.9271], label: "Colombo"      },
  losangeles:   { coords: [-118.2437,33.9600], label: "Los Angeles"  },
  newyork:      { coords: [-74.0059, 40.7128], label: "New York"     },
  houston:      { coords: [-95.3698, 29.7604], label: "Houston"      },
  vancouver:    { coords: [-123.1207,49.2827], label: "Vancouver"    },
  santos:       { coords: [-46.3338,-23.9608], label: "Santos"       },
  buenosaires:  { coords: [-58.3816,-34.6037], label: "Buenos Aires" },
  capetown:     { coords: [18.4241, -33.9249], label: "Cape Town"    },
  mombasa:      { coords: [39.6682,  -4.0435], label: "Mombasa"      },
  lagos:        { coords: [3.3792,    6.5244], label: "Lagos"        },
  sydney:       { coords: [151.2093,-33.8688], label: "Sydney"       },
  tokyo:        { coords: [139.6917, 35.6895], label: "Tokyo"        },
  busan:        { coords: [129.0756, 35.1796], label: "Busan"        },
  suezcanal:    { coords: [32.5498,  30.5852], label: "Suez Canal"   },
  panamacanal:  { coords: [-79.5197,  8.9936], label: "Panama Canal" },
};

// ─── COUNTRY DATA (lng, lat) + nearest hubs ───────────────────────────────────
const COUNTRY_DATA = {
  "Afghanistan":          { coords: [67.7100,  33.9391], hubs: ["dubai","mumbai"]              },
  "Albania":              { coords: [20.1683,  41.1533], hubs: ["antwerp","rotterdam"]         },
  "Algeria":              { coords: [1.6596,   28.0339], hubs: ["rotterdam","jeddah"]          },
  "Argentina":            { coords: [-63.6167,-38.4161], hubs: ["buenosaires","santos"]        },
  "Australia":            { coords: [133.7751,-25.2744], hubs: ["sydney","singapore"]          },
  "Austria":              { coords: [14.5501,  47.5162], hubs: ["hamburg","rotterdam"]         },
  "Bangladesh":           { coords: [90.3563,  23.6850], hubs: ["colombo","singapore"]         },
  "Belgium":              { coords: [4.4699,   50.5039], hubs: ["antwerp","rotterdam"]         },
  "Brazil":               { coords: [-51.9253,-14.2350], hubs: ["santos","buenosaires"]        },
  "Canada":               { coords: [-106.3468,56.1304], hubs: ["vancouver","newyork"]         },
  "Chile":                { coords: [-71.5430,-35.6751], hubs: ["buenosaires","losangeles"]    },
  "China":                { coords: [104.1954, 35.8617], hubs: ["shanghai","shenzhen","hongkong"] },
  "Colombia":             { coords: [-74.2973,  4.5709], hubs: ["panamacanal","houston"]       },
  "Czech Republic":       { coords: [15.4730,  49.8175], hubs: ["hamburg","rotterdam"]         },
  "Denmark":              { coords: [9.5018,   56.2639], hubs: ["hamburg","rotterdam"]         },
  "Egypt":                { coords: [30.8025,  26.8206], hubs: ["suezcanal","jeddah"]          },
  "Ethiopia":             { coords: [40.4897,   9.1450], hubs: ["mombasa","jeddah"]            },
  "Finland":              { coords: [25.7482,  61.9241], hubs: ["hamburg","rotterdam"]         },
  "France":               { coords: [2.2137,   46.2276], hubs: ["rotterdam","antwerp"]         },
  "Germany":              { coords: [10.4515,  51.1657], hubs: ["hamburg","rotterdam"]         },
  "Ghana":                { coords: [-1.0232,   7.9465], hubs: ["lagos","capetown"]            },
  "Greece":               { coords: [21.8243,  39.0742], hubs: ["suezcanal","rotterdam"]       },
  "Hungary":              { coords: [19.5033,  47.1625], hubs: ["hamburg","rotterdam"]         },
  "India":                { coords: [78.9629,  20.5937], hubs: ["mumbai","colombo"]            },
  "Indonesia":            { coords: [113.9213, -0.7893], hubs: ["singapore","shanghai"]        },
  "Iran":                 { coords: [53.6880,  32.4279], hubs: ["dubai","jeddah"]              },
  "Iraq":                 { coords: [43.6793,  33.2232], hubs: ["dubai","jeddah"]              },
  "Ireland":              { coords: [-7.6921,  53.1424], hubs: ["rotterdam","antwerp"]         },
  "Israel":               { coords: [34.8516,  31.0461], hubs: ["suezcanal","rotterdam"]       },
  "Italy":                { coords: [12.5674,  41.8719], hubs: ["rotterdam","suezcanal"]       },
  "Japan":                { coords: [138.2529, 36.2048], hubs: ["tokyo","busan","singapore"]   },
  "Jordan":               { coords: [36.2384,  30.5852], hubs: ["suezcanal","dubai"]           },
  "Kenya":                { coords: [37.9062,  -0.0236], hubs: ["mombasa","dubai"]             },
  "Malaysia":             { coords: [101.9758,  4.2105], hubs: ["singapore","hongkong"]        },
  "Mexico":               { coords: [-102.5528,23.6345], hubs: ["houston","losangeles","panamacanal"] },
  "Morocco":              { coords: [-7.0926,  31.7917], hubs: ["rotterdam","jeddah"]          },
  "Netherlands":          { coords: [5.2913,   52.1326], hubs: ["rotterdam","antwerp"]         },
  "New Zealand":          { coords: [174.8860,-40.9006], hubs: ["sydney","losangeles"]         },
  "Nigeria":              { coords: [8.6753,    9.0820], hubs: ["lagos","capetown"]            },
  "Norway":               { coords: [8.4689,   60.4720], hubs: ["rotterdam","hamburg"]         },
  "Pakistan":             { coords: [69.3451,  30.3753], hubs: ["dubai","mumbai"]              },
  "Peru":                 { coords: [-75.0152, -9.1900], hubs: ["panamacanal","losangeles"]    },
  "Philippines":          { coords: [121.7740, 12.8797], hubs: ["hongkong","singapore"]        },
  "Poland":               { coords: [19.1451,  51.9194], hubs: ["hamburg","rotterdam"]         },
  "Portugal":             { coords: [-8.2245,  39.3999], hubs: ["rotterdam","antwerp"]         },
  "Romania":              { coords: [24.9668,  45.9432], hubs: ["rotterdam","suezcanal"]       },
  "Russia":               { coords: [105.3188, 61.5240], hubs: ["rotterdam","shanghai"]        },
  "Saudi Arabia":         { coords: [45.0792,  23.8859], hubs: ["jeddah","dubai"]              },
  "Singapore":            { coords: [103.8198,  1.3521], hubs: ["singapore"]                   },
  "South Africa":         { coords: [22.9375, -30.5595], hubs: ["capetown","mombasa"]          },
  "South Korea":          { coords: [127.7669, 35.9078], hubs: ["busan","tokyo"]               },
  "Spain":                { coords: [-3.7492,  40.4637], hubs: ["rotterdam","antwerp"]         },
  "Sri Lanka":            { coords: [80.7718,   7.8731], hubs: ["colombo","singapore"]         },
  "Sweden":               { coords: [18.6435,  60.1282], hubs: ["hamburg","rotterdam"]         },
  "Switzerland":          { coords: [8.2275,   46.8182], hubs: ["rotterdam","hamburg"]         },
  "Taiwan":               { coords: [121.0254, 23.5937], hubs: ["hongkong","busan"]            },
  "Thailand":             { coords: [100.9925, 15.8700], hubs: ["singapore","colombo"]         },
  "Turkey":               { coords: [35.2433,  38.9637], hubs: ["suezcanal","rotterdam"]       },
  "Ukraine":              { coords: [31.1656,  48.3794], hubs: ["rotterdam","suezcanal"]       },
  "United Arab Emirates": { coords: [53.8478,  23.4241], hubs: ["dubai"]                       },
  "United Kingdom":       { coords: [-3.4360,  55.3781], hubs: ["rotterdam","antwerp"]         },
  "United States":        { coords: [-95.7129, 37.0902], hubs: ["losangeles","newyork","houston"] },
  "Venezuela":            { coords: [-66.5897,  6.4238], hubs: ["panamacanal","houston"]       },
  "Vietnam":              { coords: [108.2772, 14.0583], hubs: ["singapore","hongkong"]        },
  "Zimbabwe":             { coords: [29.1549, -19.0154], hubs: ["capetown","mombasa"]          },
};

// ─── PRODUCT RESTRICTIONS ─────────────────────────────────────────────────────
const PRODUCT_RESTRICTIONS = {
  fresh_produce:   { avoidHubs: new Set(["dubai"]),                 note: "Perishable — desert hub storage limited" },
  alcohol:         { avoidHubs: new Set(["jeddah","dubai"]),        note: "Gulf import restrictions apply" },
  arms:            { avoidHubs: new Set(["suezcanal","panamacanal"]), note: "Restricted via certain chokepoints" },
  livestock:       { avoidHubs: new Set(["suezcanal"]),             note: "Live animal corridor restrictions" },
  pharmaceuticals: { avoidHubs: new Set([]),                        note: "Cold chain required throughout" },
  industrial:      { avoidHubs: new Set([]),                        note: "Hazmat documentation at all hubs" },
};

// ─── ROUTING ENGINE ───────────────────────────────────────────────────────────
function dist([lng1, lat1], [lng2, lat2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function routeDist(waypoints) {
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) total += dist(waypoints[i - 1], waypoints[i]);
  return total;
}

function quantityToTons(quantity, unitType) {
  const q = Math.max(0, Number(quantity) || 0);
  const factors = {
    tonnes: 1,
    kg: 0.001,
    units: 0.015,
    pallets: 0.55,
    "containers (20ft)": 12,
    "containers (40ft)": 24,
    litres: 0.00085,
  };
  return q * (factors[unitType] || 1);
}

function priceRoute({ distanceKm, hubsCount, product, mode, quantity, unitType }) {
  const tons = Math.max(0.25, quantityToTons(quantity, unitType));
  const productRisk = {
    fresh_produce: 1.12,
    electronics: 1.18,
    pharmaceuticals: 1.28,
    confectionery: 1.04,
    alcohol: 1.08,
    textiles: 1.0,
    industrial: 1.22,
    arms: 1.7,
    vehicles: 1.2,
    livestock: 1.3,
    timber: 1.06,
    minerals: 0.96,
  };
  const modeBasePerTonKm = { air: 0.68, ocean: 0.1, rail_ocean: 0.18 };
  const handlingPerHub = { air: 520, ocean: 980, rail_ocean: 810 };
  const modeSecurity = { air: 1.12, ocean: 1.02, rail_ocean: 1.06 };

  const perTonKm = modeBasePerTonKm[mode] || 0.2;
  const handling = (handlingPerHub[mode] || 600) * (hubsCount + 1);
  const risk = productRisk[product] || 1.08;
  const security = modeSecurity[mode] || 1.05;
  const fuelSurcharge = mode === "air" ? 0.18 : 0.11;
  const insurance = 0.04;
  const marketVolatility = 1 + Math.min(0.08, Math.max(0.01, distanceKm / 200000));

  const freight = distanceKm * perTonKm * tons;
  const landedCost = (freight + handling) * (1 + fuelSurcharge + insurance) * risk * security * marketVolatility;
  return Math.round(landedCost);
}

function buildRoutes(origin, destination, product, quantity, unitType) {
  const od = COUNTRY_DATA[origin];
  const dd = COUNTRY_DATA[destination];
  if (!od || !dd) return [];

  const restrictions = PRODUCT_RESTRICTIONS[product] || { avoidHubs: new Set([]), note: "" };
  const avoid = restrictions.avoidHubs;

  const originHubs = od.hubs.filter(h => !avoid.has(h));
  const destHubs   = dd.hubs.filter(h => !avoid.has(h));

  const qtyTons = quantityToTons(quantity, unitType);
  const airNotFeasible = unitType.includes("containers") || qtyTons > 38;

  const strategies = [
    // 1. Express option (not used for heavy containerized cargo)
    !airNotFeasible ? {
      label:   "Express Intermodal — Air + Truck",
      mode:    "air",
      waypoints: [od.coords, dd.coords],
      hubLabels: [],
      speedKmh: 640,
      costPerKm: 4.8,
      dashArray: [1],
    } : null,
    // 2. Ocean — via primary hubs on each side
    originHubs[0] && destHubs[0] && originHubs[0] !== destHubs[0]
      ? {
          label: `Ocean — via ${HUBS[originHubs[0]].label} & ${HUBS[destHubs[0]].label}`,
          mode: "ocean",
          waypoints: [od.coords, HUBS[originHubs[0]].coords, HUBS[destHubs[0]].coords, dd.coords],
          hubLabels: [HUBS[originHubs[0]].label, HUBS[destHubs[0]].label],
          speedKmh: 28,
          costPerKm: 0.75,
          dashArray: [1],
        }
      : originHubs[0]
        ? {
            label: `Ocean — via ${HUBS[originHubs[0]].label}`,
            mode: "ocean",
            waypoints: [od.coords, HUBS[originHubs[0]].coords, dd.coords],
            hubLabels: [HUBS[originHubs[0]].label],
            speedKmh: 28,
            costPerKm: 0.75,
            dashArray: [1],
          }
        : null,
    // 3. Rail + Ocean — via secondary / alternate hubs
    (() => {
      const oh = originHubs[1] || originHubs[0];
      const dh = destHubs[1]   || destHubs[0];
      if (!oh) return null;
      const wps = oh !== dh && dh
        ? [od.coords, HUBS[oh].coords, HUBS[dh].coords, dd.coords]
        : [od.coords, HUBS[oh].coords, dd.coords];
      const hls = oh !== dh && dh
        ? [HUBS[oh].label, HUBS[dh].label]
        : [HUBS[oh].label];
      return {
        label: `Rail + Ocean — via ${hls.join(" & ")}`,
        mode: "rail_ocean",
        waypoints: wps,
        hubLabels: hls,
        speedKmh: 52,
        costPerKm: 1.15,
        dashArray: [1],
      };
    })(),
  ].filter(Boolean).slice(0, 3);

  return strategies.map((s, i) => {
    const d    = routeDist(s.waypoints);
    const days = Math.round(d / s.speedKmh / 24) + s.hubLabels.length;
    const cost = priceRoute({
      distanceKm: d,
      hubsCount: s.hubLabels.length,
      product,
      mode: s.mode,
      quantity,
      unitType,
    });
    const score = Math.min(99, Math.max(62, 97 - i * 7 - (days > 60 ? 6 : 0) - (s.mode === "air" ? 2 : 0)));
    return {
      ...s,
      rank: i + 1,
      color: ROUTE_COLORS[i],
      distance: Math.round(d),
      days,
      cost: `$${cost.toLocaleString()}`,
      score,
      note: restrictions.note,
    };
  });
}

// ─── ARC / LINE GEOMETRY ──────────────────────────────────────────────────────
function arcSegment(p1, p2, steps = 60) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  });
}

function buildLine(waypoints) {
  if (waypoints.length <= 2) return arcSegment(waypoints[0], waypoints[1], 90);
  const out = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const segment = arcSegment(waypoints[i], waypoints[i + 1], 72);
    if (i > 0) segment.shift();
    out.push(...segment);
  }
  return out;
}

// ─── GLOBE COMPONENT ──────────────────────────────────────────────────────────
function GlobeMap({ origin, destination, routes, activeRouteIdx, onReady, isDark }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const layersRef    = useRef([]);
  const sourcesRef   = useRef([]);
  const markersRef   = useRef([]);

  const clearAll = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    layersRef.current.forEach(id => { try { if (map.getLayer(id)) map.removeLayer(id); } catch {} });
    sourcesRef.current.forEach(id => { try { if (map.getSource(id)) map.removeSource(id); } catch {} });
    markersRef.current.forEach(m => m.remove());
    layersRef.current  = [];
    sourcesRef.current = [];
    markersRef.current = [];
  }, []);

  // Mount map once
  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      center: [20, 15],
      zoom: 1.3,
      minZoom: 0.5,
      maxZoom: 9,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");

    map.on("load", () => {
      map.setFog({
        color:            "rgb(24, 24, 24)",
        "high-color":     "rgb(12, 12, 12)",
        "horizon-blend":  0.03,
        "space-color":    "#000000",
        "star-intensity": 0,
      });
      const layers = map.getStyle()?.layers || [];
      layers.forEach((layer) => {
        try {
          if (layer.id.includes("water")) {
            if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", "#001A66");
            if (layer.type === "line") map.setPaintProperty(layer.id, "line-color", "#001A66");
          }
          if (
            layer.type === "fill" &&
            (layer.id.includes("land") || layer.id.includes("country") || layer["source-layer"]?.includes("land"))
          ) {
            map.setPaintProperty(layer.id, "fill-color", "#1DB954");
          }
          if (
            layer.type === "line" &&
            (layer.id.includes("country-boundary") || layer.id.includes("admin") || layer.id.includes("boundary"))
          ) {
            map.setPaintProperty(layer.id, "line-color", "#0D5C2C");
            map.setPaintProperty(layer.id, "line-width", 1.1);
          }
          if (
            layer.type === "symbol" &&
            layer.layout?.["text-field"] &&
            (layer.id.includes("country") || layer.id.includes("place") || layer.id.includes("settlement") || layer.id.includes("state"))
          ) {
            map.setPaintProperty(layer.id, "text-color", "#FFFFFF");
            map.setPaintProperty(layer.id, "text-halo-color", "rgba(0,0,0,0.85)");
            map.setPaintProperty(layer.id, "text-halo-width", 0.8);
            map.setPaintProperty(layer.id, "text-opacity", [
              "interpolate", ["linear"], ["zoom"],
              0, 0,
              2.4, 0,
              3.1, 1
            ]);
          }
        } catch {}
      });
      mapRef.current = map;
      onReady?.();
    });

    // Auto-rotate
    let rotating = true;
    let raf;
    const doRotate = () => {
      if (!rotating || !mapRef.current) return;
      const c = mapRef.current.getCenter();
      mapRef.current.setCenter([c.lng + 0.05, c.lat]);
      raf = requestAnimationFrame(doRotate);
    };
    const stopRotate = () => { rotating = false; cancelAnimationFrame(raf); };
    map.on("load", () => { raf = requestAnimationFrame(doRotate); });
    map.on("mousedown", stopRotate);
    map.on("touchstart", stopRotate);

    return () => {
      cancelAnimationFrame(raf);
      clearAll();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw whenever routes / selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const draw = () => {
      clearAll();
      if (!routes.length || !origin || !destination) return;

      const activeRoute = routes[activeRouteIdx] || routes[0];
      const startPoint = activeRoute?.waypoints?.[0];
      const endPoint = activeRoute?.waypoints?.[(activeRoute?.waypoints?.length || 1) - 1];
      if (!startPoint || !endPoint) return;

      // Fly to midpoint
      const midLng = (startPoint[0] + endPoint[0]) / 2;
      const midLat = (startPoint[1] + endPoint[1]) / 2;
      const d = dist(startPoint, endPoint);
      const zoom = d > 8000 ? 1.4 : d > 4000 ? 1.9 : d > 2000 ? 2.6 : 3.2;
      map.flyTo({ center: [midLng, midLat], zoom, duration: 2000, essential: true });

      // Draw each route
      routes.forEach((route, ri) => {
        const isActive  = ri === activeRouteIdx;
        const lineCoords = buildLine(route.waypoints);
        const srcId  = `rsrc-${ri}`;
        const glowId = `rglow-${ri}`;
        const lineId = `rline-${ri}`;

        map.addSource(srcId, {
          type: "geojson",
          data: { type: "Feature", geometry: { type: "LineString", coordinates: lineCoords } },
        });
        map.addLayer({ id: glowId, type: "line", source: srcId, paint: {
          "line-color":   brightenHex(route.color, isActive ? 1.28 : 1),
          "line-width":   isActive ? 11 : 8,
          "line-opacity": isActive ? 0.22 : 0.11,
          "line-blur":    6,
        }});
        const casingId = `rcasing-${ri}`;
        map.addLayer({ id: casingId, type: "line", source: srcId, paint: {
          "line-color": isDark ? "#dce6f7" : "#111111",
          "line-width": isActive ? 4.8 : 3.5,
          "line-opacity": 0.55,
        }});
        map.addLayer({ id: lineId, type: "line", source: srcId, paint: {
          "line-color":   brightenHex(route.color, isActive ? 1.22 : 1),
          "line-width":   isActive ? 3.6 : 2.5,
          "line-opacity": isActive ? 1 : 0.9,
        }});
        sourcesRef.current.push(srcId);
        layersRef.current.push(glowId, lineId, casingId);

        // Node markers use exact waypoint coordinates so edges pass through nodes.
        (route.waypointNodes || []).forEach((node, ni, nodes) => {
          if (node.nodeType === "country") return;
          const el = document.createElement("div");
          el.style.cssText = `width:${isActive ? 10 : 8}px;height:${isActive ? 10 : 8}px;border-radius:2px;background:${route.color};opacity:${isActive ? 1 : 0.75};box-shadow:0 0 ${isActive ? 9 : 6}px ${route.color};transform:rotate(45deg);`;
          const popup = new mapboxgl.Popup({ offset: 12, closeButton: false, closeOnClick: false })
            .setHTML(`<div style="font-family:'DM Sans',sans-serif;font-size:12px;color:#111;background:rgba(255,255,255,0.96);padding:5px 10px;border-radius:4px;border:1px solid rgba(0,0,0,0.12);letter-spacing:0.04em;white-space:nowrap">${node.name}</div>`);
          markersRef.current.push(
            new mapboxgl.Marker({ element: el }).setLngLat([node.lng, node.lat]).setPopup(popup).addTo(map)
          );
        });
      });

      // Start/end markers use one unique color per active route (no fixed orange).
      const endpointColor = brightenHex(activeRoute.color || "#005BFF", 1.32);
      const mkEl = (color) => {
        const el = document.createElement("div");
        el.style.cssText = `width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.75);box-shadow:0 0 0 4px rgba(${hexRgb(color)},0.22),0 0 18px ${color};`;
        return el;
      };
      markersRef.current.push(
        new mapboxgl.Marker({ element: mkEl(endpointColor) })
          .setLngLat(startPoint)
          .setPopup(new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
            `<div style="font-family:'DM Sans',sans-serif;font-size:12px;color:#111;background:rgba(255,255,255,0.96);padding:5px 10px;border-radius:4px;border:1px solid rgba(${hexRgb(endpointColor)},0.45);letter-spacing:0.04em;white-space:nowrap">◆ ${origin} (fixed)</div>`
          ))
          .addTo(map)
      );
      markersRef.current.push(
        new mapboxgl.Marker({ element: mkEl(endpointColor) })
          .setLngLat(endPoint)
          .setPopup(new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
            `<div style="font-family:'DM Sans',sans-serif;font-size:12px;color:#111;background:rgba(255,255,255,0.96);padding:5px 10px;border-radius:4px;border:1px solid rgba(${hexRgb(endpointColor)},0.45);letter-spacing:0.04em;white-space:nowrap">◆ ${destination} (fixed)</div>`
          ))
          .addTo(map)
      );
    };

    if (map.isStyleLoaded()) {
      draw();
    } else {
      map.once("load", draw);
    }
  }, [routes, origin, destination, activeRouteIdx, clearAll, isDark]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function TerminalPage() {
  const [product,     setProduct]     = useState(null);
  const [qty,         setQty]         = useState("");
  const [unit,        setUnit]        = useState("tonnes");
  const [origin,      setOrigin]      = useState("");
  const [destination, setDestination] = useState("");

  const [routes,      setRoutes]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [calculated,  setCalculated]  = useState(false);
  const [mapReady,    setMapReady]    = useState(false);
  const [activeRoute, setActiveRoute] = useState(0);
  const { isDark } = useTheme();
  const palette = isDark ? THEMES.dark : THEMES.light;

  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toUTCString().slice(0, 25).replace("GMT","UTC"));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Reset routes when key inputs change
  useEffect(() => {
    setRoutes([]);
    setCalculated(false);
    setActiveRoute(0);
  }, [origin, destination, product]);

  const canCalc = product && qty && parseFloat(qty) > 0 && origin && destination && origin !== destination;

  const handleCalc = async () => {
    if (!canCalc || loading) return;

    const originCode = COUNTRY_NAME_TO_CODE[origin];
    const destinationCode = COUNTRY_NAME_TO_CODE[destination];
    if (!originCode || !destinationCode) return;

    setLoading(true);
    setRoutes([]);
    setCalculated(false);

    try {
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: originCode,
          destination: destinationCode,
          product,
          quantity: Number(qty),
          quantityUnit: unit,
        }),
      });

      const payload = await response.json();
      const terminalRoutes = toTerminalRoutes(payload.routes || []);
      setRoutes(terminalRoutes);
      setCalculated(true);
      setActiveRoute(0);
    } catch (error) {
      console.error("Route calculation failed", error);
      setRoutes([]);
      setCalculated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Route Terminal — Koda</title></Head>
      <Header />

      <div style={{
        position: "fixed",
        inset: 0,
        paddingTop: 96,
        display: "grid",
        gridTemplateColumns: "360px 1fr 340px",
        background: palette.appBg,
        overflow: "auto",
        fontSize: 14,
        color: palette.textPrimary,
        transition: "background-color 220ms ease,color 180ms ease",
      }}>

        {/* ══ LEFT: INPUT ══ */}
        <aside style={{ borderRight: `1px solid ${palette.panelBorder}`, display: "flex", flexDirection: "column", background: palette.panelBg, overflow: "hidden", transition: "background-color 220ms ease,border-color 220ms ease" }}>
          <PanelHeader label="SHIPMENT DETAILS" right={
              <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: mapReady ? palette.statusPositive : palette.textMuted, letterSpacing: "0.08em" }}>
                {mapReady ? "● LIVE" : "○ INIT"}
              </span>
          } palette={palette} />

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 36px" }}>

            <FieldLabel palette={palette}>WHAT ARE YOU SHIPPING?</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 22 }}>
              {PRODUCTS.map(p => (
                <ProductBtn
                  key={p.id}
                  p={p}
                  active={product === p.id}
                  onClick={() => setProduct(product === p.id ? null : p.id)}
                  palette={palette}
                />
              ))}
            </div>

            <FieldLabel palette={palette}>QUANTITY</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
              <TermInput type="number" placeholder="e.g. 25" value={qty} onChange={e => setQty(e.target.value)} palette={palette} />
              <TermSelect value={unit} onChange={e => setUnit(e.target.value)} palette={palette}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </TermSelect>
            </div>

            <FieldLabel palette={palette}>ORIGIN COUNTRY</FieldLabel>
            <TermSelect value={origin} onChange={e => setOrigin(e.target.value)} style={{ marginBottom: 16 }} palette={palette}>
              <option value="">Select origin…</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </TermSelect>

            <FieldLabel palette={palette}>DESTINATION COUNTRY</FieldLabel>
            <TermSelect value={destination} onChange={e => setDestination(e.target.value)} style={{ marginBottom: 28 }} palette={palette}>
              <option value="">Select destination…</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </TermSelect>

            {origin && destination && origin === destination && (
              <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 3 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#c94f28" }}>
                  Origin and destination must differ.
                </span>
              </div>
            )}

            <button
              onClick={handleCalc}
              disabled={!canCalc || loading}
              style={{
                width: "100%",
                padding: "14px",
                background: canCalc && !loading ? palette.accentStrong : (isDark ? "rgba(0,212,255,0.13)" : "rgba(0,212,255,0.05)"),
                color: canCalc && !loading ? "#000" : "#1a3a4a",
                border: `1px solid ${canCalc && !loading ? palette.accentStrong : palette.panelBorder}`,
                borderRadius: 3,
                cursor: canCalc && !loading ? "pointer" : "not-allowed",
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {loading ? "COMPUTING…" : "CALCULATE ROUTES →"}
            </button>

            <div style={{ marginTop: 30, paddingTop: 22, borderTop: `1px solid ${palette.panelBorder}` }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: palette.textMuted, letterSpacing: "0.1em", marginBottom: 16 }}>
                HOW THIS WORKS
              </div>
              {[
                ["01", "Select your goods",        "Commodity-specific trade rules are applied for your product category."],
                ["02", "Set origin & destination", "Country-level restrictions and bans are checked instantly."],
                ["03", "Get real-distance routes", "Haversine distances via real port hubs produce realistic transit times."],
                ["04", "Review ranked options",    "Routes scored by cost, speed, and compliance burden."],
              ].map(([n, t, d]) => (
                <div key={n} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: palette.textMuted, fontWeight: 700, flexShrink: 0, paddingTop: 1 }}>{n}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: palette.textPrimary, fontWeight: 600, marginBottom: 3 }}>{t}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: palette.textSecondary, lineHeight: 1.6 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ══ CENTER: GLOBE ══ */}
        <main style={{ position: "relative", overflow: "hidden", background: palette.mapBackdrop }}>
          <GlobeMap
            origin={origin}
            destination={destination}
            routes={routes}
            activeRouteIdx={activeRoute}
            onReady={() => setMapReady(true)}
            isDark={isDark}
          />

          {/* Top-left HUD */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            background: palette.overlayBg, border: `1px solid ${palette.overlayBorder}`,
            borderRadius: 3, padding: "10px 16px", pointerEvents: "none",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: palette.overlayText, letterSpacing: "0.12em", marginBottom: 4 }}>
              MERIDIAN · ROUTE TERMINAL
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: palette.accent, letterSpacing: "0.04em" }}>
              {time}
            </div>
          </div>

          {/* Route legend */}
          {calculated && (
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: palette.overlayBg, border: `1px solid ${palette.overlayBorder}`,
              borderRadius: 3, padding: "10px 14px", backdropFilter: "blur(8px)",
            }}>
              {routes.map((r, i) => (
                <div
                  key={i}
                  onClick={() => setActiveRoute(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginBottom: i < routes.length - 1 ? 8 : 0,
                    cursor: "pointer",
                    opacity: activeRoute === i ? 1 : 0.75,
                    transition: "opacity 0.15s,color 150ms ease",
                  }}
                >
                  <div style={{ width: 18, height: 2, background: r.color, borderRadius: 1, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: r.color, letterSpacing: "0.04em" }}>
                    ROUTE {i + 1} · {r.mode.replace("_", "+").toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom status bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: palette.overlayBg, borderTop: `1px solid ${palette.overlayBorder}`,
            padding: "9px 20px", display: "flex", alignItems: "center", gap: 28,
            pointerEvents: "none", backdropFilter: "blur(8px)",
          }}>
            {[
              { k: "STATUS",    v: loading ? "COMPUTING" : calculated ? "ROUTES READY" : mapReady ? "STANDBY" : "LOADING" },
              { k: "CORRIDORS", v: "2,400+" },
              { k: "COUNTRIES", v: "160+"   },
              { k: "PORTS",     v: "3,200+" },
            ].map(({ k, v }) => (
              <div key={k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: palette.textMuted, letterSpacing: "0.1em" }}>{k}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: palette.accent, letterSpacing: "0.06em" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Computing overlay */}
          {loading && (
            <div style={{
              position: "absolute", inset: 0,
              background: isDark ? "rgba(2,6,12,0.62)" : "rgba(255,255,255,0.62)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 16,
            }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#007acc", letterSpacing: "0.18em", fontWeight: 700 }}>
                COMPUTING ROUTES
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{
                    width: 5, height: 5, borderRadius: "50%", background: "#00D4FF",
                    animation: `termPulse 1s ${i * 0.15}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ══ RIGHT: RESULTS ══ */}
        <aside style={{ borderLeft: `1px solid ${palette.panelBorder}`, display: "flex", flexDirection: "column", background: palette.panelBg, overflow: "hidden", transition: "background-color 220ms ease,border-color 220ms ease" }}>
          <PanelHeader label="ROUTE INTELLIGENCE" right={
            calculated
              ? <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: palette.statusPositive, letterSpacing: "0.08em" }}>{routes.length} ROUTES</span>
              : null
          } palette={palette} />

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {!calculated && !loading && <EmptyState palette={palette} />}
            {loading && <SkeletonCards palette={palette} />}
            {calculated && routes.map((r, i) => (
              <RouteCard
                key={i}
                route={r}
                idx={i}
                active={activeRoute === i}
                onClick={() => setActiveRoute(i)}
                palette={palette}
              />
            ))}
            {calculated && (
              <SummaryPanel
                product={product}
                qty={qty}
                unit={unit}
                origin={origin}
                destination={destination}
                routes={routes}
                palette={palette}
              />
            )}
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes termPulse {
          0%,100% { opacity:0.15; transform:scale(0.7); }
          50%      { opacity:1;   transform:scale(1.2); }
        }
        ::-webkit-scrollbar { width:2px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${isDark ? "#31445d" : "#c4ced8"}; border-radius:2px; }
        select option { background:${isDark ? "#0b111a" : "#ffffff"}; color:${isDark ? "#e7eef8" : "#111111"}; }
        .mapboxgl-popup-content {
          background:transparent !important;
          box-shadow:none !important;
          padding:0 !important;
        }
        .mapboxgl-popup-tip { display:none !important; }
        .mapboxgl-ctrl-group {
          background:${palette.overlayBg} !important;
          border:1px solid ${palette.overlayBorder} !important;
          border-radius:3px !important;
        }
        .mapboxgl-ctrl-group button { background:transparent !important; }
        .mapboxgl-ctrl-icon { filter:${isDark ? "invert(0.85)" : "invert(0.15)"} !important; }
        .mapboxgl-ctrl-attrib { display:none !important; }
      `}</style>
    </>
  );
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

function PanelHeader({ label, right, palette }) {
  return (
    <div style={{
      padding: "12px 20px",
      borderBottom: `1px solid ${palette.panelBorder}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.12em", color: palette.textPrimary, textTransform: "uppercase", fontWeight: 700 }}>
        ◆ {label}
      </span>
      {right}
    </div>
  );
}

function FieldLabel({ children, palette }) {
  return (
    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: palette.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
      {children}
    </div>
  );
}

function ProductBtn({ p, active, onClick, palette }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `rgba(${hexRgb(palette.accent)},0.16)` : palette.panelBg,
        border: `1px solid ${active ? palette.accent : palette.panelBorder}`,
        borderRadius: 3,
        padding: "10px 10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 7,
        transition: "all 0.15s",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{p.emoji}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: active ? palette.accent : palette.textPrimary, letterSpacing: "0.02em", lineHeight: 1.35 }}>
        {p.label}
      </span>
    </button>
  );
}

function TermInput({ style, onFocus, onBlur, palette, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={e => { setFocused(true); onFocus?.(e); }}
      onBlur={e => { setFocused(false); onBlur?.(e); }}
      style={{
        background: palette.panelBg,
        border: `1px solid ${focused ? palette.accent : palette.panelBorder}`,
        borderRadius: 3,
        padding: "11px 12px",
        color: palette.textPrimary,
        fontFamily: "var(--font-body)",
        fontSize: 14,
        width: "100%",
        outline: "none",
        transition: "border-color 0.15s",
        ...style,
      }}
    />
  );
}

function TermSelect({ children, style, palette, ...props }) {
  return (
    <select
      {...props}
      style={{
        background: palette.panelBg,
        border: `1px solid ${palette.panelBorder}`,
        borderRadius: 3,
        padding: "11px 28px 11px 12px",
        color: palette.textPrimary,
        fontFamily: "var(--font-body)",
        fontSize: 14,
        width: "100%",
        outline: "none",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23607180'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        ...style,
      }}
    >
      {children}
    </select>
  );
}

function RouteCard({ route, idx, active, onClick, palette }) {
  const scoreColor = route.score >= 90 ? "#A8FF3E" : route.score >= 80 ? "#FFD700" : "#FF6B35";
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? `rgba(${hexRgb(route.color)},0.08)` : palette.panelBg,
        border: `1px solid ${active ? route.color + "88" : palette.panelBorder}`,
        borderLeft: `3px solid ${active ? route.color : idx === 0 ? route.color + "88" : palette.panelBorder}`,
        borderRadius: 3,
        padding: "14px",
        marginBottom: 10,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%",
            background: `rgba(${hexRgb(route.color)},0.15)`,
            border: `1px solid ${route.color}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: route.color, fontWeight: 700 }}>
              {idx + 1}
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: route.color, letterSpacing: "0.04em", fontWeight: 700, lineHeight: 1.3 }}>
            {route.label.toUpperCase()}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: scoreColor, fontWeight: 700, flexShrink: 0 }}>
          {route.score}/100
        </span>
      </div>

      {/* Score bar */}
      <div style={{ height: 3, background: palette.surface, borderRadius: 2, marginBottom: 10 }}>
        <div style={{ width: `${route.score}%`, height: "100%", background: route.color, borderRadius: 1 }} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
        {[
          { k: "COST",     v: route.cost },
          { k: "TRANSIT",  v: `${route.days}d` },
          { k: "DIST",     v: `${Math.round(route.distance / 100) / 10}k km` },
        ].map(({ k, v }) => (
          <div key={k} style={{ background: palette.surface, padding: "7px 8px", borderRadius: 2, border: `1px solid ${palette.panelBorder}` }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: palette.textMuted, letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: palette.textPrimary, fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Via hubs */}
      {route.hubLabels.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: palette.textMuted, letterSpacing: "0.08em" }}>VIA  </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: palette.textPrimary }}>
            {route.hubLabels.join(" → ")}
          </span>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {idx === 0 && <Tag color="#A8FF3E">✓ RECOMMENDED</Tag>}
        {route.note && <Tag color="#FF6B35">⚠ {route.note}</Tag>}
      </div>
    </div>
  );
}

function Tag({ color, children }) {
  return (
    <span style={{
      fontFamily: "var(--font-body)",
      fontSize: 10, color,
      padding: "3px 7px",
      background: `rgba(${hexRgb(color)},0.07)`,
      border: `1px solid rgba(${hexRgb(color)},0.25)`,
      borderRadius: 2,
      letterSpacing: "0.1em",
    }}>
      {children}
    </span>
  );
}

function EmptyState({ palette }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 260, gap: 16, padding: "32px",
    }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="23" stroke={palette.textSecondary} strokeWidth="1"/>
        <ellipse cx="24" cy="24" rx="10" ry="23" stroke={palette.textSecondary} strokeWidth="0.8"/>
        <line x1="1" y1="24" x2="47" y2="24" stroke={palette.textSecondary} strokeWidth="0.8"/>
        <circle cx="24" cy="24" r="3" stroke={palette.textMuted} strokeWidth="1"/>
      </svg>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: palette.textMuted, letterSpacing: "0.08em", textAlign: "center", lineHeight: 2.1 }}>
        SELECT CARGO TYPE<br />SET ORIGIN & DESTINATION<br />RUN ROUTE ANALYSIS
      </div>
    </div>
  );
}

function SkeletonCards({ palette }) {
  return (
    <div>
      {[1, 0.7, 0.4].map((opacity, i) => (
        <div key={i} style={{
          border: `1px solid ${palette.panelBorder}`, borderRadius: 3,
          padding: "16px", marginBottom: 10, opacity,
        }}>
          <div style={{ width: "60%", height: 8, background: palette.panelBorder, borderRadius: 2, marginBottom: 10 }} />
          <div style={{ height: 2, background: palette.surface, marginBottom: 10 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[0,1,2].map(j => (
              <div key={j} style={{ height: 38, background: palette.surface, borderRadius: 2 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryPanel({ product, qty, unit, origin, destination, routes, palette }) {
  const prod = PRODUCTS.find(p => p.id === product);
  return (
    <div style={{
      marginTop: 8, padding: "14px",
      background: `rgba(${hexRgb(palette.accent)},0.08)`,
      border: `1px solid ${palette.panelBorder}`, borderRadius: 3,
    }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: palette.textMuted, letterSpacing: "0.08em", marginBottom: 12 }}>
        CORRIDOR SUMMARY
      </div>
      {[
        ["CARGO",        `${prod?.emoji} ${prod?.label}`],
        ["QUANTITY",     `${qty} ${unit}`],
        ["ORIGIN",       origin],
        ["DESTINATION",  destination],
        ["BEST ROUTE",   routes[0]?.label],
        ["EST. TRANSIT", `${routes[0]?.days} days`],
        ["EST. COST",    routes[0]?.cost],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7, gap: 12 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: palette.textSecondary, letterSpacing: "0.06em", flexShrink: 0 }}>{k}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: palette.textPrimary, textAlign: "right", fontWeight: 500 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── UTIL ─────────────────────────────────────────────────────────────────────
function hexRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].join(",");
}

function brightenHex(hex, factor = 1.15) {
  const [r, g, b] = hexRgb(hex).split(",").map(Number);
  const br = Math.min(255, Math.round(r * factor));
  const bg = Math.min(255, Math.round(g * factor));
  const bb = Math.min(255, Math.round(b * factor));
  return `#${[br, bg, bb].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

