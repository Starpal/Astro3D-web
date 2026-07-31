import { Box, Typography } from "@mui/material";

interface Props {
  label: string;
  value: string;
}

export function DataRow({ label, value }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          color: "#555",
          fontSize: 12,
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#E8E0D0",
          fontSize: 12,
          fontWeight: 600,
          textAlign: "right",
          flexShrink: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
