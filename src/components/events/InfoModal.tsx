import { useEffect } from "react";
import {
  EVENT_INFO,
  EVENT_INFO_SECTIONS,
  type WeddingEvent,
} from "../../data/events";

interface Props {
  event: WeddingEvent | null;
  onClose: () => void;
}

export default function InfoModal({ event, onClose }: Props) {
  const isOpen = event !== null;

  // ESC key closes
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <div
      id="info-modal"
      role="dialog"
      aria-modal="true"
      aria-label="About this ritual"
      aria-hidden={!isOpen}
      className={isOpen ? "open" : ""}
    >
      <div className="info-backdrop" onClick={onClose} />

      <div className="info-card">
        <button
          className="info-close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {event && (
          <>
            <div className="info-icon" aria-hidden="true">
              {event.icon}
            </div>
            <h3 className="info-title">{event.name}</h3>
            {EVENT_INFO_SECTIONS[event.id] ? (
              <div className="info-sections">
                {EVENT_INFO_SECTIONS[event.id].map((section) => (
                  <div className="info-section" key={section.title}>
                    <h4 className="info-section-title">{section.title}</h4>
                    <p className="info-body">{section.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="info-paragraphs">
                {EVENT_INFO[event.id]?.map((paragraph, i) => (
                  <p className="info-body" key={i}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
