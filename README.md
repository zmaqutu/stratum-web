# Stratum Web

Stratum is an early experimental geospatial processing and visualisation project. This repository contains a browser-based map workspace for inspecting XYZ tiles and drafting rectangular selections. The independent `stratum-engine` repository handles raster processing.

## Local development

Use Node.js 22.12+ on the Node 22 LTS line, or Node 24+. The workspace uses React 19.2, TypeScript 5.9, Vite 7.2, Leaflet 1.9, Zustand 5 and plain CSS. The lockfile includes newer patches within the baseline release lines.

```sh
npm ci
npm run dev
```

Open the URL shown by Vite. The map opens around Cape Town. Use **Pan** for navigation and **Inspect tile** to click a tile at the current map zoom. In **Select area**, drag across the map to preview a rectangle, then release to select it. Drag again to replace the area. Escape cancels a drawing in progress and **Clear selection** removes a completed selection.

With the map focused, arrow keys pan. In tile mode, Enter inspects the map centre. To draw an area with the keyboard, press Enter to anchor the first corner, use the arrow keys to move the map centre diagonally, then press Enter to finish.

```sh
npm test
npm run lint
npm run build
npm run preview
```

## Layers and configuration

Use the **Base Map** dropdown in Layers to switch styles while keeping the current map view and selection. **Esri World Imagery** is the default.

| Style | Good for |
| --- | --- |
| Esri World Imagery | Satellite and aerial imagery |
| Stadia Outdoors | Parks, trails and peak labels |
| Alidade Smooth | A muted backdrop for raster overlays |
| OpenStreetMap Standard | Detailed streets and points of interest |
| Esri World Hillshade | Reading terrain relief without labels |
| Stamen Toner | A high-contrast black-and-white street map |

World Imagery shows place names and boundaries by default. The **Place labels** checkbox switches the transparent Esri reference layer on or off. Esri has scheduled this reference service for retirement in December 2029. [Esri reference layer](https://www.arcgis.com/home/item.html?id=a842e359856a4365b1ddf8cc34fde079) · [Esri retirement timeline](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/announcements/sunsetting-legacy-basemaps)

Stadia styles work on `localhost` and `127.0.0.1` within the provider's development limits. For hosted use, register the domain with Stadia Maps. Esri layers follow Esri's subscription and usage terms. [Stadia Maps authentication](https://docs.stadiamaps.com/authentication/) · [Esri content terms](https://www.esri.com/content/dam/arcgisonline/docs/tou_summary.pdf) · [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

For optional settings, copy `.env.example` to `.env.local` and restart Vite. `VITE_BASE_MAP` can set a different initial style. Set `VITE_TILE_BASE_URL` to the base URL of an existing tile host, then enable **Elevation** in the sidebar. The app requests `{base}/elevation/{z}/{x}/{y}.webp`. Keep the layer off at zooms or locations where you have no output. The default elevation attribution points to AWS Terrain Tiles source credits. Update it if you use a different data source.

All `VITE_` variables are public build-time settings. `VITE_PROCESSING_API_URL` is reserved for future integration. The app can run with all settings unset.

## Status and license

The workspace supports a single tile selection or a single axis-aligned geographic rectangle. Area selection uses ordered west/east bounds within one world and does not represent antimeridian-crossing rectangles. Hillshade, Slope and processing submission are planned. See the [architecture and proposed API](docs/architecture.md) and [roadmap](docs/roadmap.md).

Stratum Web is open source under the [MIT License](LICENSE). Base map services, elevation data and dependencies retain their own licenses and attribution requirements.

The scaffolding and licensing commits use reconstructed author and committer timestamps of 10:00 and 10:03 SAST on 15 November 2025. The work took place later. Subsequent commits use their actual dates.
