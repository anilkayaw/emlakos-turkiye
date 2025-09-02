'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Square } from 'lucide-react'
import { motion } from 'framer-motion'
import { PropertyImage } from '@/components/ui/OptimizedImage'

interface Property {
  id: string
  title: string
  price: number
  type: 'Satılık' | 'Kiralık'
  location: string
  image: string
  rooms: number
  bathrooms?: number
  area: number
  isFavorite: boolean
  buildingAge?: number
  floor?: number
  totalFloors?: number
}

interface PropertyCardProps {
  property: Property
  onToggleFavorite?: (id: string) => void
  className?: string
  priority?: boolean
}

export function PropertyCard({ 
  property, 
  onToggleFavorite, 
  className = '',
  priority = false 
}: PropertyCardProps) {
  const formatPrice = (price: number, type: string) => {
    if (type === 'Kiralık') {
      return `${price.toLocaleString('tr-TR')} ₺/ay`
    }
    return `${price.toLocaleString('tr-TR')} ₺`
  }

  const handleFavoriteClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(property.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${className}`}
      data-test="property-card"
      data-analytics-action="property-card-view"
      data-property-id={property.id}
    >
      <Link href={`/ilan/${property.id}`} className="block">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <PropertyImage
            src={property.image}
            alt={property.title}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            priority={priority}
            onClick={() => window.location.href = `/ilan/${property.id}`}
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
            data-test="property-card-favorite"
            data-analytics-action="favorite-toggle"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                property.isFavorite 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-400 hover:text-red-500'
              }`} 
            />
          </button>
          
          {/* Property Type Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-sm rounded-full font-medium">
            {property.type}
          </div>
        </div>
        
        {/* Property Details */}
        <div className="p-6">
          {/* Title and Location */}
          <h3 
            className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors"
            data-test="property-card-title"
          >
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate" data-test="property-card-location">
              {property.location}
            </span>
          </div>
          
          {/* Property Features */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              {property.rooms > 0 && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span data-test="property-card-rooms">{property.rooms} Oda</span>
                </div>
              )}
              
              {property.bathrooms && property.bathrooms > 0 && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span data-test="property-card-bathrooms">{property.bathrooms} Banyo</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span data-test="property-card-area">{property.area}m²</span>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          {(property.buildingAge || property.floor) && (
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              {property.buildingAge && (
                <span data-test="property-card-age">{property.buildingAge} yaşında</span>
              )}
              {property.floor && property.totalFloors && (
                <span data-test="property-card-floor">
                  {property.floor}/{property.totalFloors}. Kat
                </span>
              )}
            </div>
          )}
          
          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <span 
              className="text-2xl font-bold text-primary-600"
              data-test="property-card-price"
            >
              {formatPrice(property.price, property.type)}
            </span>
            
            <span className="text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-transform">
              Detaylar →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PropertyCard