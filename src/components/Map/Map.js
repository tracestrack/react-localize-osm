
import {MapContainer, TileLayer, ScaleControl} from 'react-leaflet';
import MapView from "./MapView";
import MarkerWithFocus from "./MarkerWithFocus";
import mapConfig from "../../config/map";

const osmCoordsArr = coord => [coord.lat, coord.lon];
const getItemPosition = item => osmCoordsArr(item.center || item);

export default function Map({
    center, 
    zoom, 
    items, 
    touched,
    lang = "en",
    focused, 
    handlers: {onMove, onLoad, onClickItem, onClickMap}
}) {
    let tileUrl = mapConfig.tileUrl;
    if(mapConfig.addLang) {
        tileUrl += "?lang=" + lang;
    }
    return (
        <MapContainer 
            center={center} 
            zoom={zoom} 
            scrollWheelZoom={true} 
            minZoom={mapConfig.minZoom}
            maxZoom={mapConfig.maxZoom}
        >
            <TileLayer
                attribution={mapConfig.attribution}
                url={tileUrl}
                minZoom={mapConfig.minZoom}
                maxZoom={mapConfig.maxZoom}
            />
            <MapView 
                center={center}
                zoom={zoom} 
                onMove={onMove}
                onLoad={onLoad}
                onClick={onClickMap}
            />
            {items
            .map(item => (
                <MarkerWithFocus 
                    item={item}
                    position={getItemPosition(item)}
                    touched={touched.indexOf(item.id) !== -1}
                    focused={focused === item.id}
                    onClick={() => onClickItem(item.id)}
                    key={item.id}   
                />
            ))}
            <ScaleControl />
        </MapContainer>
    );
}