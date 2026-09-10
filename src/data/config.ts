// ─── Easy-edit: change names, parents, dates, venue here ───────────────────

export const COUPLE = {
  bride: {
    name: "Swetha S",
    parents: "Daughter of Sri. K. Swaminathan & Smt. Sujatha S",
  },
  groom: {
    name: "Akshith G",
    parents: "Son of Sri. S. Gunasheelan & Smt. Shanthalakshmi",
  },
};

export const WEDDING = {
  /** Displayed in the hero section */
  dateLabel: "5th & 6th December 2026",
  venue: "Sindhoor Convention Hall, JP Nagar, Bengaluru",
  /** ISO 8601 with IST (+05:30) — drives the countdown timer */
  muhurthamISO: "2026-12-06T00:00:00+05:30",
  countdownLabel: "6th December 2026",
};

export const HERO = {
  eyebrow: "திருமண அழைப்பு · ವಿವಾಹ ಆಮಂತ್ರಣ · Wedding Invitation",
  tagline: "With the blessings of our families",
  sub: "request the honour of your presence",
};

export const FOOTER = {
  blessing: "We can't wait to celebrate with you",
};

export interface Venue {
  icon: string;
  name: string;
  mapsUrl: string;
  parking: string;
  transit?: string;
}

export const LOCATIONS: Venue[] = [
  {
    icon: "🌻",
    name: "Farmhouse Collective",
    mapsUrl: "https://maps.app.goo.gl/f2Mi1Z8zpZ9WBXFC7?g_st=ic",
    parking: "Car parking available",
  },
  {
    icon: "🕉️",
    name: "Sindhoor Convention Hall, JP Nagar",
    mapsUrl: "https://maps.app.goo.gl/qe7bHGDuDVBc78yL8?g_st=ic",
    parking: "Valet parking available",
    transit:
      "6 minute walk from Jaya Prakash Nagar metro station (J.P. Nagar metro)",
  },
];
