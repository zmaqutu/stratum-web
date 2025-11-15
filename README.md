# Stratum Web

Stratum is an early experimental geospatial processing and visualisation project. This repository contains a browser-based map workspace for inspecting XYZ tiles and drafting rectangular selections. The independent `stratum-engine` repository handles raster processing.

## Local development

Use Node.js 22.12+ on the Node 22 LTS line, or Node 24+. The workspace uses React 19.2, TypeScript 5.9, Vite 7.2, Leaflet 1.9 and plain CSS. The lockfile includes newer patches within the baseline release lines.

```sh
npm ci
npm run dev
```

Open the URL shown by Vite. The map opens around Cape Town. Use **Pan** for navigation, **Inspect tile** to click a tile at the current map zoom, and **Select area** to click two opposite corners. **Clear selection** removes the current selection. With the map focused, arrow keys pan and Enter selects the map centre in either selection mode.

```sh
npm test
npm run lint
npm run build
npm run preview
```

## Layers and configuration

The default OpenStreetMap basemap requires an internet connection and is intended for interactive development use. Keep its visible attribution and follow the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

For optional settings, copy `.env.example` to `.env.local` and restart Vite. Set `VITE_TILE_BASE_URL` to the base URL of an existing tile host, then enable **Elevation** in the sidebar. The app requests `{base}/elevation/{z}/{x}/{y}.webp`. Keep the layer off at zooms or locations where you have no output. The default elevation attribution points to AWS Terrain Tiles source credits. Update it if you use a different data source.

Both variables are public build-time settings. `VITE_PROCESSING_API_URL` is reserved for future integration. The app can run with both settings unset.

## Status and license

The workspace supports a single tile selection or a single axis-aligned geographic rectangle. Area selection uses ordered west/east bounds within one world and does not represent antimeridian-crossing rectangles. Hillshade, Slope and processing submission are planned. See the [architecture and proposed API](docs/architecture.md) and [roadmap](docs/roadmap.md).

Stratum Web is open source under the [MIT License](LICENSE). The OpenStreetMap basemap, elevation data and dependencies retain their own licenses and attribution requirements.

The scaffolding and licensing commits use reconstructed author and committer timestamps of 10:00 and 10:03 SAST on 15 November 2025. The work took place later. Subsequent commits use their actual dates.
