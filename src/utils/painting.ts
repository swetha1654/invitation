import type { ScratchTheme } from "../data/events";

export function paintCoating(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: ScratchTheme,
): void {
  ctx.globalCompositeOperation = "source-over";

  if (theme.flowers) {
    paintFlowerBed(ctx, w, h);
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

function paintFlowerBed(ctx: CanvasRenderingContext2D, w: number, h: number) {
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

  const palettes: [string, string][] = [
    ["#F5820D", "#FFB03A"],
    ["#F2B705", "#F5820D"],
    ["#ffffff", "#F2B705"],
    ["#E8A0B4", "#C0392B"],
    ["#C0392B", "#F5820D"],
  ];
  for (let i = 0; i < (w * h) / 800; i++) {
    const [petal, center] = palettes[(Math.random() * palettes.length) | 0];
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 6 + Math.random() * 9;
    for (let p = 0; p < 5; p++) {
      const a = (Math.PI * 2 * p) / 5 + Math.random() * 0.3;
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(a) * r * 0.7,
        y + Math.sin(a) * r * 0.7,
        r * 0.55,
        0,
        7,
      );
      ctx.fillStyle = petal;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, r * 0.38, 0, 7);
    ctx.fillStyle = center;
    ctx.fill();
  }
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
