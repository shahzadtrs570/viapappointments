'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

// Component to handle map center updates
const MapUpdater = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { useMap } = mod;
    return ({ center }: { center: [number, number] }) => {
      const map = useMap();
      useEffect(() => {
        map.setView(center);
      }, [center, map]);
      return null;
    };
  }),
  { ssr: false }
);

export default function Map() {
  // Rawalpindi coordinates
  const defaultCenter: [number, number] = [33.6007, 73.0679];
  const [center, setCenter] = useState(defaultCenter);
  const [radius, setRadius] = useState(5000); // 5km default radius

  // Initialize Leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, []);

  // Zoom level based on radius
  const getZoomLevel = (radiusInMeters: number) => {
    return Math.log2(40000000 / radiusInMeters) - 2;
  };

  return (
    <div className="w-full h-[500px] relative bg-gray-100">
      <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded shadow">
        <select
          className="p-2 border rounded"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        >
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
          <option value={20000}>20 km</option>
          <option value={50000}>50 km</option>
        </select>
      </div>
      
      <MapContainer
        center={center}
        zoom={getZoomLevel(radius)}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={center}
          radius={radius}
          pathOptions={{
            color: '#1D67CD',
            fillColor: '#1D67CD',
            fillOpacity: 0.2,
          }}
        />
        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
} 