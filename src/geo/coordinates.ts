export const MAX_MERCATOR_LATITUDE = 85.0511287798066;

export interface Position {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function normalizeLongitude(lng: number): number {
  if (!Number.isFinite(lng)) throw new RangeError("Longitude must be finite");
  if (lng >= -180 && lng < 180) return lng;
  return ((((lng + 180) % 360) + 360) % 360) - 180;
}

export function clampLatitude(lat: number): number {
  if (!Number.isFinite(lat)) throw new RangeError("Latitude must be finite");
  return Math.max(-MAX_MERCATOR_LATITUDE, Math.min(MAX_MERCATOR_LATITUDE, lat));
}

export function boundsFromCorners(first: Position, second: Position): Bounds {
  return {
    west: Math.min(first.lng, second.lng),
    east: Math.max(first.lng, second.lng),
    south: Math.min(first.lat, second.lat),
    north: Math.max(first.lat, second.lat),
  };
}
