import { create } from "zustand";
import type { BaseMapId } from "../baseMap.ts";
import type { Bounds, Position } from "../geo/coordinates.ts";
import { positionToTile, tileBounds } from "../geo/tiles.ts";
import { INITIAL_ZOOM, initialBaseMapId } from "../mapConfig.ts";
import type { Mode, Selection } from "../selection.ts";

interface MapState {
  mode: Mode;
  selection: Selection | null;
  cursor: Position | null;
  zoom: number;
  baseMapId: BaseMapId;
  baseVisible: boolean;
  placeLabels: boolean;
  baseMapError: boolean;
  elevationVisible: boolean;
  setMode: (mode: Mode) => void;
  inspectTile: (position: Position, zoom: number) => void;
  selectArea: (bounds: Bounds) => void;
  clearSelection: () => void;
  setCursor: (cursor: Position | null) => void;
  setZoom: (zoom: number) => void;
  setBaseMap: (baseMapId: BaseMapId) => void;
  setBaseVisible: (baseVisible: boolean) => void;
  setPlaceLabels: (placeLabels: boolean) => void;
  setBaseMapError: (baseMapError: boolean) => void;
  setElevationVisible: (elevationVisible: boolean) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  mode: "pan",
  selection: null,
  cursor: null,
  zoom: INITIAL_ZOOM,
  baseMapId: initialBaseMapId,
  baseVisible: true,
  placeLabels: true,
  baseMapError: false,
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
  setBaseMap: (baseMapId) => set({ baseMapId, baseVisible: true, baseMapError: false }),
  setBaseVisible: (baseVisible) => set({ baseVisible }),
  setPlaceLabels: (placeLabels) => set({ placeLabels }),
  setBaseMapError: (baseMapError) => set({ baseMapError }),
  setElevationVisible: (elevationVisible) => set({ elevationVisible }),
}));
