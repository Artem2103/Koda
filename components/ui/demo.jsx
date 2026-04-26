import Hero from "@/components/ui/animated-shader-hero";

export default function HeroDemo() {
  return (
    <div className="w-full">
      <Hero
        trustBadge={{ text: "Trusted by next-generation logistics teams." }}
        headline={{ line1: "Navigate Global Trade", line2: " With Precision" }}
        subtitle="AI-powered insights, route optimization, and real-time risk intelligence — built to keep your operations ahead of disruption."
        buttons={{
          primary: { text: "Get Started for Free", onClick: () => (window.location.href = "/get-started") },
          secondary: { text: "Explore Features", onClick: () => (window.location.href = "/logistics") },
        }}
      />
    </div>
  );
}
