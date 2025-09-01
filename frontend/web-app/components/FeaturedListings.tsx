'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Square, Star } from 'lucide-react'
// // import { motion } from 'framer-motion'

// Mock data - gerçek uygulamada API'den gelecek
const mockListings = [
  {
    id: '1',
    title: 'Modern 3+1 Daire',
    location: 'Kadıköy, İstanbul',
    price: '2.450.000',
    priceType: 'TL',
    image: '/api/placeholder/400/300',
    propertyType: 'Daire',
    rooms: '3+1',
    sqm: 125,
    floor: '5',
    totalFloors: '12',
    isFavorite: false,
    rating: 4.8,
    reviews: 24,
    features: ['Asansör', 'Otopark', 'Güvenlik', 'Merkezi Isıtma']
  },
  {
    id: '2',
    title: 'Lüks Villa',
    location: 'Belek, Antalya',
    price: '8.900.000',
    priceType: 'TL',
    image: '/api/placeholder/400/300',
    propertyType: 'Villa',
    rooms: '5+2',
    sqm: 280,
    floor: 'Tek Kat',
    totalFloors: '1',
    isFavorite: true,
    rating: 4.9,
    reviews: 18,
    features: ['Havuz', 'Bahçe', 'Otopark', 'Güvenlik']
  },
  {
    id: '3',
    title: 'Ticari Dükkan',
    location: 'Alsancak, İzmir',
    price: '3.200.000',
    priceType: 'TL',
    image: '/api/placeholder/400/300',
    propertyType: 'Dükkan',
    rooms: '2+1',
    sqm: 85,
    floor: 'Zemin',
    totalFloors: '5',
    isFavorite: false,
    rating: 4.6,
    reviews: 12,
    features: ['Cephe', 'Otopark', 'Güvenlik']
  },
  {
    id: '4',
    title: 'Yeni Proje Daire',
    location: 'Çankaya, Ankara',
    price: '1.850.000',
    priceType: 'TL',
    image: '/api/placeholder/400/300',
    propertyType: 'Daire',
    rooms: '2+1',
    sqm: 95,
    floor: '8',
    totalFloors: '15',
    isFavorite: false,
    rating: 4.7,
    reviews: 31,
    features: ['Asansör', 'Otopark', 'Güvenlik', 'Merkezi Soğutma']
  }
]

export function FeaturedListings() {
  const [listings, setListings] = useState(mockListings)

  const toggleFavorite = (id: string) => {
    setListings(listings.map(listing => 
      listing.id === id 
        ? { ...listing, isFavorite: !listing.isFavorite }
        : listing
    ))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {listings.map((listing, index) => (
        <div
          key={listing.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="card-hover group"
        >
          <Link href={`/ilan/${listing.id}`}>
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-secondary-200 to-secondary-300 flex items-center justify-center">
                <div className="text-6xl text-secondary-400">🏠</div>
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  toggleFavorite(listing.id)
                }}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 group-hover:scale-110"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    listing.isFavorite 
                      ? 'text-error-500 fill-current' 
                      : 'text-secondary-400'
                  }`} 
                />
              </button>

              {/* Property Type Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                {listing.propertyType}
              </div>

              {/* Rating */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full">
                <Star className="w-4 h-4 text-accent-500 fill-current" />
                <span className="text-sm font-medium text-secondary-900">
                  {listing.rating}
                </span>
                <span className="text-xs text-secondary-600">
                  ({listing.reviews})
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title and Location */}
              <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                {listing.title}
              </h3>
              
              <div className="flex items-center gap-1 text-secondary-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{listing.location}</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-primary-600 mb-3">
                {listing.price} {listing.priceType}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex items-center gap-1 text-sm text-secondary-600">
                  <Bed className="w-4 h-4" />
                  <span>{listing.rooms}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-secondary-600">
                  <Bath className="w-4 h-4" />
                  <span>{listing.rooms.split('+')[0]}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-secondary-600">
                  <Square className="w-4 h-4" />
                  <span>{listing.sqm}m²</span>
                </div>
              </div>

              {/* Floor Info */}
              <div className="text-sm text-secondary-600 mb-3">
                {listing.floor} / {listing.totalFloors}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {listing.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {listing.features.length > 3 && (
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                    +{listing.features.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
