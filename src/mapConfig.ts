import { isBaseMapId } from "./baseMap.ts";
import type { BaseMapId } from "./baseMap.ts";

const configuredBaseMap: unknown = import.meta.env?.VITE_BASE_MAP;

export const INITIAL_ZOOM = 11;
export const initialBaseMapId: BaseMapId = isBaseMapId(configuredBaseMap) ? configuredBaseMap : "imagery";
export const elevationBase = import.meta.env?.VITE_TILE_BASE_URL?.trim().replace(/\/+$/, "");
