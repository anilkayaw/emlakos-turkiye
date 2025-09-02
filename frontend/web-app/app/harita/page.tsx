'use client'

import React, { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { MapContainer } from '@/components/map/MapContainer'
import { PropertyList } from '@/components/property/PropertyList'
import { FilterMenu } from '@/components/filters/FilterMenu'
import { usePropertyStore } from '@/store/usePropertyStore'

export default function HaritaPage() {
  const {
    listingType,
    mapCenter,
    mapZoom,
    setListingType,
    fetchProperties,
    mapBounds
  } = usePropertyStore()

  // Initialize map with default bounds
  useEffect(() => {
    if (!mapBounds) {
      // Set default bounds for Istanbul
      const defaultBounds = {
        ne_lat: 41.2,
        ne_lng: 29.2,
        sw_lat: 40.8,
        sw_lng: 28.6
      }
      
      fetchProperties(defaultBounds, listingType)
    }
  }, [mapBounds, listingType, fetchProperties])

  const handleListingTypeChange = (type: 'sale' | 'rent') => {
    setListingType(type)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header 
        onListingTypeChange={handleListingTypeChange}
        currentListingType={listingType}
        className="sticky top-0 z-30"
      />

      {/* Main Content */}
      <div className="flex h-screen pt-16">
        {/* Left Side - Map */}
        <div className="flex-1 lg:w-3/5">
          <MapContainer 
            className="w-full"
            height="calc(100vh - 4rem)"
          />
        </div>

        {/* Right Side - Property List */}
        <div className="w-full lg:w-2/5 flex flex-col">
          {/* Filters */}
          <div className="bg-white border-b border-gray-200 p-4">
            <FilterMenu 
              variant="dropdown"
              className="w-full"
            />
          </div>

          {/* Property List */}
          <div className="flex-1">
            <PropertyList 
              className="w-full"
              height="calc(100vh - 8rem)"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Tabs */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex">
            <button className="flex-1 py-3 text-center text-sm font-medium text-primary-600 border-b-2 border-primary-600">
              Harita
            </button>
            <button className="flex-1 py-3 text-center text-sm font-medium text-gray-500">
              Liste
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}