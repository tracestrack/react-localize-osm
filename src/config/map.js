/* eslint-disable */

const OSMtiles = {
    tileUrl: "https://tile.tracestrack.com/en/{z}/{x}/{y}.png?key=ad185d84befbbb5463e093c682930866",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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

const mapConfig = {
    ...OSMtiles,   
    minZoom: 3,
    maxZoom: 19
};
export default mapConfig;
