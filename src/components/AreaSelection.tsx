import { useEffect, useState } from "react";
import type { Point, PointTuple } from "leaflet";
import { CircleMarker, Rectangle, useMap } from "react-leaflet";
import { boundsFromCorners, clampPositionToWorld } from "../geo/coordinates";
import type { Bounds, Position } from "../geo/coordinates";

const MIN_DRAG_PIXELS = 4;
const KEYBOARD_OFFSETS: Partial<Record<string, PointTuple>> = {
  ArrowLeft: [-80, 0],
  ArrowRight: [80, 0],
  ArrowUp: [0, -80],
  ArrowDown: [0, 80],
};

interface Draft {
  anchor: Position;
  bounds: Bounds | null;
}

export function AreaSelection({ color, onSelect }: { color: string; onSelect: (bounds: Bounds) => void }) {
  const map = useMap();
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    const container = map.getContainer();
    const canDrag = map.dragging.enabled();
    const canBoxZoom = map.boxZoom.enabled();
    map.dragging.disable();
    map.boxZoom.disable();

    let pointer: { id: number; start: Point; anchor: Position } | null = null;
    let keyboardAnchor: Position | null = null;

    function pointInMap(event: PointerEvent) {
      const point = map.mouseEventToContainerPoint(event);
      const size = map.getSize();
      point.x = Math.max(0, Math.min(point.x, size.x));
      point.y = Math.max(0, Math.min(point.y, size.y));
      return point;
    }

    function finishPointer() {
      if (!pointer) return;
      const { id } = pointer;
      pointer = null;
      if (container.hasPointerCapture(id)) container.releasePointerCapture(id);
      setDraft(null);
    }

    function handlePointerDown(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0 || pointer) return;
      if (event.target instanceof Element && event.target.closest(".leaflet-control")) return;

      const start = pointInMap(event);
      keyboardAnchor = null;
      pointer = { id: event.pointerId, start, anchor: clampPositionToWorld(map.containerPointToLatLng(start)) };
      setDraft(null);
      event.preventDefault();
      container.focus({ preventScroll: true });
      container.setPointerCapture(event.pointerId);
    }

    function pointerBounds(event: PointerEvent, start: Point, anchor: Position) {
      const end = pointInMap(event);
      if (Math.abs(end.x - start.x) < MIN_DRAG_PIXELS || Math.abs(end.y - start.y) < MIN_DRAG_PIXELS) {
        return null;
      }
      const bounds = boundsFromCorners(anchor, clampPositionToWorld(map.containerPointToLatLng(end)));
      return bounds.north > bounds.south && bounds.east > bounds.west ? bounds : null;
    }

    function handlePointerMove(event: PointerEvent) {
      if (pointer?.id !== event.pointerId) return;
      const bounds = pointerBounds(event, pointer.start, pointer.anchor);
      setDraft(bounds ? { anchor: pointer.anchor, bounds } : null);
    }

    function handlePointerUp(event: PointerEvent) {
      if (pointer?.id !== event.pointerId) return;
      const bounds = pointerBounds(event, pointer.start, pointer.anchor);
      finishPointer();
      if (bounds) onSelect(bounds);
    }

    function handlePointerCancel(event: PointerEvent) {
      if (pointer?.id === event.pointerId) finishPointer();
    }

    function updateKeyboardDraft() {
      if (!keyboardAnchor) return;
      const bounds = boundsFromCorners(keyboardAnchor, clampPositionToWorld(map.getCenter()));
      setDraft({
        anchor: keyboardAnchor,
        bounds: bounds.north > bounds.south && bounds.east > bounds.west ? bounds : null,
      });
    }

    function clearKeyboardDraft() {
      if (!keyboardAnchor) return;
      keyboardAnchor = null;
      setDraft(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.target !== container) return;
      const offset = keyboardAnchor ? KEYBOARD_OFFSETS[event.key] : undefined;
      if (offset) {
        event.preventDefault();
        event.stopPropagation();
        map.panBy(offset, { animate: false });
        return;
      }
      if (event.key === "Escape") {
        finishPointer();
        clearKeyboardDraft();
        return;
      }
      if (event.key !== "Enter" || event.repeat || pointer) return;
      event.preventDefault();

      const center = clampPositionToWorld(map.getCenter());
      if (!keyboardAnchor) {
        keyboardAnchor = center;
        setDraft({ anchor: center, bounds: null });
        return;
      }

      const bounds = boundsFromCorners(keyboardAnchor, center);
      if (bounds.north > bounds.south && bounds.east > bounds.west) {
        clearKeyboardDraft();
        onSelect(bounds);
      }
    }

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerCancel);
    container.addEventListener("lostpointercapture", handlePointerCancel);
    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("blur", clearKeyboardDraft);
    map.on("move", updateKeyboardDraft);
    map.on("movestart zoomstart resize", finishPointer);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerCancel);
      container.removeEventListener("lostpointercapture", handlePointerCancel);
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("blur", clearKeyboardDraft);
      map.off("move", updateKeyboardDraft);
      map.off("movestart zoomstart resize", finishPointer);
      if (pointer && container.hasPointerCapture(pointer.id)) container.releasePointerCapture(pointer.id);
      if (canDrag) map.dragging.enable();
      if (canBoxZoom) map.boxZoom.enable();
    };
  }, [map, onSelect]);

  if (!draft) return null;
  if (!draft.bounds) {
    return (
      <CircleMarker
        center={draft.anchor}
        radius={5}
        pathOptions={{ color: "#fff", weight: 2, fillColor: color, fillOpacity: 1, interactive: false }}
      />
    );
  }

  const { north, south, east, west } = draft.bounds;
  return (
    <Rectangle
      bounds={[[south, west], [north, east]]}
      pathOptions={{ color, weight: 2, dashArray: "5 4", fillOpacity: 0.2, interactive: false }}
    />
  );
}
