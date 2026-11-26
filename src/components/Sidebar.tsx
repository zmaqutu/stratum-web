import { basemaps, isBasemapId } from "../basemap";
import type { Bounds } from "../geo/coordinates";
import { elevationBase } from "../mapConfig";
import type { Mode, Selection } from "../selection";
import { useMapStore } from "../state/mapStore";

function CoordinateBounds({ bounds }: { bounds: Bounds }) {
  return (
    <dl className="readout">
      <dt>North</dt><dd>{bounds.north.toFixed(5)}°</dd>
      <dt>South</dt><dd>{bounds.south.toFixed(5)}°</dd>
      <dt>East</dt><dd>{bounds.east.toFixed(5)}°</dd>
      <dt>West</dt><dd>{bounds.west.toFixed(5)}°</dd>
    </dl>
  );
}

function Inspector({ mode, selection }: { mode: Mode; selection: Selection | null }) {
  if (selection?.type === "tile") {
    const { tile, bounds } = selection;
    return (
      <>
        <dl className="readout tile-id">
          <dt>Zoom</dt><dd>{tile.z}</dd>
          <dt>X</dt><dd>{tile.x}</dd>
          <dt>Y</dt><dd>{tile.y}</dd>
        </dl>
        <CoordinateBounds bounds={bounds} />
        {mode === "area" && <p className="hint">Drag across the map to select an area.</p>}
      </>
    );
  }
  if (selection?.type === "area") {
    return (
      <>
        <CoordinateBounds bounds={selection.bounds} />
        {mode === "area" && <p className="hint">Drag again to replace the area.</p>}
      </>
    );
  }
  const hint = {
    pan: "Choose Inspect tile or Select area to make a selection.",
    tile: "Click the map to inspect the XYZ tile at the current zoom.",
    area: "Drag across the map to draw a rectangle. Release to select it.",
  };
  return <p className="hint">{hint[mode]}</p>;
}

export function Sidebar() {
  const mode = useMapStore((state) => state.mode);
  const selection = useMapStore((state) => state.selection);
  const baseVisible = useMapStore((state) => state.baseVisible);
  const basemapId = useMapStore((state) => state.basemapId);
  const placeLabels = useMapStore((state) => state.placeLabels);
  const basemapError = useMapStore((state) => state.basemapError);
  const elevationVisible = useMapStore((state) => state.elevationVisible);
  const setBaseVisible = useMapStore((state) => state.setBaseVisible);
  const setBasemap = useMapStore((state) => state.setBasemap);
  const setPlaceLabels = useMapStore((state) => state.setPlaceLabels);
  const setElevationVisible = useMapStore((state) => state.setElevationVisible);
  const selectionLabel = selection?.type === "tile"
    ? `Tile ${selection.tile.z}/${selection.tile.x}/${selection.tile.y}`
    : selection?.type === "area" ? "Rectangular area" : "None";

  return (
    <aside className="sidebar" aria-label="Layers, selection and processing">
      <section>
        <h2>Layers</h2>
        <ul className="layers">
          <li className="basemap-entry">
            <label>
              <input
                type="checkbox"
                checked={baseVisible}
                onChange={(event) => setBaseVisible(event.currentTarget.checked)}
              />
              Base Map
            </label>
            <select
              className="basemap-select"
              aria-label="Basemap style"
              value={basemapId}
              onChange={(event) => {
                const id = event.currentTarget.value;
                if (isBasemapId(id)) setBasemap(id);
              }}
            >
              {Object.entries(basemaps).map(([id, { label }]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            {basemapId === "imagery" && (
              <label className="place-labels-toggle">
                <input
                  type="checkbox"
                  checked={placeLabels}
                  disabled={!baseVisible}
                  onChange={(event) => setPlaceLabels(event.currentTarget.checked)}
                />
                Place labels
              </label>
            )}
            {baseVisible && basemapError && (
              <p className="hint basemap-error" role="status">Some tiles are unavailable. Try another basemap.</p>
            )}
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={elevationVisible}
                disabled={!elevationBase}
                onChange={(event) => setElevationVisible(event.currentTarget.checked)}
              />
              Elevation
            </label>
            {!elevationBase && <span className="layer-status">URL required</span>}
          </li>
          <li><span className="planned-layer">Hillshade</span><span className="layer-status">Planned</span></li>
          <li><span className="planned-layer">Slope</span><span className="layer-status">Planned</span></li>
        </ul>
      </section>
      <section aria-live="polite">
        <h2>{selection?.type === "tile" || mode === "tile" ? "Tile inspector" : "Selection"}</h2>
        <Inspector mode={mode} selection={selection} />
      </section>
      <section>
        <h2>Processing</h2>
        <dl className="readout">
          <dt>Operation</dt><dd>Elevation</dd>
          <dt>Selection</dt><dd>{selectionLabel}</dd>
          <dt>Palette</dt><dd>Default</dd>
          <dt>Output</dt><dd>WebP</dd>
        </dl>
        <button className="process-button" type="button" disabled>Run processing</button>
        <p className="hint">Processing API is disconnected.</p>
      </section>
    </aside>
  );
}
