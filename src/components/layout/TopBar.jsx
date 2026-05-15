export default function TopBar({ titel, rechts }) {
  return (
    <div
      className="h-14 flex items-center justify-between px-6 flex-shrink-0"
      style={{
        background: 'var(--light-card)',
        borderBottom: '1px solid var(--border-l)',
      }}
    >
      <h1 className="text-sm font-semibold" style={{ color: 'var(--text-d)' }}>{titel}</h1>
      <div className="flex items-center gap-3">{rechts}</div>
    </div>
  );
}
