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

export default function Legend() {
  return (
    <div style={styles.legend}>
      <LegendItem color="#3DA5FF" label="Parallel" />
      <LegendItem color="#FF3B3B" label="Contraparallel" />
      <LegendItem color="#C8A96E" label="OOB" />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 12,
    paddingBottom: 12,
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