import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CTASection from "@/components/sections/CTASection";
import LogoMarquee from "@/components/ui/LogoMarquee";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function Reveal({ children, delay = 0, y = 24 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="grain" />
      <Header />
      <main>
        <HeroSection />
        <Reveal>
          <LogoMarquee />
        </Reveal>
        <DepartmentStrip />
        <PlatformPreview />
        <IntelligenceFeed />
        <StatsBanner />
        <Reveal>
          <CTASection />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}

/* ── Department strip ─────────────────────────────────────────────────────── */
function DepartmentStrip() {
  const cards = [
    {
      href: "/logistics", label: "Logistics", tag: "Route Intelligence",
      desc: "AI-optimised routing across 160+ countries. Product-aware corridor filtering, live port data, multi-modal comparison.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M2 20L8 8L14 15L19 10L24 20" stroke="var(--text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="2" cy="20" r="2" fill="var(--text)"/>
          <circle cx="24" cy="20" r="2" fill="var(--text)"/>
        </svg>
      ),
    },
    {
      href: "/systems", label: "Systems", tag: "Business Analytics",
      desc: "Full landed-cost modelling, tariff intelligence, and supplier country analysis before you commit a single dollar.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect x="2" y="2" width="9" height="9" stroke="var(--text)" strokeWidth="1.6"/>
          <rect x="15" y="2" width="9" height="9" stroke="var(--text)" strokeWidth="1.6"/>
          <rect x="2" y="15" width="9" height="9" stroke="var(--text)" strokeWidth="1.6"/>
          <rect x="15" y="15" width="9" height="9" stroke="var(--text)" strokeWidth="1.6"/>
        </svg>
      ),
    },
    {
      href: "/securities", label: "Securities", tag: "Risk & Compliance",
      desc: "Sanctions screening, geopolitical risk scoring, and AI-generated contract recommendations — before exposure becomes crisis.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M13 2L24 6.5V14C24 20 19.5 24.5 13 26C6.5 24.5 2 20 2 14V6.5L13 2Z" stroke="var(--text)" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M9.5 13.5L12 16L16.5 10.5" stroke="var(--text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 28px",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      }}>
        {cards.map((c, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <Link href={c.href} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "52px 40px",
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
                transition: "background 0.2s",
                cursor: "pointer",
                height: "100%",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ marginBottom: 24 }}>{c.icon}</div>
                <p className="text-label" style={{ marginBottom: 10 }}>{c.tag}</p>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700,
                  letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.1,
                  color: "var(--text)",
                }}>{c.label}</h3>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.75 }}>{c.desc}</p>
                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Learn more</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5H8M5.5 2.5L8 5L5.5 7.5" stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Platform Preview — image 1 ───────────────────────────────────────────── */
function PlatformPreview() {
  return (
    <section style={{
      padding: "100px 28px",
      borderBottom: "1px solid var(--border)",
      background: "var(--bg-1)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <Reveal y={30}>
            <div>
              <Reveal>
                <span className="eyebrow" style={{ marginBottom: 20, display: "flex" }}>Platform</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="text-h2" style={{ marginBottom: 20 }}>
                  One query.<br />Every answer.
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="text-body-lg" style={{ marginBottom: 28 }}>
                  Enter origin, destination, commodity, and volume.
                  Meridian returns ranked routes, full landed cost,
                  and live risk flags in under 3 seconds.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <Link href="/logistics" style={{ textDecoration: "none" }}>
                  <button className="btn btn-outline" style={{ fontSize: 13 }}>Explore the platform →</button>
                </Link>
              </Reveal>
            </div>
          </Reveal>
          <Reveal delay={0.12} y={36}>
            <DashboardMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div style={{
      background: "var(--panel-bg)",
      border: "1px solid var(--panel-border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
    }}>
      {/* Titlebar */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--panel-border)",
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--panel-1)",
      }}>
        {["#ef4444","#f59e0b","#22c55e"].map((c, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: "monospace", fontSize: 10, color: "var(--panel-text-3)", letterSpacing: "0.06em" }}>
          meridian — route-intelligence
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        {/* Input row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 80px",
          gap: 8, marginBottom: 16,
        }}>
          {[
            { label: "ORIGIN", value: "Rotterdam, NL" },
            { label: "DESTINATION", value: "Shanghai, CN" },
            { label: "MODE", value: "Ocean" },
          ].map((f, i) => (
            <div key={i} style={{
              background: "var(--panel-2)",
              border: "1px solid var(--panel-border)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 12px",
            }}>
              <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--panel-text-3)", marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 11, color: "var(--panel-text)", fontFamily: "monospace" }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Routes */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--panel-text-3)", marginBottom: 10 }}>RANKED ROUTES</div>
          {[
            { rank: 1, via: "Suez Canal",         days: 28, cost: "$3,240", score: 94, bar: "94%" },
            { rank: 2, via: "Cape of Good Hope",  days: 36, cost: "$2,890", score: 87, bar: "87%" },
            { rank: 3, via: "Trans-Siberian Rail",days: 22, cost: "$4,100", score: 81, bar: "81%" },
          ].map((r, i) => (
            <Reveal key={r.rank} delay={0.08 * i} y={16}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px",
                background: r.rank === 1 ? "rgba(255,255,255,0.06)" : "var(--panel-2)",
                border: `1px solid ${r.rank === 1 ? "rgba(255,255,255,0.15)" : "var(--panel-border)"}`,
                borderRadius: "var(--radius-sm)",
                marginBottom: 6,
              }}>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: r.rank === 1 ? "#fff" : "var(--panel-text-3)", width: 16 }}>#{r.rank}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: r.rank === 1 ? "#fff" : "var(--panel-text-2)", marginBottom: 4 }}>{r.via}</div>
                  <div style={{ height: 2, background: "var(--panel-border)", borderRadius: 1 }}>
                    <div style={{ width: r.bar, height: "100%", background: r.rank === 1 ? "#4ade80" : "rgba(255,255,255,0.25)", borderRadius: 1 }}/>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--panel-text-3)" }}>{r.days}d</span>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--panel-text-2)" }}>{r.cost}</span>
                <span style={{ fontSize: 9, padding: "2px 6px", background: r.rank === 1 ? "#4ade80" : "rgba(255,255,255,0.08)", color: r.rank === 1 ? "#000" : "var(--panel-text-3)", borderRadius: 2 }}>
                  {r.score}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--panel-border)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "var(--panel-text-3)", letterSpacing: "0.08em" }}>Computed in 1.4s · 3 routes scored</span>
          <span style={{ fontSize: 9, padding: "3px 8px", background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 2 }}>LIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ── Intelligence Feed — image 2 ──────────────────────────────────────────── */
function IntelligenceFeed() {
  const alerts = [
    { level: "HIGH",   color: "#ef4444", label: "OFAC SDN update", desc: "3 new entities added — EU, Middle East transit affected", time: "2m ago" },
    { level: "MED",    color: "#f59e0b", label: "Port congestion: Felixstowe", desc: "7-day delay forecast · overflow routing suggested", time: "14m ago" },
    { level: "LOW",    color: "#4ade80", label: "UK–India FTA live", desc: "Duty reduction 8.5% → 0% eligible for 400+ HS codes", time: "1h ago" },
    { level: "INFO",   color: "#60a5fa", label: "Weather alert: South China Sea", desc: "Tropical system forming — monsoon corridor re-evaluation", time: "3h ago" },
    { level: "HIGH",   color: "#ef4444", label: "Red Sea diversions", desc: "Active incident · Suez approach re-scored for 14 lanes", time: "6h ago" },
  ];

  return (
    <section style={{
      padding: "100px 28px",
      background: "var(--bg)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          {/* Feed mockup */}
          <Reveal y={30}>
            <div style={{
              background: "var(--panel-bg)",
              border: "1px solid var(--panel-border)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
            }}>
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--panel-border)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "var(--panel-1)",
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--panel-text-3)", letterSpacing: "0.06em" }}>
                intelligence-feed · live
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", animation: "blink 1.5s ease-in-out infinite" }}/>
                <span style={{ fontSize: 9, color: "#4ade80", letterSpacing: "0.08em" }}>STREAMING</span>
              </div>
            </div>
            <div style={{ padding: "16px" }}>
              {alerts.map((a, i) => (
                <Reveal key={i} delay={i * 0.07} y={12}>
                  <div style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "12px",
                    borderLeft: `2px solid ${a.color}`,
                    background: "var(--panel-2)",
                    marginBottom: 6,
                    borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                  }}>
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                      color: a.color, whiteSpace: "nowrap", paddingTop: 1,
                      width: 28, textAlign: "right",
                    }}>{a.level}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--panel-text)", marginBottom: 2 }}>{a.label}</p>
                      <p style={{ fontSize: 10, color: "var(--panel-text-2)", lineHeight: 1.4 }}>{a.desc}</p>
                    </div>
                    <span style={{ fontSize: 9, color: "var(--panel-text-3)", whiteSpace: "nowrap", paddingTop: 1 }}>{a.time}</span>
                  </div>
                </Reveal>
              ))}
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <span style={{ fontSize: 9, color: "var(--panel-text-3)", letterSpacing: "0.1em" }}>↑ 47 signals processed today across 2,400+ corridors</span>
              </div>
            </div>
          </div>
          </Reveal>

          <Reveal y={30}>
            <div>
              <Reveal>
                <span className="eyebrow" style={{ marginBottom: 20, display: "flex" }}>Live Intelligence</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="text-h2" style={{ marginBottom: 20 }}>
                  Signals before<br />they become<br />problems.
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="text-body-lg" style={{ marginBottom: 28 }}>
                  Our AI monitors 180 countries around the clock — sanctions updates, port disruptions,
                  new trade agreements, weather risks — and scores their impact on your specific corridors.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <Link href="/securities" style={{ textDecoration: "none" }}>
                  <button className="btn btn-outline" style={{ fontSize: 13 }}>See Securities module →</button>
                </Link>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Stats banner ─────────────────────────────────────────────────────────── */
function StatsBanner() {
  return (
    <div style={{
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      background: "var(--bg-1)",
    }}>
      {[
        { value: "500+",  label: "Companies served" },
        { value: "160+",  label: "Countries covered" },
        { value: "$4.2B", label: "Trade value routed" },
        { value: "94%",   label: "On-time prediction accuracy" },
      ].map(({ value, label }, i) => (
        <Reveal key={i} delay={i * 0.08} y={18}>
          <div style={{
            padding: "52px 40px", textAlign: "center",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 800, letterSpacing: "-0.025em",
              lineHeight: 1, marginBottom: 8,
              color: "var(--text)",
            }}>{value}</div>
            <p className="text-label" style={{ fontSize: 11 }}>{label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}