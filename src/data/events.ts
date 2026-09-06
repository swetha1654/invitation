// ─── Easy-edit: events, card messages, scratch themes, SVG art ──────────────
import { CARD_IMAGE_URLS } from "../assets/cards";

export interface WeddingEvent {
  id: string;
  icon: string;
  name: string;
  when: string;
  where: string;
}

export interface ScratchTheme {
  stops: [string, string, string];
  speck?: [number, number, number];
  hint: string;
  taps?: number;
  flowers?: boolean;
  powder?: boolean;
  curtain?: boolean;
}

export const ALL_EVENTS: WeddingEvent[] = [
  {
    id: "haldi",
    icon: "🌻",
    name: "Haldi",
    when: "Sunday, 29 Nov 2026 · 11 AM – 3 PM",
    where: "The backyard, Farmhouse Collective",
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
    when: "Saturday, 5 Dec 2026 · 5 PM",
    where: "Sindhoor Convention Hall, JP Nagar",
  },
  {
    id: "muhurtham",
    icon: "🕉️",
    name: "Muhurtham",
    when: "Oonjal Muhurtham · 6:30 AM\nMuhurtham · 8:44 AM",
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

export interface EventInfoSection {
  title: string;
  body: string;
}

/** "A little about this" modal copy, in our own words */
export const EVENT_INFO: Record<string, string[]> = {
  haldi: [
    "A little turmeric, lots of laughter, and blessings from our families. Haldi is a simple and joyful way to begin the wedding celebrations, with loved ones coming together to apply turmeric and share their blessings with us.",
    "It's one of those traditions that brings everyone together before the big day, with plenty of laughter, photos, and a little bit of turmeric everywhere.",
  ],
  varapooje: [
    "A special welcome to the groom and his family as our two families come together. Varapooje is a traditional ceremony where the bride's family welcomes the groom and celebrates his arrival.",
    "More than anything, it's a warm beginning to bringing two families together, with blessings, traditions, and lots of excitement for what's to come.",
  ],
  sangeeth: [
    "An evening of music, dance, laughter and a little friendly competition between the two families. Sangeeth is all about coming together, putting on a show, and celebrating before the wedding day arrives.",
    "There'll be songs, performances, dancing, and hopefully a few surprises along the way. Mostly, it's an excuse for everyone to have some fun together.",
  ],
  reception: [
    "An evening to celebrate the newlyweds with everyone we love. The formalities are behind us, so it's time to relax, catch up with family and friends, and simply enjoy the evening.",
    "Good food, happy conversations, lots of pictures, and plenty of blessings. A celebration of this new chapter with everyone who made the journey special.",
  ],
};

/** Multi-part rituals shown as sections inside a single event's modal */
export const EVENT_INFO_SECTIONS: Record<string, EventInfoSection[]> = {
  muhurtham: [
    {
      title: "Kashi Yatre",
      body: "A playful little ritual where the groom sets off on a symbolic journey, only to be brought back and reminded that there's a wedding waiting for him. It's a light-hearted moment in the middle of all the wedding traditions, with the families joining in on the fun.",
    },
    {
      title: "Oonjal",
      body: "The bride and groom come together on the swing, surrounded by music, flowers, and blessings from their families. It's a beautiful and relaxed part of the wedding, filled with traditional songs, laughter, and a few playful moments shared with the family.",
    },
    {
      title: "Muhurtham",
      body: "At the auspicious moment, the thali is tied and two lives officially begin their journey together. Surrounded by family and loved ones, this is the moment we've all been waiting for. It is the heart of the wedding ceremony and the beginning of a new chapter together.",
    },
    {
      title: "Nalangu",
      body: "A light-hearted celebration with playful rituals, laughter, and plenty of interaction between the bride and groom and their families. It's a chance to relax, have some fun, and enjoy the lighter side of the wedding celebrations together.",
    },
  ],
};

export const CARD_MESSAGES: Record<string, string> = {
  haldi: "Join us to celebrate our Haldi ceremony!",
  varapooje: "Bless us at our Varapooje",
  sangeeth: "Dance the night away at our Sangeeth",
  muhurtham: "Witness us tie the knot at our Muhurtham",
  reception: "Celebrate with us at our Reception",
};

/** Resolved Vite asset URLs — swap images in src/assets/cards/ */
export const CARD_IMAGES: Partial<Record<string, string>> = CARD_IMAGE_URLS;

export const SCRATCH_THEMES: Record<string, ScratchTheme> = {
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

/** Hand-drawn SVG scenes — shown when no card image is available */
export const CARD_SVG_ART: Partial<Record<string, string>> = {
  sangeeth: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">
    <rect width="320" height="240" fill="#E9D9F2"/>
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
    <path d="M88 47 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5 -4.5 l-4.5 -1.5 l4.5 -1.5 Z" fill="#C9A227"/>
  </svg>`,
};
