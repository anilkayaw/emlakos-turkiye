'use client'

import React, { useEffect, useRef } from 'react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { PropertyCard } from './PropertyCard'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressiveLoading } from '@/lib/hooks/useLazyLoading'

interface PropertyListProps {
  className?: string
  height?: string
}

export function PropertyList({ className = '', height = '100vh' }: PropertyListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  
  const {
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    isLoading,
    error
  } = usePropertyStore()

  // Progressive loading for better performance
  const { visibleItems, hasMore, ref: loadMoreRef } = useProgressiveLoading(filteredProperties, 10)

  // Scroll to selected property
  useEffect(() => {
    if (selectedProperty && listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-property-id="${selectedProperty.id}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }
  }, [selectedProperty])

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property)
  }

  const handleToggleFavorite = (propertyId: string) => {
    // TODO: Implement favorite toggle functionality
    console.log('Toggle favorite:', propertyId)
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`} style={{ height }}>
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hata Oluştu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-50 ${className}`} style={{ height }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Mülk Listesi
          </h2>
          <div className="text-sm text-gray-500">
            {visibleItems.length} / {filteredProperties.length} ilan
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-4">
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Properties List */}
      {!isLoading && (
        <div 
          ref={listRef}
          className="overflow-y-auto h-full"
          style={{ height: `calc(${height} - 80px)` }}
          data-test="property-list"
          data-analytics-action="property-list-view"
        >
          {visibleItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <div className="text-gray-400 mb-4">🏠</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  İlan Bulunamadı
                </h3>
                <p className="text-gray-600">
                  Bu bölgede aradığınız kriterlere uygun ilan bulunmuyor.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <AnimatePresence>
                {visibleItems.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedProperty?.id === property.id 
                        ? 'ring-2 ring-primary-500 ring-opacity-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handlePropertyClick(property)}
                    data-property-id={property.id}
                    data-test={`property-item-${property.id}`}
                    data-analytics-action="property-item-click"
                  >
                    <PropertyCard
                      property={{
                        id: property.id.toString(),
                        title: property.title,
                        price: property.price,
                        type: property.listingType === 'rent' ? 'Kiralık' : 'Satılık',
                        location: property.address,
                        image: property.imageUrl,
                        rooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        area: property.area || 0,
                        isFavorite: false, // TODO: Get from user favorites
                        buildingAge: property.buildingAge,
                        floor: property.floor,
                        totalFloors: property.totalFloors
                      }}
                      onToggleFavorite={handleToggleFavorite}
                      className={`${
                        selectedProperty?.id === property.id 
                          ? 'bg-primary-50 border-primary-200' 
                          : 'bg-white'
                      }`}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Load More Trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      {!isLoading && filteredProperties.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {filteredProperties.length} ilan gösteriliyor
            </div>
            <button
              onClick={() => {
                if (listRef.current) {
                  listRef.current.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Yukarı Git ↑
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyList
