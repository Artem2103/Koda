import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SYSTEMS_FEATURES } from "@/lib/constants";
import { PageHero, FeaturesGrid, DeptCTA } from "./logistics";

export default function SystemsPage() {
  return (
    <>
      <div className="grain" />
      <Header />
      <main style={{ paddingTop: 96 }}>
        <PageHero
          tag="Systems Module"
          heading={<>Every cost,<br />before you commit.</>}
          sub="Meridian Systems gives you a complete financial picture of any trade lane — duties, taxes, handling charges, FX exposure, and supplier benchmarks — before a single order is placed."
          cta={{ label: "Start free trial", href: "/get-started" }}
          ctaSecondary={{ label: "Talk to sales", href: "/contact" }}
          /*
           * ── MEDIA ──────────────────────────────────────────────
           * mediaSrc={{ image: "YOUR_IMAGE_URL" }}
           * mediaSrc={{ video: "YOUR_VIDEO_URL" }}
           */
          mediaSrc={{ image: "https://www.shutterstock.com/image-illustration/elegant-abstract-smooth-black-background-600nw-2686662953.jpg"}}
          height="320px"
        />

        {/* Cost breakdown callout */}
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-1)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
              <div>
                <span className="eyebrow" style={{ marginBottom: 20, display: "flex" }}>Why it matters</span>
                <h2 className="text-h2" style={{ marginBottom: 24 }}>
                  The price you see
                  <br />is never the price you pay.
                </h2>
                <p className="text-body-lg" style={{ color: "var(--text-2)", marginBottom: 24 }}>
                  The quoted freight rate is just the beginning. Import duties, destination handling,
                  customs brokerage, insurance, and currency shifts can add 20–60% to your
                  landed cost.
                </p>
                <p className="text-body" style={{ color: "var(--text-3)", lineHeight: 1.8 }}>
                  Meridian Systems calculates every layer before you sign anything — so you
                  negotiate supplier prices knowing your real margin, not an estimate.
                </p>
              </div>
              <CostMockup />
            </div>
          </div>
        </div>

        <FeaturesGrid features={SYSTEMS_FEATURES} />
        <DeptCTA
          heading="Know your numbers before you move."
          sub="Full landed-cost modelling across 160+ countries. Free for 14 days."
        />
      </main>
      <Footer />
    </>
  );
}

function CostMockup() {
  const items = [
    { label: "Freight (ocean, 20ft)",  value: "$2,840",  pct: 58 },
    { label: "Import duty (6.5%)",     value: "$312",    pct: 6  },
    { label: "Destination handling",   value: "$380",    pct: 8  },
    { label: "Customs brokerage",      value: "$220",    pct: 4  },
    { label: "Insurance (0.3%)",       value: "$142",    pct: 3  },
    { label: "Currency (EUR/USD)",     value: "+$180",   pct: 4  },
  ];

  return (
    <div style={{
      background: "var(--bg-2)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)", padding: "36px",
    }}>
      <p className="text-label" style={{ marginBottom: 20 }}>Landed cost breakdown — Electronics, Germany → Brazil</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{item.label}</span>
            <div style={{
              width: 80, height: 3, background: "var(--bg-3)", borderRadius: 2, flexShrink: 0,
            }}>
              <div style={{ width: `${item.pct * 1.4}%`, height: "100%", background: "#fff", borderRadius: 2 }}/>
            </div>
            <span style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", width: 52, textAlign: "right" }}>
              {item.value}
            </span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Total landed cost</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800 }}>$4,074</span>
        </div>
      </div>
    </div>
  );
}