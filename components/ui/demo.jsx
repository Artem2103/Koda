import Hero from "@/components/ui/animated-shader-hero";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroDemo() {
  const { lang } = useLanguage();
  const isRu = lang === "ru";

  return (
    <div className="w-full">
      <Hero
        trustBadge={{ text: isRu ? "Нам доверяют логистические команды нового поколения." : "Trusted by next-generation logistics teams." }}
        headline={{ line1: isRu ? "Управляйте мировой торговлей" : "Navigate Global Trade", line2: isRu ? "с точностью" : "With Precision" }}
        subtitle={isRu ? "ИИ-аналитика, оптимизация маршрутов и оценка рисков в реальном времени — чтобы ваши операции всегда были на шаг впереди сбоев." : "AI-powered insights, route optimization, and real-time risk intelligence — built to keep your operations ahead of disruption."}
        buttons={{
          primary: { text: isRu ? "Начать бесплатно" : "Get Started for Free", onClick: () => (window.location.href = "/get-started") },
          secondary: { text: isRu ? "Изучить возможности" : "Explore Features", onClick: () => (window.location.href = "/logistics") },
        }}
      />
    </div>
  );
}
