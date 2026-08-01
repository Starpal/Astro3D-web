
/**
 * Global theme constants for Astro3D Web
 */

export const Colors = {
  light: {
    text: "#11181C",
    background: "#ffffff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
  },

  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#ffffff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#ffffff",
  },
};

export const Fonts = {
  sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

  serif: "Georgia, 'Times New Roman', serif",

  rounded:
    "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",

  mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

export const PLANET_COLORS: Record<string, string> = {
  sun: "#FFD700",

  moon: "#C0C0C0",

  mercury: "#A0A0A0",

  venus: "#FFB6C1",

  mars: "#FF4500",

  jupiter: "#FFA500",

  saturn: "#DAA520",

  uranus: "#7FFFD4",

  neptune: "#4169E1",

  pluto: "#9370DB",
};

export const PLANET_SYMBOLS: Record<string, string> = {
  sun: "☉",

  moon: "☽",

  mercury: "☿",

  venus: "♀",

  mars: "♂",

  jupiter: "♃",

  saturn: "♄",

  uranus: "♅",

  neptune: "♆",

  pluto: "♇",
};

export const ZODIAC_GLYPHS = [
  "♈︎",

  "♉︎",

  "♊︎",

  "♋︎",

  "♌︎",

  "♍︎",

  "♎︎",

  "♏︎",

  "♐︎",

  "♑︎",

  "♒︎",

  "♓︎",
];

export const PLANET_GLYPH: Record<string, string> = PLANET_SYMBOLS;

export const ASPECT_GLYPH: Record<string, string> = {
  conjunction: '☌',
  opposition: '☍',
  trine: '△',
  square: '□',
  sextile: '⚹',
  quincunx: '⚻',
  semisextile: '⚺',
  semisquare: '∠',
  sesquisquare: '⚼',
  quintile: 'Q',
  biquintile: 'bq',
  parallel: '||',
  contraparallel: '⊥',
};

export const ASPECT_COLOR: Record<string, string> = {
  conjunction: '#FF6B6B',
  opposition: '#EE5A6F',
  trine: '#51CF66',
  square: '#FFD43B',
  sextile: '#74C0FC',
  quincunx: '#B197FC',
  semisextile: '#91A7FF',
  semisquare: '#FFB3BA',
  sesquisquare: '#FFCCCB',
  quintile: '#9D84B7',
  biquintile: '#A5D8FF',
  parallel: '#5DCCCC',
  contraparallel: '#FF8A80',
};

export const ASPECT_NAME: Record<string, string> = {
  conjunction: 'Conjunction',
  opposition: 'Opposition',
  trine: 'Trine',
  square: 'Square',
  sextile: 'Sextile',
  quincunx: 'Quincunx',
  semisextile: 'Semi-sextile',
  semisquare: 'Semi-square',
  sesquisquare: 'Sesquisquare',
  quintile: 'Quintile',
  biquintile: 'Biquintile',
  parallel: 'Parallel',
  contraparallel: 'Contraparallel',
};

export const SPHERE_RADIUS = 10;
