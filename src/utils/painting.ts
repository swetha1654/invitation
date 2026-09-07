import type { ScratchTheme } from "../data/events";

export function paintCoating(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: ScratchTheme,
  separateFlowers = false,
): void {
  ctx.globalCompositeOperation = "source-over";

  if (theme.flowers) {
    // When flowers are interactive particles (drawn on their own layer),
    // only paint the leaf bed here.
    if (separateFlowers) paintFlowerBedBase(ctx, w, h);
    else paintFlowerBed(ctx, w, h);
  } else if (theme.powder) {
    paintPowder(ctx, w, h);
  } else {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, theme.stops[0]);
    g.addColorStop(0.5, theme.stops[1]);
    g.addColorStop(1, theme.stops[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (theme.speck) {
      const [r, gr, b] = theme.speck;
      for (let i = 0; i < (w * h) / 450; i++) {
        ctx.fillStyle = `rgba(${r + ((Math.random() * 60) | 0)},${gr + ((Math.random() * 40) | 0)},${b},${Math.random() * 0.3})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
    }
  }

  // "Scratch to reveal" text overlay
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (theme.flowers) {
    ctx.fillStyle = "rgba(26, 40, 18, 0.5)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(w * 0.08, h / 2 - 44, w * 0.84, 88, 14);
    else ctx.rect(w * 0.08, h / 2 - 44, w * 0.84, 88);
    ctx.fill();
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 8;
  }
  ctx.fillStyle = "rgba(255, 246, 224, 0.95)";
  ctx.font = `${Math.max(18, w * 0.055)}px Marcellus, serif`;
  ctx.fillText("✦ Scratch to reveal ✦", w / 2, h / 2 - 12);
  ctx.fillStyle = "rgba(255, 246, 224, 0.85)";
  ctx.font = `italic ${Math.max(13, w * 0.04)}px "Cormorant Garamond", serif`;
  ctx.fillText(theme.hint, w / 2, h / 2 + 18);
  ctx.shadowBlur = 0;
}

function paintFlowerBedBase(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#4c7a3f");
  g.addColorStop(1, "#2d5223");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < (w * h) / 2600; i++) {
    ctx.fillStyle = `rgba(${60 + ((Math.random() * 40) | 0)},${110 + ((Math.random() * 40) | 0)},${50 + ((Math.random() * 30) | 0)},0.8)`;
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * w,
      Math.random() * h,
      6 + Math.random() * 10,
      3 + Math.random() * 5,
      Math.random() * Math.PI,
      0,
      7,
    );
    ctx.fill();
  }
}

// ─── Interactive flower particles ────────────────────────────────────────────

export interface FlowerParticle {
  x: number;
  y: number;
  r: number;
  petal: string;
  center: string;
  rot: number;
  vx: number;
  vy: number;
}

const FLOWER_PALETTES: [string, string][] = [
  ["#F5820D", "#FFB03A"],
  ["#F2B705", "#F5820D"],
  ["#ffffff", "#F2B705"],
  ["#E8A0B4", "#C0392B"],
  ["#C0392B", "#F5820D"],
];

export function generateFlowers(w: number, h: number): FlowerParticle[] {
  const flowers: FlowerParticle[] = [];
  for (let i = 0; i < (w * h) / 800; i++) {
    const [petal, center] =
      FLOWER_PALETTES[(Math.random() * FLOWER_PALETTES.length) | 0];
    flowers.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 6 + Math.random() * 9,
      petal,
      center,
      rot: Math.random() * Math.PI * 2,
      vx: 0,
      vy: 0,
    });
  }
  return flowers;
}

export function drawFlower(ctx: CanvasRenderingContext2D, f: FlowerParticle) {
  for (let p = 0; p < 5; p++) {
    const a = f.rot + (Math.PI * 2 * p) / 5;
    ctx.beginPath();
    ctx.arc(
      f.x + Math.cos(a) * f.r * 0.7,
      f.y + Math.sin(a) * f.r * 0.7,
      f.r * 0.55,
      0,
      7,
    );
    ctx.fillStyle = f.petal;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.r * 0.38, 0, 7);
  ctx.fillStyle = f.center;
  ctx.fill();
}

// ─── Flower field engine ─────────────────────────────────────────────────────
// Mutable particle simulation kept outside of React: flowers are pushed along
// the pointer's sweep direction, glide with momentum, spin, and pile up at the
// card edges — as if brushed aside by hand.

export interface FlowerField {
  /** Resize/regenerate the flowers and paint them. */
  reset: (w: number, h: number) => void;
  /** Push flowers near (x, y) along the drag vector (dx, dy). */
  push: (x: number, y: number, dx: number, dy: number, brush: number) => void;
  /** Fling all remaining flowers outward (on card reveal). */
  fling: () => void;
  /** Cancel the animation loop. */
  stop: () => void;
}

export function createFlowerField(
  getCanvas: () => HTMLCanvasElement | null,
): FlowerField {
  let flowers: FlowerParticle[] = [];
  let raf = 0;

  const draw = () => {
    const cv = getCanvas();
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, cv.width / dpr, cv.height / dpr);
    for (const f of flowers) drawFlower(ctx, f);
  };

  const step = () => {
    raf = 0;
    const cv = getCanvas();
    if (!cv?.parentElement) return;
    const w = cv.parentElement.clientWidth;
    const h = cv.parentElement.clientHeight;
    let moving = false;
    for (const f of flowers) {
      if (Math.abs(f.vx) < 0.05 && Math.abs(f.vy) < 0.05) continue;
      f.x += f.vx;
      f.y += f.vy;
      f.vx *= 0.9;
      f.vy *= 0.9;
      f.rot += (f.vx + f.vy) * 0.012;
      // Clamp at edges so swept flowers gather into piles
      if (f.x < f.r) { f.x = f.r; f.vx = 0; }
      if (f.x > w - f.r) { f.x = w - f.r; f.vx = 0; }
      if (f.y < f.r) { f.y = f.r; f.vy = 0; }
      if (f.y > h - f.r) { f.y = h - f.r; f.vy = 0; }
      moving = true;
    }
    draw();
    if (moving) raf = requestAnimationFrame(step);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(step);
  };

  return {
    reset(w, h) {
      flowers = generateFlowers(w, h);
      draw();
    },

    push(x, y, dx, dy, brush) {
      const speed = Math.hypot(dx, dy);
      const reach = brush * 1.3;
      for (const f of flowers) {
        const d = Math.hypot(f.x - x, f.y - y);
        if (d >= reach) continue;
        const falloff = 1 - d / reach;
        if (speed > 0.5) {
          // Swept along the stroke, with a little sideways scatter
          f.vx += dx * 0.45 * falloff + (Math.random() - 0.5) * 2.5;
          f.vy += dy * 0.45 * falloff + (Math.random() - 0.5) * 2.5;
        } else {
          // Touched without moving — nudge radially outward
          const nx = (f.x - x) / (d || 1);
          const ny = (f.y - y) / (d || 1);
          f.vx += nx * 3 * falloff;
          f.vy += ny * 3 * falloff;
        }
      }
      kick();
    },

    fling() {
      const cv = getCanvas();
      const w = cv?.parentElement?.clientWidth ?? 0;
      const h = cv?.parentElement?.clientHeight ?? 0;
      for (const f of flowers) {
        const dx = f.x - w / 2;
        const dy = f.y - h / 2;
        const d = Math.hypot(dx, dy) || 1;
        f.vx = (dx / d) * (8 + Math.random() * 6);
        f.vy = (dy / d) * (8 + Math.random() * 6);
      }
      kick();
    },

    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

function paintFlowerBed(ctx: CanvasRenderingContext2D, w: number, h: number) {
  paintFlowerBedBase(ctx, w, h);
  for (const f of generateFlowers(w, h)) drawFlower(ctx, f);
}

function paintPowder(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#b92730");
  g.addColorStop(0.5, "#a41f26");
  g.addColorStop(1, "#8e1a20");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const shades = ["#c93038", "#d6454a", "#9c1c22", "#e05559", "#b02229"];
  for (let i = 0; i < (w * h) / 220; i++) {
    ctx.globalAlpha = 0.25 + Math.random() * 0.5;
    ctx.fillStyle = shades[(Math.random() * shades.length) | 0];
    ctx.beginPath();
    ctx.arc(
      Math.random() * w,
      Math.random() * h,
      0.6 + Math.random() * 2.2,
      0,
      7,
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = "rgba(224, 85, 89, 0.16)";
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 8 + Math.random() * 18, 0, 7);
    ctx.fill();
  }
}
