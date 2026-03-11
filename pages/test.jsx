import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ═══════════════════════════════════════════════════════════════
   ROUTE COLORS  — one per rank slot
═══════════════════════════════════════════════════════════════ */
const ROUTE_COLORS = ["#FF4D4D", "#4DA6FF", "#4DFF91"];

// SSR-safe number formatter — toLocaleString() differs between Node and browser
const fmtNum = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ═══════════════════════════════════════════════════════════════
   COUNTRY DATA  – 28 countries, each with a main port/hub
═══════════════════════════════════════════════════════════════ */
const COUNTRIES = {
  vietnam:     { name: "Vietnam",       lat: 10.82,  lng: 106.63, port: "Ho Chi Minh City" },
  ukraine:     { name: "Ukraine",       lat: 46.48,  lng: 30.74,  port: "Odesa"            },
  austria:     { name: "Austria",       lat: 48.21,  lng: 16.37,  port: "Vienna (Rail)"    },
  poland:      { name: "Poland",        lat: 54.35,  lng: 18.63,  port: "Gdańsk"           },
  china:       { name: "China",         lat: 31.23,  lng: 121.47, port: "Shanghai"         },
  germany:     { name: "Germany",       lat: 53.55,  lng: 9.99,   port: "Hamburg"          },
  netherlands: { name: "Netherlands",   lat: 51.92,  lng: 4.48,   port: "Rotterdam"        },
  singapore:   { name: "Singapore",     lat: 1.35,   lng: 103.82, port: "Singapore"        },
  uae:         { name: "UAE",           lat: 25.20,  lng: 55.27,  port: "Dubai"            },
  india:       { name: "India",         lat: 19.08,  lng: 72.88,  port: "Mumbai"           },
  turkey:      { name: "Turkey",        lat: 41.01,  lng: 28.95,  port: "Istanbul"         },
  egypt:       { name: "Egypt",         lat: 31.21,  lng: 29.94,  port: "Alexandria"       },
  italy:       { name: "Italy",         lat: 44.41,  lng: 8.93,   port: "Genova"           },
  malaysia:    { name: "Malaysia",      lat: 3.00,   lng: 101.39, port: "Port Klang"       },
  southkorea:  { name: "South Korea",   lat: 35.10,  lng: 129.03, port: "Busan"            },
  japan:       { name: "Japan",         lat: 35.69,  lng: 139.69, port: "Tokyo"            },
  russia:      { name: "Russia",        lat: 59.95,  lng: 30.32,  port: "St. Petersburg"   },
  greece:      { name: "Greece",        lat: 37.94,  lng: 23.63,  port: "Piraeus"          },
  france:      { name: "France",        lat: 43.30,  lng: 5.38,   port: "Marseille"        },
  spain:       { name: "Spain",         lat: 41.39,  lng: 2.16,   port: "Barcelona"        },
  kenya:       { name: "Kenya",         lat: -4.05,  lng: 39.67,  port: "Mombasa"          },
  southafrica: { name: "South Africa",  lat: -29.86, lng: 31.03,  port: "Durban"           },
  usa:         { name: "USA",           lat: 33.74,  lng: -118.27,port: "Los Angeles"      },
  brazil:      { name: "Brazil",        lat: -23.96, lng: -46.31, port: "Santos"           },
  australia:   { name: "Australia",     lat: -33.87, lng: 151.20, port: "Sydney"           },
  srilanka:    { name: "Sri Lanka",     lat: 6.93,   lng: 79.85,  port: "Colombo"          },
  pakistan:    { name: "Pakistan",      lat: 24.86,  lng: 66.99,  port: "Karachi"          },
  bangladesh:  { name: "Bangladesh",    lat: 22.33,  lng: 91.83,  port: "Chittagong"       },
};

/* ═══════════════════════════════════════════════════════════════
   LEG DATA  – [originKey, destKey, costUSD, transitDays]
═══════════════════════════════════════════════════════════════ */
const LEG_DEFINITIONS = [
  ["vietnam", "singapore",  380,  3], ["vietnam", "china",      420,  4],
  ["vietnam", "malaysia",   300,  2], ["vietnam", "india",      700,  8],
  ["vietnam", "uae",       1150, 13], ["vietnam", "southkorea", 600,  5],
  ["vietnam", "japan",      700,  6], ["vietnam", "bangladesh", 400,  4],
  ["vietnam", "australia", 1200, 14],
  ["singapore", "malaysia",    180,  1], ["singapore", "india",       550,  6],
  ["singapore", "srilanka",    400,  5], ["singapore", "uae",         900,  9],
  ["singapore", "egypt",      1400, 14], ["singapore", "netherlands", 2200, 22],
  ["singapore", "germany",    2300, 23], ["singapore", "southkorea",  550,  5],
  ["singapore", "japan",       650,  6], ["singapore", "australia",  1000, 10],
  ["singapore", "kenya",      1100, 12], ["singapore", "china",       380,  4],
  ["china", "southkorea",  280,  2], ["china", "japan",        300,  2],
  ["china", "india",       750,  8], ["china", "uae",         1250, 13],
  ["china", "netherlands",1900, 21], ["china", "germany",    2000, 22],
  ["china", "usa",        2100, 14], ["china", "australia",  1150, 12],
  ["india", "uae",        450,  5], ["india", "srilanka",    250,  2],
  ["india", "pakistan",   300,  3], ["india", "egypt",       850,  9],
  ["india", "kenya",      700,  7], ["india", "malaysia",    500,  5],
  ["uae", "egypt",        600,  5], ["uae", "turkey",        700,  6],
  ["uae", "greece",       850,  8], ["uae", "italy",         950,  9],
  ["uae", "netherlands", 1100, 10], ["uae", "germany",      1200, 11],
  ["uae", "ukraine",      950,  9], ["uae", "poland",       1050, 10],
  ["uae", "austria",     1100, 11], ["uae", "kenya",         600,  5],
  ["uae", "southafrica", 1150, 13], ["uae", "russia",       1050, 10],
  ["uae", "france",      1200, 11], ["uae", "spain",        1250, 12],
  ["uae", "pakistan",     350,  4],
  ["egypt", "turkey",      500,  4], ["egypt", "greece",      400,  3],
  ["egypt", "italy",       600,  5], ["egypt", "netherlands", 900,  9],
  ["egypt", "germany",     950,  9], ["egypt", "ukraine",     750,  7],
  ["egypt", "poland",      850,  8], ["egypt", "austria",     900,  9],
  ["egypt", "france",      750,  7], ["egypt", "spain",       750,  7],
  ["egypt", "kenya",       700,  7],
  ["turkey", "greece",     300,  2], ["turkey", "italy",      500,  4],
  ["turkey", "netherlands",750,  7], ["turkey", "germany",    800,  7],
  ["turkey", "ukraine",    400,  4], ["turkey", "poland",     500,  5],
  ["turkey", "austria",    500,  4], ["turkey", "russia",     500,  5],
  ["turkey", "france",     650,  6], ["turkey", "spain",      700,  7],
  ["greece", "italy",      400,  3], ["greece", "netherlands", 650,  6],
  ["greece", "germany",    700,  6], ["greece", "ukraine",    550,  5],
  ["greece", "poland",     650,  6], ["greece", "austria",    600,  5],
  ["greece", "france",     550,  5], ["greece", "spain",      600,  5],
  ["italy", "france",      250,  2], ["italy", "spain",       350,  3],
  ["italy", "netherlands", 450,  4], ["italy", "germany",     400,  3],
  ["italy", "austria",     250,  2], ["italy", "ukraine",     600,  6],
  ["italy", "poland",      550,  5],
  ["netherlands", "germany",  150,  1], ["netherlands", "france",   250,  2],
  ["netherlands", "spain",    400,  4], ["netherlands", "poland",   300,  3],
  ["netherlands", "austria",  350,  3], ["netherlands", "ukraine",  500,  5],
  ["netherlands", "russia",   550,  5],
  ["germany", "france",   200,  2], ["germany", "spain",     350,  3],
  ["germany", "poland",   250,  2], ["germany", "austria",   200,  2],
  ["germany", "ukraine",  450,  4], ["germany", "russia",    500,  5],
  ["poland", "austria",   250,  2], ["poland", "ukraine",    300,  3],
  ["poland", "russia",    400,  4],
  ["austria", "ukraine",  350,  3], ["austria", "italy",     250,  2],
  ["austria", "france",   350,  3],
  ["usa", "brazil",      1500, 14], ["usa", "netherlands", 1200,  8],
  ["usa", "germany",     1300,  9], ["usa", "japan",       1100, 10],
  ["usa", "southkorea",  1050,  9],
  ["kenya", "southafrica", 800, 8], ["kenya", "egypt",       700, 7],
  ["australia", "japan",       950, 10], ["australia", "southkorea", 1000, 11],
  ["malaysia", "srilanka",     350,  4],
  ["southkorea", "japan",      200,  2],
];

const LEGS = {};
for (const [a, b, cost, days] of LEG_DEFINITIONS) {
  if (!LEGS[a]) LEGS[a] = {};
  if (!LEGS[b]) LEGS[b] = {};
  LEGS[a][b] = [cost, days];
  LEGS[b][a] = [cost, days];
}

const TRANSSHIP_COST = 120;
const TRANSSHIP_DAYS = 2;

function generateAllRoutes(origin, dest) {
  if (!origin || !dest || origin === dest) return [];
  const routes = [];
  if (LEGS[origin]?.[dest]) {
    const [cost, days] = LEGS[origin][dest];
    routes.push({ stops: [origin, dest], cost, days });
  }
  for (const h of Object.keys(LEGS)) {
    if (h === origin || h === dest) continue;
    if (LEGS[origin]?.[h] && LEGS[h]?.[dest]) {
      const [c1, d1] = LEGS[origin][h];
      const [c2, d2] = LEGS[h][dest];
      routes.push({ stops: [origin, h, dest], cost: c1 + c2 + TRANSSHIP_COST, days: d1 + d2 + TRANSSHIP_DAYS });
    }
  }
  for (const h1 of Object.keys(LEGS[origin] || {})) {
    if (h1 === dest) continue;
    for (const h2 of Object.keys(LEGS[h1] || {})) {
      if (h2 === origin || h2 === dest || h2 === h1) continue;
      if (LEGS[h2]?.[dest]) {
        const [c1, d1] = LEGS[origin][h1];
        const [c2, d2] = LEGS[h1][h2];
        const [c3, d3] = LEGS[h2][dest];
        routes.push({ stops: [origin, h1, h2, dest], cost: c1 + c2 + c3 + TRANSSHIP_COST * 2, days: d1 + d2 + d3 + TRANSSHIP_DAYS * 2 });
      }
    }
  }
  return routes;
}

function computeEfficiency(routes, costWeight) {
  if (!routes.length) return [];
  const timeWeight = 1 - costWeight;
  const costs = routes.map(r => r.cost);
  const days  = routes.map(r => r.days);
  const minC = Math.min(...costs), maxC = Math.max(...costs);
  const minD = Math.min(...days),  maxD = Math.max(...days);
  return routes.map(r => {
    const cn    = maxC === minC ? 0 : (r.cost - minC) / (maxC - minC);
    const dn    = maxD === minD ? 0 : (r.days - minD) / (maxD - minD);
    const score = Math.round((1 - (costWeight * cn + timeWeight * dn)) * 100);
    const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B+" : score >= 60 ? "B" : score >= 50 ? "C" : "D";
    return { ...r, score, grade };
  }).sort((a, b) => b.score - a.score);
}

/* ═══════════════════════════════════════════════════════════════
   MAPBOX GLOBE COMPONENT

   Two subtle bugs fixed vs the previous version:
   1. `map` was a local async variable — if the component unmounted
      before init() resolved, the cleanup ran before `map` was set,
      so map.remove() was never called and the canvas stayed in the DOM.
      Fix: store the instance in a ref so cleanup always finds it.
   2. Mapbox CSS was never injected, causing the black canvas.
      Fix: inject the stylesheet link once into <head>.
═══════════════════════════════════════════════════════════════ */
function RouteGlobe({ routes }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null); // ← persists across async boundary

  useEffect(() => {
    if (!containerRef.current || routes.length === 0) return;

    // Guard: if component unmounts before async init finishes, skip mount
    let cancelled = false;

    const init = async () => {
      // ── Inject Mapbox CSS once ──────────────────────────
      if (!document.getElementById("mapbox-gl-css")) {
        const link = document.createElement("link");
        link.id   = "mapbox-gl-css";
        link.rel  = "stylesheet";
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css";
        document.head.appendChild(link);
      }

      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled) return; // unmounted while awaiting — bail out

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const topRoute  = routes[0];
      const startC    = COUNTRIES[topRoute.stops[0]];
      const endC      = COUNTRIES[topRoute.stops[topRoute.stops.length - 1]];
      const centerLng = (startC.lng + endC.lng) / 2;
      const centerLat = (startC.lat + endC.lat) / 2;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [centerLng, centerLat],
        zoom: 1.8,
        projection: "globe",
        antialias: true,
      });

      mapRef.current = map; // ← store immediately so cleanup can always reach it

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        if (cancelled) return;

        map.setFog({
          color: "rgb(8, 8, 18)",
          "high-color": "rgb(18, 18, 45)",
          "horizon-blend": 0.02,
          "space-color": "rgb(4, 4, 12)",
          "star-intensity": 0.7,
        });

        routes.slice(0, 3).forEach((route, routeIdx) => {
          const color  = ROUTE_COLORS[routeIdx];
          const coords = route.stops.map(s => [COUNTRIES[s].lng, COUNTRIES[s].lat]);

          map.addSource(`route-${routeIdx}`, {
            type: "geojson",
            data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } },
          });

          map.addLayer({
            id: `route-glow-${routeIdx}`,
            type: "line",
            source: `route-${routeIdx}`,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": color, "line-width": 7, "line-opacity": 0.15 },
          });

          map.addLayer({
            id: `route-line-${routeIdx}`,
            type: "line",
            source: `route-${routeIdx}`,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": color, "line-width": 2.5, "line-opacity": 0.95 },
          });

          map.addSource(`stops-${routeIdx}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: route.stops.map(stopKey => {
                const c = COUNTRIES[stopKey];
                return {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: [c.lng, c.lat] },
                  properties: { name: c.port },
                };
              }),
            },
          });

          map.addLayer({
            id: `stops-halo-${routeIdx}`,
            type: "circle",
            source: `stops-${routeIdx}`,
            paint: { "circle-radius": 7, "circle-color": color, "circle-opacity": 0.2 },
          });

          map.addLayer({
            id: `stops-dot-${routeIdx}`,
            type: "circle",
            source: `stops-${routeIdx}`,
            paint: {
              "circle-radius": 3.5,
              "circle-color": color,
              "circle-opacity": 1,
              "circle-stroke-color": "#000",
              "circle-stroke-width": 1.2,
            },
          });
        });
      });
    };

    init().catch(console.error);

    return () => {
      cancelled = true;                   // stop init() mid-flight if still running
      if (mapRef.current) {
        mapRef.current.remove();          // always fires now — ref not local variable
        mapRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

/* ═══════════════════════════════════════════════════════════════
   GRADE COLORS
═══════════════════════════════════════════════════════════════ */
const GRADE_COLOR = {
  "A+": "#ffffff", "A": "#d4d4d4", "B+": "#a0a0a0",
  "B":  "#777777", "C": "#555555", "D":  "#3a3a3a",
};

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function TestPage() {
  const [origin,    setOrigin]    = useState("vietnam");
  const [dest,      setDest]      = useState("ukraine");
  const [sliderVal, setSliderVal] = useState(50);
  const costWeight = 1 - sliderVal / 100;

  const countryList = useMemo(
    () => Object.entries(COUNTRIES).sort((a, b) => a[1].name.localeCompare(b[1].name)),
    []
  );

  const allRoutes = useMemo(() => generateAllRoutes(origin, dest), [origin, dest]);
  const scored    = useMemo(() => computeEfficiency(allRoutes, costWeight), [allRoutes, costWeight]);
  const top3      = scored.slice(0, 3);

  const priorityLabel = sliderVal < 30 ? "Cost-first" : sliderVal > 70 ? "Speed-first" : "Balanced";

  // Changing origin or dest gives RouteGlobe a new key → full remount → no stale animations
  const globeKey = `${origin}--${dest}`;

  const selectStyle = {
    background: "var(--bg)",
    color: "var(--text)",
    border: "1px solid var(--border-hi)",
    borderRadius: "var(--radius-sm)",
    padding: "12px 40px 12px 16px",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    minWidth: 220,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M1 3 L5 7 L9 3' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
  };

  return (
    <>
      <div className="grain" />
      <Header />
      <main style={{ paddingTop: 96 }}>

        {/* ── Hero ───────────────────────────────────────────── */}
        <section style={{ padding: "72px 28px 56px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span className="eyebrow" style={{ display: "flex", marginBottom: 20 }}>Route Efficiency Engine</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
              <div>
                <h1 className="text-h1" style={{ maxWidth: 600, marginBottom: 20 }}>
                  Find the most<br />efficient route.
                </h1>
                <p className="text-body-lg" style={{ color: "var(--text-2)", maxWidth: 480 }}>
                  Every path is scored across cost, speed, and transshipment burden.
                  Tune your priority — the engine surfaces the top 3 routes.
                </p>
              </div>

              {top3.length > 0 ? (
                <div style={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "24px 32px", minWidth: 220 }}>
                  <p className="text-label" style={{ marginBottom: 10 }}>Best route score</p>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {top3[0].score}
                    <span style={{ fontSize: 22, fontWeight: 700, marginLeft: 8, color: "var(--text-2)" }}>{top3[0].grade}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 10, fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                    {top3[0].stops.map(s => COUNTRIES[s].name).join(" → ")}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4, fontFamily: "var(--font-body)" }}>
                    ${fmtNum(top3[0].cost)} · {top3[0].days} days
                  </p>
                </div>
              ) : (
                <div style={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "24px 32px", minWidth: 220 }}>
                  <p className="text-label" style={{ marginBottom: 8 }}>No route found</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-body)" }}>
                    No direct or hub path exists between these countries.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Controls ───────────────────────────────────────── */}
        <section style={{ padding: "32px 28px", borderBottom: "1px solid var(--border)", background: "var(--bg-1)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="text-label">Origin</label>
                <select value={origin} onChange={e => setOrigin(e.target.value)} style={selectStyle}>
                  {countryList.map(([key, c]) => (
                    <option key={key} value={key}>{c.name} — {c.port}</option>
                  ))}
                </select>
              </div>

              <div style={{ paddingBottom: 13, color: "var(--text-4)", fontSize: 22, lineHeight: 1 }}>→</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="text-label">Destination</label>
                <select value={dest} onChange={e => setDest(e.target.value)} style={selectStyle}>
                  {countryList.map(([key, c]) => (
                    <option key={key} value={key}>{c.name} — {c.port}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 260 }}>
                <label className="text-label">
                  Priority — <span style={{ color: "var(--text)" }}>{priorityLabel}</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap" }}>Cheaper</span>
                  <input type="range" min={0} max={100} value={sliderVal}
                    onChange={e => setSliderVal(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#fff", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap" }}>Faster</span>
                </div>
              </div>

              <div style={{ paddingBottom: 13 }}>
                <span style={{
                  fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 700,
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  padding: "8px 16px", borderRadius: 3, color: "var(--text-2)",
                }}>
                  {allRoutes.length} routes analysed
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Globe + Rankings ───────────────────────────────── */}
        <section style={{ borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 400px", height: 580 }}>

            {/* Globe */}
            <div style={{ borderRight: "1px solid var(--border)", position: "relative", height: 580, overflow: "hidden" }}>
              {top3.length > 0 ? (
                <RouteGlobe key={globeKey} routes={top3} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-1)" }}>
                  <p style={{ color: "var(--text-3)", fontSize: 14, fontFamily: "var(--font-body)" }}>
                    Select two different countries to see routes
                  </p>
                </div>
              )}

              {/* Color legend overlay */}
              {top3.length > 0 && (
                <div style={{
                  position: "absolute", bottom: 16, left: 16,
                  display: "flex", flexDirection: "column", gap: 6,
                  background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, padding: "12px 16px",
                  pointerEvents: "none", zIndex: 10,
                }}>
                  {top3.map((route, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 20, height: 2.5, background: ROUTE_COLORS[i],
                        borderRadius: 1, flexShrink: 0,
                        boxShadow: `0 0 6px ${ROUTE_COLORS[i]}99`,
                      }} />
                      <span style={{ fontSize: 11, fontFamily: "var(--font-body)", color: ROUTE_COLORS[i], fontWeight: 600, letterSpacing: "0.01em" }}>
                        #{i + 1} {route.stops.map(s => COUNTRIES[s].name).join(" → ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rankings */}
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <p className="text-label">Top 3 Efficient Routes</p>
                {top3.length > 0 && (
                  <span style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-body)" }}>sorted by efficiency score</span>
                )}
              </div>

              {top3.length === 0 && (
                <div style={{ padding: "40px 28px" }}>
                  <p style={{ fontSize: 13, color: "var(--text-3)", fontFamily: "var(--font-body)" }}>No viable routes found.</p>
                </div>
              )}

              <div style={{ overflowY: "auto", flex: 1 }}>
              {top3.map((route, i) => (
                <RouteCard key={`${route.stops.join("-")}-${i}`} route={route} rank={i + 1} color={ROUTE_COLORS[i]} />
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Methodology ────────────────────────────────────── */}
        <section style={{ padding: "80px 28px", borderBottom: "1px solid var(--border)", background: "var(--bg-1)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span className="eyebrow" style={{ display: "flex", marginBottom: 20 }}>Methodology</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid var(--border)" }}>
              {[
                { step: "01", title: "All paths enumerated", desc: "Direct, 1-hub, and 2-hub routes are generated across the port network. For most country pairs that yields 20–250+ candidate routes." },
                { step: "02", title: "Cost & time normalised", desc: "Each route's total USD cost and transit days are normalised 0–1 within the candidate set, making them directly comparable regardless of magnitude." },
                { step: "03", title: "Efficiency score computed", desc: "Score = 100 × (1 − (w_cost × costNorm + w_time × timeNorm)). Your priority slider sets the weights. Top 3 are rendered on the globe." },
              ].map((s, i) => (
                <div key={i} style={{ padding: "40px 36px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "var(--text-4)", marginBottom: 20 }}>{s.step}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 12 }}>{s.title}</h3>
                  <p className="text-body" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: "28px 36px", border: "1px solid var(--border)", display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
              <p className="text-label" style={{ marginRight: 8 }}>Grade key</p>
              {[
                { grade: "A+", range: "90–100", note: "Optimal"     },
                { grade: "A",  range: "80–89",  note: "Excellent"   },
                { grade: "B+", range: "70–79",  note: "Good"        },
                { grade: "B",  range: "60–69",  note: "Acceptable"  },
                { grade: "C",  range: "50–59",  note: "Suboptimal"  },
                { grade: "D",  range: "0–49",   note: "Inefficient" },
              ].map(g => (
                <div key={g.grade} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: GRADE_COLOR[g.grade] }}>{g.grade}</span>
                  <div>
                    <p style={{ fontSize: 12, fontFamily: "var(--font-body)", color: "var(--text-2)" }}>{g.note}</p>
                    <p style={{ fontSize: 10, color: "var(--text-4)", fontFamily: "var(--font-body)" }}>{g.range}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROUTE CARD — left border uses the route color
═══════════════════════════════════════════════════════════════ */
function RouteCard({ route, rank, color }) {
  const stops = route.stops.map(s => COUNTRIES[s]);
  const isTop = rank === 1;

  return (
    <div
      style={{
        padding: "22px 28px",
        borderBottom: "1px solid var(--border)",
        borderLeft: `3px solid ${color}`,
        background: isTop ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "background 0.18s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-1)")}
      onMouseLeave={e => (e.currentTarget.style.background = isTop ? "rgba(255,255,255,0.03)" : "transparent")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 800, color: "var(--text-4)", letterSpacing: "0.08em" }}>#{rank}</span>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
            color: GRADE_COLOR[route.grade],
            background: "var(--bg-2)", border: `1px solid ${GRADE_COLOR[route.grade]}33`,
            padding: "2px 10px", borderRadius: 3,
          }}>
            {route.grade}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", color, lineHeight: 1 }}>
          {route.score}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center", marginBottom: 14 }}>
        {stops.map((s, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 600, color: (i === 0 || i === stops.length - 1) ? "var(--text)" : "var(--text-3)" }}>
              {s.name}
            </span>
            {i < stops.length - 1 && <span style={{ fontSize: 9, color: "var(--text-4)" }}>▶</span>}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <Stat label="Cost"    value={`$${fmtNum(route.cost)}`} />
        <Stat label="Transit" value={`${route.days} days`}             />
        <Stat label="Hubs"    value={route.stops.length - 2}           />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "var(--text-4)", fontFamily: "var(--font-body)", marginBottom: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.01em" }}>{value}</p>
    </div>
  );
}