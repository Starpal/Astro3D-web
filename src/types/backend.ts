// Rispecchia (lato frontend) le interfacce definite in engine.types.ts sul backend.
// Se il backend cambia questi tipi, aggiorna qui di conseguenza.

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface BirthData {
  dateTime: string;
  location: GeoCoordinates;
  placeName: string;
}
/**
 * Sistemi di case astrologiche più comuni.
 * ⚠️ ASSUNZIONE da verificare col backend: qui uso stringhe leggibili.
 * Se swisseph lato server si aspetta i codici a singola lettera
 * (P=Placidus, K=Koch, W=Whole Sign, E=Equal, C=Campanus, R=Regiomontanus,
 * O=Porphyry, T=Topocentric) basta cambiare i valori di questo union type.
 */
export type HouseSystem =
  | "placidus"
  | "koch"
  | "whole-sign"
  | "equal"
  | "campanus"
  | "regiomontanus"
  | "porphyry"
  | "topocentric";

export const ZodiacSystem = {
  TROPICAL: "tropical",
  SIDEREAL: "sidereal",
} as const;

export type ZodiacSystem =
  typeof ZodiacSystem[keyof typeof ZodiacSystem];


export const Ayanamsha = {
  LAHIRI: "lahiri",
  RAMAN: "raman",
  KRISHNAMURTI: "krishnamurti",
  FAGAN_BRADLEY: "fagan_bradley",
} as const;

export type Ayanamsha =
  typeof Ayanamsha[keyof typeof Ayanamsha];

/** Body inviato a POST /chart */
export interface ChartRequestBody {
  birthData: BirthData;

  houseSystem?: HouseSystem;

  zodiac?: ZodiacSystem;

  ayanamsha?: Ayanamsha;
}
