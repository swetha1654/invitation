import { useCallback, useEffect, useRef, useState } from "react";
import {
  CARD_IMAGES,
  CARD_MESSAGES,
  CARD_SVG_ART,
  SCRATCH_THEMES,
  type WeddingEvent,
} from "../../data/events";
import { petalBurst } from "../../utils/petalBurst";
import ScratchCanvas from "./ScratchCanvas";
import DrumReveal from "./DrumReveal";
import CurtainReveal from "./CurtainReveal";

type CardMode = "scratch" | "drum" | "curtain" | "revealed";

interface Props {
  event: WeddingEvent | null;
  onClose: () => void;
  onReveal: (id: string) => void;
  revealedCards: Set<string>;
}

function CardArt({ event }: { event: WeddingEvent }) {
  const imgSrc = CARD_IMAGES[event.id];
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${event.name} invitation card`}
        draggable={false}
      />
    );
  }
  const svg = CARD_SVG_ART[event.id];
  if (svg) return <span dangerouslySetInnerHTML={{ __html: svg }} />;
  return null;
}

function modeForEvent(
  event: WeddingEvent,
  revealedCards: Set<string>,
): CardMode {
  if (revealedCards.has(event.id)) return "revealed";
  const theme = SCRATCH_THEMES[event.id];
  if (theme.taps) return "drum";
  if (theme.curtain) return "curtain";
  return "scratch";
}

function hintText(mode: CardMode, event: WeddingEvent): string {
  if (mode === "revealed") return "See you there! ❤";
  const theme = SCRATCH_THEMES[event.id];
  if (theme.taps) return "Tap the drum to reveal 🥁";
  if (theme.curtain) return "Tap to part the curtains ✨";
  return "Scratch the card to reveal ✨";
}

export default function Lightbox({
  event,
  onClose,
  onReveal,
  revealedCards,
}: Props) {
  const [mode, setMode] = useState<CardMode>("scratch");
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isOpen = event !== null;

  // Reset mode when a new event is opened
  useEffect(() => {
    if (!event) return;
    if (event.id !== currentEventId) {
      setCurrentEventId(event.id);
      setMode(modeForEvent(event, revealedCards));
    }
  }, [event, currentEventId, revealedCards]);

  const handleRevealed = useCallback(() => {
    if (!event) return;
    setMode("revealed");
    onReveal(event.id);
    if (cardRef.current && lightboxRef.current) {
      petalBurst(cardRef.current, lightboxRef.current);
    }
  }, [event, onReveal]);

  // ESC key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const hasImage = event ? Boolean(CARD_IMAGES[event.id]) : false;

  return (
    <div
      id="lightbox"
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label="Event invitation card"
      aria-hidden={!isOpen}
      className={isOpen ? "open" : ""}
    >
      <div className="lb-backdrop" id="lb-backdrop" onClick={onClose} />

      <div className="lb-card" id="lb-card" ref={cardRef}>
        <button
          className="lb-close"
          type="button"
          aria-label="Close card"
          onClick={onClose}
        >
          ×
        </button>

        <div className="lb-content" id="lb-content">
          {event && (
            <>
              <div className="lb-art" id="lb-art">
                <CardArt event={event} />
              </div>

              {!hasImage && (
                <div className="lb-text">
                  <p className="lb-msg">{CARD_MESSAGES[event.id]}</p>
                  <p className="lb-when">{event.when}</p>
                  <p className="lb-where">{event.where}</p>
                </div>
              )}

              {mode === "scratch" && (
                <ScratchCanvas
                  key={`scratch-${event.id}`}
                  event={event}
                  onRevealed={handleRevealed}
                />
              )}

              {mode === "drum" && (
                <DrumReveal
                  key={`drum-${event.id}`}
                  event={event}
                  onRevealed={handleRevealed}
                />
              )}

              {mode === "curtain" && (
                <CurtainReveal
                  key={`curtain-${event.id}`}
                  onRevealed={handleRevealed}
                />
              )}
            </>
          )}
        </div>

        <p className="lb-hint">{event ? hintText(mode, event) : ""}</p>
      </div>
    </div>
  );
}
