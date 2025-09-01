'use client'

import React, { useState, useEffect } from 'react'
// // import { motion } from 'framer-motion'
import { MapPin, Search, Filter, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic imports for Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false })

interface Property {
  id: string
  title: string
  price: number
  location: [number, number]
  type: string
  bedrooms?: number
  bathrooms?: number
  area?: number
}

interface MapViewProps {
  properties?: Property[]
  onPropertyClick?: (property: Property) => void
  center?: [number, number]
  zoom?: number
}

export function MapView({ 
  properties = [], 
  onPropertyClick, 
  center = [41.0082, 28.9784], // İstanbul
  zoom = 10 
}: MapViewProps) {
  const [mapRef, setMapRef] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mapStyle, setMapStyle] = useState('osm')
  const [displayProperties, setDisplayProperties] = useState<Property[]>(properties)

  // Mock data - gerçek uygulamada API'den gelecek
  const mockProperties: Property[] = [
    {
      id: '1',
      title: 'Lüks Daire - Beşiktaş',
      price: 2500000,
      location: [41.0422, 29.0083],
      type: 'daire',
      bedrooms: 3,
      bathrooms: 2,
      area: 120
    },
    {
      id: '2',
      title: 'Villa - Sarıyer',
      price: 8500000,
      location: [41.1671, 29.0571],
      type: 'villa',
      bedrooms: 4,
      bathrooms: 3,
      area: 280
    },
    {
      id: '3',
      title: 'Dükkan - Kadıköy',
      price: 3200000,
      location: [40.9909, 29.0303],
      type: 'dükkan',
      area: 80
    },
    {
      id: '4',
      title: 'Ofis - Şişli',
      price: 1800000,
      location: [41.0602, 28.9877],
      type: 'ofis',
      area: 150
    }
  ]

  useEffect(() => {
    if (properties.length === 0) {
      setDisplayProperties(mockProperties)
    } else {
      setDisplayProperties(properties)
    }
  }, [properties])

  const changeMapStyle = (style: string) => {
    setMapStyle(style)
  }

  const formatPrice = (price: number) => {
    // Server-side rendering için sabit format
    if (typeof window === 'undefined') {
      return `${price.toLocaleString('tr-TR')} ₺`
    }
    // Client-side için de aynı format
    return `${price.toLocaleString('tr-TR')} ₺`
  }

  const getTileLayer = () => {
    switch (mapStyle) {
      case 'satellite':
        return (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        )
      case 'terrain':
        return (
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>'
          />
        )
      case 'dark':
        return (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        )
      default:
        return (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )
    }
  }

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        ref={setMapRef}
      >
        {getTileLayer()}

        {/* Property Markers */}
        {displayProperties.map((property) => (
          <Marker
            key={property.id}
            position={property.location}
            className="custom-property-marker"
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-primary-600 font-bold mb-2">
                  {formatPrice(property.price)}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  {property.bedrooms && (
                    <p>Yatak Odası: {property.bedrooms}</p>
                  )}
                  {property.bathrooms && (
                    <p>Banyo: {property.bathrooms}</p>
                  )}
                  {property.area && (
                    <p>Alan: {property.area}m²</p>
                  )}
                </div>
                <button
                  onClick={() => onPropertyClick?.(property)}
                  className="mt-3 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  Detayları Gör
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Zoom Control */}
        <ZoomControl position="topright" />
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className="bg-white rounded-lg shadow-lg p-2 space-y-2"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Filtreler"
          >
            <Filter className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => changeMapStyle(mapStyle === 'osm' ? 'satellite' : 'osm')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Harita Stili"
          >
            {/* Hata: 'Layers' bulunamadı. Doğru ikonu import edin veya değiştirin */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 17l9 4 9-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className="bg-white rounded-lg shadow-lg p-1"
        >
          <button
            onClick={() => mapRef?.zoomIn()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors block"
            title="Yakınlaştır"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapRef?.zoomOut()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors block"
            title="Uzaklaştır"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div
          className="absolute top-20 left-4 z-10 bg-white rounded-lg shadow-lg p-4 min-w-[250px]"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Harita Filtreleri</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mülk Tipi
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Tümü</option>
                <option value="daire">Daire</option>
                <option value="villa">Villa</option>
                <option value="dükkan">Dükkan</option>
                <option value="ofis">Ofis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat Aralığı
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Tümü</option>
                <option value="0-1000000">0 - 1.000.000 TL</option>
                <option value="1000000-3000000">1.000.000 - 3.000.000 TL</option>
                <option value="3000000+">3.000.000+ TL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harita Stili
              </label>
              <select 
                value={mapStyle}
                onChange={(e) => changeMapStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="osm">OpenStreetMap</option>
                <option value="satellite">Uydu</option>
                <option value="terrain">Arazi</option>
                <option value="dark">Koyu</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Property List Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div
          className="bg-white rounded-lg shadow-lg p-4 max-h-32 overflow-y-auto"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Yakındaki İlanlar</h3>
          <div className="flex space-x-3 overflow-x-auto">
            {displayProperties.slice(0, 4).map((property) => (
              <div
                key={property.id}
                onClick={() => onPropertyClick?.(property)}
                className="flex-shrink-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors min-w-[200px]"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {property.title}
                    </h4>
                    <p className="text-sm text-primary-600 font-semibold">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaflet CSS */}
      <style jsx global>{`
        .custom-property-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .leaflet-popup-tip {
          background: white !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: none !important;
          border-radius: 8px !important;
          margin: 2px !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 18px !important;
          font-weight: bold !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
          color: #1f2937 !important;
        }
      `}</style>
    </div>
  )
}
