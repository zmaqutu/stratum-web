import { useEffect, useMemo } from "react";
import type { LatLngBoundsExpression } from "leaflet";
import {
  MapContainer, Rectangle, ScaleControl, TileLayer, useMapEvents, ZoomControl,
} from "react-leaflet";
import { baseMaps, imageryPlaceLabels } from "../baseMap";
import { clampPositionToWorld, MAX_MERCATOR_LATITUDE } from "../geo/coordinates";
import { elevationBase, INITIAL_ZOOM } from "../mapConfig";
import { useMapStore } from "../state/mapStore";
import { AreaSelection } from "./AreaSelection";

const CAPE_TOWN: [number, number] = [-34.02, 18.46];
const WORLD: LatLngBoundsExpression = [
  [-MAX_MERCATOR_LATITUDE, -180],
  [MAX_MERCATOR_LATITUDE, 180],
];
function Interaction() {
  const mode = useMapStore((state) => state.mode);
  const inspectTile = useMapStore((state) => state.inspectTile);
  const setCursor = useMapStore((state) => state.setCursor);
  const setZoom = useMapStore((state) => state.setZoom);
  const map = useMapEvents({
    click: (event) => {
      if (mode === "tile") inspectTile(clampPositionToWorld(event.latlng), map.getZoom());
    },
    mousemove: (event) => setCursor(clampPositionToWorld(event.latlng)),
    mouseout: () => setCursor(null),
    zoomend: () => setZoom(map.getZoom()),
  });

  useEffect(() => {
    const container = map.getContainer();
    setZoom(map.getZoom());
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(container);
    return () => observer.disconnect();
  }, [map, setZoom]);

  useEffect(() => {
    const container = map.getContainer();
    const description = {
      pan: "Interactive map. Use the arrow keys to pan.",
      tile: "Interactive map. Press Enter to inspect the tile at the map centre.",
      area: "Interactive map. Drag to draw a rectangle, or press Enter, pan with the arrow keys, then press Enter again. Escape cancels drawing.",
    };
    container.setAttribute("aria-label", description[mode]);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && mode === "tile" && !event.repeat && event.target === container) {
        inspectTile(clampPositionToWorld(map.getCenter()), map.getZoom());
      }
    }
    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [map, mode, inspectTile]);

  return null;
}

export function MapCanvas() {
  const mode = useMapStore((state) => state.mode);
  const bounds = useMapStore((state) => state.selection?.bounds);
  const baseVisible = useMapStore((state) => state.baseVisible);
  const baseMapId = useMapStore((state) => state.baseMapId);
  const showPlaceLabels = useMapStore((state) => state.baseVisible && state.baseMapId === "imagery" && state.placeLabels);
  const elevationVisible = useMapStore((state) => state.elevationVisible);
  const setBaseMapError = useMapStore((state) => state.setBaseMapError);
  const selectArea = useMapStore((state) => state.selectArea);
  const baseMap = baseMaps[baseMapId];
  const selectionColor = baseVisible && baseMapId === "imagery" ? "#a6ddc2" : "#2a735e";
  const baseMapEvents = useMemo(() => ({
    loading: () => setBaseMapError(false),
    tileerror: () => setBaseMapError(true),
  }), [setBaseMapError]);
  return (
    <section className={`map-region mode-${mode}`} aria-label="Map workspace">
      <MapContainer
        center={CAPE_TOWN}
        zoom={INITIAL_ZOOM}
        minZoom={2}
        maxZoom={19}
        maxBounds={WORLD}
        maxBoundsViscosity={1}
        zoomControl={false}
      >
        {baseVisible && (
          <TileLayer
            key={baseMapId}
            url={baseMap.url}
            attribution={baseMap.attribution}
            eventHandlers={baseMapEvents}
            noWrap
            zIndex={100}
          />
        )}
        {elevationVisible && elevationBase && (
          <TileLayer
            url={`${elevationBase}/elevation/{z}/{x}/{y}.webp`}
            attribution='<a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md">Terrain data attribution</a>'
            noWrap
            zIndex={200}
          />
        )}
        {showPlaceLabels && (
          <TileLayer
            url={imageryPlaceLabels.url}
            attribution={imageryPlaceLabels.attribution}
            noWrap
            zIndex={300}
          />
        )}
        {bounds && (
          <Rectangle
            bounds={[[bounds.south, bounds.west], [bounds.north, bounds.east]]}
            pathOptions={{ color: selectionColor, weight: 2, fillOpacity: 0.16, interactive: false }}
          />
        )}
        {mode === "area" && <AreaSelection color={selectionColor} onSelect={selectArea} />}
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <Interaction />
      </MapContainer>
    </section>
  );
}
