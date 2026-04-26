import Hero from "@/components/ui/animated-shader-hero";

export default function HeroDemo() {
  return (
    <div className="w-full">
      <Hero
        trustBadge={{ text: "Trusted by forward-thinking teams." }}
        headline={{ line1: "Launch Your", line2: "Workflow Into Orbit" }}
        subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams — fast, seamless, and limitless."
        buttons={{
          primary: { text: "Get Started for Free", onClick: () => (window.location.href = "/get-started") },
          secondary: { text: "Explore Features", onClick: () => (window.location.href = "/logistics") },
        }}
      />
    </div>
  );
}
