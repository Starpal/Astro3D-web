import { Box, Typography } from "@mui/material";

export function SectionHeader({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 1.25,
        mt: 2,
      }}
    >
      <Box
        sx={{
          width: 3,
          height: 14,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />

      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          color,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
