import type { ChartObject, NatalChart } from "../../../types/astrology";

import {
  findChartObject,
  getObjectColor,
  getObjectSymbol,
  getOtherObjectId,
} from "../../../utils/chart/chartHelpers";

import { DataRow } from "../DataRow";
import { SectionHeader } from "../SectionHeader";

import "./PlanetProfileCard.css"; // ← Importa il CSS direttamente

interface PlanetProfileCardProps {
  chart: NatalChart;
  object: ChartObject;
  onClose: () => void;
}

export default function PlanetProfileCard({
  chart,
  object,
  onClose,
}: PlanetProfileCardProps) {
  const longitudinalAspects = chart.aspects.longitudinal.filter(
    (aspect) => aspect.objectA === object.id || aspect.objectB === object.id,
  );

  const declinationAspects = chart.aspects.declination.filter(
    (aspect) => aspect.objectA === object.id || aspect.objectB === object.id,
  );

  const symbol = getObjectSymbol(object);
  const color = getObjectColor(object);

  return (
    <div className="container">
      <div className="header">
        <div className="titleRow">
          <div
            className="dot"
            style={{ backgroundColor: color }}
          />

          <span className="symbol">{symbol}</span>

          <div>
            <h1 className="title">{object.name}</h1>
            <p className="type">{object.type}</p>
          </div>

          {object.astrology.retrograde && (
            <span className="retro">℞</span>
          )}
        </div>

        <button
          onClick={onClose}
          className="closeBtn"
          aria-label="Chiudi"
        >
          <span className="closeText">✕</span>
        </button>
      </div>

      <div className="scroll">
        <SectionHeader label="POSIZIONE ASTROLOGICA" color="#C8A96E" />

        <div className="dataGrid">
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
        </div>

        <SectionHeader label="DATI ASTRONOMICI" color="#8FB8FF" />

        <div className="dataGrid">
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

          {object.astronomy.speedLongitude !== undefined && (
            <DataRow
              label="Velocità longitudine"
              value={object.astronomy.speedLongitude.toFixed(6)}
            />
          )}

          {object.astronomy.speedLatitude !== undefined && (
            <DataRow
              label="Velocità latitudine"
              value={object.astronomy.speedLatitude.toFixed(6)}
            />
          )}

          {object.astronomy.speedDistance !== undefined && (
            <DataRow
              label="Velocità distanza"
              value={object.astronomy.speedDistance.toFixed(6)}
            />
          )}
        </div>

        <SectionHeader
          label="OUT OF BOUNDS"
          color={object.astrology.oob ? "#C8A96E" : "#444"}
        />

        <div className="chip">
          <p
            className="chipText"
            style={{
              color: object.astrology.oob ? "#C8A96E" : "#555",
            }}
          >
            {object.astrology.oob
              ? "⚡ Questo oggetto è Out of Bounds"
              : "Entro i limiti di declinazione"}
          </p>
        </div>

        <SectionHeader label="ASPETTI LONGITUDINALI" color="#FFAA66" />

        {longitudinalAspects.length === 0 ? (
          <p className="none">Nessun aspetto longitudinale.</p>
        ) : (
          longitudinalAspects.map((aspect, index) => {
            const otherId = getOtherObjectId(aspect, object.id);
            const other = findChartObject(chart, otherId);

            if (!other) {
              return null;
            }

            return (
              <div
                key={`${aspect.objectA}-${aspect.objectB}-${index}`}
                className="aspectRow"
              >
                <span className="aspectSymbol">
                  {getObjectSymbol(other)}
                </span>

                <span className="aspectName">{other.name}</span>

                <span className="aspectType">{aspect.type}</span>

                <span className="aspectOrb">
                  orb {aspect.orb.toFixed(2)}°
                </span>
              </div>
            );
          })
        )}

        <SectionHeader label="ASPETTI DI DECLINAZIONE" color="#4488FF" />

        {declinationAspects.length === 0 ? (
          <p className="none">Nessun aspetto di declinazione.</p>
        ) : (
          declinationAspects.map((aspect, index) => {
            const otherId = getOtherObjectId(aspect, object.id);
            const other = findChartObject(chart, otherId);

            if (!other) {
              return null;
            }

            return (
              <div
                key={`${aspect.objectA}-${aspect.objectB}-${index}`}
                className="aspectRow"
              >
                <span className="aspectSymbol">
                  {getObjectSymbol(other)}
                </span>

                <span className="aspectName">{other.name}</span>

                <span
                  className="aspectType"
                  style={{
                    color: aspect.type === "parallel" ? "#4488FF" : "#FF4444",
                  }}
                >
                  {aspect.type}
                </span>

                <span className="aspectOrb">
                  orb {aspect.orb.toFixed(2)}°
                </span>
              </div>
            );
          })
        )}

        <div style={{ height: "32px" }} />
      </div>
    </div>
  );
}
