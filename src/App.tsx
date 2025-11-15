import { useState } from "react";
import { MapCanvas, INITIAL_ZOOM } from "./components/MapCanvas";
import { Sidebar } from "./components/Sidebar";
import { MapToolbar, StatusBar } from "./components/MapToolbar";
import { boundsFromCorners } from "./geo/coordinates";
import type { Position } from "./geo/coordinates";
import { positionToTile, tileBounds } from "./geo/tiles";
import type { Mode, Selection } from "./selection";

const elevationBase = import.meta.env.VITE_TILE_BASE_URL?.trim().replace(/\/+$/, "");

export function App() {
  const [mode, setMode] = useState<Mode>("pan");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [cursor, setCursor] = useState<Position | null>(null);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [baseVisible, setBaseVisible] = useState(true);
  const [elevationVisible, setElevationVisible] = useState(false);

  function changeMode(next: Mode) {
    setMode(next);
    if (selection?.type === "corner" && next !== "area") setSelection(null);
  }

  function select(point: Position, mapZoom: number) {
    if (mode === "tile") {
      const tile = positionToTile(point, mapZoom);
      setSelection({ type: "tile", tile, bounds: tileBounds(tile) });
    }

    if (mode === "area") {
      setSelection((current) => {
        if (current?.type !== "corner") return { type: "corner", point };
        if (current.point.lat === point.lat || current.point.lng === point.lng) return current;
        return { type: "area", bounds: boundsFromCorners(current.point, point) };
      });
    }
  }

  return (
    <div className="workspace">
      <MapToolbar
        mode={mode}
        onMode={changeMode}
        canClear={selection !== null}
        onClear={() => setSelection(null)}
      />
      <main className="workspace-main">
        <Sidebar
          mode={mode}
          selection={selection}
          baseVisible={baseVisible}
          elevationVisible={elevationVisible}
          elevationAvailable={Boolean(elevationBase)}
          onBase={setBaseVisible}
          onElevation={setElevationVisible}
        />
        <MapCanvas
          mode={mode}
          selection={selection}
          baseVisible={baseVisible}
          elevationUrl={elevationVisible ? elevationBase : undefined}
          onSelect={select}
          onCursor={setCursor}
          onZoom={setZoom}
        />
      </main>
      <StatusBar mode={mode} cursor={cursor} zoom={zoom} />
    </div>
  );
}
