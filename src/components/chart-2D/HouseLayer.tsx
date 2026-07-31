// HouseLayer.tsx
import React from "react";
import type { NatalChart } from "../../types/astrology";
import { Fonts } from "../../constants/theme";
import { zodiacAngle } from "./Chart2D";

type House = NatalChart["houses"]["houses"][number];

interface Props {
  houses: House[];
  ascendant: number;
  radius: number;
  toXY: (angle: number, r: number) => { x: number; y: number };
}

function HouseLayer({ houses, ascendant, radius, toXY }: Props) {
  return (
    <>
      {houses.map((house) => {
        const angle = zodiacAngle(house.cuspLongitude, ascendant);

        const inner = toXY(angle, 0);
        const outer = toXY(angle, radius * 0.85);
        const label = toXY(angle - 15, radius * 0.68);

        return (
          <g key={house.number}>
            {/* House cusp */}
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#8d4fa5"
              strokeOpacity={0.5}
              strokeWidth={0.3}
            />

            {/* House number */}
            <text
              x={label.x}
              y={label.y}
              fill="#777"
              fillOpacity={0.35}
              fontSize={11}
              fontWeight={600}
              fontFamily={Fonts.rounded}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {house.number}
            </text>
          </g>
        );
      })}
    </>
  );
}

export default React.memo(HouseLayer);