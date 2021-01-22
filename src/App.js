import logo from './logo.svg';
import './App.css';
import {MapContainer} from 'react-leaflet';
import {TileLayer} from 'react-leaflet';
import {ScaleControl} from 'react-leaflet';
import {useMapEvents} from 'react-leaflet';

let center = [5, 38.8910, 106.3037];
var vals = center;

if (window.location.href.indexOf("#") > 0) {
  let qstr = window.location.href.split("#")[1];
  vals = qstr.split("/");
}

function MyComponent() {
  const map = useMapEvents({
    move: () => {
      let center = map.getCenter();
      window.location.href = "#" + map.getZoom() + "/" + center.lat.toFixed(4) + "/" + center.lng.toFixed(4);
    },
  });

  return null;
}

function App() {
  return (

    <MapContainer center={[vals[1], vals[2]]} zoom={vals[0]} scrollWheelZoom={true} maxZoom={19}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <MyComponent />
      <ScaleControl />

    </MapContainer>

  );
}

export default App;
