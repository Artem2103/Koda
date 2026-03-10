import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  return (
    <>
      <Header />
      <AuthLayout eyebrow="Welcome back" heading="Sign in to Meridian" mode="login" />
    </>
  );
}

export function AuthLayout({ eyebrow, heading, mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      // Supabase may require email confirmation — redirect anyway
      router.push("/");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 28px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        <div style={{ marginBottom: 48 }}>
          <span className="eyebrow anim-up d-1" style={{ marginBottom: 20, display: "flex" }}>{eyebrow}</span>
          <h1 className="anim-up d-2" style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 48px)",
            fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1,
          }}>
            {heading}
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} className="anim-up d-3">

          {isSignup && (
            <div>
              <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Full name</label>
              <input className="field" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div>
            <label className="text-label" style={{ display: "block", marginBottom: 8 }}>Email</label>
            <input className="field" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label className="text-label">Password</label>
              {!isSignup && (
                <a href="#" style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--text-2)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}
                >
                  Forgot password?
                </a>
              )}
            </div>
            <input className="field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && (
            <p style={{ fontSize: 12, color: "#ff5555", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 14, marginTop: 8, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Please wait…" : isSignup ? "Create account →" : "Sign in →"}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-3)" }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <Link href={isSignup ? "/login" : "/get-started"} style={{ color: "var(--text)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>
            {isSignup ? "Sign in" : "Get started free"}
          </Link>
        </p>

      </div>
    </div>
  );
}