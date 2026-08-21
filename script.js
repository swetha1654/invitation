/* ============================================================
   Swetha & Akshith — Wedding Invitation
   ============================================================ */

"use strict";

/* Base URL for shared assets (card images) — derived from this script's own
   URL so variant pages in subfolders (all/, mr/, ...) resolve them correctly */
const ASSET_BASE = (() => {
  const s = document.currentScript;
  return s && s.src ? s.src.slice(0, s.src.lastIndexOf("/") + 1) : "";
})();

/* ---------- Event data (edit here if plans change) ---------- */
const ALL_EVENTS = [
  {
    id: "haldi",
    icon: "🌻",
    name: "Haldi",
    when: "Sunday, 29 Nov 2026 · 11 AM – 3 PM",
    where: "Farmhouse Collective",
  },
  {
    id: "varapooje",
    icon: "🪔",
    name: "Varapooje",
    when: "Saturday, 5 Dec 2026 · 11 AM",
    where: "Sindhoor Convention Hall, JP Nagar",
  },
  {
    id: "sangeeth",
    icon: "🎶",
    name: "Sangeeth",
    when: "Saturday, 5 Dec 2026 · 6 PM",
    where: "Sindhoor Convention Hall, JP Nagar",
  },
  {
    id: "muhurtham",
    icon: "🕉️",
    name: "Muhurtham",
    when: "Sunday, 6 Dec 2026 · 6 AM",
    where: "Sindhoor Convention Hall, JP Nagar",
  },
  {
    id: "reception",
    icon: "✨",
    name: "Reception",
    when: "Sunday, 6 Dec 2026 · 6 PM",
    where: "Sindhoor Convention Hall, JP Nagar",
  },
];

/* A variant page can set window.INVITATION_EVENTS = ["muhurtham", "reception"]
   before loading this script to show only those events */
const EVENTS = Array.isArray(window.INVITATION_EVENTS)
  ? ALL_EVENTS.filter((ev) => window.INVITATION_EVENTS.includes(ev.id))
  : ALL_EVENTS;

/* Countdown target: midnight as 6 Dec 2026 begins, IST (+05:30) */
const MUHURTHAM_DATE = new Date("2026-12-06T00:00:00+05:30");

/* ============================================================
   1. Golden gate opening flow
   ============================================================ */
(function gateFlow() {
  const overlay = document.getElementById("gate-overlay");
  const gate = document.getElementById("gate");
  const seal = document.getElementById("gate-seal");
  let opened = false;

  function openGate() {
    if (opened) return;
    opened = true;

    overlay.classList.add("opening"); // seal + texts fade out
    gate.classList.add("open"); // doors slide apart

    // After the doors part, reveal the invitation
    setTimeout(() => {
      overlay.classList.add("gone");
      document.body.classList.remove("locked");
      document.body.classList.add("revealed");
      startLeaves();
      // Kick off scroll-reveal for anything already in view
      observeReveals();
    }, 1200);

    // Remove overlay from DOM after fade
    setTimeout(() => overlay.remove(), 2300);
  }

  seal.addEventListener("click", openGate);
  // Tapping anywhere on the doors also opens the gate
  gate.addEventListener("click", openGate);

  // Dev/test hook: open instantly via #autopen, optionally jump to a section via #autopen-<sectionId>
  const m = window.location.hash.match(/^#autopen(?:-(\w+))?$/);
  if (m) {
    openGate();
    if (m[1]) {
      setTimeout(() => {
        const el = document.getElementById(m[1]);
        if (el) {
          document.documentElement.style.scrollBehavior = "auto";
          el.scrollIntoView();
          // Test hook: force-reveal everything (headless screenshots don't fire IntersectionObserver)
          document
            .querySelectorAll(".reveal, .event-card")
            .forEach((t) => t.classList.add("visible"));
        }
      }, 1400);
    }
  }
})();

/* ============================================================
   2. Falling leaves
   ============================================================ */
let leavesStarted = false;

function startLeaves() {
  if (leavesStarted) return;
  leavesStarted = true;

  const layer = document.getElementById("leaves");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  function spawnLeaf() {
    const leaf = document.createElement("div");
    const kind = Math.random();
    leaf.classList.add("leaf");
    leaf.classList.add(kind < 0.55 ? "green" : kind < 0.85 ? "gold" : "petal");

    const size = 12 + Math.random() * 18; // 12–30px
    const duration = 7 + Math.random() * 6; // 7–13s fall
    const sway = 20 + Math.random() * 60; // horizontal drift

    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.setProperty(
      "--sway",
      `${(Math.random() < 0.5 ? -1 : 1) * sway}px`,
    );
    leaf.style.animationDuration = `${duration}s`;

    layer.appendChild(leaf);
    leaf.addEventListener("animationend", () => leaf.remove());
  }

  // Initial burst, then a gentle continuous fall
  for (let i = 0; i < 14; i++) setTimeout(spawnLeaf, i * 220);
  setInterval(spawnLeaf, 1400);
}

/* ============================================================
   3. Scroll reveal animations
   ============================================================ */
function observeReveals() {
  const targets = document.querySelectorAll(".reveal, .event-card");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  targets.forEach((t) => io.observe(t));
}

/* ============================================================
   4b. Event invitation cards — lightbox with scratch coating
   Each timeline event has a small thumbnail card. Tapping it
   opens a popup with an illustrated card (art + message +
   details), covered in a themed coating (turmeric for Haldi,
   a bed of flowers for Varapooje...) that the guest scratches
   away to reveal the card.
   ============================================================ */
const CARD_MESSAGES = {
  haldi: "Join us to celebrate our Haldi ceremony!",
  varapooje: "Bless us at our Varapooje",
  sangeeth: "Dance the night away at our Sangeeth",
  muhurtham: "Witness us tie the knot at our Muhurtham",
  reception: "Celebrate with us at our Reception",
};

/* Events with a real designed card image — revealed under the coating
   (the image already carries the title & details, so the text block
   is hidden for these) */
const CARD_IMAGES = {
  haldi: "card_haldi.jpg",
  varapooje: "card_varapooje.png",
  sangeeth: "card_sangeeth.png",
  muhurtham: " card_muhurtham.png",
  reception: "card_reception.png",
};

/* Card art for an event: the real image if we have one, else the SVG scene */
function cardArtHTML(ev) {
  if (CARD_IMAGES[ev.id]) {
    return `<img src="${ASSET_BASE}${CARD_IMAGES[ev.id]}" alt="${ev.name} invitation card" draggable="false" />`;
  }
  return ART[ev.id] || "";
}

/* --- Hand-drawn SVG scenes (the Sangeeth dhol doubles as the drum cover) --- */
function artFrame(bg, inner) {
  return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false"><rect width="320" height="240" fill="${bg}"/>${inner}</svg>`;
}

const ART = {
  /* Dhol with sticks, music notes & sparkles */
  sangeeth: artFrame(
    "#E9D9F2",
    `
    <circle cx="160" cy="120" r="100" fill="#DCC6EC"/>
    <path d="M104 116 q56 -24 112 0 l0 46 q-56 24 -112 0 Z" fill="#A5281B"/>
    <ellipse cx="104" cy="139" rx="12" ry="23" fill="#E0A92E"/>
    <ellipse cx="216" cy="139" rx="12" ry="23" fill="#E0A92E"/>
    <path d="M110 121 L212 151 M110 133 L212 161 M110 149 L212 119 M110 161 L212 131" stroke="#F3D876" stroke-width="2" fill="none"/>
    <rect x="126" y="66" width="4" height="42" rx="2" transform="rotate(28 128 87)" fill="#8c6418"/>
    <rect x="190" y="66" width="4" height="42" rx="2" transform="rotate(-28 192 87)" fill="#8c6418"/>
    <ellipse cx="64" cy="98" rx="7" ry="5" transform="rotate(-20 64 98)" fill="#43205c"/>
    <rect x="69" y="64" width="3" height="34" fill="#43205c"/>
    <path d="M72 64 q14 5 9 18" stroke="#43205c" stroke-width="3" fill="none"/>
    <ellipse cx="252" cy="88" rx="6" ry="4.5" transform="rotate(-20 252 88)" fill="#43205c"/>
    <rect x="256" y="56" width="2.5" height="32" fill="#43205c"/>
    <path d="M258.5 56 q12 4 8 15" stroke="#43205c" stroke-width="2.5" fill="none"/>
    <path d="M48 144 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" fill="#C9A227"/>
    <path d="M282 126 l1.8 5.2 l5.2 1.8 l-5.2 1.8 l-1.8 5.2 l-1.8 -5.2 l-5.2 -1.8 l5.2 -1.8 Z" fill="#C9A227"/>
    <path d="M238 191 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5 -4.5 l-4.5 -1.5 l4.5 -1.5 Z" fill="#C9A227"/>
    <path d="M88 47 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5 -4.5 l-4.5 -1.5 l4.5 -1.5 Z" fill="#C9A227"/>`,
  ),
};
const SCRATCH_THEMES = {
  haldi: {
    stops: ["#e7b53f", "#d99b22", "#c98415"],
    speck: [190, 130, 25],
    hint: "Rub off the turmeric",
  },
  varapooje: {
    flowers: true,
    stops: ["#527f43", "#4c7a3f", "#2d5223"],
    hint: "Brush the flowers aside",
  },
  sangeeth: {
    stops: ["#6d3b8e", "#572c75", "#43205c"],
    speck: [95, 55, 135],
    hint: "Tap the drum to reveal",
    taps: 4,
  },
  muhurtham: {
    powder: true,
    stops: ["#c0392b", "#a5281b", "#8e1e12"],
    hint: "Wipe off the kumkum",
  },
  reception: {
    curtain: true,
    stops: ["#8e1e2c", "#6b0f1a", "#4a0810"],
    hint: "Tap to part the curtains",
  },
};

/* Remember which cards have been scratched open */
const revealedCards = new Set();

const cardLightbox = (function () {
  const lb = document.getElementById("lightbox");
  const lbCard = document.getElementById("lb-card");
  const lbContent = document.getElementById("lb-content");
  const lbArt = document.getElementById("lb-art");
  const lbText = lbContent.querySelector(".lb-text");
  const lbMsg = document.getElementById("lb-msg");
  const lbWhen = document.getElementById("lb-when");
  const lbWhere = document.getElementById("lb-where");
  const lbHint = document.getElementById("lb-hint");
  const lbClose = document.getElementById("lb-close");
  const lbBackdrop = document.getElementById("lb-backdrop");
  const cv = document.getElementById("lb-canvas");
  const cx = cv.getContext("2d");
  const lbDrum = document.getElementById("lb-drum");
  const lbDrumArt = document.getElementById("lb-drum-art");
  const lbDrumCount = document.getElementById("lb-drum-count");
  const lbCurtain = document.getElementById("lb-curtain");

  let currentEv = null;
  let mode = "idle"; // idle → covered | tapped → revealed
  let drawing = false;
  let last = null;
  let lastCheck = 0;
  let tapsLeft = 0;

  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(lbContent.clientWidth * dpr);
    cv.height = Math.round(lbContent.clientHeight * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* A dense bed of flowers (jasmine, marigold, roses) — the Varapooje coating */
  function paintFlowerBed(w, h) {
    // leafy green base
    const g = cx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#4c7a3f");
    g.addColorStop(1, "#2d5223");
    cx.fillStyle = g;
    cx.fillRect(0, 0, w, h);

    // scattered leaves
    for (let i = 0; i < (w * h) / 2600; i++) {
      cx.fillStyle = `rgba(${60 + ((Math.random() * 40) | 0)},${110 + ((Math.random() * 40) | 0)},${50 + ((Math.random() * 30) | 0)},0.8)`;
      cx.beginPath();
      cx.ellipse(
        Math.random() * w,
        Math.random() * h,
        6 + Math.random() * 10,
        3 + Math.random() * 5,
        Math.random() * Math.PI,
        0,
        7,
      );
      cx.fill();
    }

    // dense flowers
    const palettes = [
      ["#F5820D", "#FFB03A"], // marigold
      ["#F2B705", "#F5820D"], // yellow marigold
      ["#ffffff", "#F2B705"], // jasmine
      ["#E8A0B4", "#C0392B"], // pink rose
      ["#C0392B", "#F5820D"], // red rose
    ];
    for (let i = 0; i < (w * h) / 800; i++) {
      const [petal, center] = palettes[(Math.random() * palettes.length) | 0];
      const x = Math.random() * w,
        y = Math.random() * h;
      const r = 6 + Math.random() * 9;
      for (let p = 0; p < 5; p++) {
        const a = (Math.PI * 2 * p) / 5 + Math.random() * 0.3;
        cx.beginPath();
        cx.arc(
          x + Math.cos(a) * r * 0.7,
          y + Math.sin(a) * r * 0.7,
          r * 0.55,
          0,
          7,
        );
        cx.fillStyle = petal;
        cx.fill();
      }
      cx.beginPath();
      cx.arc(x, y, r * 0.38, 0, 7);
      cx.fillStyle = center;
      cx.fill();
    }
  }

  /* A thick layer of kumkum (red powder) — the Muhurtham coating */
  function paintPowder(w, h) {
    // deep red base
    const g = cx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#b92730");
    g.addColorStop(0.5, "#a41f26");
    g.addColorStop(1, "#8e1a20");
    cx.fillStyle = g;
    cx.fillRect(0, 0, w, h);

    // powdery texture: thousands of tiny particles in red shades
    const shades = ["#c93038", "#d6454a", "#9c1c22", "#e05559", "#b02229"];
    for (let i = 0; i < (w * h) / 220; i++) {
      cx.globalAlpha = 0.25 + Math.random() * 0.5;
      cx.fillStyle = shades[(Math.random() * shades.length) | 0];
      cx.beginPath();
      cx.arc(
        Math.random() * w,
        Math.random() * h,
        0.6 + Math.random() * 2.2,
        0,
        7,
      );
      cx.fill();
    }
    cx.globalAlpha = 1;

    // soft powder mounds
    for (let i = 0; i < 14; i++) {
      cx.fillStyle = "rgba(224, 85, 89, 0.16)";
      cx.beginPath();
      cx.arc(
        Math.random() * w,
        Math.random() * h,
        8 + Math.random() * 18,
        0,
        7,
      );
      cx.fill();
    }
  }

  function paintCoating() {
    const theme = SCRATCH_THEMES[currentEv.id];
    const w = lbContent.clientWidth,
      h = lbContent.clientHeight;
    cx.globalCompositeOperation = "source-over";

    if (theme.flowers) {
      paintFlowerBed(w, h);
    } else if (theme.powder) {
      paintPowder(w, h);
    } else {
      // themed foil gradient
      const g = cx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, theme.stops[0]);
      g.addColorStop(0.5, theme.stops[1]);
      g.addColorStop(1, theme.stops[2]);
      cx.fillStyle = g;
      cx.fillRect(0, 0, w, h);

      // foil speckles
      const [r, gr, b] = theme.speck;
      for (let i = 0; i < (w * h) / 450; i++) {
        cx.fillStyle = `rgba(${r + ((Math.random() * 60) | 0)},${gr + ((Math.random() * 40) | 0)},${b},${Math.random() * 0.3})`;
        cx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
    }

    // "scratch here" print, like a real scratch card
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    if (theme.flowers) {
      // soft dark band so the text reads over the busy petals
      cx.fillStyle = "rgba(26, 40, 18, 0.5)";
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(w * 0.08, h / 2 - 44, w * 0.84, 88, 14);
      else cx.rect(w * 0.08, h / 2 - 44, w * 0.84, 88);
      cx.fill();
      cx.shadowColor = "rgba(0, 0, 0, 0.6)";
      cx.shadowBlur = 8;
    }
    cx.fillStyle = "rgba(255, 246, 224, 0.95)";
    cx.font = `${Math.max(18, w * 0.055)}px Marcellus, serif`;
    cx.fillText("✦ Scratch to reveal ✦", w / 2, h / 2 - 12);
    cx.fillStyle = "rgba(255, 246, 224, 0.85)";
    cx.font = `italic ${Math.max(13, w * 0.04)}px "Cormorant Garamond", serif`;
    cx.fillText(theme.hint, w / 2, h / 2 + 18);
    cx.shadowBlur = 0;
  }

  function openCard(ev) {
    currentEv = ev;
    const theme = SCRATCH_THEMES[ev.id];
    lbArt.innerHTML = cardArtHTML(ev);
    lbText.hidden = Boolean(CARD_IMAGES[ev.id]); // image cards already carry the text
    lbMsg.textContent = CARD_MESSAGES[ev.id];
    lbWhen.textContent = ev.when;
    lbWhere.textContent = ev.where;
    cv.setAttribute(
      "aria-label",
      `Scratch card for ${ev.name} — scratch to reveal the invitation`,
    );

    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-open");

    if (revealedCards.has(ev.id)) {
      mode = "revealed";
      cv.classList.remove("on");
      cv.classList.add("fade");
      lbDrum.hidden = true;
      lbCurtain.hidden = true;
      lbHint.textContent = "See you there! ❤";
    } else if (theme.taps) {
      // Tap-the-drum reveal — no scratching for this one
      mode = "tapped";
      tapsLeft = theme.taps;
      cv.classList.remove("on");
      cv.classList.add("fade");
      lbCurtain.hidden = true;
      lbDrumArt.innerHTML = ART[ev.id];
      lbDrum.hidden = false;
      lbDrum.classList.remove("fade");
      updateDrumCount();
      lbHint.textContent = "Tap the drum to reveal 🥁";
    } else if (theme.curtain) {
      // Stage curtains part to reveal the card
      mode = "curtained";
      cv.classList.remove("on");
      cv.classList.add("fade");
      lbDrum.hidden = true;
      lbCurtain.hidden = false;
      lbCurtain.classList.remove("parted", "fade");
      lbHint.textContent = "Tap to part the curtains ✨";
    } else {
      mode = "covered";
      lbDrum.hidden = true;
      lbCurtain.hidden = true;
      lbHint.textContent = "Scratch the card to reveal ✨";
      cv.classList.remove("fade");
      setTimeout(() => {
        sizeCanvas();
        paintCoating();
        cv.classList.add("on");
      }, 60);
    }
  }

  /* Dhol sound for the drum taps — synthesized with Web Audio (no audio file).
     Alternates the bass ("dhum") and treble ("ta") sides of the drum. */
  let audioCtx = null;
  function playDholHit(tapIndex) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx || new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const ctx = audioCtx;
      const t = ctx.currentTime;
      const bass = tapIndex % 2 === 0;

      // Membrane thump: sine with a quick pitch drop and exponential decay
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(bass ? 170 : 240, t);
      osc.frequency.exponentialRampToValueAtTime(bass ? 55 : 95, t + 0.1);
      gain.gain.setValueAtTime(bass ? 0.9 : 0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (bass ? 0.35 : 0.18));
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);

      // Skin slap: short burst of filtered noise
      const len = Math.floor(ctx.sampleRate * 0.06);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = bass ? 900 : 2400;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(bass ? 0.35 : 0.5, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      noise.connect(filter).connect(nGain).connect(ctx.destination);
      noise.start(t);
    } catch (_) {
      /* audio unavailable — stay silent */
    }
  }

  function updateDrumCount() {
    lbDrumCount.textContent =
      tapsLeft === 1 ? "1 tap to go!" : `${tapsLeft} taps to go`;
  }

  function drumTap() {
    if (mode !== "tapped") return;
    // Drum-hit bounce (retrigger the CSS animation)
    lbDrum.classList.remove("hit");
    void lbDrum.offsetWidth;
    lbDrum.classList.add("hit");
    const tapIndex = SCRATCH_THEMES[currentEv.id].taps - tapsLeft;
    playDholHit(tapIndex);
    tapsLeft--;
    if (tapsLeft <= 0) {
      playDholHit(tapIndex + 1); // little bass+treble flourish on the final hit
      revealCard();
    } else {
      updateDrumCount();
    }
  }

  /* Soft curtain whoosh for the Reception reveal */
  function playCurtainWhoosh() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx || new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const ctx = audioCtx;
      const t = ctx.currentTime;

      const len = Math.floor(ctx.sampleRate * 0.9);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 1.2;
      filter.frequency.setValueAtTime(350, t);
      filter.frequency.exponentialRampToValueAtTime(1400, t + 0.7);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.9);
    } catch (_) {
      /* audio unavailable — stay silent */
    }
  }

  function curtainTap() {
    if (mode !== "curtained") return;
    mode = "parting";
    lbCurtain.classList.add("parted");
    playCurtainWhoosh();
    setTimeout(revealCard, 1150); // let the curtains finish parting first
  }

  function closeCard() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");
    drawing = false;
    last = null;
  }

  function pos(e) {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function scratch(e) {
    if (mode !== "covered" || !drawing) return;
    const p = pos(e);
    const brush = Math.max(18, lbContent.clientWidth * 0.08);
    cx.globalCompositeOperation = "destination-out";
    cx.lineCap = "round";
    cx.lineJoin = "round";
    cx.lineWidth = brush * 2;
    cx.beginPath();
    if (last) {
      cx.moveTo(last.x, last.y);
      cx.lineTo(p.x, p.y);
      cx.stroke();
    }
    cx.beginPath();
    cx.arc(p.x, p.y, brush, 0, 7);
    cx.fill();
    last = p;

    // Check progress mid-scratch (throttled) so the card pops open
    // as soon as ~a third is cleared, without lifting the finger
    const now = Date.now();
    if (now - lastCheck > 350) {
      lastCheck = now;
      checkCleared();
    }
  }

  function checkCleared() {
    if (mode !== "covered") return;
    const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    let cleared = 0,
      total = 0;
    for (let i = 3; i < d.length; i += 32) {
      total++;
      if (d[i] === 0) cleared++;
    }
    // Reveal the whole card once ~a third is scratched — no need to clear it all
    if (cleared / total > 0.35) revealCard();
  }

  function revealCard() {
    if (mode !== "covered" && mode !== "tapped" && mode !== "parting") return;
    mode = "revealed";
    revealedCards.add(currentEv.id);
    cv.classList.add("fade");
    lbDrum.classList.add("fade");
    lbCurtain.classList.add("fade");
    lbHint.textContent = "See you there! ❤";
    const thumb = document.querySelector(`[data-thumb="${currentEv.id}"]`);
    if (thumb) {
      thumb.classList.add("revealed");
      const badge = thumb.querySelector(".thumb-badge");
      if (badge) badge.textContent = "❤ Revealed";
    }
    petalBurst(lbCard, lb);
  }

  // Scratching
  cv.addEventListener("pointerdown", (e) => {
    if (mode !== "covered") return;
    drawing = true;
    last = null;
    try {
      cv.setPointerCapture(e.pointerId);
    } catch (_) {
      /* older browsers */
    }
    scratch(e);
    e.preventDefault();
  });
  cv.addEventListener("pointermove", scratch);
  const stopScratch = () => {
    if (drawing) {
      drawing = false;
      last = null;
      checkCleared();
    }
  };
  cv.addEventListener("pointerup", stopScratch);
  cv.addEventListener("pointercancel", stopScratch);

  // Keyboard fallback: Enter/Space reveals the card
  cv.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      revealCard();
    }
  });

  // Drum taps (mouse/touch + keyboard)
  lbDrum.addEventListener("click", drumTap);
  lbDrum.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      drumTap();
    }
  });

  // Curtain tap (mouse/touch + keyboard)
  lbCurtain.addEventListener("click", curtainTap);
  lbCurtain.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      curtainTap();
    }
  });

  // Closing: X button, backdrop tap, or ESC
  lbClose.addEventListener("click", closeCard);
  lbBackdrop.addEventListener("click", closeCard);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("open")) closeCard();
  });

  // Keep the coating fitted if the layout changes mid-scratch
  window.addEventListener("resize", () => {
    if (mode === "covered" && lb.classList.contains("open")) {
      sizeCanvas();
      paintCoating();
    }
  });

  // Dev/test hook: #cardtest-<eventId> opens a card covered, #cardtest-<eventId>-open opens it revealed
  const cm = window.location.hash.match(/^#cardtest-(\w+?)(-open)?$/);
  if (cm) {
    setTimeout(() => {
      const ev = EVENTS.find((e) => e.id === cm[1]);
      if (!ev) return;
      openCard(ev);
      if (cm[2]) setTimeout(revealCard, 700);
    }, 1600);
  }

  return { open: openCard };
})();

/* Little burst of gold petals when a card is fully scratched */
function petalBurst(el, layer) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  layer = layer || document.getElementById("leaves");
  const r = el.getBoundingClientRect();
  const cxp = r.left + r.width / 2,
    cyp = r.top + r.height / 2;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("span");
    p.className = "burst-petal";
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
    const dist = 60 + Math.random() * 90;
    p.style.left = `${cxp}px`;
    p.style.top = `${cyp}px`;
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist - 40}px`);
    layer.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

/* ============================================================
    4. Render event timeline
   ============================================================ */
(function renderEvents() {
  const timeline = document.getElementById("timeline");

  EVENTS.forEach((ev) => {
    // Timeline card
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-dot" aria-hidden="true">${ev.icon}</div>
      <div class="event-body">
        <h3 class="event-name">${ev.name}</h3>
        <p class="event-when">${ev.when}</p>
        <p class="event-where">${ev.where}</p>
      </div>`;

    // Thumbnail that opens the invitation card — covered in the
    // event's themed coating until the card has been scratched open
    const theme = SCRATCH_THEMES[ev.id];
    const coverBg = theme.flowers
      ? "linear-gradient(160deg, #527f43, #2d5223)"
      : `linear-gradient(160deg, ${theme.stops[0]}, ${theme.stops[1]} 55%, ${theme.stops[2]})`;
    const thumb = document.createElement("button");
    thumb.className = "event-thumb";
    thumb.type = "button";
    thumb.dataset.thumb = ev.id;
    thumb.setAttribute(
      "aria-label",
      `Open the ${ev.name} invitation card — scratch to reveal`,
    );
    thumb.innerHTML = `
      <span class="thumb-art">${cardArtHTML(ev)}<span class="thumb-cover" style="background: ${coverBg}" aria-hidden="true">${ev.icon}</span></span>
      <span class="thumb-badge">${theme.taps ? "Tap me 🥁" : theme.curtain ? "Tap me 🎭" : "Scratch me ✨"}</span>`;
    thumb.addEventListener("click", () => cardLightbox.open(ev));
    card.appendChild(thumb);

    timeline.appendChild(card);
  });
})();

/* ============================================================
   5. Countdown to Muhurtham
   ============================================================ */
(function countdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");
  const container = document.getElementById("countdown-timer");

  function tick() {
    const diff = MUHURTHAM_DATE - new Date();

    if (diff <= 0) {
      container.innerHTML =
        '<p class="countdown-done">The big day is here! 🎉</p>';
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(mins).padStart(2, "0");
    secsEl.textContent = String(secs).padStart(2, "0");
  }

  const timer = setInterval(tick, 1000);
  tick();
})();
