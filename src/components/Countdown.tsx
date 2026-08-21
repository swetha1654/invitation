import { useEffect, useRef, useState } from "react";
import { WEDDING } from "../data/config";
import { useReveal } from "../hooks/useReveal";

const TARGET = new Date(WEDDING.muhurthamISO);

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function calc(): TimeLeft | null {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(calc);
  const title = useReveal();
  const sub = useReveal();
  const counter = useReveal();
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section id="countdown" className="section section-alt">
      <h2 ref={title.ref} className={`section-title ${title.cls}`}>
        Counting down to the Muhurtham
      </h2>
      <p ref={sub.ref} className={`section-sub ${sub.cls}`}>
        {WEDDING.countdownLabel}
      </p>

      <div
        ref={counter.ref}
        className={`countdown ${counter.cls}`}
        id="countdown-timer"
      >
        {time ? (
          <>
            <div className="cd-cell">
              <span className="cd-num" id="cd-days">
                {time.days}
              </span>
              <span className="cd-label">Days</span>
            </div>
            <div className="cd-sep" aria-hidden="true">
              :
            </div>
            <div className="cd-cell">
              <span className="cd-num" id="cd-hours">
                {pad(time.hours)}
              </span>
              <span className="cd-label">Hours</span>
            </div>
            <div className="cd-sep" aria-hidden="true">
              :
            </div>
            <div className="cd-cell">
              <span className="cd-num" id="cd-mins">
                {pad(time.mins)}
              </span>
              <span className="cd-label">Minutes</span>
            </div>
            <div className="cd-sep" aria-hidden="true">
              :
            </div>
            <div className="cd-cell">
              <span className="cd-num" id="cd-secs">
                {pad(time.secs)}
              </span>
              <span className="cd-label">Seconds</span>
            </div>
          </>
        ) : (
          <p className="countdown-done">The big day is here! 🎉</p>
        )}
      </div>
    </section>
  );
}
