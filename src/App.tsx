import { useCallback, useEffect, useMemo, useState } from "react";
import type { WeddingEvent } from "./data/events";
import { GUEST_TOKENS, getEventsForTier } from "./data/events";
import FallingLeaves from "./components/FallingLeaves";
import GateOverlay from "./components/gate/GateOverlay";
import Hero from "./components/hero/Hero";
import EventTimeline from "./components/events/EventTimeline";
import InfoModal from "./components/events/InfoModal";
import Countdown from "./components/Countdown";
import Footer from "./components/Footer";
import Lightbox from "./components/lightbox/Lightbox";
import NotInvited from "./components/NotInvited";

export default function App() {
  const events = useMemo(() => {
    const token = window.location.hash.replace("#", "");
    const tier = GUEST_TOKENS[token];
    return tier ? getEventsForTier(tier) : null;
  }, []);

  if (!events) return <NotInvited />;
  const [revealed, setRevealed] = useState(false);
  const [lightboxEvent, setLightboxEvent] = useState<WeddingEvent | null>(null);
  const [infoEvent, setInfoEvent] = useState<WeddingEvent | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  // Sync body classes for CSS rules in index.css
  useEffect(() => {
    document.body.classList.toggle("locked", !revealed);
    document.body.classList.toggle("revealed", revealed);
  }, [revealed]);

  useEffect(() => {
    document.body.classList.toggle("lb-open", lightboxEvent !== null || infoEvent !== null);
  }, [lightboxEvent, infoEvent]);

  const handleRevealCard = useCallback((id: string) => {
    setRevealedCards((prev) => new Set([...prev, id]));
  }, []);

  const handleClose = useCallback(() => setLightboxEvent(null), []);
  const handleInfoClose = useCallback(() => setInfoEvent(null), []);

  return (
    <>
      <FallingLeaves active={revealed} />

      <GateOverlay onOpen={() => setRevealed(true)} />

      {revealed && (
        <main id="invitation">
          <Hero />
          <EventTimeline
            events={events}
            onCardOpen={setLightboxEvent}
            onInfoOpen={setInfoEvent}
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

      <InfoModal event={infoEvent} onClose={handleInfoClose} />
    </>
  );
}

