'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  return position === null ? null : (
    <Marker position={position}></Marker>
  )
}

export default function MapSelector({ 
    initialLat, 
    initialLng, 
    onLocationSelect 
}: { 
    initialLat: number, 
    initialLng: number, 
    onLocationSelect: (lat: number, lng: number) => void 
}) {
  const [position, setPosition] = useState<L.LatLng | null>(new L.LatLng(initialLat, initialLng))
  const [mapKey, setMapKey] = useState(0)

  // Force remount on client to avoid HMR / StrictMode appendChild issues
  useEffect(() => {
    setMapKey(prev => prev + 1)
  }, [])

  const handlePositionChange = (pos: L.LatLng) => {
    setPosition(pos)
    onLocationSelect(pos.lat, pos.lng)
  }

  if (mapKey === 0) {
      return <div style={{ height: '300px', width: '100%', borderRadius: '0.75rem' }} className="bg-gray-100 flex items-center justify-center text-gray-500 text-sm">Initializing Map...</div>
  }

  return (
    <MapContainer 
        key={mapKey}
        center={[initialLat, initialLng]} 
        zoom={13} 
        style={{ height: '300px', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={handlePositionChange} />
    </MapContainer>
  )
}
