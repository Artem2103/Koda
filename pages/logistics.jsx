import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TradeRouteMap from "@/components/sections/TradeRouteMap";
import PageMediaBanner from "@/components/ui/PageMediaBanner";
import { LOGISTICS_FEATURES } from "@/lib/constants";

export default function LogisticsPage() {
  return (
    <>
      <div className="grain" />
      <Header />
      <main style={{ paddingTop: 96 }}>
        <PageHero
          tag="Logistics Module"
          heading={<>Route intelligence<br />for the real world.</>}
          sub="Meridian's route engine evaluates every viable path for your cargo — across modes, borders, and trade regimes — and ranks them by cost, speed, and risk. No guesswork."
          cta={{ label: "Start free trial", href: "/get-started" }}
          ctaSecondary={{ label: "Talk to sales", href: "/contact" }}
          /*
           * ── MEDIA ──────────────────────────────────────────────
           * Paste your image or video URL in one of the props below.
           * Examples:
           *   mediaSrc={{ image: "https://cdn.example.com/logistics.jpg" }}
           *   mediaSrc={{ video: "/videos/logistics-hero.mp4" }}
           */
          mediaSrc={{}}
        />

        {/* How it works */}
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-1)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
              <div>
                <span className="eyebrow" style={{ marginBottom: 20, display: "flex" }}>How it works</span>
                <h2 className="text-h2" style={{ marginBottom: 24 }}>
                  Your cargo,<br />your rules.
                </h2>
                <p className="text-body-lg" style={{ color: "var(--text-2)", marginBottom: 32 }}>
                  Enter your product, origin, destination, and volume. Meridian cross-references
                  commodity-specific trade rules, live port conditions, and carrier performance
                  to return ranked route options in seconds.
                </p>
                <p className="text-body" style={{ color: "var(--text-3)", lineHeight: 1.8 }}>
                  Shipping apples? It won't route through Hong Kong.
                  Moving lithium batteries? It flags required documentation automatically.
                  Sourcing from a sanctioned region? It reroutes before you even ask.
                </p>
              </div>
              <RouteMockup />
            </div>
          </div>
        </div>

        {/* Animated world map */}
        <TradeRouteMap variant="logistics" />

        <FeaturesGrid features={LOGISTICS_FEATURES} />

        <DeptCTA
          heading="Start routing smarter today."
          sub="14-day free trial. Full access to the Logistics module. No credit card."
        />
      </main>
      <Footer />
    </>
  );
}

function RouteMockup() {
  const routes = [
    { rank: 1, via: "Suez Canal",          days: 28, cost: "$3,240", score: 94 },
    { rank: 2, via: "Cape of Good Hope",   days: 36, cost: "$2,890", score: 87 },
    { rank: 3, via: "Trans-Siberian Rail", days: 22, cost: "$4,100", score: 81 },
  ];

  return (
    <div style={{
      background: "var(--bg-2)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)", padding: "40px 36px",
    }}>
      <p className="text-label" style={{ marginBottom: 20 }}>Suggested routes — Fresh produce, 20ft container</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {routes.map((r) => (
          <div key={r.rank} style={{
            background: r.rank === 1 ? "rgba(255,255,255,0.05)" : "var(--bg-1)",
            border: `1px solid ${r.rank === 1 ? "var(--border-hi)" : "var(--border)"}`,
            borderRadius: "var(--radius-sm)", padding: "16px 20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
                color: r.rank === 1 ? "#fff" : "var(--text-2)",
              }}>
                #{r.rank} — via {r.via}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: r.rank === 1 ? "#000" : "var(--text-3)",
                background: r.rank === 1 ? "#fff" : "var(--bg-3)",
                padding: "2px 8px", borderRadius: 2,
              }}>Score {r.score}</span>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>{r.days} days</span>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>{r.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Shared section components ─────────────────────────────────────────────── */

/**
 * PageHero — used by Logistics, Systems, Securities pages.
 *
 * mediaSrc prop:
 *   { image: "URL" }  →  shows a background image
 *   { video: "URL" }  →  shows a looping background video
 *   {}                →  shows placeholder (default)
 */
export function PageHero({ tag, heading, sub, cta, ctaSecondary, mediaSrc = {} }) {
  return (
    <>
      {/*
       * ── PAGE MEDIA BANNER ────────────────────────────────────────
       * To add a hero image:  mediaSrc={{ image: "YOUR_IMAGE_URL" }}
       * To add a hero video:  mediaSrc={{ video: "YOUR_VIDEO_URL" }}
       * Paste the URL in the component that calls <PageHero> above.
       * ─────────────────────────────────────────────────────────────
       */}
      <PageMediaBanner
        imageSrc={mediaSrc.image || "https://www.shutterstock.com/image-illustration/elegant-abstract-smooth-black-background-600nw-2686662953.jpg"}
        videoSrc={mediaSrc.video || ""}
        height="320px"
      />

      <section style={{ padding: "64px 28px 100px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span className="eyebrow" style={{ marginBottom: 28, display: "flex" }}>{tag}</span>
          <h1 className="text-h1" style={{ maxWidth: 780, marginBottom: 32 }}>{heading}</h1>
          <p className="text-body-lg" style={{ color: "var(--text-2)", maxWidth: 520, marginBottom: 48 }}>{sub}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={cta.href} style={{ textDecoration: "none" }}>
              <button className="btn btn-primary" style={{ fontSize: 14, padding: "13px 26px" }}>{cta.label}</button>
            </Link>
            {ctaSecondary && (
              <Link href={ctaSecondary.href} style={{ textDecoration: "none" }}>
                <button className="btn btn-outline" style={{ fontSize: 14, padding: "12px 24px" }}>{ctaSecondary.label}</button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function FeaturesGrid({ features }) {
  return (
    <section className="section">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {features.map((f, i) => {
            const col = i % 2;
            const totalRows = Math.ceil(features.length / 2);
            const row = Math.floor(i / 2);
            return (
              <div key={i} style={{
                padding: "40px 36px",
                borderRight:  col === 0 ? "1px solid var(--border)" : "none",
                borderBottom: row < totalRows - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                  letterSpacing: "-0.015em", marginBottom: 14, lineHeight: 1.2,
                }}>{f.title}</h3>
                <p className="text-body" style={{ color: "var(--text-2)" }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function DeptCTA({ heading, sub }) {
  return (
    <section style={{ padding: "100px 28px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <h2 className="text-h2" style={{ marginBottom: 20 }}>{heading}</h2>
        <p className="text-body-lg" style={{ color: "var(--text-2)", marginBottom: 40 }}>{sub}</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <Link href="/get-started" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ fontSize: 14, padding: "14px 28px" }}>Start free trial</button>
          </Link>
          <Link href="/contact" style={{ textDecoration: "none" }}>
            <button className="btn btn-outline" style={{ fontSize: 14, padding: "13px 24px" }}>Talk to sales</button>
          </Link>
        </div>
      </div>
    </section>
  );
}