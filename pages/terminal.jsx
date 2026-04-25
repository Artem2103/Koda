import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  GOODS_CATEGORIES,
  QUANTITY_UNITS,
  COUNTRIES,
  checkCountryRestriction,
} from "@/lib/Traderules";

// ─── Country list sorted for dropdowns ───────────────────────────────────────
const COUNTRY_OPTIONS = Object.entries(COUNTRIES)
  .map(([code, data]) => ({ code, ...data }))
  .sort((a, b) => a.name.localeCompare(b.name));

// ─── Route colours (top-3) ───────────────────────────────────────────────────
const ROUTE_COLORS = ["#FF4D4D", "#4DA6FF", "#4DFF91"];

const MODE_ICONS = { Ocean: "⚓", Rail: "🚂", Road: "🚚", Air: "✈️" };

// ─── Mapbox Globe ─────────────────────────────────────────────────────────────
function MapboxRouteGlobe({ routes, originCoords, destCoords }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const activeLayersRef = useRef([]);
  const activeSourcesRef = useRef([]);

  const clearMap = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    activeLayersRef.current.forEach((id) => {
      try { if (map.getLayer(id)) map.removeLayer(id); } catch {}
    });
    activeSourcesRef.current.forEach((id) => {
      try { if (map.getSource(id)) map.removeSource(id); } catch {}
    });
    activeLayersRef.current  = [];
    activeSourcesRef.current = [];
  }, []);

  const paintRoutes = useCallback(() => {
    const map = mapRef.current;
    if (!map || !routes.length) return;

    clearMap();

    routes.slice(0, 3).forEach((route, rIdx) => {
      const color = ROUTE_COLORS[rIdx];
      const coords = (route.waypoints ?? []).map((wp) => [wp.lng, wp.lat]);
      if (coords.length < 2) return;

      const srcId  = `route-src-${rIdx}`;
      const glowId = `route-glow-${rIdx}`;
      const lineId = `route-line-${rIdx}`;
      const stpSrc = `stops-src-${rIdx}`;
      const stpHlo = `stops-halo-${rIdx}`;
      const stpDot = `stops-dot-${rIdx}`;

      map.addSource(srcId, {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } },
      });
      map.addLayer({
        id: glowId, type: "line", source: srcId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": color, "line-width": 8, "line-opacity": 0.12 },
      });
      map.addLayer({
        id: lineId, type: "line", source: srcId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": color, "line-width": 2.5, "line-opacity": 0.95 },
      });

      map.addSource(stpSrc, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: (route.waypoints ?? []).map((wp) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [wp.lng, wp.lat] },
            properties: { name: wp.name },
          })),
        },
      });
      map.addLayer({
        id: stpHlo, type: "circle", source: stpSrc,
        paint: { "circle-radius": 8, "circle-color": color, "circle-opacity": 0.18 },
      });
      map.addLayer({
        id: stpDot, type: "circle", source: stpSrc,
        paint: {
          "circle-radius": 3.5,
          "circle-color": color,
          "circle-opacity": 1,
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1.2,
        },
      });

      activeLayersRef.current.push(glowId, lineId, stpHlo, stpDot);
      activeSourcesRef.current.push(srcId, stpSrc);
    });
  }, [routes, clearMap]);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const init = async () => {
      if (!document.getElementById("mapbox-gl-css")) {
        const link = document.createElement("link");
        link.id   = "mapbox-gl-css";
        link.rel  = "stylesheet";
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css";
        document.head.appendChild(link);
      }

      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const centerLng = originCoords && destCoords
        ? (originCoords.lng + destCoords.lng) / 2
        : 30;
      const centerLat = originCoords && destCoords
        ? (originCoords.lat + destCoords.lat) / 2
        : 20;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [centerLng, centerLat],
        zoom: 1.5,
        projection: "globe",
        antialias: true,
      });

      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        if (cancelled) return;
        map.setFog({
          color: "rgb(8,8,18)",
          "high-color": "rgb(18,18,45)",
          "horizon-blend": 0.02,
          "space-color": "rgb(4,4,12)",
          "star-intensity": 0.65,
        });
        if (routes.length) paintRoutes();
      });
    };

    init().catch(console.error);
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      paintRoutes();
    } else {
      map.once("load", paintRoutes);
    }
  }, [paintRoutes]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── Dotted-globe placeholder ─────────────────────────────────────────────────
function EmptyGlobe() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--bg-1)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 12,
    }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" stroke="var(--border-hi)" strokeWidth="1.2"/>
        <ellipse cx="24" cy="24" rx="10" ry="22" stroke="var(--border)" strokeWidth="0.8"/>
        <line x1="2" y1="24" x2="46" y2="24" stroke="var(--border)" strokeWidth="0.8"/>
        <line x1="24" y1="2" x2="24" y2="46" stroke="var(--border)" strokeWidth="0.8"/>
      </svg>
      <p style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center", lineHeight: 1.6 }}>
        Select origin &amp; destination<br />to visualise the route
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TerminalPage() {
  const [goods,    setGoods]    = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit,     setUnit]     = useState("tonnes");
  const [origin,   setOrigin]   = useState("");
  const [dest,     setDest]     = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [ran,      setRan]      = useState(false);
  const [apiError, setApiError] = useState("");

  const quantityKg = useMemo(() => {
    const q = parseFloat(quantity) || 0;
    const m = { "kg": 1, "tonnes": 1000, "units": 0.5, "pallets": 500,
                "containers (20ft)": 20000, "containers (40ft)": 26000 };
    return q * (m[unit] || 1);
  }, [quantity, unit]);

  const handleCalculate = async () => {
    if (!goods || !origin || !dest || !quantity) return;
    setLoading(true);
    setRan(true);
    setApiError("");
    setResult(null);

    try {
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination: dest,
          product: goods,
          quantity: quantityKg,
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setApiError("Failed to calculate routes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goodsLabel = GOODS_CATEGORIES.find((g) => g.id === goods)?.label || "";
  const goodsIcon  = GOODS_CATEGORIES.find((g) => g.id === goods)?.icon  || "";
  const originName = COUNTRIES[origin]?.name || "";
  const destName   = COUNTRIES[dest]?.name   || "";
  const canRun     = goods && origin && dest && quantity;

  const mapKey = `${origin}--${dest}--${result ? result.routes.length : "empty"}`;

  return (
    <>
      <div className="grain" />
      <Header />
      <main style={{ paddingTop: 96, minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <div style={{ padding: "48px 28px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 40 }}>
            <span className="eyebrow" style={{ marginBottom: 20, display: "flex" }}>Route Terminal</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
              <h1 className="text-h1" style={{ maxWidth: 520 }}>
                Calculate any<br />trade route.
              </h1>
              <p className="text-body-lg" style={{ color: "var(--text-2)", maxWidth: 400 }}>
                Enter shipment details. Meridian evaluates every viable corridor,
                applies real-world distance data, filters country restrictions,
                and ranks routes by cost, speed, and compliance risk.
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr",
            minHeight: "calc(100vh - 260px)",
            borderRight: "1px solid var(--border)",
          }}>

            {/* ── LEFT: Form ── */}
            <div style={{ borderRight: "1px solid var(--border)", padding: "40px 32px" }}>
              <p className="text-label" style={{ marginBottom: 32 }}>Shipment details</p>

              {/* Goods */}
              <FieldBlock label="What are you shipping?" required>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {GOODS_CATEGORIES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoods(g.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "9px 11px",
                        background: goods === g.id ? "rgba(255,255,255,0.07)" : "var(--bg-2)",
                        border: `1px solid ${goods === g.id ? "var(--border-hi)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer", transition: "all 0.14s", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 15 }}>{g.icon}</span>
                      <span style={{
                        fontSize: 11, lineHeight: 1.3, fontFamily: "var(--font-body)",
                        // FIX: was "#fff" when selected — now always uses text variable
                        color: "var(--text-1)",
                        fontWeight: goods === g.id ? 500 : 400,
                      }}>
                        {g.label}
                      </span>
                    </button>
                  ))}
                </div>
              </FieldBlock>

              <Divider />

              {/* Quantity */}
              <FieldBlock label="Quantity" required>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="field"
                    type="number"
                    placeholder="e.g. 25"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <select
                    className="field"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{ width: 154, cursor: "pointer" }}
                  >
                    {QUANTITY_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                {quantity && (
                  <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>
                    ≈ {quantityKg >= 1000
                       ? `${(quantityKg / 1000).toFixed(1)} tonnes`
                       : `${quantityKg} kg`} gross weight
                  </p>
                )}
              </FieldBlock>

              <Divider />

              {/* Origin */}
              <FieldBlock label="Origin country" required>
                <select
                  className="field"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select origin country…</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </FieldBlock>

              <Divider />

              {/* Destination */}
              <FieldBlock label="Destination country" required>
                <select
                  className="field"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select destination country…</option>
                  {COUNTRY_OPTIONS.filter((c) => c.code !== origin).map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </FieldBlock>

              <Divider />

              {/* Live restriction preview */}
              {dest && goods && (
                <RestrictionPreview destCode={dest} goods={goods} destName={destName} />
              )}

              {/* API error */}
              {apiError && (
                <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 12, lineHeight: 1.6 }}>
                  {apiError}
                </p>
              )}

              {/* CTA */}
              <button
                className="btn btn-primary"
                onClick={handleCalculate}
                disabled={!canRun || loading}
                style={{
                  width: "100%", justifyContent: "center",
                  padding: "14px 0", fontSize: 13, marginTop: 4,
                  opacity: canRun ? 1 : 0.4,
                  cursor: canRun ? "pointer" : "not-allowed",
                }}
              >
                {loading ? "Calculating routes…" : "Calculate routes →"}
              </button>

              {canRun && !ran && (
                <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 10 }}>
                  Real distances · 160+ country trade rules
                </p>
              )}
            </div>

            {/* ── RIGHT: Map + Results ── */}
            <div style={{ padding: "40px 40px", display: "flex", flexDirection: "column", gap: 36 }}>

              {/* Globe */}
              <div>
                {origin && dest
                  ? (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <p className="text-label">{originName} → {destName}</p>
                        {result?.routes?.length > 0 && (
                          <div style={{ display: "flex", gap: 16 }}>
                            {result.routes.slice(0, 3).map((r, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 18, height: 2.5, background: ROUTE_COLORS[i], borderRadius: 1, boxShadow: `0 0 5px ${ROUTE_COLORS[i]}88` }} />
                                <span style={{ fontSize: 10, color: ROUTE_COLORS[i], fontFamily: "var(--font-body)", fontWeight: 600 }}>#{i + 1}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{
                        height: 360,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                      }}>
                        <MapboxRouteGlobe
                          key={mapKey}
                          routes={result?.routes ?? []}
                          originCoords={result?.originCoords ?? COUNTRIES[origin]}
                          destCoords={result?.destCoords ?? COUNTRIES[dest]}
                        />
                      </div>
                    </>
                  )
                  : (
                    <div style={{ height: 360 }}>
                      <EmptyGlobe />
                    </div>
                  )
                }
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{
                      height: 72, background: "var(--bg-1)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      opacity: 1 - i * 0.18,
                      animation: "pulse 1.4s ease infinite",
                      animationDelay: `${i * 0.12}s`,
                    }} />
                  ))}
                  <style>{`@keyframes pulse{0%,100%{opacity:.45}50%{opacity:.9}}`}</style>
                </div>
              )}

              {/* Route results */}
              {!loading && result && (
                <RouteResults
                  result={result}
                  goodsLabel={goodsLabel}
                  goodsIcon={goodsIcon}
                  originName={originName}
                  destName={destName}
                  quantityKg={quantityKg}
                />
              )}

              {/* How it works — empty state */}
              {!loading && !ran && (
                <HowItWorks />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function FieldBlock({ label, required, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--text-3)", marginBottom: 11,
        fontFamily: "var(--font-body)",
      }}>
        {label}
        {required && <span style={{ color: "var(--border-hi)", marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "6px 0 22px" }} />;
}

// ─── Live restriction banner ──────────────────────────────────────────────────
function RestrictionPreview({ destCode, goods, destName }) {
  const check = checkCountryRestriction(destCode, goods);

  if (check.type === "ok") return (
    <div style={{
      display: "flex", gap: 9, alignItems: "flex-start",
      background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)",
      borderRadius: "var(--radius-sm)", padding: "11px 13px", marginBottom: 18,
    }}>
      <span style={{ fontSize: 13 }}>✓</span>
      <p style={{ fontSize: 12, color: "#4ade80", lineHeight: 1.6 }}>
        No import ban detected for this category in {destName}.
      </p>
    </div>
  );

  if (check.blocked) return (
    <div style={{
      display: "flex", gap: 9, alignItems: "flex-start",
      background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.22)",
      borderRadius: "var(--radius-sm)", padding: "11px 13px", marginBottom: 18,
    }}>
      <span style={{ fontSize: 13 }}>⛔</span>
      <div>
        <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 4 }}>
          {destName} bans this goods category
        </p>
        <p style={{ fontSize: 11, color: "rgba(239,68,68,0.75)", lineHeight: 1.6 }}>{check.reason}</p>
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex", gap: 9, alignItems: "flex-start",
      background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.22)",
      borderRadius: "var(--radius-sm)", padding: "11px 13px", marginBottom: 18,
    }}>
      <span style={{ fontSize: 13 }}>⚠️</span>
      <div>
        <p style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, marginBottom: 4 }}>
          Restrictions apply in {destName}
        </p>
        <p style={{ fontSize: 11, color: "rgba(245,158,11,0.75)", lineHeight: 1.6 }}>{check.reason}</p>
      </div>
    </div>
  );
}

// ─── Route results section ────────────────────────────────────────────────────
function RouteResults({ result, goodsLabel, goodsIcon, originName, destName, quantityKg }) {
  const { routes, blockedCountries, warnings } = result;

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 3 }}>
            {goodsIcon} {goodsLabel}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>
            {originName} → {destName} ·{" "}
            {quantityKg >= 1000 ? `${(quantityKg / 1000).toFixed(1)} t` : `${quantityKg} kg`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <StatPill value={routes.length} label="Routes" />
          {blockedCountries.length > 0 && (
            <StatPill value={blockedCountries.length} label="Avoided" danger />
          )}
        </div>
      </div>

      {/* Warnings */}
      {warnings.map((w, i) => (
        <AlertBand key={i} color="#f59e0b" message={w} />
      ))}

      {/* Blocked countries */}
      {blockedCountries.length > 0 && (
        <AlertBand
          color="#ef4444"
          heading="Routes via restricted countries removed"
          message={`${blockedCountries.map((c) => COUNTRIES[c]?.name).join(", ")} — restricted for this category. All transiting routes have been excluded.`}
        />
      )}

      {/* No results */}
      {routes.length === 0 && (
        <div style={{
          padding: "40px 28px", textAlign: "center",
          border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>⛔</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No viable routes</p>
          <p style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 340, margin: "0 auto", lineHeight: 1.7 }}>
            The destination bans this goods category, or all corridor options are restricted.
            Consider an alternate goods classification or contact our trade specialists.
          </p>
        </div>
      )}

      {/* Route cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {routes.map((route, i) => (
          <RouteCard key={route.id} route={route} rank={i + 1} color={ROUTE_COLORS[i] ?? "#666"} />
        ))}
      </div>
    </div>
  );
}

function StatPill({ value, label, danger }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: danger ? "#ef4444" : "var(--text-1)" }}>{value}</p>
      <p style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
    </div>
  );
}

function AlertBand({ color, heading, message }) {
  return (
    <div style={{
      background: `${color}0A`, border: `1px solid ${color}30`,
      borderRadius: "var(--radius-sm)", padding: "11px 14px", marginBottom: 10,
    }}>
      {heading && <p style={{ fontSize: 12, color, fontWeight: 600, marginBottom: 4 }}>{heading}</p>}
      <p style={{ fontSize: 12, color: `${color}CC`, lineHeight: 1.65 }}>{message}</p>
    </div>
  );
}

// ─── Individual route card ────────────────────────────────────────────────────
function RouteCard({ route, rank, color }) {
  const [expanded, setExpanded] = useState(rank === 1);
  const isTop = rank === 1;

  const scoreColor = route.score >= 80 ? "#4ade80" : route.score >= 60 ? "#f59e0b" : "#ef4444";
  const estCost    = route.estimatedCostUSD
    ? `~$${route.estimatedCostUSD.toLocaleString()}`
    : "Request quote";

  return (
    <div style={{
      border: `1px solid ${isTop ? color + "60" : "var(--border)"}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: "var(--radius-sm)",
      background: isTop ? "rgba(255,255,255,0.025)" : "var(--bg)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 14,
          padding: "16px 20px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600,
          color: "var(--text-3)", minWidth: 20,
        }}>#{rank}</span>

        {/* Mode badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "3px 9px",
          background: `${color}15`, border: `1px solid ${color}35`,
          borderRadius: 2, flexShrink: 0,
        }}>
          <span style={{ fontSize: 11 }}>{MODE_ICONS[route.mode] ?? "📦"}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: "0.04em" }}>{route.mode}</span>
        </div>

        {/* FIX: Route label — was fontWeight 700 and color #000000, now matches page style */}
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500,
          color: "var(--text-1)", flex: 1, letterSpacing: "-0.01em",
        }}>
          {route.label}
        </span>

        {/* Stats */}
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            {/* FIX: was fontWeight 600 and color #000000 */}
            <p style={{ fontSize: 13, fontWeight: 400, color: "var(--text-1)" }}>
              {route.days[0]}–{route.days[1]}d
            </p>
            <p style={{ fontSize: 10, color: "var(--text-3)" }}>transit</p>
          </div>
          {route.distanceKm && (
            <div style={{ textAlign: "right" }}>
              {/* FIX: was fontWeight 600 and color #000000 */}
              <p style={{ fontSize: 13, fontWeight: 400, color: "var(--text-1)" }}>
                {route.distanceKm >= 1000
                  ? `${(route.distanceKm / 1000).toFixed(1)}k km`
                  : `${route.distanceKm} km`}
              </p>
              <p style={{ fontSize: 10, color: "var(--text-3)" }}>distance</p>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            {/* FIX: was fontWeight 600 and color #000000 */}
            <p style={{ fontSize: 13, fontWeight: 400, color: "var(--text-1)" }}>{estCost}</p>
            <p style={{ fontSize: 10, color: "var(--text-3)" }}>estimated</p>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `${scoreColor}18`, border: `1.5px solid ${scoreColor}45`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: scoreColor }}>
              {route.score}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "var(--text-3)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{
          borderTop: "1px solid var(--border)", padding: "14px 20px 18px",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {/* Route path */}
          {route.waypoints?.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Route path</p>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                {route.waypoints.map((wp, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{
                      fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 400,
                      // FIX: was "#fff" for first/last waypoints — now all use text variable
                      color: "var(--text-2)",
                      padding: "3px 9px",
                      // FIX: was "rgba(255,255,255,0.07)" for first/last — now uniform
                      background: "var(--bg-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 2,
                    }}>
                      {wp.name}
                    </span>
                    {i < route.waypoints.length - 1 && (
                      <span style={{ fontSize: 9, color: "var(--text-4)" }}>▶</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Required docs */}
          {route.requirements?.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Required documentation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {route.requirements.map((req, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, color: "#f59e0b", marginTop: 1 }}>→</span>
                    <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.55 }}>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance notes */}
          {route.warnings?.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Compliance notes</p>
              {route.warnings.map((w, i) => (
                <p key={i} style={{ fontSize: 12, color: "rgba(245,158,11,0.85)", lineHeight: 1.65, marginBottom: 4 }}>{w}</p>
              ))}
            </div>
          )}

          {/* Clean route */}
          {!route.warnings?.length && !route.requirements?.length && (
            <p style={{ fontSize: 12, color: "#4ade80" }}>
              ✓ No additional documentation or compliance requirements detected for this route.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── How it works (empty state) ───────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { step: "01", title: "Select your goods",        desc: "Commodity-specific trade rules are applied for your product category across all evaluated corridors." },
    { step: "02", title: "Set origin & destination",  desc: "Country-level restrictions, bans, and certification requirements are checked the moment you select." },
    { step: "03", title: "Get real-distance routes",  desc: "Haversine and Mapbox distances are combined to produce realistic transit times and landed costs per route." },
    { step: "04", title: "Review ranked options",     desc: "Routes are scored by cost, speed, and compliance burden. Required docs are surfaced per route." },
  ];

  return (
    <div>
      <p className="text-label" style={{ marginBottom: 20 }}>How this works</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
        {steps.map((item, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "44px 1fr",
            gap: 18, padding: "20px 22px",
            borderBottom: i < steps.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text-4)", lineHeight: 1 }}>
              {item.step}
            </span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, marginBottom: 4, letterSpacing: "-0.01em" }}>{item.title}</p>
              <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}