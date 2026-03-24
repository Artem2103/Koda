import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <AuthLayout
        eyebrow="Welcome back"
        heading="Sign in to Meridian"
        mode="login"
      />
    </>
  );
}

export function AuthLayout({ eyebrow, heading, mode }) {
  const isSignup = mode === "signup";
  const router   = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [company,  setCompany]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);

    /* Simulate auth delay */
    await new Promise((r) => setTimeout(r, 800));

    /* Mark as authenticated */
    if (typeof window !== "undefined") {
      localStorage.setItem("meridian_auth", JSON.stringify({ email, ts: Date.now() }));
    }

    /* Redirect to terminal */
    router.push("/terminal");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 28px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span className="eyebrow" style={{ marginBottom: 20, display: "flex" }}>{eyebrow}</span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            {heading}
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Email</label>
            <input
              className="field"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div>
              <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Company</label>
              <input
                className="field"
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          )}

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label className="text-label">Password</label>
              {!isSignup && (
                <a
                  href="#"
                  style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--text-2)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}
                >
                  Forgot password?
                </a>
              )}
            </div>
            <input
              className="field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%", justifyContent: "center",
              padding: "14px", fontSize: 14, marginTop: 8,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : isSignup ? "Create account →" : "Sign in →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* SSO */}
        <button
          className="btn btn-outline"
          style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "12px" }}
          onClick={handleSubmit}
        >
          Continue with SSO
        </button>

        {/* Switch link */}
        <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-3)" }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <Link
            href={isSignup ? "/login" : "/get-started"}
            style={{
              color: "var(--text)",
              fontWeight: 500,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            {isSignup ? "Sign in" : "Get started free"}
          </Link>
        </p>
      </div>
    </div>
  );
}