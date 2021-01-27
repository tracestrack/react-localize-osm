import {useMapEvents, useMap} from 'react-leaflet';

const toArray = coord => [coord.lat, coord.lng];

export default function MapView({onLoad, onMove, onClick, center, zoom}) {
    const map = useMap();
    let c = map.getCenter();
    if(c.lat !== center[0] || c.lng !== center[1])
        map.flyTo(center, zoom);
        
    useMapEvents({
        move: () => {
            let c = map.getCenter();
            onMove({
                bbox: Object.values(map.getBounds()).map(toArray),
                center: toArray(c),
                zoom: map.getZoom()
            });
        },
        click: () => {
            onClick();
        }
    });
    onLoad({
        bbox: Object.values(map.getBounds())
            .map(toArray),
    });
    return null;
}
