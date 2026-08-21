import { useCallback, useRef, useState } from "react";
import {
  CARD_SVG_ART,
  SCRATCH_THEMES,
  type WeddingEvent,
} from "../../data/events";
import { playDholHit } from "../../utils/audio";

interface Props {
  event: WeddingEvent;
  onRevealed: () => void;
}

export default function DrumReveal({ event, onRevealed }: Props) {
  const totalTaps = SCRATCH_THEMES[event.id].taps ?? 4;
  const [tapsLeft, setTapsLeft] = useState(totalTaps);
  const [fading, setFading] = useState(false);
  const drumRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const handleTap = useCallback(() => {
    if (doneRef.current || fading) return;

    // Retrigger CSS animation by removing then re-adding the `hit` class
    const el = drumRef.current;
    if (el) {
      el.classList.remove("hit");
      void el.offsetWidth; // force reflow
      el.classList.add("hit");
    }

    const tapIndex = totalTaps - tapsLeft;
    playDholHit(tapIndex);

    const remaining = tapsLeft - 1;
    setTapsLeft(remaining);

    if (remaining <= 0) {
      doneRef.current = true;
      playDholHit(tapIndex + 1);
      setFading(true);
      setTimeout(onRevealed, 600);
    }
  }, [tapsLeft, totalTaps, fading, onRevealed]);

  const svg = CARD_SVG_ART[event.id] ?? "";

  return (
    <div
      ref={drumRef}
      className={`lb-drum${fading ? " fade" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Tap the drum to reveal the invitation"
      onClick={handleTap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTap();
        }
      }}
    >
      <div className="lb-drum-art" dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="lb-drum-count">
        {tapsLeft === 1 ? "1 tap to go!" : `${tapsLeft} taps to go`}
      </p>
    </div>
  );
}
