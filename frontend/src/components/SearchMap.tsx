'use client'

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SearchResult } from '@/lib/types'

// Fix for Next.js Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const userIcon = new L.DivIcon({
  html: `<div class="relative flex items-center justify-center">
           <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75"></span>
           <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow"></span>
         </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const pharmacyIcon = (status: string) => {
  const color = status === 'IN_STOCK' ? 'bg-[#173822]' : status === 'LOW_STOCK' ? 'bg-[#8b9d77]' : 'bg-rose-500';
  return new L.DivIcon({
    html: `<div class="flex items-center justify-center">
             <div class="h-7 w-7 rounded-full ${color} text-white flex items-center justify-center shadow-md border border-white transform transition-transform hover:scale-110">
               <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
             </div>
           </div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Component to handle map panning / refocusing
function MapController({ 
  center, 
  zoom, 
  selectedPharmacy 
}: { 
  center: [number, number], 
  zoom: number, 
  selectedPharmacy: SearchResult | null 
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedPharmacy) {
      map.setView([selectedPharmacy.latitude, selectedPharmacy.longitude], 15, {
        animate: true,
        duration: 1.0
      })
    } else {
      map.setView(center, zoom, {
        animate: true,
        duration: 0.8
      })
    }
  }, [selectedPharmacy, center, zoom, map])

  return null
}

interface SearchMapProps {
  userLat: number
  userLng: number
  results: SearchResult[]
  radiusKm: number
  selectedPharmacyId: number | null
  onSelectPharmacy: (pharmacy: SearchResult) => void
}

export default function SearchMap({
  userLat,
  userLng,
  results,
  radiusKm,
  selectedPharmacyId,
  onSelectPharmacy
}: SearchMapProps) {
  const [mapKey, setMapKey] = useState(0)
  const selectedPharmacy = results.find(r => r.pharmacyId === selectedPharmacyId) || null

  // Force mount on client side
  useEffect(() => {
    setMapKey(prev => prev + 1)
  }, [])

  if (mapKey === 0) {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2 border-l border-slate-200">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#173822] border-t-transparent"></div>
        <p className="text-sm font-semibold">Loading Search Map...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        key={mapKey}
        center={[userLat, userLng]}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        <Marker position={[userLat, userLng]} icon={userIcon}>
          <Popup>
            <div className="p-1 font-medium text-slate-800 text-xs">Current Location</div>
          </Popup>
        </Marker>

        {/* Radius Circle */}
        <Circle
          center={[userLat, userLng]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.08,
            weight: 1
          }}
        />

        {/* Pharmacy Markers */}
        {results.map((pharmacy) => (
          <Marker
            key={pharmacy.pharmacyId}
            position={[pharmacy.latitude, pharmacy.longitude]}
            icon={pharmacyIcon(pharmacy.status)}
            eventHandlers={{
              click: () => {
                onSelectPharmacy(pharmacy)
              }
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]" style={{ fontFamily: 'var(--font-outfit)' }}>
                <h4 className="font-bold text-sm text-slate-900 mb-0.5">{pharmacy.pharmacyName}</h4>
                <p className="text-slate-500 text-xs mb-2">{pharmacy.address}</p>
                <div className="border-t border-slate-100 my-2"></div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Price:</span>
                  <span className="font-bold text-slate-900">Rs. {pharmacy.price}</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-500">Qty:</span>
                  <span className="font-bold text-slate-900">{pharmacy.quantityInStock} pcs</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-500">Distance:</span>
                  <span className="font-bold text-[#173822]">{pharmacy.distanceKm.toFixed(1)} km</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapController 
          center={[userLat, userLng]} 
          zoom={13} 
          selectedPharmacy={selectedPharmacy} 
        />
      </MapContainer>
    </div>
  )
}
