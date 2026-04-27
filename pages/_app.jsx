import "@/styles/globals.css";
import Script from "next/script";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: 14,
        right: 16,
        zIndex: 1200,
        borderRadius: 4,
        border: "1px solid var(--border)",
        background: "var(--glass-bg)",
        color: "var(--text)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        fontFamily: "var(--font-body)",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "8px 10px",
        cursor: "pointer",
        transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease",
      }}
    >
      Theme · {isDark ? "Dark" : "Light"}
    </button>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      {/* Google Translate — must be loaded before the init callback */}
      <Script
        id="google-translate-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'nl,fr,de,es,zh-CN,ar,ja,ko,pt,ru,hi,tr,pl,sv',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                },
                'google_translate_element'
              );
            }
          `,
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      {/* Hidden container — the GT widget binds here */}
      <div id="google_translate_element" />
      <ThemeToggle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
