import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WorldMap } from "@/components/ui/WorldMap";
import {
  GOODS_CATEGORIES,
  QUANTITY_UNITS,
  COUNTRIES,
  calculateRoutes,
  checkCountryRestriction,
} from "@/lib/Traderules";

// Sort countries alphabetically for dropdowns
const COUNTRY_OPTIONS = Object.entries(COUNTRIES)
  .map(([code, data]) => ({ code, ...data }))
  .sort((a, b) => a.name.localeCompare(b.name));

const MODE_ICONS = {
  Ocean:  "⚓",
  Rail:   "🚂",
  Road:   "🚚",
  Air:    "✈️",
};

const MODE_COLORS = {
  Ocean:  "#3b82f6",
  Rail:   "#f59e0b",
  Road:   "#10b981",
  Air:    "#f43f5e",
};

export default function TerminalPage() {
  const [goods,    setGoods]    = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit,     setUnit]     = useState("tonnes");
  const [origin,   setOrigin]   = useState("");
  const [dest,     setDest]     = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [ran,      setRan]      = useState(false);

  const quantityKg = useMemo(() => {
    const q = parseFloat(quantity) || 0;
    const multipliers = {
      "kg": 1,
      "tonnes": 1000,
      "units": 0.5,
      "pallets": 500,
      "containers (20ft)": 20000,
      "containers (40ft)": 26000,
    };
    return q * (multipliers[unit] || 1);
  }, [quantity, unit]);

  const handleCalculate = () => {
    if (!goods || !origin || !dest || !quantity) return;
    setLoading(true);
    setRan(true);
    // Simulate slight processing delay for UX
    setTimeout(() => {
      const res = calculateRoutes(origin, dest, goods, quantityKg);
      setResult(res);
      setLoading(false);
    }, 800);
  };

  // Build map dots from origin + destination
  const mapDots = useMemo(() => {
    if (!origin || !dest) return [];
    const o = COUNTRIES[origin];
    const d = COUNTRIES[dest];
    if (!o || !d) return [];
    return [{
      start: { lat: o.lat, lng: o.lng, label: o.name },
      end:   { lat: d.lat, lng: d.lng, label: d.name },
    }];
  }, [origin, dest]);

  const goodsLabel = GOODS_CATEGORIES.find(g => g.id === goods)?.label || "";
  const goodsIcon  = GOODS_CATEGORIES.find(g => g.id === goods)?.icon || "";
  const originName = COUNTRIES[origin]?.name || "";
  const destName   = COUNTRIES[dest]?.name   || "";

  const canRun = goods && origin && dest && quantity;

  return (
    <>
      <div className="grain" />
      <Header />
      <main style={{ paddingTop: 96, minHeight: "100vh" }}>

        {/* ── Page Hero ── */}
        <div style={{ padding: "48px 28px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 40 }}>
            <span className="eyebrow" style={{ marginBottom: 20, display: "flex" }}>Route Terminal</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
              <h1 className="text-h1" style={{ maxWidth: 600 }}>
                Calculate any<br />trade route.
              </h1>
              <p className="text-body-lg" style={{ color: "var(--text-2)", maxWidth: 400 }}>
                Enter your shipment details. Meridian evaluates every viable corridor,
                filters for country restrictions, and ranks routes by cost, speed, and compliance risk.
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", minHeight: "calc(100vh - 260px)", borderRight: "1px solid var(--border)" }}>

            {/* ── LEFT PANEL: Form ── */}
            <div style={{ borderRight: "1px solid var(--border)", padding: "40px 36px" }}>
              <p className="text-label" style={{ marginBottom: 32 }}>Shipment details</p>

              {/* Goods */}
              <FieldBlock label="What are you shipping?" required>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {GOODS_CATEGORIES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoods(g.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "10px 12px",
                        background: goods === g.id ? "rgba(255,255,255,0.08)" : "var(--bg-2)",
                        border: `1px solid ${goods === g.id ? "var(--border-hi)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{g.icon}</span>
                      <span style={{ fontSize: 11, color: goods === g.id ? "#fff" : "var(--text-2)", fontFamily: "var(--font-body)", lineHeight: 1.3, fontWeight: goods === g.id ? 600 : 400 }}>
                        {g.label}
                      </span>
                    </button>
                  ))}
                </div>
              </FieldBlock>

              <Divider />

              {/* Quantity */}
              <FieldBlock label="Quantity" required>
                <div style={{ display: "flex", gap: 10 }}>
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
                    style={{ width: 160, cursor: "pointer" }}
                  >
                    {QUANTITY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                {quantity && (
                  <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>
                    ≈ {quantityKg >= 1000 ? `${(quantityKg / 1000).toFixed(1)} tonnes` : `${quantityKg} kg`} gross weight
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
                  {COUNTRY_OPTIONS.map(c => (
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
                  {COUNTRY_OPTIONS.filter(c => c.code !== origin).map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </FieldBlock>

              <Divider />

              {/* Restrictions preview */}
              {dest && goods && <RestrictionPreview destCode={dest} goods={goods} destName={destName} />}

              {/* CTA */}
              <button
                className="btn btn-primary"
                onClick={handleCalculate}
                disabled={!canRun || loading}
                style={{
                  width: "100%", justifyContent: "center",
                  padding: "14px 0", fontSize: 13, marginTop: 8,
                  opacity: canRun ? 1 : 0.4,
                  cursor: canRun ? "pointer" : "not-allowed",
                }}
              >
                {loading ? "Calculating routes…" : "Calculate routes →"}
              </button>

              {canRun && !ran && (
                <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 10 }}>
                  Evaluating corridors across 160+ countries
                </p>
              )}
            </div>

            {/* ── RIGHT PANEL: Results ── */}
            <div style={{ padding: "40px 40px" }}>

              {/* Map always visible when origin+dest selected */}
              {(origin && dest) ? (
                <div style={{ marginBottom: 40 }}>
                  <p className="text-label" style={{ marginBottom: 16 }}>
                    {originName} → {destName}
                  </p>
                  <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                    <WorldMap
                      dots={mapDots}
                      lineColor={result?.routes[0] ? MODE_COLORS[result.routes[0].mode] || "#fff" : "#ffffff"}
                      showLabels={true}
                      animationDuration={2.0}
                      loop={true}
                    />
                  </div>
                </div>
              ) : (
                <EmptyMapPlaceholder />
              )}

              {/* Loading */}
              {loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      height: 80,
                      background: "var(--bg-1)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      animation: "pulse 1.4s ease infinite",
                      animationDelay: `${i * 0.15}s`,
                    }} />
                  ))}
                  <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
                </div>
              )}

              {/* Results */}
              {!loading && result && (
                <RouteResults
                  result={result}
                  goods={goodsLabel}
                  goodsIcon={goodsIcon}
                  origin={originName}
                  dest={destName}
                  quantityKg={quantityKg}
                />
              )}

              {/* Empty state */}
              {!loading && !ran && (
                <div style={{ paddingTop: 0 }}>
                  <p className="text-label" style={{ marginBottom: 24 }}>How this works</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                    {[
                      { step: "01", title: "Select your goods",       desc: "The engine applies commodity-specific trade rules for your product category." },
                      { step: "02", title: "Set origin & destination", desc: "Country-level restrictions, bans, and certification requirements are checked immediately." },
                      { step: "03", title: "Review route options",     desc: "Routes are ranked by score — factoring in transit time, cost, and compliance burden." },
                      { step: "04", title: "Check requirements",       desc: "Any certifications, permits, or documentation needed at destination are listed per route." },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: "grid", gridTemplateColumns: "44px 1fr",
                        gap: 20, padding: "22px 24px",
                        borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                      }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--text-4)", lineHeight: 1 }}>
                          {item.step}
                        </span>
                        <div>
                          <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 5, letterSpacing: "-0.01em" }}>{item.title}</p>
                          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────────── */

function FieldBlock({ label, required, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{
        display: "block", fontFamily: "var(--font-body)",
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "var(--text-3)", marginBottom: 12,
      }}>
        {label}{required && <span style={{ color: "var(--border-hi)", marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "8px 0 24px" }} />;
}

function RestrictionPreview({ destCode, goods, destName }) {
  const check = checkCountryRestriction(destCode, goods);
  if (check.type === "ok") return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)",
      borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 20,
    }}>
      <span style={{ fontSize: 14 }}>✓</span>
      <p style={{ fontSize: 12, color: "#4ade80", lineHeight: 1.6 }}>
        No import ban detected for this category in {destName}.
      </p>
    </div>
  );
  if (check.blocked) return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 20,
    }}>
      <span style={{ fontSize: 14 }}>⛔</span>
      <div>
        <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 4 }}>
          {destName} bans this goods category
        </p>
        <p style={{ fontSize: 11, color: "rgba(239,68,68,0.8)", lineHeight: 1.6 }}>{check.reason}</p>
      </div>
    </div>
  );
  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)",
      borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 20,
    }}>
      <span style={{ fontSize: 14 }}>⚠️</span>
      <div>
        <p style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, marginBottom: 4 }}>
          Restrictions apply in {destName}
        </p>
        <p style={{ fontSize: 11, color: "rgba(245,158,11,0.8)", lineHeight: 1.6 }}>{check.reason}</p>
      </div>
    </div>
  );
}

function EmptyMapPlaceholder() {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      aspectRatio: "2 / 1",
      background: "var(--bg-1)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 12, marginBottom: 40,
    }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="var(--border-hi)" strokeWidth="1.2"/>
        <path d="M2 20h36M20 2a28 28 0 0 1 0 36M20 2a28 28 0 0 0 0 36M8 8.5a28 28 0 0 1 24 0M8 31.5a28 28 0 0 0 24 0" stroke="var(--border)" strokeWidth="1" />
      </svg>
      <p style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
        Select an origin and destination<br />to visualise the route
      </p>
    </div>
  );
}

function RouteResults({ result, goods, goodsIcon, origin, dest, quantityKg }) {
  const { routes, blockedCountries, warnings } = result;

  return (
    <div>
      {/* Summary bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 4 }}>
            {goodsIcon} {goods}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>
            {origin} → {dest} · {quantityKg >= 1000 ? `${(quantityKg/1000).toFixed(1)} tonnes` : `${quantityKg} kg`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800 }}>{routes.length}</p>
            <p style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Routes found</p>
          </div>
          {blockedCountries.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#ef4444" }}>{blockedCountries.length}</p>
              <p style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Countries avoided</p>
            </div>
          )}
        </div>
      </div>

      {/* Global warnings */}
      {warnings.length > 0 && warnings.map((w, i) => (
        <div key={i} style={{
          display: "flex", gap: 10, alignItems: "flex-start",
          background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 12,
        }}>
          <p style={{ fontSize: 12, color: "#f59e0b", lineHeight: 1.65 }}>{w}</p>
        </div>
      ))}

      {/* Blocked countries notice */}
      {blockedCountries.length > 0 && (
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-start",
          background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 20,
        }}>
          <div>
            <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 4 }}>Routes via restricted countries removed</p>
            <p style={{ fontSize: 11, color: "rgba(239,68,68,0.75)", lineHeight: 1.6 }}>
              {blockedCountries.map(c => COUNTRIES[c]?.name).join(", ")} — restricted for this goods category.
              All routes passing through these countries have been excluded.
            </p>
          </div>
        </div>
      )}

      {/* No routes */}
      {routes.length === 0 && (
        <div style={{
          padding: "32px", textAlign: "center",
          border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
        }}>
          <p style={{ fontSize: 28, marginBottom: 12 }}>⛔</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No viable routes found</p>
          <p style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 340, margin: "0 auto", lineHeight: 1.7 }}>
            The destination country bans import of this goods category, or all transit corridors
            are restricted. Consider an alternate goods classification or contact our trade specialists.
          </p>
        </div>
      )}

      {/* Route cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {routes.map((route, i) => (
          <RouteCard key={route.id} route={route} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

function RouteCard({ route, rank }) {
  const [expanded, setExpanded] = useState(rank === 1);
  const modeColor = MODE_COLORS[route.mode] || "#fff";
  const modeIcon  = MODE_ICONS[route.mode]  || "📦";
  const isTop     = rank === 1;

  const scoreColor = route.score >= 80 ? "#4ade80" : route.score >= 60 ? "#f59e0b" : "#ef4444";

  const estCost = route.estimatedCostUSD
    ? `~$${route.estimatedCostUSD.toLocaleString()}`
    : "Contact for quote";

  return (
    <div style={{
      border: `1px solid ${isTop ? "var(--border-hi)" : "var(--border)"}`,
      borderRadius: "var(--radius-sm)",
      background: isTop ? "rgba(255,255,255,0.03)" : "var(--bg)",
      overflow: "hidden",
      transition: "border-color 0.18s",
    }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 16,
          padding: "18px 20px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        {/* Rank */}
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700,
          color: "var(--text-3)", letterSpacing: "0.08em", minWidth: 24,
        }}>#{rank}</span>

        {/* Mode badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "3px 10px",
          background: `${modeColor}18`,
          border: `1px solid ${modeColor}40`,
          borderRadius: 2,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 12 }}>{modeIcon}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: modeColor, letterSpacing: "0.04em" }}>{route.mode}</span>
        </div>

        {/* Label */}
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700,
          color: "#fff", letterSpacing: "-0.01em", flex: 1,
        }}>
          {route.label}
        </span>

        {/* Stats */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{route.days[0]}–{route.days[1]} days</p>
            <p style={{ fontSize: 10, color: "var(--text-3)" }}>transit</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{estCost}</p>
            <p style={{ fontSize: 10, color: "var(--text-3)" }}>estimated</p>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: `${scoreColor}18`,
            border: `1.5px solid ${scoreColor}50`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, color: scoreColor }}>{route.score}</span>
          </div>
          <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: -4 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "16px 20px 20px",
          display: "flex", flexDirection: "column", gap: 14,
        }}>

          {/* Transit countries */}
          {route.transit.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Transit via</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {route.transit.map(tCode => (
                  <div key={tCode} style={{
                    padding: "4px 10px",
                    background: "var(--bg-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                    fontSize: 12,
                    color: "var(--text-2)",
                  }}>
                    {COUNTRIES[tCode]?.name || tCode}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {route.requirements.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Required documentation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {route.requirements.map((req, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, color: "#f59e0b", marginTop: 1 }}>→</span>
                    <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.55 }}>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {route.warnings.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Compliance notes</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {route.warnings.map((w, i) => (
                  <p key={i} style={{ fontSize: 12, color: "rgba(245,158,11,0.85)", lineHeight: 1.65 }}>{w}</p>
                ))}
              </div>
            </div>
          )}

          {/* No warnings, no requirements */}
          {route.warnings.length === 0 && route.requirements.length === 0 && (
            <p style={{ fontSize: 12, color: "#4ade80" }}>✓ No additional documentation or compliance requirements detected for this route.</p>
          )}
        </div>
      )}
    </div>
  );
}