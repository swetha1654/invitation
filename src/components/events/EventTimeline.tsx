import { useReveal } from "../../hooks/useReveal";
import { ALL_EVENTS, type WeddingEvent } from "../../data/events";
import EventCard from "./EventCard";

interface Props {
  onCardOpen: (event: WeddingEvent) => void;
  revealedCards: Set<string>;
}

export default function EventTimeline({ onCardOpen, revealedCards }: Props) {
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
        {ALL_EVENTS.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            revealed={revealedCards.has(ev.id)}
            onOpen={() => onCardOpen(ev)}
          />
        ))}
      </div>
    </section>
  );
}
