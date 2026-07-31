import { Box, Typography } from "@mui/material";

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />

      <Typography
        sx={{
          color: "#666",
          fontSize: 11,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function Legend() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        py: 1.5,
        borderBottom: "1px solid #1A1A2E",
      }}
    >
      <LegendItem color="#3DA5FF" label="Parallel" />

      <LegendItem color="#FF3B3B" label="Contraparallel" />

      <LegendItem color="#C8A96E" label="OOB" />
    </Box>
  );
}
