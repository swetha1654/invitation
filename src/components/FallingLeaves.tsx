import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
}

export default function FallingLeaves({ active }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;

    function spawnLeaf() {
      if (!layer) return;
      const leaf = document.createElement("div");
      const kind = Math.random();
      leaf.classList.add(
        "leaf",
        kind < 0.55 ? "green" : kind < 0.85 ? "gold" : "petal",
      );
      const size = 12 + Math.random() * 18;
      const duration = 7 + Math.random() * 6;
      const sway = (20 + Math.random() * 60) * (Math.random() < 0.5 ? -1 : 1);
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.left = `${Math.random() * 100}vw`;
      leaf.style.setProperty("--sway", `${sway}px`);
      leaf.style.animationDuration = `${duration}s`;
      layer.appendChild(leaf);
      leaf.addEventListener("animationend", () => leaf.remove(), {
        once: true,
      });
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 14; i++) timeouts.push(setTimeout(spawnLeaf, i * 220));
    const interval = setInterval(spawnLeaf, 1400);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [active]);

  return <div id="leaves" ref={layerRef} aria-hidden="true" />;
}
