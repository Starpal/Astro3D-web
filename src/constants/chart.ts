import type { HouseSystem } from "../types/backend";
import type { MinorAspectType } from "../types/astrology";

export const HOUSE_SYSTEMS: { value: HouseSystem; label: string }[] = [
  { value: "placidus", label: "Placidus" },
  { value: "whole-sign", label: "Whole Sign" },
  { value: "koch", label: "Koch" },
  { value: "equal", label: "Equal" },
  { value: "campanus", label: "Campanus" },
  { value: "regiomontanus", label: "Regiomontanus" },
  { value: "porphyry", label: "Porphyry" },
  { value: "topocentric", label: "Topocentric" },
];

export const ASPECT_DEFINITIONS: {
  type: string;
  angle: number;
  orb: number;
  color: string;
}[] = [
  { type: "conjunction", angle: 0, orb: 10, color: "#AAAAAA" },
  { type: "opposition", angle: 180, orb: 10, color: "#FF4444" },
  { type: "trine", angle: 120, orb: 8, color: "#44FF88" },
  { type: "square", angle: 90, orb: 6, color: "#FF8844" },
  { type: "sextile", angle: 60, orb: 6, color: "#4488FF" },
  { type: "semisextile", angle: 30, orb: 3, color: "#66CCAA" },
  { type: "quincunx", angle: 150, orb: 2, color: "#B266FF" },
  // Opzionali:
  { type: "sesquiquadrate", angle: 135, orb: 2, color: "#FF66AA" },
  { type: "quintile", angle: 72, orb: 2, color: "#AA66FF" },
];

export const MINOR_ASPECTS: MinorAspectType[] = [
  "quincunx",
  "semisextile",
  "semisquare",
  "sesquisquare",
  "quintile",
  "biquintile",
];

export const OOB_THRESHOLD = 23 + 27 / 60 + 1.01 / 3600; // ≈ 23.450281°

/**
 * PlanetKey — tipo per i pianeti nel chart
 * (usa lowercase per consistency con backend)
 */
export type PlanetKey = 
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

/**
 * AspectKey — tipo per tutti gli aspetti (longitudinali + declination)
 */
export type AspectKey =
  | 'conjunction'
  | 'opposition'
  | 'trine'
  | 'square'
  | 'sextile'
  | 'quincunx'
  | 'semisextile'
  | 'semisquare'
  | 'sesquisquare'
  | 'quintile'
  | 'biquintile'
  | 'parallel'
  | 'contraparallel';

/**
 * SPHERE_RADIUS — raggio della sfera celeste per Three.js
 */
export const SPHERE_RADIUS = 10.5;

/**
 * OBLIQUITY — inclinazione assiale terrestre (tropici)
 */
export const OBLIQUITY = 23.44;

