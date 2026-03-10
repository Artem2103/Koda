import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NAV_LINKS, DEPARTMENT_LINKS } from "@/lib/constants";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
  };

  // Get display name: full_name from metadata, or email prefix
  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split("@")[0]
    || "Account";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
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
            fontSize: 19, color: "#fff", letterSpacing: "-0.02em",
          }}>
            Meridian Intelligence
          </span>
        </Link>

        {/* Main nav */}
        <nav className="hide-sm" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_LINKS.map(({ label, href }) => {
            const active = router.pathname === href;
            return (
              <Link key={label} href={href} style={{ textDecoration: "none" }}>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                  color: active ? "var(--text)" : "var(--text-3)",
                  padding: "6px 14px", display: "inline-block",
                  transition: "color 0.18s", cursor: "pointer",
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

        {/* Auth area */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            /* ── Logged-in user pill ── */
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "var(--bg-2)", border: "1px solid var(--border-hi)",
                  borderRadius: "var(--radius)", padding: "5px 12px 5px 5px",
                  cursor: "pointer", transition: "border-color 0.18s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-hi)")}
              >
                {/* Avatar circle */}
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "#fff", color: "#000",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.02em", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                  color: "var(--text)", maxWidth: 120,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {displayName}
                </span>
                {/* Chevron */}
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transition: "transform 0.18s", transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path d="M2 4l3 3 3-3" stroke="var(--text-3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "var(--bg-2)", border: "1px solid var(--border-hi)",
                  borderRadius: "var(--radius)", minWidth: 180,
                  overflow: "hidden",
                  animation: "fadeUp 0.2s cubic-bezier(0.16,1,0.3,1) both",
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 12, fontFamily: "var(--font-body)", color: "var(--text)", fontWeight: 500, marginBottom: 2 }}>
                      {displayName}
                    </p>
                    <p style={{ fontSize: 11, fontFamily: "var(--font-body)", color: "var(--text-3)" }}>
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: "100%", padding: "10px 16px", textAlign: "left",
                      background: "transparent", border: "none", cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-2)",
                      transition: "background 0.14s, color 0.14s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged-out buttons ── */
            <>
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
            </>
          )}
        </div>
      </div>

      {/* ── Department bar ── */}
      <div style={{
        borderTop: "1px solid var(--border)",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 28px",
          height: 40,
          display: "flex", alignItems: "center", gap: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--text-4)", marginRight: 20, whiteSpace: "nowrap",
          }}>
            Departments
          </span>

          {DEPARTMENT_LINKS.map(({ label, href }) => {
            const active = router.pathname === href;
            return (
              <Link key={label} href={href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "0 18px", height: 40,
                  borderRight: "1px solid var(--border)",
                  borderLeft: label === "Logistics" ? "1px solid var(--border)" : "none",
                  background: active ? "rgba(255,255,255,0.05)" : "transparent",
                  transition: "background 0.18s", cursor: "pointer",
                }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <DeptIcon dept={label} active={active} />
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                    color: active ? "#fff" : "var(--text-2)",
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

function DeptIcon({ dept, active }) {
  const color = active ? "#fff" : "var(--text-3)";
  if (dept === "Logistics") return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 10L4 4L7 7.5L9.5 5L12 10" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (dept === "Systems") return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="1" width="4.5" height="4.5" stroke={color} strokeWidth="1.3"/>
      <rect x="7.5" y="1" width="4.5" height="4.5" stroke={color} strokeWidth="1.3"/>
      <rect x="1" y="7.5" width="4.5" height="4.5" stroke={color} strokeWidth="1.3"/>
      <rect x="7.5" y="7.5" width="4.5" height="4.5" stroke={color} strokeWidth="1.3"/>
    </svg>
  );
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1.5L11.5 3.5V7C11.5 10 9 12 6.5 13C4 12 1.5 10 1.5 7V3.5L6.5 1.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1" y="1" width="20" height="20" stroke="#fff" strokeWidth="1.4"/>
      <path d="M5 17L5 9L9 14L11 9L13 14L17 9V17" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}