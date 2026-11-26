import { isBasemapId } from "./basemap.ts";
import type { BasemapId } from "./basemap.ts";

const configuredBasemap: unknown = import.meta.env?.VITE_BASEMAP;

export const INITIAL_ZOOM = 11;
export const initialBasemapId: BasemapId = isBasemapId(configuredBasemap) ? configuredBasemap : "imagery";
export const elevationBase = import.meta.env?.VITE_TILE_BASE_URL?.trim().replace(/\/+$/, "");
