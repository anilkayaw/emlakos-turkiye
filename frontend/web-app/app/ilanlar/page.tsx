'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Grid, List, Heart, Bed, Bath, Square, Star } from 'lucide-react'
import Link from 'next/link'

// Mock data for listings
const mockListings = [
  {
    id: '1',
    title: 'Modern Daire - Beşiktaş',
    price: 2500000,
    location: 'Beşiktaş, İstanbul',
    type: 'daire',
    rooms: 3,
    bathrooms: 2,
    area: 120,
    image: '/images/listing1.jpg',
    isFavorite: false,
    rating: 4.8,
    description: 'Deniz manzaralı, modern tasarım, merkezi konumda'
  },
  {
    id: '2',
    title: 'Lüks Villa - Antalya',
    price: 4500000,
    location: 'Konyaaltı, Antalya',
    type: 'villa',
    rooms: 5,
    bathrooms: 4,
    area: 250,
    image: '/images/listing2.jpg',
    isFavorite: true,
    rating: 4.9,
    description: 'Havuzlu, bahçeli, deniz manzaralı villa'
  },
  {
    id: '3',
    title: 'Ticari Dükkan - İzmir',
    price: 1200000,
    location: 'Konak, İzmir',
    type: 'dükkan',
    rooms: 1,
    bathrooms: 1,
    area: 80,
    image: '/images/listing3.jpg',
    isFavorite: false,
    rating: 4.5,
    description: 'Ana cadde üzerinde, ticari kullanıma uygun'
  },
  {
    id: '4',
    title: 'Ofis - Ankara',
    price: 1800000,
    location: 'Çankaya, Ankara',
    type: 'ofis',
    rooms: 4,
    bathrooms: 2,
    area: 150,
    image: '/images/listing4.jpg',
    isFavorite: false,
    rating: 4.6,
    description: 'Merkezi konumda, modern ofis binası'
  },
  {
    id: '5',
    title: 'Arsa - Bursa',
    price: 800000,
    location: 'Nilüfer, Bursa',
    type: 'arsa',
    rooms: 0,
    bathrooms: 0,
    area: 500,
    image: '/images/listing5.jpg',
    isFavorite: true,
    rating: 4.3,
    description: 'İmar durumu uygun, yatırım için ideal'
  },
  {
    id: '6',
    title: 'Penthouse - İstanbul',
    price: 6500000,
    location: 'Şişli, İstanbul',
    type: 'daire',
    rooms: 4,
    bathrooms: 3,
    area: 200,
    image: '/images/listing6.jpg',
    isFavorite: false,
    rating: 4.9,
    description: 'Şehir manzaralı, lüks penthouse'
  }
]

export default function IlanlarPage() {
  const [listings, setListings] = useState(mockListings)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('price-asc')

  // Filter listings based on search criteria
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || listing.type === selectedType
    const matchesCity = !selectedCity || listing.location.toLowerCase().includes(selectedCity.toLowerCase())
    
    let matchesPrice = true
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      if (max) {
        matchesPrice = listing.price >= min && listing.price <= max
      } else {
        matchesPrice = listing.price >= min
      }
    }

    return matchesSearch && matchesType && matchesCity && matchesPrice
  })

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'rating-desc':
        return b.rating - a.rating
      case 'area-desc':
        return b.area - a.area
      default:
        return 0
    }
  })

  const toggleFavorite = (id: string) => {
    setListings(listings.map(listing => 
      listing.id === id ? { ...listing, isFavorite: !listing.isFavorite } : listing
    ))
  }

  const formatPrice = (price: number) => {
    // Server-side rendering için sabit format
    if (typeof window === 'undefined') {
      return `${price.toLocaleString('tr-TR')} ₺`
    }
    // Client-side için de aynı format
    return `${price.toLocaleString('tr-TR')} ₺`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">İlanlar</h1>
              <p className="text-gray-600 mt-1">
                {sortedListings.length} ilan bulundu
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
              
              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arama
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="İlan ara..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mülk Tipi
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="daire">Daire</option>
                  <option value="villa">Villa</option>
                  <option value="dükkan">Dükkan</option>
                  <option value="ofis">Ofis</option>
                  <option value="arsa">Arsa</option>
                </select>
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şehir
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="istanbul">İstanbul</option>
                  <option value="ankara">Ankara</option>
                  <option value="izmir">İzmir</option>
                  <option value="bursa">Bursa</option>
                  <option value="antalya">Antalya</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat Aralığı
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="0-1000000">0 - 1.000.000 TL</option>
                  <option value="1000000-2500000">1.000.000 - 2.500.000 TL</option>
                  <option value="2500000-5000000">2.500.000 - 5.000.000 TL</option>
                  <option value="5000000">5.000.000+ TL</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
                  <option value="price-desc">Fiyat (Yüksek → Düşük)</option>
                  <option value="rating-desc">En Yüksek Puan</option>
                  <option value="area-desc">En Büyük Alan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid/List */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedListings.map((listing, index) => (
                  <div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Resim Yükleniyor...</span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(listing.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Heart 
                          className={`w-5 h-5 ${listing.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                        />
                      </button>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
                          {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{listing.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{listing.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {listing.rooms > 0 && (
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            <span>{listing.rooms}</span>
                          </div>
                        )}
                        {listing.bathrooms > 0 && (
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span>{listing.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{listing.area} m²</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary-600">
                          {formatPrice(listing.price)}
                        </div>
                        <Link
                          href={`/ilan/${listing.id}`}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                        >
                          Detay
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedListings.map((listing, index) => (
                  <div
                    key={listing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">Resim</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {listing.title}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{listing.location}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(listing.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Heart 
                              className={`w-5 h-5 ${listing.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          {listing.rooms > 0 && (
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              <span>{listing.rooms} oda</span>
                            </div>
                          )}
                          {listing.bathrooms > 0 && (
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              <span>{listing.bathrooms} banyo</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            <span>{listing.area} m²</span>
                          </div>
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-gray-600 ml-1">{listing.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {listing.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-primary-600">
                            {formatPrice(listing.price)}
                          </div>
                          <Link
                            href={`/ilan/${listing.id}`}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                          >
                            Detay
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sortedListings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  İlan bulunamadı
                </h3>
                <p className="text-gray-600">
                  Arama kriterlerinizi değiştirerek tekrar deneyin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
