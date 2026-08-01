import type { ViewMode } from "../../../types/chart";

import CommonControls from "./CommonControls";

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div style={styles.legendItem}>
      <div style={{ ...styles.legendDot, backgroundColor: color }} />
      <span style={styles.legendText}>{label}</span>
    </div>
  );
}

export default function Legend({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}) {
  return (
    <div style={styles.container}>
      <CommonControls viewMode={viewMode} setViewMode={setViewMode} />
      {viewMode !== "2d" && (
        <div style={styles.legend}>
          <LegendItem color="#3DA5FF" label="Parallel" />
          <LegendItem color="#FF3B3B" label="Contraparallel" />
          <LegendItem color="#C8A96E" label="OOB" />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "row",
    padding: "0 15px"
  },
  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    padding: "2px 10px",
    borderBottom: "1px solid #1A1A2E",
  },
  legendItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: "#666",
    fontSize: 11,
    letterSpacing: 0.5,
  },
};
