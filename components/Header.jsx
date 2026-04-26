import { memo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NAV_LINKS, DEPARTMENT_LINKS } from "@/lib/constants";

const LANGUAGES = [
  { code: "nl", flag: "🇳🇱", name: "Dutch" },
  { code: "fr", flag: "🇫🇷", name: "French" },
  { code: "de", flag: "🇩🇪", name: "German" },
  { code: "es", flag: "🇪🇸", name: "Spanish" },
  { code: "zh-CN", flag: "🇨🇳", name: "Chinese" },
  { code: "ar", flag: "🇸🇦", name: "Arabic" },
  { code: "ja", flag: "🇯🇵", name: "Japanese" },
  { code: "ko", flag: "🇰🇷", name: "Korean" },
  { code: "pt", flag: "🇧🇷", name: "Portuguese" },
  { code: "ru", flag: "🇷🇺", name: "Russian" },
  { code: "hi", flag: "🇮🇳", name: "Hindi" },
  { code: "tr", flag: "🇹🇷", name: "Turkish" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [activeLang, setActiveLang] = useState(null);
  const langRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let rafId = 0;
    let lastScrolled = false;

    const commit = () => {
      rafId = 0;
      const next = window.scrollY > 12;
      if (next !== lastScrolled) {
        lastScrolled = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(commit);
    };

    commit();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLang(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTranslate = (lang) => {
    setActiveLang(lang);
    setShowLang(false);
    // Trigger Google Translate via the select element the widget injects
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang.code;
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback: open in Google Translate frame
      const url = `https://translate.google.com/translate?sl=auto&tl=${lang.code}&u=${encodeURIComponent(window.location.href)}`;
      window.location.href = url;
    }
  };

  const handleResetTranslation = () => {
    setActiveLang(null);
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = "en";
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      background: scrolled
        ? "rgba(255, 255, 255, 0.88)"
        : "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid var(--glass-border)",
      transition: "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 28px",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark />
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: 18, color: "var(--text)", letterSpacing: "-0.025em",
          }}>
            Meridian
          </span>
        </Link>

        {/* Nav */}
        <nav className="hide-sm" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_LINKS.filter(l => l.label !== "Test").map(({ label, href }) => {
            const active = router.pathname === href;
            return (
              <Link key={label} href={href} style={{ textDecoration: "none" }}>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                  color: active ? "var(--text)" : "var(--text-3)",
                  padding: "6px 14px", display: "inline-block",
                  transition: "color 0.18s",
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { if (!active) e.target.style.color = "var(--text-2)"; }}
                  onMouseLeave={(e) => { if (!active) e.target.style.color = "var(--text-3)"; }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: translate + auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Translate button */}
          <div ref={langRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowLang(!showLang)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: activeLang ? "var(--text)" : "transparent",
                color: activeLang ? "var(--bg)" : "var(--text-3)",
                border: `1px solid ${activeLang ? "var(--text)" : "var(--border)"}`,
                borderRadius: "var(--radius-sm)",
                padding: "5px 10px 5px 8px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 11, fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                if (!activeLang) {
                  e.currentTarget.style.borderColor = "var(--border-hi)";
                  e.currentTarget.style.color = "var(--text-2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!activeLang) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-3)";
                }
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1"/>
                <path d="M6 1C6 1 4 3.5 4 6s2 5 2 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                <path d="M6 1s2 2.5 2 5-2 5-2 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                <path d="M1.5 4.5h9M1.5 7.5h9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
              </svg>
              {activeLang ? activeLang.flag : "Translate"}
              {activeLang && (
                <span
                  onClick={(e) => { e.stopPropagation(); handleResetTranslation(); }}
                  style={{ marginLeft: 2, opacity: 0.7, cursor: "pointer" }}
                >×</span>
              )}
            </button>

            {showLang && (
              <div className="lang-dropdown">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className="lang-item"
                    onClick={() => handleTranslate(lang)}
                  >
                    <span style={{ fontSize: 16 }}>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {activeLang?.code === lang.code && (
                      <span style={{ marginLeft: "auto", color: "var(--text)", fontSize: 10 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn btn-ghost" style={{ fontSize: 13 }}>Log in</button>
          </Link>
          <Link href="/get-started" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ fontSize: 13, padding: "9px 18px" }}>
              Get Started
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5H9M6.5 3L9 5.5L6.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* ── Department bar ── */}
      <div style={{
        borderTop: "1px solid var(--border)",
        background: "rgba(255, 255, 255, 0.5)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 28px",
          height: 40,
          display: "flex", alignItems: "center", gap: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--text)", marginRight: 20, whiteSpace: "nowrap",
          }}>
            Departments
          </span>

          {DEPARTMENT_LINKS.map(({ label, href, desc }) => {
            const active = router.pathname === href;
            return (
              <Link key={label} href={href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "0 18px", height: 40,
                  borderRight: "1px solid var(--border)",
                  borderLeft: label === "Logistics" ? "1px solid var(--border)" : "none",
                  background: active ? "rgba(0,0,0,0.04)" : "transparent",
                  transition: "background 0.18s",
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <DeptIcon dept={label} active={active} />
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                    color: active ? "var(--text)" : "var(--text-3)",
                    transition: "color 0.18s",
                  }}>
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

const DeptIcon = memo(function DeptIcon({ dept, active }) {
  const color = active ? "var(--text)" : "var(--text-3)";
  const icons = {
    Logistics: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M1.5 9.5L4.5 3.5L7.5 7.5L9.5 5L11.5 9.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="1.5" cy="9.5" r="1" fill={color}/>
        <circle cx="11.5" cy="9.5" r="1" fill={color}/>
      </svg>
    ),
    Systems: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="1.5" y="1.5" width="4" height="4" stroke={color} strokeWidth="1.2"/>
        <rect x="7.5" y="1.5" width="4" height="4" stroke={color} strokeWidth="1.2"/>
        <rect x="1.5" y="7.5" width="4" height="4" stroke={color} strokeWidth="1.2"/>
        <rect x="7.5" y="7.5" width="4" height="4" stroke={color} strokeWidth="1.2"/>
      </svg>
    ),
    Securities: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 1.5L11.5 3.5V7C11.5 9.5 9 11.5 6.5 12C4 11.5 1.5 9.5 1.5 7V3.5L6.5 1.5Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M4.5 6.5L6 8L8.5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return icons[dept] || null;
});

const LogoMark = memo(function LogoMark() {
  return (
    <div style={{
      width: 26, height: 26,
      background: "var(--text)",
      borderRadius: "var(--radius-sm)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="0.5" y="0.5" width="4.5" height="4.5" fill="var(--bg)"/>
        <rect x="7"   y="0.5" width="4.5" height="4.5" fill="var(--bg)"/>
        <rect x="0.5" y="7"   width="4.5" height="4.5" fill="var(--bg)"/>
        <rect x="7"   y="7"   width="4.5" height="4.5" fill="var(--bg)"/>
      </svg>
    </div>
  );
});