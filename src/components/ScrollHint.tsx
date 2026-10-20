import { useEffect, useState } from "react";

/**
 * Floating bottom banner that nudges guests (mobile especially) to scroll
 * through the invite — stays visible until they reach the bottom of the page.
 */
export default function ScrollHint() {
  const [visible, setVisible] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onScroll = () => {
      const scrolledToEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;
      setAtEnd(scrolledToEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  if (!visible || atEnd) return null;

  return (
    <button
      type="button"
      className="scroll-hint"
      onClick={() => {
        document
          .getElementById("events")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span className="scroll-hint-arrow" aria-hidden="true">
        ↓
      </span>
      <span className="scroll-hint-text">
        Scroll down for events, timings &amp; location
      </span>
    </button>
  );
}
