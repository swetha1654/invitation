import { useCallback, useRef, useState } from "react";
import { playCurtainWhoosh } from "../../utils/audio";

interface Props {
  onRevealed: () => void;
}

export default function CurtainReveal({ onRevealed }: Props) {
  const [parted, setParted] = useState(false);
  const doneRef = useRef(false);

  const handleTap = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setParted(true);
    playCurtainWhoosh();
    setTimeout(onRevealed, 1150);
  }, [onRevealed]);

  return (
    <div
      className={`lb-curtain${parted ? " parted" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Tap to part the curtains and reveal the invitation"
      onClick={handleTap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTap();
        }
      }}
    >
      <div className="curtain-half curtain-left" />
      <div className="curtain-half curtain-right" />
      <div className="curtain-valance" />
      <p className="curtain-cue">✦ Tap to open ✦</p>
    </div>
  );
}
