import type { HouseSystem } from "./backend";

export interface NatalChartFormData {
  name: string;
  date: string;
  time: string;
  city: string;
  lat: number;
  lon: number;
  houseSystem: HouseSystem;
}