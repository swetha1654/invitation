import { useCallback, useEffect, useRef, useState } from "react";
import { SCRATCH_THEMES, type WeddingEvent } from "../../data/events";
import { paintCoating } from "../../utils/painting";

interface Props {
  event: WeddingEvent;
  onRevealed: () => void;
}

export default function ScratchCanvas({ event, onRevealed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  const [fading, setFading] = useState(false);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const lastCheckRef = useRef(0);
  const revealedRef = useRef(false);
  const theme = SCRATCH_THEMES[event.id];

  const sizeAndPaint = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv?.parentElement) return;
    const parent = cv.parentElement;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(parent.clientWidth * dpr);
    cv.height = Math.round(parent.clientHeight * dpr);
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintCoating(ctx, parent.clientWidth, parent.clientHeight, theme);
  }, [theme]);

  // Initial paint after layout settles (matches original 60ms delay)
  useEffect(() => {
    const t = setTimeout(() => {
      sizeAndPaint();
      setOn(true);
    }, 60);
    return () => clearTimeout(t);
  }, [sizeAndPaint]);

  // Repaint on resize while scratch is active
  useEffect(() => {
    const handler = () => {
      if (!fading) sizeAndPaint();
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [fading, sizeAndPaint]);

  const triggerReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setFading(true);
    setTimeout(onRevealed, 600);
  }, [onRevealed]);

  const checkCleared = useCallback(() => {
    if (fading) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let cleared = 0,
      total = 0;
    for (let i = 3; i < d.length; i += 32) {
      total++;
      if (d[i] === 0) cleared++;
    }
    if (cleared / total > 0.35) triggerReveal();
  }, [fading, triggerReveal]);

  const getPos = (e: PointerEvent | React.PointerEvent) => {
    const cv = canvasRef.current!;
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const scratch = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current || fading) return;
      const cv = canvasRef.current!;
      const ctx = cv.getContext("2d")!;
      const p = getPos(e);
      const brush = Math.max(18, cv.parentElement!.clientWidth * 0.08);
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brush * 2;
      ctx.beginPath();
      if (lastRef.current) {
        ctx.moveTo(lastRef.current.x, lastRef.current.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, brush, 0, 7);
      ctx.fill();
      lastRef.current = p;

      const now = Date.now();
      if (now - lastCheckRef.current > 350) {
        lastCheckRef.current = now;
        checkCleared();
      }
    },
    [fading, checkCleared],
  );

  const stopScratch = useCallback(() => {
    if (drawingRef.current) {
      drawingRef.current = false;
      lastRef.current = null;
      checkCleared();
    }
  }, [checkCleared]);

  return (
    <canvas
      ref={canvasRef}
      className={`scratch-canvas${on ? " on" : ""}${fading ? " fade" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`Scratch the ${event.name} card to reveal — ${theme.hint}`}
      onPointerDown={(e) => {
        drawingRef.current = true;
        lastRef.current = null;
        try {
          canvasRef.current?.setPointerCapture(e.pointerId);
        } catch {
          /* older browsers */
        }
        scratch(e);
        e.preventDefault();
      }}
      onPointerMove={scratch}
      onPointerUp={stopScratch}
      onPointerCancel={stopScratch}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerReveal();
        }
      }}
    />
  );
}
