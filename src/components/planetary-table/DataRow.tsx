interface DataRowProps {
  label: string;
  value: string;
}

export function DataRow({ label, value }: DataRowProps) {
  return (
    <div style={styles.dataRow}>
      <span style={styles.dataLabel}>{label}</span>
      <span style={styles.dataValue}>{value}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dataRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  dataLabel: {
    color: "#555",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  dataValue: {
    color: "#E8E0D0",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "right",
    flexShrink: 1,
  },
};