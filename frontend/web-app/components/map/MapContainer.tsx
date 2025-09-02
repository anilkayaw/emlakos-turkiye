'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { motion } from 'framer-motion'

interface MapContainerProps {
  className?: string
  height?: string
}

// Google Maps marker interface
interface MapMarker {
  id: number
  position: { lat: number; lng: number }
  property: any
  marker?: google.maps.Marker
}

export function MapContainer({ className = '', height = '100vh' }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<MapMarker[]>([])
  
  const {
    filteredProperties,
    selectedProperty,
    mapCenter,
    mapZoom,
    updateMapView,
    setSelectedProperty,
    isLoading
  } = usePropertyStore()

  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        // Check if Google Maps is loaded
        if (typeof window.google === 'undefined' || !window.google.maps) {
          throw new Error('Google Maps API not loaded')
        }

        // Create map instance
        const map = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: mapZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy'
        })

        mapInstanceRef.current = map
        setIsMapLoaded(true)

        // Add map event listeners
        map.addListener('bounds_changed', () => {
          const bounds = map.getBounds()
          if (bounds) {
            const ne = bounds.getNorthEast()
            const sw = bounds.getSouthWest()
            
            updateMapView(
              {
                ne_lat: ne.lat(),
                ne_lng: ne.lng(),
                sw_lat: sw.lat(),
                sw_lng: sw.lng()
              },
              {
                lat: map.getCenter()?.lat() || mapCenter.lat,
                lng: map.getCenter()?.lng() || mapCenter.lng
              },
              map.getZoom() || mapZoom
            )
          }
        })

        map.addListener('center_changed', () => {
          const center = map.getCenter()
          if (center) {
            updateMapView(
              {
                ne_lat: map.getBounds()?.getNorthEast().lat() || 0,
                ne_lng: map.getBounds()?.getNorthEast().lng() || 0,
                sw_lat: map.getBounds()?.getSouthWest().lat() || 0,
                sw_lng: map.getBounds()?.getSouthWest().lng() || 0
              },
              { lat: center.lat(), lng: center.lng() },
              map.getZoom() || mapZoom
            )
          }
        })

      } catch (error) {
        console.error('Error initializing map:', error)
        setMapError('Harita yüklenirken bir hata oluştu')
      }
    }

    initializeMap()
  }, [])

  // Update markers when properties change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return

    const map = mapInstanceRef.current

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.marker) {
        marker.marker.setMap(null)
      }
    })
    markersRef.current = []

    // Create new markers
    filteredProperties.forEach(property => {
      const marker = new google.maps.Marker({
        position: { lat: property.latitude, lng: property.longitude },
        map: map,
        title: property.title,
        icon: {
          url: createMarkerIcon(property.price, property.listingType || 'sale'),
          scaledSize: new google.maps.Size(60, 40),
          anchor: new google.maps.Point(30, 40)
        }
      })

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(property)
      })

      // Add click listener
      marker.addListener('click', () => {
        setSelectedProperty(property)
        infoWindow.open(map, marker)
      })

      markersRef.current.push({
        id: property.id,
        position: { lat: property.latitude, lng: property.longitude },
        property,
        marker
      })
    })
  }, [filteredProperties, isMapLoaded])

  // Center map on selected property
  useEffect(() => {
    if (selectedProperty && mapInstanceRef.current) {
      const map = mapInstanceRef.current
      const position = { lat: selectedProperty.latitude, lng: selectedProperty.longitude }
      
      map.panTo(position)
      map.setZoom(Math.max(map.getZoom() || 15, 15))
    }
  }, [selectedProperty])

  // Create custom marker icon
  const createMarkerIcon = (price: number, listingType: string) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    canvas.width = 60
    canvas.height = 40

    // Background
    ctx.fillStyle = listingType === 'rent' ? '#10b981' : '#3b82f6'
    ctx.fillRect(0, 0, 60, 40)

    // Border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, 58, 38)

    // Price text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const priceText = price > 1000 ? `${Math.round(price / 1000)}K` : price.toString()
    ctx.fillText(priceText, 30, 20)

    return canvas.toDataURL()
  }

  // Create info window content
  const createInfoWindowContent = (property: any) => {
    return `
      <div class="p-2 max-w-xs">
        <div class="font-semibold text-sm mb-1">${property.title}</div>
        <div class="text-xs text-gray-600 mb-2">${property.address}</div>
        <div class="text-sm font-bold text-primary-600">
          ${property.price.toLocaleString('tr-TR')} ₺
        </div>
        <div class="text-xs text-gray-500 mt-1">
          ${property.bedrooms} oda, ${property.bathrooms} banyo
        </div>
      </div>
    `
  }

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{mapError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        data-test="map-container"
        data-analytics-action="map-container-view"
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
        >
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Harita yükleniyor...</p>
          </div>
        </motion.div>
      )}
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setCenter(mapCenter)
              mapInstanceRef.current.setZoom(mapZoom)
            }
          }}
          className="bg-white shadow-lg rounded-lg p-2 hover:bg-gray-50 transition-colors"
          data-test="reset-map-button"
          data-analytics-action="reset-map-click"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Property Count */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white shadow-lg rounded-lg px-3 py-2">
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-primary-600">{filteredProperties.length}</span> ilan gösteriliyor
          </span>
        </div>
      </div>
    </div>
  )
}

export default MapContainer
