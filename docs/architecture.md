# Web architecture

Leaflet supplies map interaction, tile loading and attribution. Vite serves the development client and builds static browser assets. Separating the map and engine repositories lets each develop and run independently. The initial integration is an optional raster tile URL.

The Zustand store in `src/state/mapStore.ts` holds the active basemap, layer visibility, selection mode, committed tile or area, current zoom and cursor position. Components subscribe to the values they use, so cursor movement updates the status readout without rerendering the map or sidebar. The Leaflet instance and in-progress drawing stay within their components. The current zoom follows Leaflet events, and a selected tile retains the zoom at which it was picked.

The `geo/` modules represent geographic coordinates in degrees and map to the standard Web Mercator XYZ grid. The longitude interval is `[-180, 180)` for tile lookup. Latitude is clamped to approximately ±85.05113°. Tile bounds may include +180° as a right edge. Tiles use integers with x increasing east and y increasing south. Leaflet owns rendering in EPSG:3857. The inspector computes a single tile footprint on demand at the current zoom. The area tool captures a pointer drag, previews its rectangle, then commits geographic bounds on release. It suspends drag panning while active. Keyboard drawing uses the map centre as a movable corner. Dateline-aware selection and area-to-tile conversion are future design work.

Layer visibility, basemap choice and selections remain in browser memory. The elevation layer displays encoded WebP imagery where an operator has published a matching XYZ tree. Leaflet requests tiles for the active basemap and shows its attribution. Changing the basemap replaces that raster layer while preserving the map instance and its overlays. Esri tiles use zoom, row, column addressing. Esri World Imagery loads first unless `VITE_BASEMAP` specifies another initial style.

## Proposed job API

A future service could accept these routes.

| Method and route | Intended action |
| --- | --- |
| `POST /jobs` | Validate the request and enqueue a job. Return HTTP 202 with a `jobId` and initial state. |
| `GET /jobs/{jobId}` | Read a job's state and any available progress. |
| `GET /jobs/{jobId}/results` | Describe the published outputs, potentially with a tile URL template. |
| `POST /jobs/{jobId}/cancel` | Request cancellation. |

### Single-tile request

```json
{
  "operation": "elevation",
  "selection": { "type": "tile", "z": 12, "x": 2257, "y": 2458 },
  "palette": "default",
  "format": "webp"
}
```

### Geographic-area request

```json
{
  "operation": "elevation",
  "selection": {
    "type": "bbox",
    "west": 18.30,
    "south": -34.10,
    "east": 18.65,
    "north": -33.80,
    "zoom": 12
  },
  "palette": "default",
  "format": "webp"
}
```

Candidate states are `queued`, `running`, `completed`, `failed` and `cancelled`. A completed result may include the job ID, layer name, processed extent or tile count, and a URL template. Request limits, authentication, idempotency, cancellation semantics and result versioning are open design questions. The proposal has no implementation or runtime dependency.
