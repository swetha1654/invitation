/** Spawns gold petal particles that fly out from the card's centre. */
export function petalBurst(cardEl: HTMLElement, layerEl: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = cardEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("span");
    p.className = "burst-petal";
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
    const dist = 60 + Math.random() * 90;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist - 40}px`);
    layerEl.appendChild(p);
    p.addEventListener("animationend", () => p.remove(), { once: true });
  }
}
