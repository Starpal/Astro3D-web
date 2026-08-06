import { useMemo, useState } from "react";
import BirthDataForm from "../birth-data-form/BirthDataForm";
import KosmoConsole from "../kosmo-console/KosmoConsole";
import PlanetProfileCard from "../planetary-table/planet-profile-card/PlanetProfileCard";
import PlanetaryPositionsModal from "../planetary-table/planetary-position-modal/PlanetaryPositionsModal";

import type { NatalChart } from "../../types/astrology";
import type { ChartRequestBody } from "../../types/backend";
import type { NatalChartFormData } from "../../types/form";

import { birthDataToRequest, fetchNatalChart } from "../../utils/astroApi";
import { findChartObject } from "../../utils/chart/chartHelpers";

import "./HomeScreen.css";

export default function HomeScreen() {
  const [chartRequest, setChartRequest] = useState<ChartRequestBody | null>(
    null,
  );
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showTables, setShowTables] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedObjectData = useMemo(() => {
    if (!chart || !selectedObject) {
      return undefined;
    }
    return findChartObject(chart, selectedObject);
  }, [chart, selectedObject]);

  const handleFormSubmit = async (data: NatalChartFormData) => {
    setLoading(true);
    setError(null);

    try {
      const payload = birthDataToRequest(data);
      const result = await fetchNatalChart(payload);

      setChartRequest(payload);
      setChart(result.chart);
      setSelectedObject(null);
    } catch (err) {
      console.error("Chart loading error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Errore durante il caricamento della carta.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setChartRequest(null);
    setChart(null);
    setSelectedObject(null);
    setShowTables(false);
    setError(null);
  };

  // ─── Birth data form screen ───
  if (!chartRequest) {
    return (
      <div className="home-safe">
        <BirthDataForm onSubmit={handleFormSubmit} loading={loading} />

        {loading && (
          <div className="loading-overlay">
            <p className="loading-text">Calcolo della carta...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <p className="error-text">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // ─── Chart viewer screen ───
  return (
    <div className="home-safe">
      {/* Header */}
      <div className="header">
        <button onClick={handleBack} className="back-btn">
          <span className="back-text">← Back</span>
        </button>

        <div className="header-center">
          <h1 className="header-name">
            {chartRequest.birthData.placeName ?? "Carta Natale"}
          </h1>
          <p className="header-date">
            {chartRequest.birthData.dateTime}
            {chartRequest.birthData.placeName
              ? ` · ${chartRequest.birthData.placeName}`
              : ""}
          </p>
        </div>

        <button onClick={() => setShowTables(true)} className="tables-btn">
          <span className="tables-btn-text">📊</span>
        </button>
      </div>

      {/* 3D Chart Viewer with Canvas + Data Panel */}
      {chart && (
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <KosmoConsole
            chart={chart}
            selectedPlanet={selectedObject}
            onSelectPlanet={setSelectedObject}
          />
        </div>
      )}

      {/* Modal: Planetary Positions Table */}
      {chart && (
        <PlanetaryPositionsModal
          visible={showTables}
          onClose={() => setShowTables(false)}
          chart={chart}
        />
      )}

      {/* Modal: Planet Profile Card */}
      {selectedObjectData && (
        <div className="modal-overlay" onClick={() => setSelectedObject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {chart && selectedObjectData && (
              <PlanetProfileCard
                chart={chart}
                object={selectedObjectData}
                onClose={() => setSelectedObject(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
