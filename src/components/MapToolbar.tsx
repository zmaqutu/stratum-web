import type { Position } from "../geo/coordinates";
import { selectionModes } from "../selection";
import type { Mode } from "../selection";

interface ToolbarProps {
  mode: Mode;
  onMode: (mode: Mode) => void;
  canClear: boolean;
  onClear: () => void;
}

export function MapToolbar({ mode, onMode, canClear, onClear }: ToolbarProps) {
  return (
    <header className="topbar">
      <h1>Stratum</h1>
      <div className="mode-buttons" role="group" aria-label="Map mode">
        {selectionModes.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => onMode(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <button className="clear-button" type="button" disabled={!canClear} onClick={onClear}>
        Clear selection
      </button>
    </header>
  );
}

export function StatusBar({ cursor, zoom, mode }: { cursor: Position | null; zoom: number; mode: Mode }) {
  const modeLabel = selectionModes.find(({ value }) => value === mode)?.label;
  return (
    <footer className="statusbar" aria-label="Map status">
      <span>Lat <span className="status-value">{cursor?.lat.toFixed(5) ?? "—"}</span></span>
      <span>Lon <span className="status-value">{cursor?.lng.toFixed(5) ?? "—"}</span></span>
      <span>Zoom <span className="status-value">{zoom}</span></span>
      <span>Mode <span className="status-value">{modeLabel}</span></span>
      <span className="projection">WGS 84 / Web Mercator</span>
    </footer>
  );
}
