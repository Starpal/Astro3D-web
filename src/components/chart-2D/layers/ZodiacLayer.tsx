import { ZODIAC_GLYPHS } from "../../../constants/theme";
import { zodiacAngle } from "../Chart2D";
import { Fonts } from "../../../constants/theme";

interface Props {
  center: number;
  radius: number;
  ascendant: number;
  toXY: (angle: number, r: number) => { x: number; y: number };
}

export default function ZodiacLayer({
  center,
  radius,
  ascendant,
  toXY,
}: Props) {
  return (
    <>
      {/* Background */}
      <circle cx={center} cy={center} r={radius + 10} fill="#0A0A1A" />

      {/* Outer Ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#334466"
        strokeWidth={1.5}
        opacity={0.8}
      />

      {/* Inner Ring */}
      <circle
        cx={center}
        cy={center}
        r={radius * 0.85}
        fill="none"
        stroke="#C8A96E"
        strokeWidth={1}
        opacity={0.4}
        strokeDasharray="4 4"
      />

      {/* Zodiac Sign Lines */}
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = zodiacAngle(index * 30, ascendant);

        const start = toXY(angle, radius * 0.85);

        const end = toXY(angle, radius);

        return (
          <line
            key={`line-${index}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#1A1A2E"
            strokeWidth={1}
          />
        );
      })}

      {/* Zodiac Glyphs */}
      {ZODIAC_GLYPHS.map((glyph, index) => {
        const angle = zodiacAngle(index * 30 + 15, ascendant);

        const pos = toXY(angle, radius * 0.925);
        return (
          <text
            key={`glyph-${index}`}
            x={pos.x}
            y={pos.y}
            fill="#C8A96E"
            fontSize={16}
            fontWeight={700}
            fontFamily={Fonts.rounded}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              userSelect: "none",
            }}
          >
            {glyph}
          </text>
        );
      })}
    </>
  );
}
