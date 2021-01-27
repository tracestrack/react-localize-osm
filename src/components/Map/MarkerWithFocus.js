
import {useMemo, useRef} from "react";
import {Marker} from 'react-leaflet';
import getIcon from "./getIcon";

export default function MarkerWithFocus({
    item, touched, focused, position, onClick
}) {
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            click: onClick
        }),
      [onClick],
    );
    return (
        <Marker
            position={position} 
            icon={getIcon(item, touched, focused)}         
            eventHandlers={eventHandlers}
            ref={markerRef}
        >
        </Marker>
    )
}