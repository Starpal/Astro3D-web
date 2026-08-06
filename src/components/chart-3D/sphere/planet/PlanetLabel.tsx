import { Html } from "@react-three/drei";
import type { PlanetVisual } from "../../Chart3D";

interface PlanetLabelProps {
  planet: PlanetVisual;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * PlanetLabel
 *
 * Badge HTML che visualizza il simbolo del pianeta.
 * Tutte le informazioni (colore, simbolo, ecc.)
 * arrivano già preparate da Chart3D.
 */
export default function PlanetLabel({
  planet,
  selected = false,
  onClick,
}: PlanetLabelProps) {
  const { color, symbol, isOOB } = planet;

  return (
    <Html
      center
      zIndexRange={[20, 0]}
      occlude={false}
      style={{
        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          padding: 0,
          margin: 0,
          outline: "none",
          appearance: "none",
          cursor: "pointer",

          color,

          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: -0.5,

          background: `radial-gradient(circle at 35% 35%, ${color}40, rgba(4,6,18,0.92) 70%)`,
          border: `2px solid ${selected ? color : `${color}88`}`,

          boxShadow: selected
            ? `0 0 28px ${color}dd,
               0 0 14px ${color}88,
               0 0 4px ${color}44,
               inset 0 0 16px ${color}28`
            : `0 0 16px ${color}66,
               0 0 6px ${color}33,
               inset 0 0 8px ${color}14`,

          // backdropFilter: "blur(6px)",
          // WebkitBackdropFilter: "blur(6px)",

          transform: selected ? "scale(1.08)" : "scale(1)",

          transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
        onMouseEnter={(e) => {
          if (selected) return;

          const el = e.currentTarget;

          el.style.transform = "scale(1.05)";
          el.style.boxShadow = `0 0 20px ${color}77,
             0 0 8px ${color}44,
             inset 0 0 10px ${color}18`;
        }}
        onMouseLeave={(e) => {
          if (selected) return;

          const el = e.currentTarget;

          el.style.transform = "scale(1)";
          el.style.boxShadow = `0 0 16px ${color}66,
             0 0 6px ${color}33,
             inset 0 0 8px ${color}14`;
        }}
      >
        {/* Halo if planet is OOB */}
        {isOOB && (
          <>
            <span
              style={{
                position: "absolute",
                inset: "-6px",
                borderRadius: "50%",
                border: "2px solid #F3C969",
                boxShadow: "0 0 12px #F3C969,0 0 24px #F3C969AA",
                pointerEvents: "none",
              }}
            />

            <span
              style={{
                position: "absolute",
                inset: "-10px",
                borderRadius: "50%",
                border: "1px solid #F3C96966",
                pointerEvents: "none",
              }}
            />
          </>
        )}
        {symbol}
      </button>
    </Html>
  );
}
