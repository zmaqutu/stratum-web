import { useEffect } from "react";
import type { LatLngBoundsExpression } from "leaflet";
import {
  CircleMarker, MapContainer, Rectangle, ScaleControl, TileLayer, useMapEvents, ZoomControl,
} from "react-leaflet";
import { clampLatitude, MAX_MERCATOR_LATITUDE } from "../geo/coordinates";
import type { Position } from "../geo/coordinates";
import type { Mode, Selection } from "../selection";

const CAPE_TOWN: [number, number] = [-34.02, 18.46];
const WORLD: LatLngBoundsExpression = [
  [-MAX_MERCATOR_LATITUDE, -180],
  [MAX_MERCATOR_LATITUDE, 180],
];
export const INITIAL_ZOOM = 11;

interface MapProps {
  mode: Mode;
  selection: Selection | null;
  baseVisible: boolean;
  elevationUrl?: string;
  onSelect: (position: Position, zoom: number) => void;
  onCursor: (position: Position | null) => void;
  onZoom: (zoom: number) => void;
}

function mapPosition(point: Position): Position {
  return { lat: clampLatitude(point.lat), lng: Math.max(-180, Math.min(180, point.lng)) };
}

function Interaction({
  mode, onSelect, onCursor, onZoom,
}: Pick<MapProps, "mode" | "onSelect" | "onCursor" | "onZoom">) {
  const map = useMapEvents({
    click: (event) => onSelect(mapPosition(event.latlng), map.getZoom()),
    mousemove: (event) => onCursor(mapPosition(event.latlng)),
    mouseout: () => onCursor(null),
    zoomend: () => onZoom(map.getZoom()),
  });

  useEffect(() => {
    const container = map.getContainer();
    container.setAttribute("aria-label", "Interactive map. Arrow keys pan. Enter selects the map centre in selection modes.");
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && mode !== "pan" && event.target === map.getContainer()) {
        onSelect(mapPosition(map.getCenter()), map.getZoom());
      }
    }
    const container = map.getContainer();
    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [map, mode, onSelect]);

  return null;
}

export function MapCanvas({
  mode, selection, baseVisible, elevationUrl, onSelect, onCursor, onZoom,
}: MapProps) {
  const bounds = selection && "bounds" in selection ? selection.bounds : null;
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
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            noWrap
            zIndex={100}
          />
        )}
        {elevationUrl && (
          <TileLayer
            url={`${elevationUrl}/elevation/{z}/{x}/{y}.webp`}
            attribution='<a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md">Terrain data attribution</a>'
            noWrap
            zIndex={200}
          />
        )}
        {bounds && (
          <Rectangle
            bounds={[[bounds.south, bounds.west], [bounds.north, bounds.east]]}
            pathOptions={{ color: "#2a735e", weight: 2, fillOpacity: 0.16, interactive: false }}
          />
        )}
        {selection?.type === "corner" && (
          <CircleMarker
            center={selection.point}
            radius={5}
            pathOptions={{ color: "#fff", weight: 2, fillColor: "#2a735e", fillOpacity: 1, interactive: false }}
          />
        )}
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <Interaction mode={mode} onSelect={onSelect} onCursor={onCursor} onZoom={onZoom} />
      </MapContainer>
    </section>
  );
}
