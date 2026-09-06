import { useReveal } from "../../hooks/useReveal";
import type { WeddingEvent } from "../../data/events";
import EventCard from "./EventCard";

interface Props {
  events: WeddingEvent[];
  onCardOpen: (event: WeddingEvent) => void;
  onInfoOpen: (event: WeddingEvent) => void;
  revealedCards: Set<string>;
}

export default function EventTimeline({
  onCardOpen,
  onInfoOpen,
  revealedCards,
}: Props) {
  const title = useReveal();
  const sub = useReveal();

  return (
    <section id="events" className="section">
      <h2 ref={title.ref} className={`section-title ${title.cls}`}>
        Wedding Festivities
      </h2>
      <p ref={sub.ref} className={`section-sub ${sub.cls}`}>
        Join us through each celebration
      </p>
      <div className="timeline" id="timeline">
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            revealed={revealedCards.has(ev.id)}
            onOpen={() => onCardOpen(ev)}
            onLearnMore={() => onInfoOpen(ev)}
          />
        ))}
      </div>
    </section>
  );
}
