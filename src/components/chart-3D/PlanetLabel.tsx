import React from "react";

export interface PlanetHalo {
  color: string;
  opacity: number;
}

interface Props {
  planetKey: string;
  symbol: string;
  x: number;
  y: number;
  color: string;
  halo: PlanetHalo | null;
  onSelect: (key: string) => void;
}

function PlanetLabel({
  planetKey,
  symbol,
  x,
  y,
  color,
  halo,
  onSelect,
}: Props) {
  const ringColor = halo ? "#ead362e0" : color;

  return (
    <div
      style={{
        ...styles.planetLabel,
        left: x - 18,
        top: y - 18,
        cursor: "pointer",
      }}
      onClick={() => onSelect(planetKey)}
    >
      <div
        style={{
          ...styles.planetRing,
          borderColor: ringColor,
          borderWidth: halo ? 2.5 : 0.75,
          borderStyle: "solid",
          opacity: halo ? halo.opacity : 0.7,
        }}
      >
        <span style={{ ...styles.planetSymbol, color }}>{symbol}</span>
      </div>
    </div>
  );
}

export default React.memo(PlanetLabel);

const styles: Record<string, React.CSSProperties> = {
  planetLabel: {
    position: "absolute",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  planetRing: {
    width: 30,
    height: 30,
    minWidth: 30,
    minHeight: 30,
    maxWidth: 30,
    maxHeight: 30,
    boxSizing: "border-box",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10,10,18,0.65)",
  },
  planetSymbol: {
    fontSize: 13,
    fontWeight: 700,
  },
};


