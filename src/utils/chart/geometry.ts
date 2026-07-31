import type { PlanetVisual } from "../../types/chart";

export function createZodiacAngle(ascendant: number) {
  return (longitude: number) => {
    return (ascendant - longitude + 360) % 360;
  };
}


export function createToXY(center: number) {
  return (angle: number, radius: number) => {
    const rad = ((angle + 180) * Math.PI) / 180;

    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };
}


/**
 * Posizione del glifo (con eventuale decluttering).
 */
export function getPlanetPosition(
  planet: PlanetVisual,
  zodiacAngle: (longitude: number) => number,
  toXY: (angle: number, radius: number) => {
    x: number;
    y: number;
  },
  spreadRadius: number,
  spreadOffsets: Record<string, number>,
) {
  const angle =
    zodiacAngle(planet.longitude) +
    (spreadOffsets[planet.id] ?? 0);

  return toXY(angle, spreadRadius);
}


/**
 * Posizione astronomica reale del pianeta.
 * Usata per tick e aspetti.
 */
export function getTruePosition(
  planet: PlanetVisual,
  zodiacAngle: (longitude: number) => number,
  toXY: (angle: number, radius: number) => {
    x: number;
    y: number;
  },
  radius: number,
) {
  const angle = zodiacAngle(planet.longitude);

  return toXY(
    angle,
    radius * 0.84
  );
}


/* -------------------------------------------------------------------------- */
/*                                DECLUTTERING                                */
/* -------------------------------------------------------------------------- */

const GLYPH_DIAMETER_PX = 18;
const GLYPH_MARGIN_PX = 2;


export function computeDeclutteredOffsets(
  planets: PlanetVisual[],
  zodiacAngle: (longitude: number) => number,
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
    (2 *
      Math.asin(
        Math.min(1, stepPx / (2 * spreadRadiusPx))
      ) *
      180) /
    Math.PI;


  const items = planets.map((planet) => ({
    key: planet.id,
    angle: zodiacAngle(planet.longitude),
  }));


  const sorted = [...items].sort(
    (a, b) => a.angle - b.angle
  );


  const n = sorted.length;


  let cutIndex = 0;
  let maxGap = -Infinity;


  for (let i = 0; i < n; i++) {

    const current = sorted[i].angle;

    const next =
      sorted[(i + 1) % n].angle;


    const gap =
      i === n - 1
        ? next + 360 - current
        : next - current;


    if (gap > maxGap) {
      maxGap = gap;
      cutIndex = (i + 1) % n;
    }
  }


  const ordered = Array.from(
    { length: n },
    (_, i) => sorted[(cutIndex + i) % n],
  );


  const unwrapped = [
    {
      key: ordered[0].key,
      angle: ordered[0].angle,
    },
  ];


  let previous = ordered[0].angle;


  for (let i = 1; i < n; i++) {

    let angle = ordered[i].angle;

    while (angle < previous) {
      angle += 360;
    }

    unwrapped.push({
      key: ordered[i].key,
      angle,
    });

    previous = angle;
  }


  const forward = unwrapped.map(
    (u) => u.angle
  );


  for (let i = 1; i < n; i++) {

    if (
      forward[i] - forward[i - 1] <
      minSpacingDeg
    ) {
      forward[i] =
        forward[i - 1] + minSpacingDeg;
    }
  }


  const backward = unwrapped.map(
    (u) => u.angle
  );


  for (let i = n - 2; i >= 0; i--) {

    if (
      backward[i + 1] - backward[i] <
      minSpacingDeg
    ) {
      backward[i] =
        backward[i + 1] - minSpacingDeg;
    }
  }


  for (let i = 0; i < n; i++) {

    const finalAngle =
      (forward[i] + backward[i]) / 2;


    offsets[unwrapped[i].key] =
      finalAngle - ordered[i].angle;
  }


  return offsets;
}