import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import { useMapStore } from "../src/state/mapStore.ts";

beforeEach(() => {
  useMapStore.setState(useMapStore.getInitialState(), true);
});

test("changing the base map reveals it and preserves the selection and label preference", () => {
  const { inspectTile, setBaseMap, setBaseMapError, setBaseVisible, setPlaceLabels } = useMapStore.getState();

  inspectTile({ lat: -34.02, lng: 18.46 }, 11);
  setPlaceLabels(false);
  setBaseVisible(false);
  setBaseMapError(true);
  const selection = useMapStore.getState().selection;

  setBaseMap("outdoors");
  const state = useMapStore.getState();
  assert.equal(state.baseMapId, "outdoors");
  assert.equal(state.baseVisible, true);
  assert.equal(state.baseMapError, false);
  assert.equal(state.placeLabels, false);
  assert.equal(state.selection, selection);
});

test("zoom and cursor changes preserve the inspected tile's original coordinates", () => {
  const { setMode, inspectTile, setZoom, setCursor, clearSelection } = useMapStore.getState();

  setMode("tile");
  inspectTile({ lat: -34.02, lng: 18.46 }, 11);
  setZoom(13);
  setCursor({ lat: -34, lng: 18.5 });
  const state = useMapStore.getState();

  assert.equal(state.zoom, 13);
  assert.equal(state.selection?.type, "tile");
  assert.deepEqual(state.selection.tile, { z: 11, x: 1129, y: 1230 });
  clearSelection();
  assert.equal(useMapStore.getState().selection, null);
  assert.equal(useMapStore.getState().zoom, 13);
});

test("a completed area replaces a tile and stays selected when returning to pan mode", () => {
  const { inspectTile, setMode, selectArea } = useMapStore.getState();
  const bounds = { north: -33.9, south: -34.1, east: 18.6, west: 18.4 };

  inspectTile({ lat: -34.02, lng: 18.46 }, 11);
  setMode("area");
  selectArea(bounds);
  setMode("pan");

  assert.deepEqual(useMapStore.getState().selection, { type: "area", bounds });
});
