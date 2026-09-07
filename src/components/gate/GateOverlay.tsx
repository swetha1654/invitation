import { useRef } from "react";
import logoSrc from "../../assets/logo.png";

const MARIGOLD_COUNT = 20;

interface Props {
  onOpen: () => void;
  onClosed: () => void;
}

export default function GateOverlay({ onOpen, onClosed }: Props) {
  const openedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);

  function openGate() {
    if (openedRef.current) return;
    openedRef.current = true;

    const overlay = overlayRef.current;
    const gate = gateRef.current;
    if (!overlay || !gate) return;

    overlay.classList.add("opening");
    gate.classList.add("open");

    setTimeout(() => {
      overlay.classList.add("gone");
      onOpen();
    }, 1200);

    setTimeout(onClosed, 2300);
  }

  return (
    <div id="gate-overlay" ref={overlayRef}>
      <div className="marigold-garland" aria-hidden="true">
        {Array.from({ length: MARIGOLD_COUNT }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="gate" id="gate" ref={gateRef} onClick={openGate}>
        <div className="door door-left" aria-hidden="true">
          <div className="strip" />
        </div>
        <div className="door door-right" aria-hidden="true">
          <div className="strip" />
        </div>
      </div>

      <button
        className="gate-seal"
        id="gate-seal"
        type="button"
        aria-label="Tap to open the wedding invitation"
        onClick={(e) => {
          e.stopPropagation();
          openGate();
        }}
      >
        <span className="seal-ring">
          <img className="seal-logo" src={logoSrc} alt="S & A" />
        </span>
      </button>

      <p className="tap-open">✦&nbsp;&nbsp;Tap to open&nbsp;&nbsp;✦</p>
      <p className="warmly">You are warmly invited</p>
    </div>
  );
}
