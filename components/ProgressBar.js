export default function ProgressBar({ pct = 0, color = '#0A2540', height = 6 }) {
  return (
    <div style={{ height, borderRadius: height / 2, background: '#f1f5f9', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, pct))}%`,
          background: color,
          borderRadius: height / 2,
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  );
}
