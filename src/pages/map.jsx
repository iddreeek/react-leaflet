import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import "../App.css";
import "leaflet-control-geocoder/Control.Geocoder.css"
import "leaflet-control-geocoder";
const { BaseLayer } = LayersControl;


function Map() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [markers, setMarkers] = useState([
    [14.533742443483478, 120.98137642209622],
    [14.6255184, 121.1386111],
    [14.63093268435, 121.137665939116],
  ]);
  const customIcon = new Icon({
    iconUrl: "marker-icon2.svg",
    iconSize: [38, 38],
  });

  function LeafletControlGeocoder() {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      const geocoder = L.Control.Geocoder.photon(); // Default to Nominatim

      const geocoderControl = L.Control.geocoder({
        query: "",
        placeholder: "Search here...",
        defaultMarkGeocode: false,
        geocoder,
      })
        .on("markgeocode", function (e) {
          const { bbox } = e.geocode;
          map.fitBounds(bbox);
        })
        .addTo(map);

      return () => {
        map.removeControl(geocoderControl);
      };
    }, [map]);

    return null;
  }

  function LocationMarker() {
    const map = useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        markers.push([lat, lng]);
        setPosition({
          latitude: lat,
          longitude: lng,
        });
      },
    });
    return position.latitude !== 0 ? (
      <Marker
        position={[position.latitude, position.longitude]}
        interactive={false}
        icon={customIcon}
      />
    ) : null;
  }

  console.log(markers);

  return (
    <div className=" h-full">
      <MapContainer center={[14.539463420883909, 120.9830204750233]} zoom={18}>
      <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg'
            />
          </BaseLayer>
        </LayersControl>
        {markers.map((pos, key) => (
          <Marker key={key} position={pos} icon={customIcon}>
            <Popup>
              <div className=" flex flex-col px-4 py-2 justify-center items-center">
                <img src="vite.svg" className=" w-[150px] mb-4"></img>
                <p>This is a popup</p>
                <a href="https://react-leaflet.js.org/">Go to link!</a>
              </div>
            </Popup>
          </Marker>
        ))}
        {/* <Marker position={[51.505, -0.09]} icon={customIcon}>
      <Popup>
        <div className=" flex flex-col px-4 py-2 justify-center items-center">
          <img src="vite.svg" className=" w-[150px] mb-4"></img>
          <p>This is a popup</p>
          <a href="https://react-leaflet.js.org/">Go to link!</a>
        </div>
      </Popup>
    </Marker> */}
        <LeafletControlGeocoder />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default Map;

