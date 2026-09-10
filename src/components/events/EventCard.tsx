import { useReveal } from "../../hooks/useReveal";
import {
  CARD_IMAGES,
  CARD_SVG_ART,
  SCRATCH_THEMES,
  type WeddingEvent,
} from "../../data/events";

interface Props {
  event: WeddingEvent;
  revealed: boolean;
  onOpen: () => void;
  onLearnMore: () => void;
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
  if (svg) {
    return <span dangerouslySetInnerHTML={{ __html: svg }} />;
  }
  return null;
}

export default function EventCard({
  event,
  revealed,
  onOpen,
  onLearnMore,
}: Props) {
  const card = useReveal();
  const theme = SCRATCH_THEMES[event.id];

  const coverBg = theme.flowers
    ? "linear-gradient(160deg, #527f43, #2d5223)"
    : `linear-gradient(160deg, ${theme.stops[0]}, ${theme.stops[1]} 55%, ${theme.stops[2]})`;

  const badgeText = revealed
    ? "❤ Revealed"
    : theme.taps
      ? "Click me 🥁"
      : theme.curtain
        ? "Click me 🎭"
        : "Click me ✨";

  return (
    <div ref={card.ref} className={`event-card ${card.cls}`}>
      <div className="event-dot" aria-hidden="true">
        {event.icon}
      </div>

      <div className="event-body">
        <h3 className="event-name">{event.name}</h3>
        <p className="event-when">{event.when}</p>
        <p className="event-where">{event.where}</p>
        <button
          className="event-learn-more"
          type="button"
          onClick={onLearnMore}
        >
          A little about this
          <span className="learn-more-arrow" aria-hidden="true">
            ↓
          </span>
        </button>
      </div>

      <button
        className={`event-thumb${revealed ? " revealed" : ""}`}
        type="button"
        data-thumb={event.id}
        aria-label={`Open the ${event.name} invitation card — scratch to reveal`}
        onClick={onOpen}
      >
        <span className="thumb-art">
          <CardArt event={event} />
          <span
            className="thumb-cover"
            style={{ background: coverBg }}
            aria-hidden="true"
          >
            {event.icon}
          </span>
        </span>
        <span className="thumb-badge">{badgeText}</span>
      </button>
    </div>
  );
}
