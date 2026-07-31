import { PLANET_SYMBOLS } from "@/constants/theme";

import type {
  Aspect,
  ChartObject,
  DeclinationAspect,
  NatalChart,
} from "@/types/astrology";

/** Trova un oggetto della carta per id (es. "sun", "moon", "asc"...). */
export function findChartObject(
  chart: NatalChart,
  id: string,
): ChartObject | undefined {
  return chart.objects.find((object) => object.id === id);
}

/** Simbolo di fallback per un tipo di oggetto celeste quando manca in PLANET_SYMBOLS. */
function getObjectTypeSymbol(type: ChartObject["type"]): string {
  switch (type) {
    case "planet":
      return "●";
    case "asteroid":
      return "⚬";
    case "point":
      return "✦";
    case "arabic_part":
      return "⊙";
    case "angle":
      return "⌖";
    default:
      return "●";
  }
}

/** Simbolo da mostrare accanto al nome (gerarchia: id → tipo → default). */
export function getObjectSymbol(object: ChartObject): string {
  return PLANET_SYMBOLS[object.id] ?? getObjectTypeSymbol(object.type);
}

/** Colore di fallback per un tipo di oggetto celeste. */
function getTypeColor(type: ChartObject["type"]): string {
  switch (type) {
    case "planet":
      return "#E8E0D0";
    case "asteroid":
      return "#B8A8C8";
    case "point":
      return "#8FB8FF";
    case "arabic_part":
      return "#C8A96E";
    case "angle":
      return "#A5D6A7";
    default:
      return "#E8E0D0";
  }
}

/**
 * Colore specifico per id noto (pianeti classici, nodi, angoli);
 * cade sul fallback per tipo se l'id non è mappato.
 */
export function getObjectColor(object: ChartObject): string {
  const colors: Record<string, string> = {
    sun: "#C8A96E",
    moon: "#D0D0D8",
    mercury: "#8FB8FF",
    venus: "#FF9FB2",
    mars: "#FF6B6B",
    jupiter: "#D9A441",
    saturn: "#9C8B6A",
    uranus: "#65D6D6",
    neptune: "#7B8CFF",
    pluto: "#B078D1",
    chiron: "#A5A5A5",
    north_node: "#C8A96E",
    south_node: "#C8A96E",
    ascendant: "#C8A96E",
    descendant: "#C8A96E",
    mc: "#C8A96E",
    ic: "#C8A96E",
    vertex: "#C8A96E",
    anti_vertex: "#C8A96E",
  };

  return colors[object.id] ?? getTypeColor(object.type);
}

/** Id dell'altro estremo di un aspetto, dato l'id selezionato. */
export function getOtherObjectId(
  aspect: Aspect | DeclinationAspect,
  selectedObjectId: string,
): string {
  return aspect.objectA === selectedObjectId ? aspect.objectB : aspect.objectA;
}
