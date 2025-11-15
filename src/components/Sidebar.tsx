import type { Bounds } from "../geo/coordinates";
import type { Mode, Selection } from "../selection";

interface SidebarProps {
  mode: Mode;
  selection: Selection | null;
  baseVisible: boolean;
  elevationVisible: boolean;
  elevationAvailable: boolean;
  onBase: (visible: boolean) => void;
  onElevation: (visible: boolean) => void;
}

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
      </>
    );
  }
  if (selection?.type === "area") return <CoordinateBounds bounds={selection.bounds} />;
  if (selection?.type === "corner") {
    return (
      <>
        <dl className="readout">
          <dt>First corner latitude</dt><dd>{selection.point.lat.toFixed(5)}°</dd>
          <dt>First corner longitude</dt><dd>{selection.point.lng.toFixed(5)}°</dd>
        </dl>
        <p className="hint">Click the opposite corner to complete the area.</p>
      </>
    );
  }
  const hint = {
    pan: "Choose Inspect tile or Select area to make a selection.",
    tile: "Click the map to inspect the XYZ tile at the current zoom.",
    area: "Click two opposite corners on the map.",
  };
  return <p className="hint">{hint[mode]}</p>;
}

export function Sidebar({
  mode, selection, baseVisible, elevationVisible, elevationAvailable, onBase, onElevation,
}: SidebarProps) {
  const selectionLabel = selection?.type === "tile"
    ? `Tile ${selection.tile.z}/${selection.tile.x}/${selection.tile.y}`
    : selection?.type === "area" ? "Rectangular area" : "None";

  return (
    <aside className="sidebar" aria-label="Layers, selection and processing">
      <section>
        <h2>Layers</h2>
        <ul className="layers">
          <li>
            <label>
              <input type="checkbox" checked={baseVisible} onChange={(event) => onBase(event.target.checked)} />
              Base Map
            </label>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={elevationVisible}
                disabled={!elevationAvailable}
                onChange={(event) => onElevation(event.target.checked)}
              />
              Elevation
            </label>
            {!elevationAvailable && <span className="layer-status">URL required</span>}
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
