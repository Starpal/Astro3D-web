import React from "react";

import { Box, Typography, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import type { ChartObject, NatalChart } from "../../types/astrology";

import {
  findChartObject,
  getObjectColor,
  getObjectSymbol,
  getOtherObjectId,
} from "../../utils/chart/chartHelpers";

import { DataRow } from "./DataRow";
import { SectionHeader } from "./SectionHeader";

interface Props {
  chart: NatalChart;
  object: ChartObject;
  onClose: () => void;
}

export default function PlanetaryPanel({ chart, object, onClose }: Props) {
  const longitudinalAspects = chart.aspects.longitudinal.filter(
    (aspect) => aspect.objectA === object.id || aspect.objectB === object.id,
  );

  const declinationAspects = chart.aspects.declination.filter(
    (aspect) => aspect.objectA === object.id || aspect.objectB === object.id,
  );

  const symbol = getObjectSymbol(object);

  const color = getObjectColor(object);

  return (
    <Box
      sx={{
        background: "#12121E",
        borderRadius: "24px 24px 0 0",
        p: 3,
        maxHeight: "85vh",
        overflowY: "auto",
        borderTop: "1px solid #2A2A3E",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
            }}
          />

          <Typography
            sx={{
              fontSize: 24,
              color: "#E8E0D0",
            }}
          >
            {symbol}
          </Typography>

          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "#E8E0D0",
              }}
            >
              {object.name}
            </Typography>

            <Typography
              sx={{
                color: "#555",
                fontSize: 10,
                textTransform: "uppercase",
              }}
            >
              {object.type}
            </Typography>
          </Box>

          {object.astrology.retrograde && (
            <Typography
              sx={{
                color: "#C8A96E",
                fontSize: 16,
              }}
            >
              ℞
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#555",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <SectionHeader label="POSIZIONE ASTROLOGICA" color="#C8A96E" />

      <Box sx={cardStyle}>
        <DataRow label="Segno" value={object.astrology.sign} />

        <DataRow
          label="Grado"
          value={`${object.astrology.degree}° ${object.astrology.minute}' ${object.astrology.second}"`}
        />

        <DataRow label="Casa" value={String(object.astrology.house)} />

        <DataRow
          label="Retrogrado"
          value={object.astrology.retrograde ? "Sì ℞" : "No"}
        />

        <DataRow
          label="Out of Bounds"
          value={object.astrology.oob ? "Sì" : "No"}
        />
      </Box>

      <SectionHeader label="DATI ASTRONOMICI" color="#8FB8FF" />

      <Box sx={cardStyle}>
        <DataRow
          label="Longitudine"
          value={`${object.astronomy.longitude.toFixed(4)}°`}
        />

        <DataRow
          label="Latitudine"
          value={`${object.astronomy.latitude.toFixed(4)}°`}
        />

        {object.astronomy.distance !== undefined && (
          <DataRow
            label="Distanza"
            value={object.astronomy.distance.toFixed(6)}
          />
        )}

        {object.astronomy.rightAscension !== undefined && (
          <DataRow
            label="Ascensione Retta"
            value={object.astronomy.rightAscension.toFixed(4)}
          />
        )}

        {object.astronomy.declination !== undefined && (
          <DataRow
            label="Declinazione"
            value={`${object.astronomy.declination.toFixed(4)}° ${
              object.astronomy.declination >= 0 ? "N" : "S"
            }`}
          />
        )}
      </Box>

      <SectionHeader
        label="OUT OF BOUNDS"
        color={object.astrology.oob ? "C8A96E" : "#444"}
      />

      <Box sx={cardStyle}>
        <Typography
          sx={{
            fontSize: 13,
            color: object.astrology.oob ? " #C8A96E" : "#555",
          }}
        >
          {object.astrology.oob
            ? "⚡ Questo oggetto è Out of Bounds"
            : "Entro i limiti di declinazione"}
        </Typography>
      </Box>

      <SectionHeader label="ASPETTI LONGITUDINALI" color="#FFAA66" />

      {longitudinalAspects.length === 0 ? (
        <Typography sx={noneStyle}>Nessun aspetto longitudinale.</Typography>
      ) : (
        longitudinalAspects.map((aspect, index) => {
          const other = findChartObject(
            chart,
            getOtherObjectId(aspect, object.id),
          );

          if (!other) return null;

          return (
            <AspectRow key={`${aspect.objectA}-${aspect.objectB}-${index}`}>
              <Typography sx={symbolStyle}>{getObjectSymbol(other)}</Typography>

              <Typography sx={nameStyle}>{other.name}</Typography>

              <Typography sx={typeStyle}>{aspect.type}</Typography>

              <Typography sx={orbStyle}>
                orb {aspect.orb.toFixed(2)}°
              </Typography>
            </AspectRow>
          );
        })
      )}

      <SectionHeader label="ASPETTI DI DECLINAZIONE" color="#4488FF" />

      {declinationAspects.map((aspect, index) => {
        const other = findChartObject(
          chart,
          getOtherObjectId(aspect, object.id),
        );

        if (!other) return null;

        return (
          <AspectRow key={`${aspect.objectA}-${aspect.objectB}-${index}`}>
            <Typography sx={symbolStyle}>{getObjectSymbol(other)}</Typography>

            <Typography sx={nameStyle}>{other.name}</Typography>

            <Typography
              sx={{
                ...typeStyle,
                color: aspect.type === "parallel" ? " #4488FF" : "#FF4444",
              }}
            >
              {aspect.type}
            </Typography>

            <Typography sx={orbStyle}>orb {aspect.orb.toFixed(2)}°</Typography>
          </AspectRow>
        );
      })}
    </Box>
  );
}

const cardStyle = {
  background: "#0A0A12",
  borderRadius: 3,
  p: 2,
  mb: 2,
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const noneStyle = {
  color: "#444",
  fontSize: 13,
  pl: 0.5,
};

const symbolStyle = {
  fontSize: 16,
  color: "#E8E0D0",
  width: 24,
};

const nameStyle = {
  color: "#E8E0D0",
  fontSize: 13,
  flex: 1,
};

const typeStyle = {
  color: "#A0A0B0",
  fontSize: 11,
  textTransform: "capitalize",
};

const orbStyle = {
  color: "#555",
  fontSize: 11,
};

function AspectRow({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 1,
        px: 0.5,
        borderBottom: "1px solid #1A1A2E",
      }}
    >
      {children}
    </Box>
  );
}
