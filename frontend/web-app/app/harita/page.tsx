'use client'

import { useState } from 'react'
// import { motion } from 'framer-motion'
import { MapPin, Filter, Search, Star, Heart, Share2 } from 'lucide-react'
import { MapView } from '@/components/map/MapView'
import MapSearch from '@/components/map/MapSearch'

interface Property {
  id: string
  title: string
  price: number
  location: [number, number]
  type: string
  image: string
  address: string
  rating: number
  bedrooms?: number
  bathrooms?: number
  area: number
  isFavorite: boolean
}

export default function HaritaPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([32.8597, 39.9334]) // Ankara
  const [mapZoom, setMapZoom] = useState(10)
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split')
  const [showFilters, setShowFilters] = useState(false)

  // Mock properties data
  const properties: Property[] = [
    {
      id: '1',
      title: 'Modern Daire - Beşiktaş',
      price: 2500000,
      location: [28.9784, 41.0421],
      type: 'daire',
      image: '/images/listing1.jpg',
      address: 'Beşiktaş Mahallesi, Beşiktaş/İstanbul',
      rating: 4.8,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      isFavorite: false
    },
    {
      id: '2',
      title: 'Lüks Villa - Antalya',
      price: 4500000,
      location: [30.7133, 36.8969],
      type: 'villa',
      image: '/images/listing2.jpg',
      address: 'Muratpaşa Merkez, Muratpaşa/Antalya',
      rating: 4.6,
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      isFavorite: true
    },
    {
      id: '3',
      title: 'Ticari Dükkan - İzmir',
      price: 1200000,
      location: [27.1428, 38.4237],
      type: 'dükkan',
      image: '/images/listing3.jpg',
      address: 'Konak Merkez, Konak/İzmir',
      rating: 4.5,
      area: 80,
      isFavorite: false
    },
    {
      id: '4',
      title: 'Ofis - Ankara',
      price: 1800000,
      location: [32.8597, 39.9334],
      type: 'ofis',
      image: '/images/listing4.jpg',
      address: 'Çankaya Merkez, Çankaya/Ankara',
      rating: 4.7,
      area: 150,
      isFavorite: false
    },
    {
      id: '5',
      title: 'Bahçeli Daire - Bursa',
      price: 1800000,
      location: [29.0610, 40.1885],
      type: 'daire',
      image: '/images/listing5.jpg',
      address: 'Nilüfer Merkez, Nilüfer/Bursa',
      rating: 4.4,
      bedrooms: 2,
      bathrooms: 1,
      area: 95,
      isFavorite: false
    }
  ]

  const handleLocationSelect = (coordinates: [number, number], address: string) => {
    setMapCenter(coordinates)
    setMapZoom(15)
  }

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
    // Search logic would be implemented here
  }

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
    setMapCenter(property.location)
    setMapZoom(16)
  }

  const toggleFavorite = (propertyId: string) => {
    // Toggle favorite logic would be implemented here
    console.log('Toggle favorite:', propertyId)
  }

  const formatPrice = (price: number) => {
    // Server-side rendering için sabit format
    if (typeof window === 'undefined') {
      return `${price.toLocaleString('tr-TR')} ₺`
    }
    // Client-side için de aynı format
    return `${price.toLocaleString('tr-TR')} ₺`
  }

  const formatArea = (area: number) => {
    return `${area}m²`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Harita Görünümü</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>Gayrimenkul Haritası</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Harita
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'split'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bölünmüş
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <MapSearch
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            placeholder="Şehir, ilçe, mahalle veya adres ara..."
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className={`${viewMode === 'list' ? 'hidden' : 'lg:col-span-2'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Gayrimenkul Haritası</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Filtreler"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Yakınlaştır"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setMapZoom(Math.max(mapZoom - 1, 5))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Uzaklaştır"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 17l9 4 9-4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="h-[600px] rounded-lg overflow-hidden">
                <MapView
                  properties={properties}
                  onPropertyClick={handlePropertyClick}
                  center={mapCenter}
                  zoom={mapZoom}
                />
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className={`${viewMode === 'map' ? 'hidden' : 'lg:col-span-1'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  İlanlar ({properties.length})
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtrele
                </button>
              </div>

              {/* Properties Grid */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={() => handlePropertyClick(property)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedProperty?.id === property.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {/* Property Image */}
                    <div className="relative mb-3">
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      
                      {/* Property Type Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                          {property.type}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(property.id)
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            property.isFavorite
                              ? 'text-red-500 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Property Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {property.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {property.address}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(property.price)}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{property.rating}</span>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          {property.bedrooms && (
                            <span>{property.bedrooms} Yatak</span>
                          )}
                          {property.bathrooms && (
                            <span>{property.bathrooms} Banyo</span>
                          )}
                          <span>{formatArea(property.area)}</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Share logic would be implemented here
                            console.log('Share property:', property.id)
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Property Details */}
        {selectedProperty && (
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedProperty.title}
              </h2>
                              <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Image */}
              <div className="relative">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-gray-400" />
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                    {selectedProperty.type}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {formatPrice(selectedProperty.price)}
                  </h3>
                  <p className="text-gray-600">{selectedProperty.address}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{selectedProperty.rating}</span>
                    <span className="text-gray-500">/ 5</span>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(selectedProperty.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedProperty.isFavorite
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        selectedProperty.isFavorite ? 'fill-current' : ''
                      }`}
                    />
                    <span>
                      {selectedProperty.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedProperty.bedrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {selectedProperty.bedrooms}
                      </div>
                      <div className="text-sm text-gray-600">Yatak Odası</div>
                    </div>
                  )}
                  
                  {selectedProperty.bathrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {selectedProperty.bathrooms}
                      </div>
                      <div className="text-sm text-gray-600">Banyo</div>
                    </div>
                  )}
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatArea(selectedProperty.area)}
                    </div>
                    <div className="text-sm text-gray-600">Alan</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      {selectedProperty.type}
                    </div>
                    <div className="text-sm text-gray-600">Tip</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    İletişime Geç
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Detayları Gör
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
