'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '@/lib/types'
import { getTypeColor } from '@/lib/utils'

const PARIS_9: [number, number] = [48.8771, 2.3385]
const DEFAULT_ZOOM = 15

// Airbnb-style: small dot when idle, labeled pill when selected
function createDotMarker(type: string) {
  const color = getTypeColor(type)
  return L.divIcon({
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.22);
    "></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

function createPillMarker(type: string, name: string) {
  const color = getTypeColor(type)
  const display = name.length > 20 ? name.slice(0, 20) + '\u2026' : name
  return L.divIcon({
    html: `<div style="
      background:${color};
      color:white;
      border:2.5px solid white;
      border-radius:100px;
      padding:7px 14px 7px 10px;
      font-size:13px;
      font-weight:700;
      white-space:nowrap;
      box-shadow:0 6px 24px rgba(0,0,0,0.28);
      font-family:-apple-system,BlinkMacSystemFont,sans-serif;
      display:flex;
      align-items:center;
      gap:7px;
      letter-spacing:-0.01em;
    ">
      <span style="width:7px;height:7px;background:rgba(255,255,255,0.55);border-radius:50%;display:block;flex-shrink:0;"></span>
      ${display}
    </div>`,
    className: '',
    iconSize: [0, 0],
    iconAnchor: [-8, 22],
  })
}

function FlyToPlace({ place }: { place: Place | null }) {
  const map = useMap()
  useEffect(() => {
    if (place?.lat && place?.lng) {
      map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 16), { duration: 0.45 })
    }
  }, [place, map])
  return null
}

interface Props {
  places: Place[]
  selectedPlace: Place | null
  onSelectPlace: (place: Place) => void
}

export default function MapView({ places, selectedPlace, onSelectPlace }: Props) {
  const withCoords = places.filter(p => p.lat !== null && p.lng !== null)

  return (
    <MapContainer
      center={PARIS_9}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        maxZoom={19}
      />
      <FlyToPlace place={selectedPlace} />
      {withCoords.map(place => (
        <Marker
          key={place.id}
          position={[place.lat!, place.lng!]}
          icon={
            selectedPlace?.id === place.id
              ? createPillMarker(place.type, place.name)
              : createDotMarker(place.type)
          }
          eventHandlers={{ click: () => onSelectPlace(place) }}
        />
      ))}
    </MapContainer>
  )
}
