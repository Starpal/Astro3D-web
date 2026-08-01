import React, { useCallback, useMemo, useRef, useState } from "react";
import type { NatalChart, ChartObject } from "../../types/astrology";
import { PLANET_COLORS, PLANET_SYMBOLS } from "../../constants/theme";
import { ASPECT_DEFINITIONS, type PlanetKey } from "../../constants/chart";

import ZodiacLayer from "./layers/ZodiacLayer";
import HouseLayer from "./layers/HouseLayer";
import AspectLayer from "./layers/AspectLayer";
import PlanetLayer from "./layers/PlanetLayer";

interface Props {
  chart: NatalChart;
  onSelectPlanet?: (planet: PlanetKey | null) => void;
}

const DEFAULT_CHART_SIZE = 600;
const RADIUS_RATIO = 0.48;

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

export function zodiacAngle(longitude: number, ascendant: number): number {
  return (ascendant - longitude + 360) % 360;
}

// --- Shape interna condivisa da tutti i layer -----------------------------
export interface PlanetVisual {
  id: string;
  longitude: number;
  symbol: string;
  color: string;
  isRetrograde: boolean;
}

function toPlanetVisual(obj: ChartObject): PlanetVisual {
  return {
    id: obj.id,
    longitude: obj.astronomy.longitude,
    symbol: PLANET_SYMBOLS[obj.id] ?? "●",
    color: PLANET_COLORS[obj.id] ?? "#888888",
    isRetrograde: obj.astrology.retrograde,
  };
}

export function getAspectColor(type: string): string {
  const def = ASPECT_DEFINITIONS.find((d) => d.type === type);
  return def?.color || "#888888";
}

// --- Layout senza sovrapposizioni (decluttering) --------------------------
// Invariata rispetto all'originale — resta qui perché è puro calcolo
// geometrico condiviso (serve sia a PlanetLayer per il posizionamento dei
// glifi, sia potenzialmente ad AspectLayer se in futuro vorremo evidenziare
// stellium).
const GLYPH_DIAMETER_PX = 9 * 2;
const GLYPH_MARGIN_PX = 2;

export function computeDeclutteredOffsets(
  planets: PlanetVisual[],
  ascendant: number,
  spreadRadiusPx: number,
): Record<string, number> {
  const offsets: Record<string, number> = {};

  if (planets.length <= 1) {
    planets.forEach((p) => {
      offsets[p.id] = 0;
    });
    return offsets;
  }

  const stepPx = GLYPH_DIAMETER_PX + GLYPH_MARGIN_PX;
  const minSpacingDeg =
    (2 * Math.asin(Math.min(1, stepPx / (2 * spreadRadiusPx))) * 180) / Math.PI;

  const items = planets.map((p) => ({
    key: p.id,
    angle: zodiacAngle(p.longitude, ascendant),
  }));

  const sorted = [...items].sort((a, b) => a.angle - b.angle);
  const n = sorted.length;

  let cutIndex = 0;
  let maxGap = -Infinity;
  for (let i = 0; i < n; i++) {
    const curr = sorted[i].angle;
    const next = sorted[(i + 1) % n].angle;
    const gap = i === n - 1 ? next + 360 - curr : next - curr;
    if (gap > maxGap) {
      maxGap = gap;
      cutIndex = (i + 1) % n;
    }
  }

  const ordered = Array.from(
    { length: n },
    (_, i) => sorted[(cutIndex + i) % n],
  );

  const unwrapped: { key: string; angle: number }[] = [
    { key: ordered[0].key, angle: ordered[0].angle },
  ];
  let prev = ordered[0].angle;
  for (let i = 1; i < n; i++) {
    let a = ordered[i].angle;
    while (a < prev) a += 360;
    unwrapped.push({ key: ordered[i].key, angle: a });
    prev = a;
  }

  const forward = unwrapped.map((u) => u.angle);
  for (let i = 1; i < n; i++) {
    if (forward[i] - forward[i - 1] < minSpacingDeg) {
      forward[i] = forward[i - 1] + minSpacingDeg;
    }
  }

  const backward = unwrapped.map((u) => u.angle);
  for (let i = n - 2; i >= 0; i--) {
    if (backward[i + 1] - backward[i] < minSpacingDeg) {
      backward[i] = backward[i + 1] - minSpacingDeg;
    }
  }

  for (let i = 0; i < n; i++) {
    const finalAngle = (forward[i] + backward[i]) / 2;
    offsets[unwrapped[i].key] = finalAngle - ordered[i].angle;
  }

  return offsets;
}

// --- Helper geometrico condiviso: coordinate polari -> XY nell'SVG --------
export function makeToXY(center: number) {
  return (angle: number, r: number): { x: number; y: number } => {
    const rad = ((angle + 180) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };
}

function Chart2D({ chart, onSelectPlanet }: Props) {
  const ascendant = chart.houses.angles.ascendant;

  const planets = useMemo(
    () =>
      chart.objects.filter((o) => o.id in PLANET_SYMBOLS).map(toPlanetVisual),
    [chart.objects],
  );

  const classicAspects = useMemo(
    () =>
      (chart.aspects?.longitudinal || []).map((aspect) => ({
        ...aspect,
        color: getAspectColor(aspect.type),
      })),
    [chart.aspects?.longitudinal],
  );

  // --- Misura del contenitore (equivalente web di onLayout) --------------
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(DEFAULT_CHART_SIZE);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const size = Math.max(0, Math.min(width, height));
    setContainerSize((prev) => (Math.abs(prev - size) > 1 ? size : prev));
  }, []);

  React.useEffect(() => {
    measure();
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const chartSize = containerSize > 0 ? containerSize : DEFAULT_CHART_SIZE;
  const center = chartSize / 2;
  const radius = chartSize * RADIUS_RATIO;
  const spreadRadiusPx = radius * 0.77;

  const toXY = useMemo(() => makeToXY(center), [center]);

  const spreadOffsets = useMemo(
    () => computeDeclutteredOffsets(planets, ascendant, spreadRadiusPx),
    [planets, ascendant, spreadRadiusPx],
  );

  // Adatta la firma (PlanetKey | null) di onSelectPlanet a quella (string)
  // richiesta da PlanetLayer.
  const handlePlanetSelect = useCallback(
    (id: string) => {
      onSelectPlanet?.(id as PlanetKey | null);
    },
    [onSelectPlanet],
  );

  // --- Zoom/pan web: rotellina per zoom, drag per pan (niente pinch) -----
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.002;
      const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
      if (clamped === ZOOM_MIN) setPan({ x: 0, y: 0 });
      return clamped;
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= ZOOM_MIN) return;
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [zoom, pan],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) return;
    const { startX, startY, panX, panY } = dragState.current;
    setPan({ x: panX + (e.clientX - startX), y: panY + (e.clientY - startY) });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  const handleDoubleClick = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <div ref={containerRef} style={styles.container}>
      <div
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        style={{
          ...styles.zoomWrapper,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          cursor: zoom > ZOOM_MIN ? "grab" : "default",
        }}
      >
        <svg width={chartSize} height={chartSize} style={styles.chart}>
          <ZodiacLayer
            center={center}
            radius={radius}
            ascendant={ascendant}
            toXY={toXY}
          />

          <HouseLayer
            houses={chart.houses.houses}
            ascendant={ascendant}
            radius={radius}
            toXY={toXY}
          />

          <AspectLayer
            aspects={classicAspects}
            planets={planets}
            ascendant={ascendant}
            radius={radius}
            toXY={toXY}
          />

          <PlanetLayer
            planets={planets}
            ascendant={ascendant}
            radius={radius}
            spreadRadiusPx={spreadRadiusPx}
            spreadOffsets={spreadOffsets}
            center={center}
            toXY={toXY}
            onSelectPlanet={handlePlanetSelect}
          />
        </svg>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#0A0A12",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    height: "100%",
    width: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  zoomWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none",
  },
  chart: {
    backgroundColor: "transparent",
    display: "block",
  },
};

export default React.memo(Chart2D);
