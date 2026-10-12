import './DataRow.css';

interface DataRowProps {
  label: string;
  value: string;
}

export function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="data-row">
      <span className="data-label">{label}</span>
      <span className="data-value">{value}</span>
    </div>
  );
}