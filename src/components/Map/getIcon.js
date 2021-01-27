import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.js";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import "@fortawesome/fontawesome-free/css/all.css";

const icons = [

    {cat: "tourism", tag: ["hotel", "hostel"], iconType: "hotel"},
    {cat: "place",   tag: ["city", "town", "neighborhood"], iconType: "city"},
    {cat: "place",   tag: ["village", "hamlet"], iconType: "home"},

    {cat: "aeroway", iconType: "plane"},
    {cat: "shop", iconType: "store"},
    {cat: "historic", iconType: "monument"},
    {cat: "leisure", iconType: "futbol"},
    {cat: "tourism", iconType: "compass"},
    {cat: "highway", iconType: "road"},
    {cat: "building", iconType: "building"},
    {cat: "natural", iconType: "tree"},
    {cat: "waterway", iconType: "water"}
];

const createIcon = (type, color, shape) => L.AwesomeMarkers.icon({
    icon: type,
    prefix: "fa",
    markerColor: color,
    className: "awesome-marker awesome-marker-" + shape
});

const createIcons = ({type, shape, color = "blue"}) => ({
    icon: createIcon(type, color, shape),
    touched: createIcon(type, "orange", shape),
    focused: createIcon(type, "red", shape),
})

const defaultIcon =  createIcons({type: "circle"});

const iconTypes = icons.map(icon => ({
    ...icon,
    ...createIcons({type: icon.iconType})
}));
  
const getIcon = (item, touched, focused) => {
    return (
        iconTypes.find(icon => 
            (!icon.tag && item[icon.cat]) || 
            (item.tags[icon.cat] && item.tags[icon.cat].indexOf(icon.tag) !== -1)
        ) || 
        defaultIcon
    )[focused ? "focused" : touched ? "touched" : "icon"];
};

export default getIcon;
