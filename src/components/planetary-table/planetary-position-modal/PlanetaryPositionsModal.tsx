import React from "react";
import {
  findChartObject,
  getObjectColor,
  getObjectSymbol,
} from "../../../utils/chart/chartHelpers";
import type { NatalChart } from "../../../types/astrology";
import "./PlanetaryPositionsModal.css";

interface Props {
  visible: boolean;
  onClose: () => void;
  chart: NatalChart;
}

function PlanetaryPositionsModal({ visible, onClose, chart }: Props) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">📊 Planetary Positions</h2>

          <button onClick={onClose} className="close-btn">
            <span className="close-text">✕</span>
          </button>
        </div>

        <div className="modal-scroll">
          <div className="table">
            <div className="table-row header-row">
              <div className="table-cell header-cell" style={{ flex: 0.5 }}>
                Type
              </div>

              <div className="table-cell header-cell" style={{ flex: 1.1 }}>
                Object
              </div>

              <div className="table-cell header-cell" style={{ flex: 1 }}>
                Sign
              </div>

              <div className="table-cell header-cell" style={{ flex: 0.8 }}>
                Degrees
              </div>

              <div className="table-cell header-cell" style={{ flex: 0.8 }}>
                Declination
              </div>

              <div className="table-cell header-cell" style={{ flex: 0.5 }}>
                House
              </div>

              <div className="table-cell header-cell" style={{ flex: 0.6 }}>
                OOB
              </div>
            </div>

            {chart.objects.map((object) => (
              <div key={object.id} className="table-row data-row">
                <div
                  className="table-cell"
                  style={{
                    flex: 0.5,
                    color: getObjectColor(object),
                  }}
                >
                  {getObjectSymbol(object)}
                </div>

                <div className="table-cell" style={{ flex: 1.1 }}>
                  {object.name}
                </div>

                <div className="table-cell" style={{ flex: 1 }}>
                  {object.astrology.sign}
                </div>

                <div className="table-cell" style={{ flex: 0.8 }}>
                  {object.astrology.degree}°{" "}
                  {object.astrology.minute.toString().padStart(2, "0")}′
                </div>

                <div className="table-cell" style={{ flex: 0.8 }}>
                  {object.astronomy.declination !== undefined
                    ? `${Math.abs(object.astronomy.declination).toFixed(2)}° ${
                        object.astronomy.declination >= 0 ? "N" : "S"
                      }`
                    : "-"}
                </div>

                <div className="table-cell" style={{ flex: 0.5 }}>
                  {object.astrology.house}
                </div>

                <div
                  className="table-cell"
                  style={{
                    flex: 0.6,
                    color: object.astrology.oob ? "#C8A96E" : "#444",
                  }}
                >
                  {object.astrology.oob ? "⚡" : " "}
                </div>
              </div>
            ))}
          </div>

          <div className="aspects-section">
            <h3 className="aspects-title">🔗 Aspetti Longitudinali</h3>

            {chart.aspects.longitudinal.length === 0 ? (
              <p className="no-aspects">Nessun aspetto longitudinale.</p>
            ) : (
              chart.aspects.longitudinal.map((aspect, index) => {
                const objectA = findChartObject(chart, aspect.objectA);
                const objectB = findChartObject(chart, aspect.objectB);

                if (!objectA || !objectB) {
                  return null;
                }

                const motionLabel =
                  aspect.motion === "applying"
                    ? "A"
                    : aspect.motion === "separating"
                      ? "S"
                      : null;

                return (
                  <div
                    key={`${aspect.objectA}-${aspect.objectB}-${index}`}
                    className="aspect-row"
                  >
                    <span className="aspect-text">
                      {objectA.name} {aspect.type} {objectB.name}
                    </span>

                    <div className="orb-motion-group">
                      <span className="aspect-text">
                        orb {aspect.orb.toFixed(2)}°
                      </span>

                      {motionLabel && (
                        <span
                          className={`motion-badge ${
                            motionLabel === "A"
                              ? "motion-applying"
                              : "motion-separating"
                          }`}
                        >
                          {motionLabel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="aspects-section">
            <h3 className="aspects-title">↕ Aspetti di Declinazione</h3>

            {chart.aspects.declination.length === 0 ? (
              <p className="no-aspects">Nessun aspetto di declinazione.</p>
            ) : (
              chart.aspects.declination.map((aspect, index) => {
                const objectA = findChartObject(chart, aspect.objectA);
                const objectB = findChartObject(chart, aspect.objectB);

                if (!objectA || !objectB) {
                  return null;
                }

                return (
                  <div
                    key={`${aspect.objectA}-${aspect.objectB}-${index}`}
                    className="aspect-row"
                  >
                    <span className="aspect-text">
                      {objectA.name} {aspect.type} {objectB.name}
                    </span>

                    <span
                      className="aspect-text"
                      style={{
                        color:
                          aspect.type === "parallel" ? "#4488FF" : "#FF4444",
                      }}
                    >
                      orb {aspect.orb.toFixed(2)}°
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PlanetaryPositionsModal);
