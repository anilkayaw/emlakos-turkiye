'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, MapPin, Grid, List, Heart, Bed, Bath, Square, Star } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { apiClient as api } from '@/lib/api'
import { Property, SearchFilters } from '@/types/api'

export default function ListingsPage() {
  // State management
  const [listings, setListings] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Fetch listings from API
  const fetchListings = useCallback(async (page: number = 1, filters: SearchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const searchFilters: any = {
        ...filters,
        page,
        limit: pageSize,
      };

      const response = await api.getProperties(searchFilters);
      
      if (response.success && response.data) {
        if (page === 1) {
          setListings(response.data.listings);
        } else {
          // @ts-ignore
          setListings(prev => [...prev, ...response.data.listings]);
        }
        setTotalCount(response.data.total);
        setHasMore(response.data.hasMore);
        setCurrentPage(page);
      } else {
        setError(response.error || 'İlanlar yüklenirken hata oluştu');
      }
    } catch (err) {
      setError('İlanlar yüklenirken hata oluştu');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Load more listings
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const filters: any = {
        query: searchQuery || undefined,
        type: selectedType || undefined,
        city: selectedCity || undefined,
        minPrice: priceRange ? parseInt(priceRange.split('-')[0]) : undefined,
        maxPrice: priceRange ? parseInt(priceRange.split('-')[1]) : undefined,
      };
      fetchListings(currentPage + 1, filters);
    }
  }, [hasMore, loading, currentPage, searchQuery, selectedType, selectedCity, priceRange, fetchListings]);

  // Search and filter
  const handleSearch = useCallback(() => {
    const filters: any = {
      query: searchQuery || undefined,
      type: selectedType || undefined,
      city: selectedCity || undefined,
      minPrice: priceRange ? parseInt(priceRange.split('-')[0]) : undefined,
      maxPrice: priceRange ? parseInt(priceRange.split('-')[1]) : undefined,
    };
    fetchListings(1, filters);
  }, [searchQuery, selectedType, selectedCity, priceRange, fetchListings]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (propertyId: string) => {
    try {
      const property = listings.find(p => p.id === propertyId);
      if (!property) return;

      if (property.isFavorite) {
        await api.removeFromFavorites(propertyId);
      } else {
        await api.addToFavorites(propertyId);
      }

      // Update local state
      // @ts-ignore
      setListings(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, isFavorite: !p.isFavorite }
          : p
      ));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [listings]);

  // Sort listings
  const sortedListings = React.useMemo(() => {
    const sorted = [...listings];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'area-large':
        return sorted.sort((a, b) => b.features.area - a.features.area);
      case 'area-small':
        return sorted.sort((a, b) => a.features.area - b.features.area);
      default:
        return sorted;
    }
  }, [listings, sortBy]);

  // Initial load
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Format price
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">İlanlar</h1>
              <p className="text-gray-600 mt-1">
                {totalCount} ilan bulundu
              </p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                {/* @ts-ignore */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  placeholder="İlan ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyPress={(e: any) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                {/* @ts-ignore */}
                <Filter className="w-4 h-4" />
                Filtreler
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={selectedType}
                  onChange={(e: any) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Tüm Mülk Tipleri</option>
                  <option value="apartment">Daire</option>
                  <option value="house">Ev</option>
                  <option value="villa">Villa</option>
                  <option value="office">Ofis</option>
                  <option value="land">Arsa</option>
                  <option value="commercial">Ticari</option>
                </select>

                <select
                  value={selectedCity}
                  onChange={(e: any) => setSelectedCity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Tüm Şehirler</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Antalya">Antalya</option>
                  <option value="Bursa">Bursa</option>
                </select>

                <select
                  value={priceRange}
                  onChange={(e: any) => setPriceRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Fiyat Aralığı</option>
                  <option value="0-500000">0 - 500.000 TL</option>
                  <option value="500000-1000000">500.000 - 1.000.000 TL</option>
                  <option value="1000000-2000000">1.000.000 - 2.000.000 TL</option>
                  <option value="2000000-5000000">2.000.000 - 5.000.000 TL</option>
                  <option value="5000000-999999999">5.000.000 TL+</option>
                </select>

                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Ara
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="price-low">Fiyat (Düşük-Yüksek)</option>
              <option value="price-high">Fiyat (Yüksek-Düşük)</option>
              <option value="area-large">Alan (Büyük-Küçük)</option>
              <option value="area-small">Alan (Küçük-Büyük)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              {/* @ts-ignore */}
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              {/* @ts-ignore */}
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-2">İlanlar yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <p className="text-lg font-medium">Hata</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => fetchListings()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${listing.images[0] || '/images/default-property.jpg'})`,
                          backgroundColor: '#f3f4f6'
                        }}
                        onError={(e: any) => {
                          e.currentTarget.style.backgroundImage = "url('/images/default-property.jpg')";
                        }}
                      />
                      <button
                        onClick={() => toggleFavorite(listing.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* @ts-ignore */}
                        <Heart 
                          className={`w-5 h-5 ${listing.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                        />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-yellow-400">
                          {/* @ts-ignore */}
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{listing.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        {/* @ts-ignore */}
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{listing.location.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {listing.features.bedrooms > 0 && (
                          <div className="flex items-center">
                            {/* @ts-ignore */}
                            <Bed className="w-4 h-4 mr-1" />
                            <span>{listing.features.bedrooms}</span>
                          </div>
                        )}
                        {listing.features.bathrooms > 0 && (
                          <div className="flex items-center">
                            {/* @ts-ignore */}
                            <Bath className="w-4 h-4 mr-1" />
                            <span>{listing.features.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          {/* @ts-ignore */}
                          <Square className="w-4 h-4 mr-1" />
                          <span>{listing.features.area} m²</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-primary-600">
                          {formatPrice(listing.price, listing.currency)}
                        </div>
                        <Link
                          href={`/ilan/${listing.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Detaylar
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex gap-4">
                      <div
                        className="w-32 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                        style={{
                          backgroundImage: `url(${listing.images[0] || '/images/default-property.jpg'})`,
                          backgroundColor: '#f3f4f6'
                        }}
                        onError={(e: any) => {
                          e.currentTarget.style.backgroundImage = "url('/images/default-property.jpg')";
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {listing.title}
                          </h3>
                          <button
                            onClick={() => toggleFavorite(listing.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            {/* @ts-ignore */}
                            <Heart 
                              className={`w-5 h-5 ${listing.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          {/* @ts-ignore */}
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{listing.location.address}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          {listing.features.bedrooms > 0 && (
                            <div className="flex items-center">
                              {/* @ts-ignore */}
                              <Bed className="w-4 h-4 mr-1" />
                              <span>{listing.features.bedrooms} yatak</span>
                            </div>
                          )}
                          {listing.features.bathrooms > 0 && (
                            <div className="flex items-center">
                              {/* @ts-ignore */}
                              <Bath className="w-4 h-4 mr-1" />
                              <span>{listing.features.bathrooms} banyo</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            {/* @ts-ignore */}
                            <Square className="w-4 h-4 mr-1" />
                            <span>{listing.features.area} m²</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary-600">
                            {formatPrice(listing.price, listing.currency)}
                          </div>
                          <Link
                            href={`/ilan/${listing.id}`}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Detaylar
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                </button>
              </div>
            )}

            {/* No Results */}
            {sortedListings.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {/* @ts-ignore */}
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
          </>
        )}
      </div>
    </div>
  )
}