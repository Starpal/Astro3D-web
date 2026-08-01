import React from "react";
import type { ViewMode } from "../../../types/chart";
import { TbWorldLongitude, TbArrowsVertical, TbSphere } from "react-icons/tb";

export default function CommonControls({
  viewMode,
  setViewMode,
}: {
  viewMode: string;
  setViewMode: (mode: ViewMode) => void;
}) {
  return (
    <div style={styles.container}>
      {/* Common Controls */}
      {/* <div
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderBottom: "1px solid #1A1A2E",
        }}
      > */}
        <button
        title="Longitude View"
          onClick={() => setViewMode("2d")}
          style={{
            ...styles.iconBtn,
            ...(viewMode === "2d" ? styles.iconBtnActive : {}),
          }}
        >
          <TbWorldLongitude />
        </button>
        <button
        title="Declination View"
          onClick={() => setViewMode("declination")}
          style={{
            ...styles.iconBtn,
            ...(viewMode === "3d" ? styles.iconBtnActive : {}),
          }}
        >
          <TbArrowsVertical />
        </button>
        <button
         title="3D Explorer"
          onClick={() => setViewMode("3d-explorer")}
          style={{
            ...styles.iconBtn,
            ...(viewMode === "3d-explorer" ? styles.iconBtnActive : {}),
          }}
        >
          <TbSphere />
        </button>
      </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 8,
    padding: "10px 0",
    borderBottom: "1px solid #1A1A2E",
  },
    iconBtn: {
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: 2,
    border: "1px solid #2A2A3E",
    background: "rgba(10,10,18,0.85)",
    color: "#8a8a9a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backdropFilter: "blur(8px)",
  },
  iconBtnActive: {
    background: "rgba(200,169,110,0.15)",
    borderColor: "#C8A96E",
    color: "#C8A96E",
    boxShadow:
      "0 0 12px rgba(200,169,110,0.35)",
  },
};
