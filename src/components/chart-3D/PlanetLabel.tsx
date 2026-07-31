import React from "react";
import { Box, Typography } from "@mui/material";

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
    <Box
      onClick={() => onSelect(planetKey)}
      sx={{
        position: "absolute",
        left: x - 18,
        top: y - 18,
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          border: `${halo ? 2.5 : 0.75}px solid ${ringColor}`,

          opacity: halo ? halo.opacity : 0.7,

          backgroundColor: "rgba(10,10,18,0.65)",

          transition: "all 0.2s ease",

          "&:hover": {
            transform: "scale(1.15)",
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {symbol}
        </Typography>
      </Box>
    </Box>
  );
}

export default React.memo(PlanetLabel);
