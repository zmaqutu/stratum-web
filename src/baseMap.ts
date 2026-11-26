const esriAttribution = 'Powered by <a href="https://www.esri.com/">Esri</a>';
const osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const stadiaAttribution = '&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a>';
const openMapTilesAttribution = '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>';
const stamenAttribution = '&copy; <a href="https://stamen.com/">Stamen Design</a>';

export const baseMaps = {
  imagery: {
    label: "Esri World Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: esriAttribution + " | Sources: Esri, Vantor, Earthstar Geographics, and the GIS User Community",
  },
  outdoors: {
    label: "Stadia Outdoors",
    url: "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
    attribution: [stadiaAttribution, openMapTilesAttribution, osmAttribution].join(" "),
  },
  smooth: {
    label: "Alidade Smooth",
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    attribution: [stadiaAttribution, openMapTilesAttribution, osmAttribution].join(" "),
  },
  osm: {
    label: "OpenStreetMap Standard",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: osmAttribution,
  },
  hillshade: {
    label: "Esri World Hillshade",
    url: "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
    attribution: esriAttribution + " | Sources: Esri, Vantor, Airbus DS, USGS, NGA, NASA, CGIAR, " +
      "N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen, Rijkswaterstaat, GSA, Geoland, FEMA, " +
      "Intermap, and the GIS User Community",
  },
  toner: {
    label: "Stamen Toner",
    url: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png",
    attribution: [stadiaAttribution, stamenAttribution, openMapTilesAttribution, osmAttribution].join(" "),
  },
};

export const imageryPlaceLabels = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  attribution: `Place labels: Esri, HERE, Garmin, ${osmAttribution}, and the GIS User Community`,
};

export type BaseMapId = keyof typeof baseMaps;

export function isBaseMapId(value: unknown): value is BaseMapId {
  return typeof value === "string" && Object.hasOwn(baseMaps, value);
}
