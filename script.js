/* ============================================================
   Swetha & Akshith — Wedding Invitation
   ============================================================ */

"use strict";

/* ---------- Event data (edit here if plans change) ---------- */
const EVENTS = [
  { id: "haldi",      icon: "🌻", name: "Haldi",              when: "Sunday, 29 Nov 2026 · 11 AM – 3 PM", where: "Farmhouse Collective" },
  { id: "mehendi",    icon: "🌿", name: "Mehendi",            when: "Wednesday, 2 Dec 2026 · 7 PM – 11 PM", where: "SMR Vinay Harmony" },
  { id: "varapooje",  icon: "🪔", name: "Nandi & Varapooje",  when: "Saturday, 5 Dec 2026 · 8 AM",  where: "Sindhoor Convention Hall, JP Nagar" },
  { id: "sangeeth",   icon: "🎶", name: "Sangeeth",           when: "Saturday, 5 Dec 2026 · 6 PM",  where: "Sindhoor Convention Hall, JP Nagar" },
  { id: "muhurtham",  icon: "🕉️", name: "Muhurtham",          when: "Sunday, 6 Dec 2026 · 6 AM",    where: "Sindhoor Convention Hall, JP Nagar" },
  { id: "reception",  icon: "✨", name: "Reception",          when: "Sunday, 6 Dec 2026 · 6 PM",    where: "Sindhoor Convention Hall, JP Nagar" },
];

/* Muhurtham: 6 Dec 2026, 6:00 AM IST (+05:30) */
const MUHURTHAM_DATE = new Date("2026-12-06T06:00:00+05:30");

/* WhatsApp numbers (country code + number, no + or spaces) */
const WHATSAPP = {
  bride: "919620746746",
  groom: "919731583928",
};

/* ---------- RSVP state ---------- */
const state = {
  squad: null,          // "bride" | "groom"
  rsvp: {},             // eventId -> "yes" | "no"
  guests: "",
};

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

    overlay.classList.add("opening");   // seal + texts fade out
    gate.classList.add("open");         // doors slide apart

    // After the doors part, reveal the invitation
    setTimeout(() => {
      overlay.classList.add("gone");
      document.body.classList.remove("locked");
      document.body.classList.add("revealed");
      startLeaves();
      // Kick off scroll-reveal for anything already in view
      requestAnimationFrame(observeReveals);
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
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  function spawnLeaf() {
    const leaf = document.createElement("div");
    const kind = Math.random();
    leaf.classList.add("leaf");
    leaf.classList.add(kind < 0.55 ? "green" : kind < 0.85 ? "gold" : "petal");

    const size = 12 + Math.random() * 18;               // 12–30px
    const duration = 7 + Math.random() * 6;             // 7–13s fall
    const sway = 20 + Math.random() * 60;               // horizontal drift

    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.setProperty("--sway", `${(Math.random() < 0.5 ? -1 : 1) * sway}px`);
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
    { threshold: 0.15 }
  );
  targets.forEach((t) => io.observe(t));
}

/* ============================================================
   4. Render event timeline + RSVP rows
   ============================================================ */
(function renderEvents() {
  const timeline = document.getElementById("timeline");
  const rsvpList = document.getElementById("rsvp-list");

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
    timeline.appendChild(card);

    // RSVP row
    const row = document.createElement("div");
    row.className = "rsvp-row";
    row.innerHTML = `
      <span class="rsvp-row-name">${ev.name}<span class="rsvp-row-date">${ev.when.split("·")[0].trim()}</span></span>
      <div class="rsvp-buttons" role="group" aria-label="RSVP for ${ev.name}">
        <button type="button" class="rsvp-btn yes" data-event="${ev.id}" data-value="yes">Yes</button>
        <button type="button" class="rsvp-btn no" data-event="${ev.id}" data-value="no">No</button>
      </div>`;
    rsvpList.appendChild(row);
  });
})();

/* ============================================================
   5. Squad selection
   ============================================================ */
(function squadSelection() {
  const brideBtn = document.getElementById("squad-bride");
  const groomBtn = document.getElementById("squad-groom");
  const warning = document.getElementById("rsvp-warning");

  function select(squad) {
    state.squad = squad;
    brideBtn.classList.toggle("selected", squad === "bride");
    groomBtn.classList.toggle("selected", squad === "groom");
    brideBtn.setAttribute("aria-pressed", squad === "bride");
    groomBtn.setAttribute("aria-pressed", squad === "groom");
    warning.textContent = "";
  }

  brideBtn.addEventListener("click", () => select("bride"));
  groomBtn.addEventListener("click", () => select("groom"));
})();

/* ============================================================
   6. RSVP yes/no toggles
   ============================================================ */
document.getElementById("rsvp-list").addEventListener("click", (e) => {
  const btn = e.target.closest(".rsvp-btn");
  if (!btn) return;

  const { event, value } = btn.dataset;
  state.rsvp[event] = value;

  // Update active states within this row's button group
  const group = btn.closest(".rsvp-buttons");
  group.querySelectorAll(".rsvp-btn").forEach((b) => {
    const isActive = b.dataset.value === value;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-pressed", isActive);
  });
});

/* ============================================================
   7. Countdown to Muhurtham
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
      container.innerHTML = '<p class="countdown-done">The big day is here! 🎉</p>';
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

/* ============================================================
   8. Guest count + WhatsApp RSVP
   ============================================================ */
(function whatsappRsvp() {
  const input = document.getElementById("guest-count");
  const sendBtn = document.getElementById("send-rsvp");
  const warning = document.getElementById("rsvp-warning");

  input.addEventListener("input", () => {
    state.guests = input.value.trim();
  });

  sendBtn.addEventListener("click", () => {
    // Gentle validation
    if (!state.squad) {
      warning.textContent = "Please pick the bride's or groom's squad above first 💛";
      document.getElementById("squad").scrollIntoView({ behavior: "smooth" });
      return;
    }
    const answered = Object.keys(state.rsvp).length;
    if (answered === 0) {
      warning.textContent = "Please mark Yes or No for at least one event above 🙏";
      document.getElementById("rsvp").scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Build the WhatsApp message
    const squadLabel = state.squad === "bride" ? "Bride's Squad (Team Swetha)" : "Groom's Squad (Team Akshith)";
    const lines = [
      "💍 *RSVP — Swetha & Akshith's Wedding*",
      "",
      `🌟 Squad: ${squadLabel}`,
      "",
      "*Events:*",
      ...EVENTS.map((ev) => {
        const ans = state.rsvp[ev.id];
        const mark = ans === "yes" ? "✅ Yes" : ans === "no" ? "❌ No" : "— No response";
        return `${ev.icon} ${ev.name}: ${mark}`;
      }),
      "",
      `👥 Number of guests: ${state.guests || "Not specified"}`,
    ];

    const number = WHATSAPP[state.squad];
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });
})();
