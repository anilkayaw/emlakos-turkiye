'use client'

import React, { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  userLocation?: [number, number] | null
}

export function MapView({ 
  center = [41.0082, 28.9784], // İstanbul
  zoom = 10,
  userLocation = null
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Client-side rendering kontrolü
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Harita yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Harita Yüklenemedi</h3>
          <p className="text-gray-500 mb-4">Lütfen sayfayı yenileyin</p>
          <button
            onClick={() => setMapError(false)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Placeholder Map - Gerçek harita yerine */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Map content */}
        <div className="text-center z-10">
          <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">İnteraktif Harita</h3>
          <p className="text-gray-600 mb-4">Konumunuz ve yakındaki ilanlar</p>
          
          {userLocation && (
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Konumunuz</span>
              </div>
              <p className="text-xs text-gray-500">
                Enlem: {userLocation[0].toFixed(4)}<br />
                Boylam: {userLocation[1].toFixed(4)}
              </p>
            </div>
          )}
        </div>

        {/* Mock property markers */}
        <div className="absolute top-8 left-8 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg"></div>
        <div className="absolute top-16 right-12 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg"></div>
        <div className="absolute bottom-20 left-16 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg"></div>
        <div className="absolute bottom-12 right-8 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg"></div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-1">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors block"
            title="Yakınlaştır"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors block"
            title="Uzaklaştır"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Location info */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">İstanbul, Türkiye</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView