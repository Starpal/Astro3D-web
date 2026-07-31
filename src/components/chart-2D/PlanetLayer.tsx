// PlanetLayer.tsx
import React, { useCallback } from "react";
import type { PlanetVisual } from "./Chart2D";
import { zodiacAngle } from "./Chart2D";

interface Props {
  planets: PlanetVisual[];
  ascendant: number;
  radius: number;
  spreadRadiusPx: number;
  spreadOffsets: Record<string, number>;
  center: number;
  toXY: (angle: number, r: number) => { x: number; y: number };
  onSelectPlanet: (id: string) => void;
}

function PlanetLayer({
  planets,
  ascendant,
  radius,
  spreadRadiusPx,
  spreadOffsets,
  toXY,
  onSelectPlanet,
}: Props) {
  // Posizione del glifo: sulla circonferenza degli astri, con l'eventuale
  // offset di decluttering per evitare overlap in uno stellium.
  const getPlanetPosition = useCallback(
    (planet: PlanetVisual) => {
      const baseAngle = zodiacAngle(planet.longitude, ascendant);
      const angle = baseAngle + (spreadOffsets[planet.id] ?? 0);
      return toXY(angle, spreadRadiusPx);
    },
    [ascendant, spreadOffsets, spreadRadiusPx, toXY],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      onSelectPlanet(id);
    },
    [onSelectPlanet],
  );

  return (
    <>
      {planets.map((planet) => {
        const pos = getPlanetPosition(planet);

        const angle = zodiacAngle(planet.longitude, ascendant);
        const inner = toXY(angle, radius * 0.84);
        const outer = toXY(angle, radius * 0.86);

        const ringR = 15;
        const hasOffset = Math.abs(spreadOffsets[planet.id] ?? 0) > 0.01;
        const tapR = ringR + 6; // margine extra per facilitare il click

        return (
          <g key={planet.id}>
            {/* Tick verso lo zodiaco (resta sulla posizione reale, lo
                stesso punto a cui si agganciano gli aspetti) */}
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={planet.color}
              strokeWidth={1}
              strokeOpacity={0.7}
            />

            {/* Leader line: collega la posizione reale al glifo spostato
                per evitare overlap in uno stellium */}
            {hasOffset && (
              <line
                x1={outer.x}
                y1={outer.y}
                x2={pos.x}
                y2={pos.y}
                stroke={planet.color}
                strokeWidth={0.75}
                strokeOpacity={0.35}
                strokeDasharray="2 2"
              />
            )}

            {/* Glifo del pianeta, colorato, senza cerchio intorno */}
            <text
              x={pos.x}
              y={pos.y}
              fill={planet.color}
              fontSize={20}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ pointerEvents: "none" }}
            >
              {planet.symbol}
            </text>

            {/* Retrogrado */}
            {planet.isRetrograde && (
              <text
                x={pos.x + ringR - 2}
                y={pos.y + ringR - 2}
                fill="#C8A96E"
                fontSize={12}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ pointerEvents: "none" }}
              >
                ℞
              </text>
            )}

            {/* Hitbox invisibile per il click, sopra tutto — equivalente
                web del TouchableOpacity separato dell'originale */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={tapR}
              fill="transparent"
              onClick={(e) => handleClick(e, planet.id)}
              style={{ cursor: "pointer" }}
            />
          </g>
        );
      })}
    </>
  );
}

export default React.memo(PlanetLayer);