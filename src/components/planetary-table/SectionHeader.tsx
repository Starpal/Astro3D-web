interface SectionHeaderProps {
  label: string;
  color: string;
}

export function SectionHeader({ label, color }: SectionHeaderProps) {
  return (
    <div style={styles.sectionHeader}>
      <div style={{ ...styles.sectionLine, backgroundColor: color }} />
      <span style={{ ...styles.sectionLabel, color }}>{label}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    marginTop: 16,
  },
  sectionLine: {
    width: 3,
    height: 14,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
  },
};