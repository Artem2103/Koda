import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageMediaBanner from "@/components/ui/PageMediaBanner";
import { OFFICES, COMPANY_EMAIL } from "@/lib/constants";

export default function ContactPage() {
  const [form, setForm]   = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) { setError("Please fill in all required fields."); return; }
    setError(""); setSent(true);
  };

  return (
    <>
      <div className="grain" />
      <Header />
      <main style={{ paddingTop: 96 }}>

        {/*
         * ── CONTACT PAGE HERO MEDIA ───────────────────────────────
         * IMAGE: set imageSrc="YOUR_IMAGE_URL"
         * VIDEO: set videoSrc="YOUR_VIDEO_URL"
         * ─────────────────────────────────────────────────────────
         */}
        <PageMediaBanner
          imageSrc="https://www.shutterstock.com/image-illustration/elegant-abstract-smooth-black-background-600nw-2686662953.jpg"
          videoSrc=""
          height="320px"
        />

        <div style={{ padding: "80px 28px 100px" }}>
          <div className="container">

            <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 60, marginBottom: 80 }}>
              <span className="eyebrow anim-up d-1" style={{ marginBottom: 24, display: "flex" }}>Contact</span>
              <h1 className="text-h1 anim-up d-2">Let's talk trade.</h1>
            </div>

            <div className="anim-up d-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
              <div>
                {sent ? (
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Message sent.</h3>
                    <p className="text-body" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
                      We typically respond within one business day.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {error && <p style={{ fontSize: 13, color: "#ff4444", fontFamily: "var(--font-body)" }}>{error}</p>}
                    {[
                      { key: "name",    label: "Name *",  type: "text",  placeholder: "Your name" },
                      { key: "email",   label: "Email *", type: "email", placeholder: "you@company.com" },
                      { key: "company", label: "Company", type: "text",  placeholder: "Company name" },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key}>
                        <label style={{ display: "block", fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>{label}</label>
                        <input className="field" type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>Message *</label>
                      <textarea className="field" placeholder="Tell us about your trade operations…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button onClick={handleSubmit} className="btn btn-primary" style={{ alignSelf: "flex-start", fontSize: 14, padding: "13px 28px" }}>Send message</button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 12 }}>Sales</h3>
                  <p className="text-body" style={{ color: "var(--text-2)", marginBottom: 8 }}>For pricing, enterprise contracts, or a product walkthrough.</p>
                  <a href={`mailto:${COMPANY_EMAIL}`} style={{ fontSize: 13, color: "var(--text-2)", fontFamily: "var(--font-body)", textDecoration: "none" }}>{COMPANY_EMAIL}</a>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 12 }}>Support</h3>
                  <p className="text-body" style={{ color: "var(--text-2)" }}>We respond within 4 hours.</p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 24 }}>Our offices</h3>
                  {OFFICES.map(({ city, address, tz }, i) => (
                    <div key={i} style={{ padding: "20px 0", borderBottom: i < OFFICES.length - 1 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 4 }}>{city}</p>
                        <p style={{ fontSize: 13, color: "var(--text-3)" }}>{address}</p>
                      </div>
                      <p className="text-label" style={{ paddingTop: 2 }}>{tz}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}