import { create } from "zustand";
import type { BasemapId } from "../basemap.ts";
import type { Bounds, Position } from "../geo/coordinates.ts";
import { positionToTile, tileBounds } from "../geo/tiles.ts";
import { INITIAL_ZOOM, initialBasemapId } from "../mapConfig.ts";
import type { Mode, Selection } from "../selection.ts";

interface MapState {
  mode: Mode;
  selection: Selection | null;
  cursor: Position | null;
  zoom: number;
  basemapId: BasemapId;
  baseVisible: boolean;
  placeLabels: boolean;
  basemapError: boolean;
  elevationVisible: boolean;
  setMode: (mode: Mode) => void;
  inspectTile: (position: Position, zoom: number) => void;
  selectArea: (bounds: Bounds) => void;
  clearSelection: () => void;
  setCursor: (cursor: Position | null) => void;
  setZoom: (zoom: number) => void;
  setBasemap: (basemapId: BasemapId) => void;
  setBaseVisible: (baseVisible: boolean) => void;
  setPlaceLabels: (placeLabels: boolean) => void;
  setBasemapError: (basemapError: boolean) => void;
  setElevationVisible: (elevationVisible: boolean) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  mode: "pan",
  selection: null,
  cursor: null,
  zoom: INITIAL_ZOOM,
  basemapId: initialBasemapId,
  baseVisible: true,
  placeLabels: true,
  basemapError: false,
  elevationVisible: false,
  setMode: (mode) => set({ mode }),
  inspectTile: (position, zoom) => {
    const tile = positionToTile(position, zoom);
    set({ selection: { type: "tile", tile, bounds: tileBounds(tile) } });
  },
  selectArea: (bounds) => set({ selection: { type: "area", bounds } }),
  clearSelection: () => set({ selection: null }),
  setCursor: (cursor) => set({ cursor }),
  setZoom: (zoom) => set({ zoom }),
  setBasemap: (basemapId) => set({ basemapId, baseVisible: true, basemapError: false }),
  setBaseVisible: (baseVisible) => set({ baseVisible }),
  setPlaceLabels: (placeLabels) => set({ placeLabels }),
  setBasemapError: (basemapError) => set({ basemapError }),
  setElevationVisible: (elevationVisible) => set({ elevationVisible }),
}));
