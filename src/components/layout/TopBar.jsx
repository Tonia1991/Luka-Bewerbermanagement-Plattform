export default function TopBar({ titel, rechts }) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-text-dark">{titel}</h1>
      <div className="flex items-center gap-3">{rechts}</div>
    </div>
  );
}
