import type { Bounds, Position } from "./geo/coordinates";
import type { Tile } from "./geo/tiles";

export const selectionModes = [
  { value: "pan", label: "Pan" },
  { value: "tile", label: "Inspect tile" },
  { value: "area", label: "Select area" },
] as const;

export type Mode = (typeof selectionModes)[number]["value"];
export type Selection =
  | { type: "tile"; tile: Tile; bounds: Bounds }
  | { type: "corner"; point: Position }
  | { type: "area"; bounds: Bounds };
