/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import icon from '../../public/busicon.avif'
import L from 'leaflet';
// Fix for default marker icon issue with Webpack/React
// This is a common workaround for Leaflet's default icon not showing up
// due to webpack's asset handling.


interface MapComponentProps {
  position: [number, number]; // Latitude and Longitude
  zoom: number;
  popupText: string; // Text to display in the marker's popup
}
export  const customIcon = L.icon({
    iconUrl: icon,
    iconSize: [20, 20],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
const MapComponent: React.FC<MapComponentProps> = ({ position, zoom, popupText }) => {
  return (
    <div className="w-full z-30 h-80 md:h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={position} // Initial map center [latitude, longitude]
        zoom={zoom}      // Initial zoom level
        scrollWheelZoom={false} // Disable scroll wheel zoom for better UX on pages
        className="h-full w-full" // Ensure map container takes full height and width
      >
        {/* Tile Layer: This is the actual map tiles (OpenStreetMap) */}
       <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

        {/* Marker: Represents a specific point on the map */}
        <Marker position={position} icon={customIcon}>
          {/* Popup: Content that appears when the marker is clicked */}
          <Popup>
            <img src={icon} alt="bus" width="40" height="40" />
            {popupText}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
