'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, Heart, Bed, Bath, Square } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SearchBanner } from '@/components/layout/Banner'

interface Property {
  id: string
  title: string
  price: number
  currency: string
  type: string
  location: {
    city: string
    district: string
    neighborhood: string
  }
  images: string[]
  features: {
    bedrooms: number
    bathrooms: number
    area: number
  }
  createdAt: string
  isFavorite: boolean
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  const mockListings: Property[] = [
    {
      id: '1',
      title: 'Modern 3+1 Daire - Beşiktaş',
      price: 2500000,
      currency: 'TRY',
      type: 'Satılık',
      location: {
        city: 'İstanbul',
        district: 'Beşiktaş',
        neighborhood: 'Etiler'
      },
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: 120
      },
      createdAt: '2024-01-01T00:00:00Z',
      isFavorite: false
    },
    {
      id: '2',
      title: 'Lüks Villa - Sarıyer',
      price: 8500000,
      currency: 'TRY',
      type: 'Satılık',
      location: {
        city: 'İstanbul',
        district: 'Sarıyer',
        neighborhood: 'Büyükdere'
      },
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
      features: {
        bedrooms: 5,
        bathrooms: 4,
        area: 300
      },
      createdAt: '2024-01-02T00:00:00Z',
      isFavorite: true
    },
    {
      id: '3',
      title: 'Şehir Merkezi Daire - Kadıköy',
      price: 1800000,
      currency: 'TRY',
      type: 'Satılık',
      location: {
        city: 'İstanbul',
        district: 'Kadıköy',
        neighborhood: 'Moda'
      },
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
      features: {
        bedrooms: 2,
        bathrooms: 1,
        area: 85
      },
      createdAt: '2024-01-03T00:00:00Z',
      isFavorite: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListings(mockListings)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSearch = () => {
    console.log('Search:', searchQuery)
  }

  const toggleFavorite = (id: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === id 
        ? { ...listing, isFavorite: !listing.isFavorite }
        : listing
    ))
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SearchBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <SearchBanner />
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İlanlar</h1>
            <p className="text-gray-600 mt-1">
              {listings.length} ilan bulundu
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İlan ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtreler
            </button>
          </div>
        </div>

        {/* Sort and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="price-low">Fiyat (Düşük-Yüksek)</option>
              <option value="price-high">Fiyat (Yüksek-Düşük)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <Heart className={`w-4 h-4 ${listing.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
                <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                  {listing.type}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {listing.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  {listing.location.district}, {listing.location.city}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{listing.features.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{listing.features.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    <span>{listing.features.area} m²</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(listing.price, listing.currency)}
                  </span>
                  <Link
                    href={`/ilan/${listing.id}`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Detay
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz ilan bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  )
}
