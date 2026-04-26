import dynamic from "next/dynamic";

const HeroDemo = dynamic(() => import("@/components/ui/demo"), {
  ssr: false,
  loading: () => (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(1200px 600px at 70% 20%, rgba(59,130,246,0.25), transparent 60%), #050b1a",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 16px",
          textAlign: "center",
          color: "#f8fbff",
        }}
      >
        <p style={{ fontSize: 13, opacity: 0.9, color: "#c9d9ff" }}>
          Trusted by next-generation logistics teams.
        </p>
        <h1 style={{ fontSize: "clamp(42px, 8vw, 96px)", lineHeight: 0.95, color: "#eaf2ff" }}>
          Navigate Global Trade
        </h1>
        <h1 style={{ fontSize: "clamp(42px, 8vw, 96px)", lineHeight: 0.95, color: "#93c5fd" }}>
          With Precision
        </h1>
        <p style={{ maxWidth: 820, fontSize: "clamp(16px, 2vw, 24px)", opacity: 0.92, color: "#dbeafe" }}>
          AI-powered insights, route optimization, and real-time risk intelligence.
        </p>
      </div>
    </section>
  ),
});

export default function HeroSection() {
  return <HeroDemo />;
}
