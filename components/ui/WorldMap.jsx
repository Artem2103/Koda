import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

export function WorldMap({
  dots = [],
  lineColor = "#4ade80",
  showLabels = true,
  animationDuration = 2,
  loop = true,
}) {
  const svgRef = useRef(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: "#FFFFFF",   // subtle dark dots on dark bg
        shape: "circle",
        backgroundColor: "transparent",
      }),
    [map]
  );

  const projectPoint = (lat, lng) => ({
    x: (lng + 180) * (800 / 360),
    y: (90 - lat) * (400 / 180),
  });

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const staggerDelay       = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime          = 2;
  const fullCycleDuration  = totalAnimationTime + pauseTime;

  return (
    <div style={{
      width: "100%",
      aspectRatio: "2 / 1",
      background: "transparent",
      borderRadius: 4,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Dotted base map */}
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover",
          userSelect: "none", pointerEvents: "none",
          opacity: 0.6,
          maskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
        }}
        alt="world map"
        height={495} width={1056}
        draggable={false} priority
      />

      {/* Route SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0, userSelect: "none" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={lineColor} stopOpacity="0" />
            <stop offset="5%"   stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%"  stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated paths */}
        {dots.map((dot, i) => {
          const s = projectPoint(dot.start.lat, dot.start.lng);
          const e = projectPoint(dot.end.lat,   dot.end.lng);
          const pathD     = createCurvedPath(s, e);
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime   = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={pathD} fill="none"
                stroke="url(#path-gradient)" strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={loop
                  ? { pathLength: [0, 0, 1, 1, 0] }
                  : { pathLength: 1 }
                }
                transition={loop
                  ? { duration: fullCycleDuration, times: [0, startTime, endTime, resetTime, 1], ease: "easeInOut", repeat: Infinity }
                  : { duration: animationDuration, delay: i * staggerDelay, ease: "easeInOut" }
                }
              />
              {loop && (
                <motion.circle
                  r="3.5" fill={lineColor} filter="url(#glow)"
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity:        [0,    0,     1,      0,      0    ],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut", repeat: Infinity,
                  }}
                  style={{ offsetPath: `path('${pathD}')` }}
                />
              )}
            </g>
          );
        })}

        {/* Dots & labels */}
        {dots.map((dot, i) => {
          const s = projectPoint(dot.start.lat, dot.start.lng);
          const e = projectPoint(dot.end.lat,   dot.end.lng);

          return (
            <g key={`points-group-${i}`}>
              {[
                { pt: s, label: dot.start.label, delay: i * 0.5 + 0.3 },
                { pt: e, label: dot.end.label,   delay: i * 0.5 + 0.5 },
              ].map(({ pt, label, delay }, j) => (
                <g key={j}>
                  <motion.g
                    onHoverStart={() => setHoveredLocation(label || null)}
                    onHoverEnd={() => setHoveredLocation(null)}
                    style={{ cursor: "pointer" }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill={lineColor} filter="url(#glow)"/>
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill={lineColor} opacity="0.35">
                      <animate attributeName="r"       from="3.5" to="13" dur="2s" begin={`${j * 0.5}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0"  dur="2s" begin={`${j * 0.5}s`} repeatCount="indefinite" />
                    </circle>
                  </motion.g>

                  {showLabels && label && (
                    <motion.g
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay, duration: 0.5 }}
                      style={{ pointerEvents: "none" }}
                    >
                      <foreignObject x={pt.x - 44} y={pt.y - 34} width="88" height="26">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                          <span style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 9, fontWeight: 600,
                            letterSpacing: "0.04em",
                            padding: "2px 8px",
                            background: "rgba(12, 13, 20, 0.9)",
                            color: "#fff",
                            border: "1px solid rgba(74, 222, 128, 0.3)",
                            borderRadius: 3,
                            whiteSpace: "nowrap",
                          }}>
                            {label}
                          </span>
                        </div>
                      </foreignObject>
                    </motion.g>
                  )}
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "absolute", bottom: 16, left: 16,
              background: "rgba(12, 13, 20, 0.9)",
              color: "#4ade80",
              padding: "8px 14px",
              borderRadius: 4, fontSize: 12,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              border: "1px solid rgba(74, 222, 128, 0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}