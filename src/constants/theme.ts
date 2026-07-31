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
