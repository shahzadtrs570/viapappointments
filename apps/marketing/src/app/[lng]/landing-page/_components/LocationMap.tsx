"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import type { MapContainer as MapContainerType, TileLayer as TileLayerType, Circle as CircleType } from 'react-leaflet'
import type { Map as LeafletMapType } from 'leaflet'

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
}) as typeof MapContainerType

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
}) as typeof TileLayerType

const Circle = dynamic(() => import('react-leaflet').then((mod) => mod.Circle), {
  ssr: false,
}) as typeof CircleType

// Component to handle map center updates
const MapUpdater = dynamic(() => 
  import('react-leaflet').then((mod) => {
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

const Map = dynamic(
  () => import('./Map'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
);

export default function LocationMap() {
  return <Map />;
} 