import React from "react";

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import {
  findChartObject,
  getObjectColor,
  getObjectSymbol,
} from "../../utils/chart/chartHelpers";

import type { NatalChart } from "../../types/astrology";

interface Props {
  visible: boolean;
  onClose: () => void;
  chart: NatalChart;
}

function PlanetaryPositionsModal({ visible, onClose, chart }: Props) {
  return (
    <Dialog
      open={visible}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: "#12121E",
          borderRadius: 3,
          border: "1px solid #2A2A3E",
          maxHeight: "85vh",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #1A1A2E",
        }}
      >
        <Typography
          sx={{
            color: "#E8E0D0",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          📊 Planetary Positions
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#666",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          overflowY: "auto",
        }}
      >
        {/* PLANET TABLE */}

        <Box
          sx={{
            background: "#0A0A12",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* HEADER ROW */}

          <TableRow header>
            <TableCell flex={0.5}>Type</TableCell>

            <TableCell flex={1.1}>Object</TableCell>

            <TableCell flex={1}>Sign</TableCell>

            <TableCell flex={0.8}>Degrees</TableCell>

            <TableCell flex={0.8}>Declination</TableCell>

            <TableCell flex={0.5}>House</TableCell>

            <TableCell flex={0.6}>OOB</TableCell>
          </TableRow>

          {chart.objects.map((object) => (
            <TableRow key={object.id}>
              <TableCell flex={0.5} color={getObjectColor(object)}>
                {getObjectSymbol(object)}
              </TableCell>

              <TableCell flex={1.1}>{object.name}</TableCell>

              <TableCell flex={1}>{object.astrology.sign}</TableCell>

              <TableCell flex={0.8}>
                {object.astrology.degree}°{" "}
                {object.astrology.minute.toString().padStart(2, "0")}′
              </TableCell>

              <TableCell flex={0.8}>
                {object.astronomy.declination !== undefined
                  ? `${Math.abs(object.astronomy.declination).toFixed(2)}° ${
                      object.astronomy.declination >= 0 ? "N" : "S"
                    }`
                  : "-"}
              </TableCell>

              <TableCell flex={0.5}>{object.astrology.house}</TableCell>

              <TableCell
                flex={0.6}
                color={object.astrology.oob ? "#C8A96E" : "#444"}
              >
                {object.astrology.oob ? "⚡" : ""}
              </TableCell>
            </TableRow>
          ))}
        </Box>

        {/* LONGITUDINAL ASPECTS */}

        <AspectSection title="🔗 Aspetti Longitudinali">
          {chart.aspects.longitudinal.length === 0 ? (
            <Typography sx={emptyText}>
              Nessun aspetto longitudinale.
            </Typography>
          ) : (
            chart.aspects.longitudinal.map((aspect, index) => {
              const objectA = findChartObject(chart, aspect.objectA);

              const objectB = findChartObject(chart, aspect.objectB);

              if (!objectA || !objectB) return null;

              return (
                <Box
                  key={`${aspect.objectA}-${aspect.objectB}-${index}`}
                  sx={aspectRow}
                >
                  <Typography sx={aspectText}>
                    {objectA.name} {aspect.type} {objectB.name}
                  </Typography>

                  <Typography sx={aspectText}>
                    orb {aspect.orb.toFixed(2)}°
                  </Typography>
                </Box>
              );
            })
          )}
        </AspectSection>

        {/* DECLINATION */}

        <AspectSection title="↕ Aspetti di Declinazione">
          {chart.aspects.declination.length === 0 ? (
            <Typography sx={emptyText}>
              Nessun aspetto di declinazione.
            </Typography>
          ) : (
            chart.aspects.declination.map((aspect, index) => {
              const objectA = findChartObject(chart, aspect.objectA);

              const objectB = findChartObject(chart, aspect.objectB);

              if (!objectA || !objectB) return null;

              return (
                <Box
                  key={`${aspect.objectA}-${aspect.objectB}-${index}`}
                  sx={aspectRow}
                >
                  <Typography sx={aspectText}>
                    {objectA.name} {aspect.type} {objectB.name}
                  </Typography>

                  <Typography
                    sx={{
                      ...aspectText,
                      color: aspect.type === "parallel" ? "#4488FF" : "#FF4444",
                    }}
                  >
                    orb {aspect.orb.toFixed(2)}°
                  </Typography>
                </Box>
              );
            })
          )}
        </AspectSection>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(PlanetaryPositionsModal);

/* ---------------- HELPERS ---------------- */

function TableRow({
  children,
  header = false,
}: {
  children: React.ReactNode;
  header?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        py: 1,
        px: 1,
        borderBottom: "1px solid #1A1A2E",
        background: header ? "#1A1A2E" : "#0A0A12",
      }}
    >
      {children}
    </Box>
  );
}

function TableCell({
  children,
  flex,
  color,
}: {
  children: React.ReactNode;
  flex: number;
  color?: string;
}) {
  return (
    <Typography
      sx={{
        flex,
        color: color ?? "#A0A0B0",
        fontSize: 11,
        textAlign: "center",
      }}
    >
      {children}
    </Typography>
  );
}

function AspectSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        mt: 2,
        p: 1.5,
        background: "#0A0A12",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{
          color: "#E8E0D0",
          fontWeight: 600,
          fontSize: 14,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}

const emptyText = {
  color: "#444",
  fontSize: 12,
  textAlign: "center",
  py: 1,
};

const aspectRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 2,
  py: 0.8,
  borderBottom: "1px solid #1A1A2E",
};

const aspectText = {
  color: "#A0A0B0",
  fontSize: 12,
};
