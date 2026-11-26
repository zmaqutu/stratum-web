import { selectionModes } from "../selection";
import { useMapStore } from "../state/mapStore";

export function MapToolbar() {
  const mode = useMapStore((state) => state.mode);
  const setMode = useMapStore((state) => state.setMode);
  const canClear = useMapStore((state) => state.selection !== null);
  const clearSelection = useMapStore((state) => state.clearSelection);
  return (
    <header className="topbar">
      <h1>Stratum</h1>
      <div className="mode-buttons" role="group" aria-label="Map mode">
        {selectionModes.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <button className="clear-button" type="button" disabled={!canClear} onClick={clearSelection}>
        Clear selection
      </button>
    </header>
  );
}

export function StatusBar() {
  const cursor = useMapStore((state) => state.cursor);
  const zoom = useMapStore((state) => state.zoom);
  const mode = useMapStore((state) => state.mode);
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
