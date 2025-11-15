import { clampLatitude, normalizeLongitude } from "./coordinates.ts";
import type { Bounds, Position } from "./coordinates.ts";

export interface Tile {
  z: number;
  x: number;
  y: number;
}

function dimensionAt(z: number): number {
  if (!Number.isInteger(z) || z < 0 || z > 30) {
    throw new RangeError("Zoom must be an integer from 0 to 30");
  }
  return 2 ** z;
}

export function positionToTile({ lat, lng }: Position, z: number): Tile {
  const size = dimensionAt(z);
  const radians = (clampLatitude(lat) * Math.PI) / 180;
  const column = ((normalizeLongitude(lng) + 180) / 360) * size;
  const row = (1 - Math.asinh(Math.tan(radians)) / Math.PI) * (size / 2);
  const index = (value: number) => Math.max(0, Math.min(size - 1, Math.floor(value)));
  return { z, x: index(column), y: index(row) };
}

export function tileBounds({ z, x, y }: Tile): Bounds {
  const size = dimensionAt(z);
  if (![x, y].every((index) => Number.isInteger(index) && index >= 0 && index < size)) {
    throw new RangeError("Tile coordinates are outside the selected zoom");
  }
  const longitude = (column: number) => (column / size) * 360 - 180;
  const latitude = (row: number) =>
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * row) / size))) * 180) / Math.PI;
  return {
    north: latitude(y),
    south: latitude(y + 1),
    east: longitude(x + 1),
    west: longitude(x),
  };
}
