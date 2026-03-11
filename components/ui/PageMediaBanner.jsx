/**
 * PageMediaBanner
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop this at the top of any page hero to show a full-width image or video.
 *
 * HOW TO USE:
 *   1. To show an IMAGE: set the `imageSrc` prop to your image URL.
 *      e.g. <PageMediaBanner imageSrc="https://your-cdn.com/hero.jpg" />
 *        or <PageMediaBanner imageSrc="/images/logistics-hero.jpg" />  (local file in /public)
 *
 *   2. To show a VIDEO: set the `videoSrc` prop to your video URL.
 *      e.g. <PageMediaBanner videoSrc="https://your-cdn.com/hero.mp4" />
 *        or <PageMediaBanner videoSrc="/videos/hero.mp4" />  (local file in /public)
 *
 *   3. To change the height: set `height` (default "480px").
 *      e.g. <PageMediaBanner imageSrc="..." height="600px" />
 *
 *   4. To add an overlay tint (0–1): set `overlayOpacity` (default 0.4).
 *
 * WHEN NEITHER SRC IS PROVIDED:
 *   A dark placeholder is shown with instructions — safe to ship as-is.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function PageMediaBanner({
    imageSrc = "",          // ← paste your image URL here
    videoSrc = "",          // ← paste your video URL here (takes priority over image)
    height   = "480px",
    overlayOpacity = 0.4,
    alt = "",
  }) {
    const hasMedia = imageSrc || videoSrc;
  
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height,
          overflow: "hidden",
          background: "var(--bg-2)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* ── VIDEO ── */}
        {videoSrc && (
          <video
            src={videoSrc}          /* ← your video URL goes here */
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
        )}
  
        {/* ── IMAGE (only if no video) ── */}
        {!videoSrc && imageSrc && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc}          /* ← your image URL goes here */
            alt={alt}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
        )}
  
        {/* ── Dark overlay (helps text readability if you add text on top) ── */}
        {hasMedia && (
          <div style={{
            position: "absolute", inset: 0,
            background: `rgba(0,0,0,${overlayOpacity})`,
          }} />
        )}
  
        {/* ── Placeholder shown when no src is provided ── */}
        {!hasMedia && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 14,
            background: "linear-gradient(135deg, var(--bg-2) 0%, var(--bg-3) 100%)",
          }}>
            {/* Icon */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="1" y="1" width="34" height="34" stroke="var(--border-hi)" strokeWidth="1.2"/>
              <path d="M10 26l6-8 4 5 3-3 5 6" stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="13" cy="15" r="2.5" stroke="var(--text-3)" strokeWidth="1.2"/>
            </svg>
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
                letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)",
                marginBottom: 8,
              }}>
                Media Placeholder
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-4)",
                lineHeight: 1.7,
              }}>
                Set <code style={{ background: "var(--bg-3)", padding: "1px 6px", borderRadius: 2, color: "var(--text-3)" }}>imageSrc</code> or{" "}
                <code style={{ background: "var(--bg-3)", padding: "1px 6px", borderRadius: 2, color: "var(--text-3)" }}>videoSrc</code>{" "}
                on this component
              </p>
            </div>
          </div>
        )}
  
        {/* ── Bottom fade — blends into page background ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(to bottom, transparent, var(--bg))",
          pointerEvents: "none",
        }} />
      </div>
    );
  }