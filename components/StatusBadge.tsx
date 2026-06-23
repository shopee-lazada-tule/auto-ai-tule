export function StatusBadge({ value }: { value: string }) {
  const cls = value === 'A' || value === 'B' || value === 'ACTIVE' || value === 'READY' ? 'good' : value === 'NG' || value === 'ERROR' ? 'bad' : 'warn';
  return <span className={`badge ${cls}`}>{value}</span>;
}
