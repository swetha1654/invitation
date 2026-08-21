import { useCallback, useEffect, useState } from "react";
import type { WeddingEvent } from "./data/events";
import FallingLeaves from "./components/FallingLeaves";
import GateOverlay from "./components/gate/GateOverlay";
import Hero from "./components/hero/Hero";
import EventTimeline from "./components/events/EventTimeline";
import Countdown from "./components/Countdown";
import Footer from "./components/Footer";
import Lightbox from "./components/lightbox/Lightbox";

export default function App() {
  const [revealed, setRevealed] = useState(false);
  const [lightboxEvent, setLightboxEvent] = useState<WeddingEvent | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  // Sync body classes for CSS rules in index.css
  useEffect(() => {
    document.body.classList.toggle("locked", !revealed);
    document.body.classList.toggle("revealed", revealed);
  }, [revealed]);

  useEffect(() => {
    document.body.classList.toggle("lb-open", lightboxEvent !== null);
  }, [lightboxEvent]);

  const handleRevealCard = useCallback((id: string) => {
    setRevealedCards((prev) => new Set([...prev, id]));
  }, []);

  const handleClose = useCallback(() => setLightboxEvent(null), []);

  return (
    <>
      <FallingLeaves active={revealed} />

      <GateOverlay onOpen={() => setRevealed(true)} />

      {revealed && (
        <main id="invitation">
          <Hero />
          <EventTimeline
            onCardOpen={setLightboxEvent}
            revealedCards={revealedCards}
          />
          <Countdown />
          <Footer />
        </main>
      )}

      <Lightbox
        event={lightboxEvent}
        onClose={handleClose}
        onReveal={handleRevealCard}
        revealedCards={revealedCards}
      />
    </>
  );
}
