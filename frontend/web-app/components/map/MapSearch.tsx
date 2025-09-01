'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
import { Search, MapPin, Filter, Star } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  address: string
  type: string
  rating?: number
  price?: number
  coordinates: [number, number]
}

interface MapSearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onLocationSelect?: (coordinates: [number, number], address: string) => void
}

export default function MapSearch({
  placeholder = 'Konum, mahalle veya mülk ara...',
  onSearch,
  onLocationSelect
}: MapSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<any>({
    showFilters: false,
    type: '',
    priceRange: '',
    rooms: '',
    area: ''
  })

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Beşiktaş, İstanbul',
      address: 'Beşiktaş Mahallesi, Beşiktaş/İstanbul',
      type: 'Mahalle',
      rating: 4.8,
      coordinates: [41.0421, 28.9784]
    },
    {
      id: '2',
      title: 'Kadıköy, İstanbul',
      address: 'Kadıköy Merkez, Kadıköy/İstanbul',
      type: 'Mahalle',
      rating: 4.6,
      coordinates: [40.9909, 29.0304]
    },
    {
      id: '3',
      title: 'Çankaya, Ankara',
      address: 'Çankaya Merkez, Çankaya/Ankara',
      type: 'Mahalle',
      rating: 4.7,
      coordinates: [39.9334, 32.8597]
    },
    {
      id: '4',
      title: 'Konak, İzmir',
      address: 'Konak Merkez, Konak/İzmir',
      type: 'Mahalle',
      rating: 4.5,
      coordinates: [38.4237, 27.1428]
    }
  ]

  useEffect(() => {
    if (searchQuery.length > 2) {
      // Simulate search delay
      setIsSearching(true)
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setSearchResults(filtered)
        setIsSearching(false)
        setShowResults(true)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setShowResults(false)
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleLocationSelect = (result: SearchResult) => {
    if (onLocationSelect) {
      onLocationSelect(result.coordinates, result.address)
    }
    setSearchQuery(result.title)
    setShowResults(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowResults(false)
    setSearchResults([])
  }

  const applyFilters = () => {
    // Filter logic would be implemented here
    console.log('Applying filters:', selectedFilters)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
          
          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Ara
          </button>
        </div>

        {/* Filters Toggle */}
        <button
          type="button"
          onClick={() => setSelectedFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
          className="absolute -bottom-10 left-0 flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filtreler</span>
        </button>
      </form>

      {/* Filters Panel */}
      {selectedFilters.showFilters && (
        <div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-4 bg-white rounded-lg shadow-lg p-4 z-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mülk Tipi
              </label>
              <select
                value={selectedFilters.type}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
              >
                <option value="">Tümü</option>
                <option value="daire">Daire</option>
                <option value="villa">Villa</option>
                <option value="dükkan">Dükkan</option>
                <option value="ofis">Ofis</option>
                <option value="arsa">Arsa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat Aralığı
              </label>
              <select
                value={selectedFilters.priceRange}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
              >
                <option value="">Tümü</option>
                <option value="0-1000000">0 - 1.000.000 TL</option>
                <option value="1000000-3000000">1.000.000 - 3.000.000 TL</option>
                <option value="3000000-5000000">3.000.000 - 5.000.000 TL</option>
                <option value="5000000+">5.000.000+ TL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oda Sayısı
              </label>
              <select
                value={selectedFilters.rooms}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, rooms: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
              >
                <option value="">Tümü</option>
                <option value="1">1+1</option>
                <option value="2">2+1</option>
                <option value="3">3+1</option>
                <option value="4">4+1</option>
                <option value="5+">5+1</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setSelectedFilters(prev => ({ ...prev, showFilters: false }))}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
            >
              Uygula
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto z-30"
        >
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleLocationSelect(result)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {result.title}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {result.address}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-400 uppercase">
                      {result.type}
                    </span>
                    
                    {result.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">
                          {result.rating}
                        </span>
                      </div>
                    )}
                    
                    {result.price && (
                      <span className="text-xs text-primary-600 font-medium">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                          minimumFractionDigits: 0
                        }).format(result.price)}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLocationSelect?.(result.coordinates, result.address)
                  }}
                  className="flex-shrink-0 p-2 hover:bg-primary-100 rounded-lg transition-colors"
                  title="Bu konuma git"
                >
                                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-30">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span className="text-gray-600">Aranıyor...</span>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && searchResults.length === 0 && !isSearching && searchQuery.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-30">
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Sonuç bulunamadı</p>
            <p className="text-sm">Farklı anahtar kelimeler deneyin</p>
          </div>
        </div>
      )}
    </div>
  )
}
