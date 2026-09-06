import { useEffect, useRef } from "react";

export default function NotInvited() {
  const border1 = useRef<HTMLDivElement>(null);

  // Slow pulse on the decorative border
  useEffect(() => {
    const el = border1.current;
    if (!el) return;
    let frame: number;
    let t = 0;
    const tick = () => {
      t += 0.015;
      el.style.setProperty("--pulse", String(0.55 + 0.45 * Math.sin(t)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="ni-root">
      <div className="ni-glow" />

      {/* top & bottom marigold accents */}
      <div className="ni-petals ni-petals--top" aria-hidden>
        {"🌸🌼🌸🌼🌸🌼🌸🌼🌸".split("").map((p, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.18}s` }}>
            {p}
          </span>
        ))}
      </div>

      <div className="ni-card" ref={border1}>
        <div className="ni-corner ni-corner--tl" aria-hidden>
          ✦
        </div>
        <div className="ni-corner ni-corner--tr" aria-hidden>
          ✦
        </div>
        <div className="ni-corner ni-corner--bl" aria-hidden>
          ✦
        </div>
        <div className="ni-corner ni-corner--br" aria-hidden>
          ✦
        </div>

        <div className="ni-diya" aria-hidden>
          🪔
        </div>

        <h1 className="ni-title">
          <span className="ni-title-top">Swetha &amp; Akshith</span>
          <span className="ni-title-divider">— ✦ —</span>
          <span className="ni-title-bottom">Wedding Celebration</span>
        </h1>

        <div className="ni-rule" aria-hidden />

        <p className="ni-message">This link does not appear to be valid.</p>
        <p className="ni-sub">
          If you received an invitation, please check the link shared
          with&nbsp;you.
        </p>
      </div>

      <div className="ni-petals ni-petals--bottom" aria-hidden>
        {"🌼🌸🌼🌸🌼🌸🌼🌸🌼".split("").map((p, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.18}s` }}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
