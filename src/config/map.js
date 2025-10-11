/* eslint-disable */

const OSMtiles = {
    tileUrl: "https://tile.tracestrack.com/auto-en/{z}/{x}/{y}.webp?key=ad185d84befbbb5463e093c682930866",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
};

// Standard OSM tiles for development
const OSMDevTiles = {
    tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// localized tiles
// note that new translations are applied after while
const WikimediaTiles = {
    tileUrl: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
    attribution: `<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a> | Map data © <a href="http://openstreetmap.org/copyright">OpenStreetMap contributors</a>`,
    // this will tell Map component to add ?lang={lang} to tileUrl
    // lang = first language you will choose in the interface
    addLang: true
};

// Use standard OSM tiles in development mode
const DEV_MODE = process.env.REACT_APP_DEV_MODE === 'true';

const mapConfig = {
    ...(DEV_MODE ? OSMDevTiles : OSMtiles),
    minZoom: 3,
    maxZoom: 19
};
export default mapConfig;
