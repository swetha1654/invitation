import { LOCATIONS } from "../data/config";
import { useReveal } from "../hooks/useReveal";

export default function Location() {
  const title = useReveal();
  const sub = useReveal();
  const cards = useReveal();

  return (
    <section id="location" className="section location-section">
      <h2 ref={title.ref} className={`section-title ${title.cls}`}>
        Location Information
      </h2>
      <p ref={sub.ref} className={`section-sub ${sub.cls}`}>
        Finding your way to the celebrations
      </p>

      <div ref={cards.ref} className={`location-grid ${cards.cls}`}>
        {LOCATIONS.map((venue) => (
          <div className="location-card" key={venue.name}>
            <div className="location-icon" aria-hidden="true">
              {venue.icon}
            </div>
            <h3 className="location-name">{venue.name}</h3>
            <a
              className="location-link"
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Open in Maps
            </a>
            <p className="location-detail">🚗 {venue.parking}</p>
            {venue.transit && (
              <p className="location-detail">🚇 {venue.transit}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
