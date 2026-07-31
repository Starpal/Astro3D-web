// Tipi generati a partire dal JSON restituito dal backend astro-engine (swisseph)

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type CelestialObjectType =
  | "planet"
  | "asteroid"
  | "point"
  | "arabic_part"
  | "angle";

export interface NatalChart {
  objects: ChartObject[];
  houses: HousesData;
  aspects: AspectsData;
}

/** Shape esatta della risposta { chart: {...} } che arriva dal backend */
export interface NatalChartResponse {
  chart: NatalChart;
}

export interface Astronomy {
  longitude: number;
  latitude: number;
  distance: number;
  rightAscension?: number;
  declination?: number;
  speedLongitude?: number;
  speedLatitude?: number;
  speedDistance?: number;
}

export interface Astrology {
  sign: ZodiacSign;
  degree: number;
  minute: number;
  second: number;
  retrograde: boolean;
  oob: boolean;
  house: number;
}

export interface ChartObject {
  id: string;
  name: string;
  type: CelestialObjectType;
  astronomy: Astronomy;
  astrology: Astrology;
}
/**
 *  HOUSES
 */
export interface HouseCusp {
  number: number; // 1-12
  cuspLongitude: number;
}

export interface HousesData {
  houses: HouseCusp[];
  angles: ChartAngles;
}

export interface ChartAngles {
  ascendant: number;
  descendant: number;
  mc: number;
  ic: number;
  vertex: number;
  antiVertex: number;
  ascendantDeclination: number;
  descendantDeclination: number;
  mcDeclination: number;
  icDeclination: number;
  vertexDeclination: number;
  antiVertexDeclination: number;
}

/**
 *  ASPECTS
 */

export interface LongitudinalAspect {
  objectA: string; // riferisce ChartObject.id
  objectB: string; // riferisce ChartObject.id
  type: LongitudinalAspectType;
  orb: number;
  motion?: AspectMotion;
}

export type MajorAspectType =
  | "conjunction"
  | "opposition"
  | "trine"
  | "square"
  | "sextile";

export type MinorAspectType =
  | "quincunx"
  | "semisextile"
  | "semisquare"
  | "sesquisquare"
  | "quintile"
  | "biquintile";

export type LongitudinalAspectType = MajorAspectType | MinorAspectType;

export const AspectMotion = {
  APPLYING: "applying",
  SEPARATING: "separating",
} as const;

export type AspectMotion =
  (typeof AspectMotion)[keyof typeof AspectMotion];

export interface DeclinationAspect {
  objectA: string; // riferisce ChartObject.id
  objectB: string; // riferisce ChartObject.id
  type: DeclinationAspectType;
  orb: number;
}

export type DeclinationAspectType = "parallel" | "contraparallel";

export interface AspectsData {
  longitudinal: LongitudinalAspect[];
  declination: DeclinationAspect[];
}
// Visual for aspects drawing
export interface AspectVisual extends LongitudinalAspect {
  color: string;
  isMinor: boolean;
}
