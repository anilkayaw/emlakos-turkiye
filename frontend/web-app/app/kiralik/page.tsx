'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Grid, 
  List, 
  MapPin, 
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { PropertyCard } from '@/components/property/PropertyCard'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { PropertyCardSkeleton, PropertyListSkeleton } from '@/components/ui/Skeleton'

interface Property {
  id: string
  title: string
  price: number
  currency: string
  type: 'Satılık' | 'Kiralık'
  location: {
    district: string
    neighborhood: string
    city: string
  }
  images: string[]
  features: {
    rooms: string
    area: number
    buildingAge: number
    floor: number
    totalFloors: number
  }
  createdAt: string
  isFeatured?: boolean
  isVerified?: boolean
}

interface FilterState {
  location: {
    city: string
    district: string
    neighborhood: string
  }
  priceRange: {
    min: number
    max: number
  }
  areaRange: {
    min: number
    max: number
  }
  roomCount: string[]
  buildingAge: string
  floor: string
  features: string[]
}

export default function KiralikPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favorites, setFavorites] = useState<string[]>([])

  const [filters, setFilters] = useState<FilterState>({
    location: {
      city: searchParams?.get('city') || '',
      district: searchParams?.get('district') || '',
      neighborhood: searchParams?.get('neighborhood') || ''
    },
    priceRange: {
      min: parseInt(searchParams?.get('minPrice') || '0') || 0,
      max: parseInt(searchParams?.get('maxPrice') || '0') || 0
    },
    areaRange: {
      min: 0,
      max: 0
    },
    roomCount: [],
    buildingAge: '',
    floor: '',
    features: []
  })

  const sortOptions = [
    { value: 'newest', label: 'En Yeni İlanlar' },
    { value: 'price-desc', label: 'Fiyata Göre (Önce En Yüksek)' },
    { value: 'price-asc', label: 'Fiyata Göre (Önce En Düşük)' },
    { value: 'area-desc', label: 'Metrekareye Göre (En Büyük)' },
    { value: 'area-asc', label: 'Metrekareye Göre (En Küçük)' }
  ]

  // Mock data for rental properties
  const mockProperties: Property[] = [
    {
      id: '1',
      title: 'Kiralık 2+1 Daire - Kadıköy',
      price: 8500,
      currency: 'TRY',
      type: 'Kiralık',
      location: {
        district: 'Kadıköy',
        neighborhood: 'Moda',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
      features: {
        rooms: '2+1',
        area: 85,
        buildingAge: 8,
        floor: 3,
        totalFloors: 6
      },
      createdAt: '2024-12-01T10:00:00Z',
      isFeatured: true,
      isVerified: true
    },
    {
      id: '2',
      title: 'Kiralık Villa - Bodrum',
      price: 25000,
      currency: 'TRY',
      type: 'Kiralık',
      location: {
        district: 'Bodrum',
        neighborhood: 'Yalıkavak',
        city: 'Muğla'
      },
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
      features: {
        rooms: '3+1',
        area: 200,
        buildingAge: 3,
        floor: 0,
        totalFloors: 2
      },
      createdAt: '2024-11-28T15:30:00Z',
      isFeatured: true,
      isVerified: true
    },
    {
      id: '3',
      title: 'Kiralık Ofis - Şişli',
      price: 12000,
      currency: 'TRY',
      type: 'Kiralık',
      location: {
        district: 'Şişli',
        neighborhood: 'Mecidiyeköy',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'],
      features: {
        rooms: 'Ofis',
        area: 150,
        buildingAge: 5,
        floor: 10,
        totalFloors: 15
      },
      createdAt: '2024-11-25T09:15:00Z',
      isFeatured: false,
      isVerified: true
    },
    {
      id: '4',
      title: 'Kiralık Daire - Beşiktaş',
      price: 15000,
      currency: 'TRY',
      type: 'Kiralık',
      location: {
        district: 'Beşiktaş',
        neighborhood: 'Etiler',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
      features: {
        rooms: '3+1',
        area: 120,
        buildingAge: 5,
        floor: 8,
        totalFloors: 12
      },
      createdAt: '2024-11-20T14:45:00Z',
      isFeatured: false,
      isVerified: true
    },
    {
      id: '5',
      title: 'Kiralık Daire - Ankara',
      price: 6500,
      currency: 'TRY',
      type: 'Kiralık',
      location: {
        district: 'Çankaya',
        neighborhood: 'Kızılay',
        city: 'Ankara'
      },
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'],
      features: {
        rooms: '2+1',
        area: 95,
        buildingAge: 10,
        floor: 4,
        totalFloors: 8
      },
      createdAt: '2024-11-18T11:20:00Z',
      isFeatured: false,
      isVerified: true
    },
    {
      id: '6',
      title: 'Kiralık Rezidans - Ataşehir',
      price: 18000,
      currency: 'TRY',
      type: 'Kiralık',
      location: {
        district: 'Ataşehir',
        neighborhood: 'Barbaros',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'],
      features: {
        rooms: '4+1',
        area: 160,
        buildingAge: 2,
        floor: 12,
        totalFloors: 20
      },
      createdAt: '2024-11-15T16:10:00Z',
      isFeatured: true,
      isVerified: true
    }
  ]

  useEffect(() => {
    loadProperties()
  }, [filters, sortBy, currentPage])

  const loadProperties = async () => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Apply filters and sorting
      let filteredProperties = [...mockProperties]
      
      // Apply location filter
      if (filters.location.city) {
        filteredProperties = filteredProperties.filter(p => 
          p.location.city.toLowerCase().includes(filters.location.city.toLowerCase())
        )
      }
      
      // Apply price filter
      if (filters.priceRange.min > 0) {
        filteredProperties = filteredProperties.filter(p => p.price >= filters.priceRange.min)
      }
      if (filters.priceRange.max > 0) {
        filteredProperties = filteredProperties.filter(p => p.price <= filters.priceRange.max)
      }
      
      // Apply area filter
      if (filters.areaRange.min > 0) {
        filteredProperties = filteredProperties.filter(p => p.features.area >= filters.areaRange.min)
      }
      if (filters.areaRange.max > 0) {
        filteredProperties = filteredProperties.filter(p => p.features.area <= filters.areaRange.max)
      }
      
      // Apply room count filter
      if (filters.roomCount.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          filters.roomCount.includes(p.features.rooms)
        )
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'price-desc':
          filteredProperties.sort((a, b) => b.price - a.price)
          break
        case 'price-asc':
          filteredProperties.sort((a, b) => a.price - b.price)
          break
        case 'area-desc':
          filteredProperties.sort((a, b) => b.features.area - a.features.area)
          break
        case 'area-asc':
          filteredProperties.sort((a, b) => a.features.area - b.features.area)
          break
        default:
          filteredProperties.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      }
      
      setProperties(filteredProperties)
      setTotalPages(Math.ceil(filteredProperties.length / 12))
      
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      location: { city: '', district: '', neighborhood: '' },
      priceRange: { min: 0, max: 0 },
      areaRange: { min: 0, max: 0 },
      roomCount: [],
      buildingAge: '',
      floor: '',
      features: []
    })
    setCurrentPage(1)
  }

  const handleFavorite = (id: string) => {
    setFavorites((prev: string[]) => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4">
        <Grid className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aradığınız kriterlere uygun ilan bulunamadı
      </h3>
      <p className="text-gray-600 mb-6">
        Filtrelerinizi değiştirerek tekrar deneyin veya popüler aramalarımıza göz atın.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={clearFilters}>
          Filtreleri Temizle
        </Button>
        <Button>
          Popüler Aramalar
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kiralık İlanlar</h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Yükleniyor...' : `${properties.length} ilan bulundu`}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-48"
                />
              </div>
              
              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 bg-primary-500 text-white rounded-lg"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              isRental={true}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <PropertyCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <PropertyListSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {properties.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={{
                              id: property.id,
                              title: property.title,
                              price: property.price,
                              type: property.type,
                              location: `${property.location.neighborhood}, ${property.location.district}`,
                              image: property.images[0] || '',
                              rooms: parseInt(property.features.rooms.split('+')[0]),
                              bathrooms: parseInt(property.features.rooms.split('+')[1]) || 1,
                              area: property.features.area,
                              isFavorite: favorites.includes(property.id),
                              buildingAge: property.features.buildingAge,
                              floor: property.features.floor,
                              totalFloors: property.features.totalFloors
                            }}
                            onToggleFavorite={handleFavorite}
                          />
                        ))}
                      </div>
                    )}
                    
                    {viewMode === 'list' && (
                      <div className="space-y-4">
                        {properties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={{
                              id: property.id,
                              title: property.title,
                              price: property.price,
                              type: property.type,
                              location: `${property.location.neighborhood}, ${property.location.district}`,
                              image: property.images[0] || '',
                              rooms: parseInt(property.features.rooms.split('+')[0]),
                              bathrooms: parseInt(property.features.rooms.split('+')[1]) || 1,
                              area: property.features.area,
                              isFavorite: favorites.includes(property.id),
                              buildingAge: property.features.buildingAge,
                              floor: property.features.floor,
                              totalFloors: property.features.totalFloors
                            }}
                            onToggleFavorite={handleFavorite}
                          />
                        ))}
                      </div>
                    )}
                    
                    {viewMode === 'map' && (
                      <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Harita görünümü yakında gelecek</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filtreler</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                isRental={true}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}