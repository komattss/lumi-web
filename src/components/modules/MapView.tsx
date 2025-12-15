"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in React-Leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const locations = [
  { id: 1, position: [51.505, -0.09], name: "London" },
  { id: 2, position: [48.8566, 2.3522], name: "Paris" },
  { id: 3, position: [40.7128, -74.006], name: "New York" },
];

export default function MapView() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={3}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.position as [number, number]}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{location.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
