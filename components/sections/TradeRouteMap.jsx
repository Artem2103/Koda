import { useEffect, useRef, useState, useMemo } from "react";
import { WorldMap } from "@/components/ui/WorldMap";

// ─── AISstream WebSocket ───────────────────────────────────────────────────────
// Connects client-side to aisstream.io and streams live vessel positions.
// Returns an array of { lat, lng, mmsi, name } updated in real time.
function useVesselPositions(apiKey) {
  const [vessels, setVessels] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!apiKey) return;

    function connect() {
      const ws = new WebSocket("wss://stream.aisstream.io/v0/stream");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            APIKey: apiKey,
            // Global bounding box — narrows to major shipping lanes
            BoundingBoxes: [
              [[-90, -180], [90, 180]],
            ],
            FilterMessageTypes: ["PositionReport"],
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.MessageType !== "PositionReport") return;

          const meta     = msg.MetaData  ?? {};
          const position = msg.Message?.PositionReport ?? {};

          const lat  = parseFloat(meta.latitude  ?? position.Latitude);
          const lng  = parseFloat(meta.longitude ?? position.Longitude);
          const mmsi = String(meta.MMSI ?? position.UserID ?? "");
          const name = meta.ShipName ?? "Vessel";

          if (isNaN(lat) || isNaN(lng)) return;
          // Filter out obviously bad coordinates (0,0 ghost ships)
          if (lat === 0 && lng === 0) return;

          setVessels((prev) => {
            const idx = prev.findIndex((v) => v.mmsi === mmsi);
            const updated = { lat, lng, mmsi, name };
            if (idx === -1) {
              // Cap at 300 vessels to keep the map readable
              return prev.length < 300 ? [...prev, updated] : prev;
            }
            const next = [...prev];
            next[idx] = updated;
            return next;
          });
        } catch (_) {
          // silently ignore malformed messages
        }
      };

      ws.onerror = (err) => console.error("[AISstream] WebSocket error", err);

      ws.onclose = () => {
        // Reconnect after 5 s if closed unexpectedly
        setTimeout(connect, 5000);
      };
    }

    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [apiKey]);

  return vessels;
}

// ─── Fallback static routes (shown while real data loads) ─────────────────────
const FALLBACK_ROUTES = [
  { start: { lat: 51.9225, lng: 4.4792,    label: "Rotterdam"   }, end: { lat: 31.2304, lng: 121.4737, label: "Shanghai"    } },
  { start: { lat: 25.2048, lng: 55.2708,   label: "Dubai"       }, end: { lat: 19.076,  lng: 72.8777,  label: "Mumbai"      } },
  { start: { lat: 1.3521,  lng: 103.8198,  label: "Singapore"   }, end: { lat: 33.7405, lng: -118.272, label: "Los Angeles" } },
  { start: { lat: 51.9225, lng: 4.4792,    label: "Rotterdam"   }, end: { lat: 40.6413, lng: -74.0059, label: "New York"    } },
  { start: { lat: 31.2304, lng: 121.4737,  label: "Shanghai"    }, end: { lat: -1.2921, lng: 36.8219,  label: "Nairobi"     } },
];

// ─── Main component ────────────────────────────────────────────────────────────
/**
 * @param {{ variant?: "home" | "logistics" }} props
 */
export default function TradeRouteMap({ variant = "home" }) {
  const isHome = variant === "home";

  // ── Maersk port locations ────────────────────────────────────────────────────
  const [ports, setPorts]       = useState([]);
  const [portsLoading, setLoading] = useState(true);
  const [portsError, setError]  = useState(null);

  useEffect(() => {
    async function fetchPorts() {
      try {
        setLoading(true);
        const res = await fetch("/api/locations?locationType=TERMINAL");
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        setPorts(data);
      } catch (err) {
        console.error("[TradeRouteMap] Failed to load ports:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPorts();
  }, []);

  // ── Live vessel positions via AISstream ──────────────────────────────────────
  const AIS_KEY = process.env.NEXT_PUBLIC_AISSTREAM_KEY;
  const vessels = useVesselPositions(AIS_KEY);

  // ── Build route pairs from top ports for the animated lines ─────────────────
  // We pair consecutive major ports to draw meaningful route arcs.
  // Build routes by picking maximally distant port pairs from real Maersk data
  const routes = useMemo(() => {
    if (ports.length < 2) return FALLBACK_ROUTES;

    // Pick 10 well-spread ports using a greedy farthest-point approach
    const pool = [...ports];
    const chosen = [pool[0]];

    while (chosen.length < Math.min(200, pool.length)) {
      let farthest = null;
      let maxDist  = -1;
      for (const candidate of pool) {
        // Min distance from candidate to any already-chosen port
        const minD = chosen.reduce((min, c) => {
          const d = Math.sqrt(
            Math.pow(candidate.lat - c.lat, 2) +
            Math.pow(candidate.lng - c.lng, 2)
          );
          return Math.min(min, d);
        }, Infinity);
        if (minD > maxDist) { maxDist = minD; farthest = candidate; }
      }
      if (!farthest || maxDist < 5) break;
      chosen.push(farthest);
    }

    // Pair them as a chain
    const pairs = [];
    for (let i = 0; i < chosen.length - 1; i++) {
      pairs.push({
        start: { lat: chosen[i].lat,     lng: chosen[i].lng,     label: chosen[i].name },
        end:   { lat: chosen[i+1].lat,   lng: chosen[i+1].lng,   label: chosen[i+1].name },
      });
    }
    return pairs.length > 0 ? pairs : FALLBACK_ROUTES;
  }, [ports]);

  // ── Vessel dots to overlay on the map ───────────────────────────────────────
  // The WorldMap "dots" prop drives the animated routes, so we pass vessels
  // as additional single-point dots (start === end, no arc drawn).
  const vesselDots = useMemo(
    () =>
      vessels.map((v) => ({
        start: { lat: v.lat, lng: v.lng, label: v.name },
        end:   { lat: v.lat, lng: v.lng, label: v.name },
      })),
    [vessels]
  );

  const mapDots = [...routes, ...vesselDots];

  return (
    <section
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: isHome ? "100px 28px" : "72px 28px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: 56,
          flexWrap: "wrap", gap: 24,
          borderBottom: "1px solid var(--border)", paddingBottom: 40,
        }}>
          <div>
            <span className="eyebrow" style={{ marginBottom: 16, display: "flex" }}>
              {isHome ? "Global Coverage" : "Active Trade Lanes"}
            </span>
            <h2 className="text-h2">
              {isHome
                ? <>{ports.length > 0 ? `${ports.length}+` : "160+"} ports.<br />Every corridor mapped.</>
                : <>Route intelligence<br />across every lane.</>
              }
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: isHome ? "flex-end" : "flex-start", gap: 8 }}>
            <p className="text-body-lg" style={{ color: "var(--text-2)", maxWidth: 380, textAlign: isHome ? "right" : "left" }}>
              {isHome
                ? "Live Maersk port network. Real vessel positions via AIS. Every corridor tracked in real time."
                : "Every route scored against live port conditions, commodity restrictions, sanctions exposure, and carrier performance."
              }
            </p>
            {/* Live status indicators */}
            <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
              <StatusPill
                label={portsLoading ? "Loading ports…" : portsError ? "Port data unavailable" : `${ports.length} ports live`}
                color={portsLoading ? "#888" : portsError ? "#f87171" : "#4ade80"}
              />
              <StatusPill
                label={vessels.length > 0 ? `${vessels.length} vessels live` : "Connecting AIS…"}
                color={vessels.length > 0 ? "#4ade80" : "#888"}
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <WorldMap
          dots={mapDots}
          lineColor="#ff0000"
          showLabels={true}
          animationDuration={2.5}
          loop={true}
        />

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          marginTop: 1,
          borderTop: "1px solid var(--border)",
        }}>
          {[
            { value: ports.length > 0 ? `${ports.length}+` : "—",   label: "Maersk ports"         },
            { value: "2,400+",                                         label: "Trade corridors"      },
            { value: vessels.length > 0 ? `${vessels.length}` : "—", label: "Live vessels (AIS)"   },
            { value: "800+",                                           label: "Carriers benchmarked" },
          ].map(({ value, label }, i) => (
            <div key={i} style={{
              padding: "32px 24px", textAlign: "center",
              borderRight: i < 3 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px, 3vw, 38px)",
                fontWeight: 800, letterSpacing: "-0.025em",
                lineHeight: 1, marginBottom: 6,
              }}>{value}</div>
              <p className="text-label" style={{ fontSize: 10 }}>{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusPill({ label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: color,
        boxShadow: `0 0 6px ${color}`,
        flexShrink: 0,
      }} />
      <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-body)" }}>
        {label}
      </span>
    </div>
  );
}