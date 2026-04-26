import { WorldMap } from "@/components/ui/WorldMap";
import { MAP_ROUTES } from "@/lib/data/routes";

export default function TradeRouteMap({ variant = "home" }) {
  const isHome = variant === "home";

  return (
    <section
      style={{
        background: "var(--panel-bg)",
        borderTop: "1px solid var(--panel-border)",
        borderBottom: "1px solid var(--panel-border)",
        padding: isHome ? "100px 28px" : "72px 28px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 24,
            borderBottom: "1px solid var(--panel-border)",
            paddingBottom: 28,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--panel-text-3)",
                marginBottom: 14,
              }}
            >
              Global Logistics Network
            </span>
            <h2
              style={{
                margin: "0 0 12px 0",
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3.4vw, 2.8rem)",
                letterSpacing: "0.02em",
                color: "var(--text-4)",
              }}
            >
              Active Trade Corridors
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--panel-text-2)",
                maxWidth: 640,
              }}
            >
              Real-time maritime lanes connecting major ports across Asia, Europe,
              and North America.
            </p>
          </div>
        </div>

        <WorldMap
          dots={MAP_ROUTES}
          lineColor="#4ade80"
          showLabels
          animationDuration={2}
          loop
        />
      </div>
    </section>
  );
}