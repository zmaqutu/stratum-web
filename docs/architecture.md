# Web architecture

React manages local view and selection state. Leaflet supplies map interaction, tile loading and attribution. Vite serves the development client and builds static browser assets. Separating the map and engine repositories lets each develop and run independently. The initial integration is an optional raster tile URL.

The `geo/` modules represent geographic coordinates in degrees and map to the standard Web Mercator XYZ grid. The longitude interval is `[-180, 180)` for tile lookup. Latitude is clamped to approximately ±85.05113°. Tile bounds may include +180° as a right edge. Tiles use integers with x increasing east and y increasing south. Leaflet owns rendering in EPSG:3857. The inspector computes a single tile footprint on demand at the current zoom. For an area, two distinct corners produce geographic bounds within the displayed world. Dateline-aware selection and area-to-tile conversion are future design work.

Layer visibility and selections remain in browser memory. The elevation layer displays encoded WebP imagery where an operator has published a matching XYZ tree. The OSM basemap is a development dependency with visible attribution and ordinary viewport-driven requests. A future deployment will need an appropriate basemap service for its traffic.

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
