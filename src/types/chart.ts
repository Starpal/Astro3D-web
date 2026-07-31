// --- Shape interna usata dal disegno --------------------------------------
// Normalizziamo ogni ChartObject rilevante in questa forma più snella,
// così tutta la logica sotto (aspetti, decluttering, posizionamento) non
// deve conoscere la struttura di astronomy/astrology del backend.
export interface PlanetVisual {
  id: string;
  longitude: number;
  symbol: string;
  color: string;
  isRetrograde: boolean;
}