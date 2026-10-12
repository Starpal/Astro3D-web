// AspectLayer.tsx
import React from "react";
import type { NatalChart, MinorAspectType } from "../../../types/astrology";
import { MINOR_ASPECTS } from "../../../constants/chart";
import type { PlanetVisual } from "../Chart2D";
import { zodiacAngle } from "../Chart2D";
import './AspectLayer.css';

type LongitudinalAspect = NatalChart["aspects"]["longitudinal"][number] & {
  color: string;
};

interface Props {
  aspects: LongitudinalAspect[];
  planets: PlanetVisual[];
  ascendant: number;
  radius: number;
  toXY: (angle: number, r: number) => { x: number; y: number };
}

function AspectLayer({ aspects, planets, ascendant, radius, toXY }: Props) {
  // Posizione reale (non spalmata) del pianeta sul bordo dello zodiaco: è
  // il punto a cui si agganciano le linee degli aspetti, indipendentemente
  // da dove il glifo sia stato spostato dal decluttering in PlanetLayer.
  const getTruePosition = (planet: PlanetVisual) => {
    const angle = zodiacAngle(planet.longitude, ascendant);
    return toXY(angle, radius * 0.84);
  };

  return (
    <>
      {aspects.map((aspect, index) => {
        const p1 = planets.find((p) => p.id === aspect.objectA);
        const p2 = planets.find((p) => p.id === aspect.objectB);
        if (!p1 || !p2) return null;

        const pos1 = getTruePosition(p1);
        const pos2 = getTruePosition(p2);

        // Opacity basata su quanto l'orb è preciso (orb minore = più marcato)
        const opacity = Math.max(0.25, 1 - aspect.orb / 8);
        const isDashed = MINOR_ASPECTS.includes(aspect.type as MinorAspectType);

        return (
          <line
            key={index}
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={aspect.color}
            strokeWidth={1.5}
            strokeOpacity={opacity}
            className={`aspect-line ${isDashed ? 'aspect-line-dashed' : 'aspect-line-solid'}`}
          />
        );
      })}
    </>
  );
}

export default React.memo(AspectLayer);