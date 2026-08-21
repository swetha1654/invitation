import { COUPLE, HERO, WEDDING } from "../../data/config";
import { useReveal } from "../../hooks/useReveal";

const THORANAM_COUNT = 15;

export default function Hero() {
  const eyebrow = useReveal();
  const tagline = useReveal();
  const couple = useReveal();
  const sub = useReveal();
  const date = useReveal();
  const cue = useReveal();

  return (
    <section className="hero">
      <div className="thoranam" aria-hidden="true">
        {Array.from({ length: THORANAM_COUNT }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <p ref={eyebrow.ref} className={`eyebrow ${eyebrow.cls}`}>
        {HERO.eyebrow}
      </p>

      <p ref={tagline.ref} className={`hero-line ${tagline.cls}`}>
        {HERO.tagline}
      </p>

      <h1 ref={couple.ref} className={`couple ${couple.cls}`}>
        <span className="name">{COUPLE.bride.name}</span>
        <span className="parents">{COUPLE.bride.parents}</span>
        <span className="amp">&amp;</span>
        <span className="name">{COUPLE.groom.name}</span>
        <span className="parents">{COUPLE.groom.parents}</span>
      </h1>

      <p ref={sub.ref} className={`hero-sub ${sub.cls}`}>
        {HERO.sub}
      </p>

      <div ref={date.ref} className={`hero-date ${date.cls}`}>
        <div className="ornament" aria-hidden="true">
          <svg viewBox="0 0 200 20" width="200" height="20">
            <path d="M0 10 H78" stroke="currentColor" strokeWidth="1" />
            <path d="M122 10 H200" stroke="currentColor" strokeWidth="1" />
            <circle
              cx="100"
              cy="10"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="100" cy="10" r="1.5" fill="currentColor" />
            <path
              d="M85 10 q7 -8 15 0 q-7 8 -15 0 Z M115 10 q-7 -8 -15 0 q7 8 15 0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
        </div>
        <p className="date-big">{WEDDING.dateLabel}</p>
        <p className="venue-line">{WEDDING.venue}</p>
      </div>

      <a
        ref={cue.ref}
        className={`scroll-cue ${cue.cls}`}
        href="#events"
        aria-label="Scroll to events"
      >
        <span className="chev" />
      </a>
    </section>
  );
}
