'use client'

import React, { useState } from 'react'
import { Search, MapPin, Home, Building } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchFormProps {
  onSearch?: (searchData: SearchData) => void
  className?: string
  variant?: 'hero' | 'header' | 'compact'
  showTabs?: boolean
  showLocationButton?: boolean
}

interface SearchData {
  query: string
  type: 'buy' | 'rent'
  propertyType?: string
  location?: string
}

export function SearchForm({ 
  onSearch, 
  className = '',
  variant = 'hero',
  showTabs = true,
  showLocationButton = true
}: SearchFormProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy')
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const searchData: SearchData = {
      query: searchQuery,
      type: activeTab,
      propertyType,
      location: searchQuery
    }
    
    onSearch?.(searchData)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleLocationService = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location:', position.coords)
          // Handle location success
        },
        (error) => {
          console.error('Location error:', error)
          // Handle location error
        }
      )
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'max-w-4xl mx-auto',
          input: 'w-full px-6 py-4 pl-16 pr-32 text-lg border-0 rounded-full shadow-2xl focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50 bg-white',
          button: 'px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors'
        }
      case 'header':
        return {
          container: 'max-w-2xl mx-auto',
          input: 'w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          button: 'px-4 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors'
        }
      case 'compact':
        return {
          container: 'max-w-lg',
          input: 'w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm',
          button: 'px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm'
        }
      default:
        return {
          container: 'max-w-4xl mx-auto',
          input: 'w-full px-6 py-4 pl-16 pr-32 text-lg border-0 rounded-full shadow-2xl focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50 bg-white',
          button: 'px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors'
        }
    }
  }

  const classes = getVariantClasses()

  return (
    <div className={`relative ${classes.container} ${className}`}>
      <form onSubmit={handleSubmit} data-test="search-form" data-analytics-action="search-form-submit">
        {/* Search Tabs */}
        {showTabs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveTab('buy')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'buy'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
                data-test="search-tab-buy"
                data-analytics-action="search-tab-change"
              >
                Satın Al
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rent')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'rent'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
                data-test="search-tab-rent"
                data-analytics-action="search-tab-change"
              >
                Kirala
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative"
        >
          <input
            type="text"
            placeholder={variant === 'hero' ? "Mahalle, Ev, İlçe Adresi Girin" : "Mahalle, İl, İlçe, Cadde Ara..."}
            className={classes.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-test="search-input"
            data-analytics-action="search-input-focus"
          />
          
          <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {showLocationButton && variant === 'hero' && (
              <button
                type="button"
                onClick={handleLocationService}
                className="px-4 py-2 rounded-full transition-colors text-sm flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                data-test="location-button"
                data-analytics-action="location-service"
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                Mevcut Konumu Kullan
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`${classes.button} flex items-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              data-test="search-submit"
              data-analytics-action="search-submit"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Property Type Filter */}
        {variant === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-4 flex justify-center"
          >
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPropertyType('')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  propertyType === '' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-test="property-type-all"
                data-analytics-action="property-type-filter"
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('daire')}
                className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center ${
                  propertyType === 'daire' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-test="property-type-apartment"
                data-analytics-action="property-type-filter"
              >
                <Home className="w-4 h-4 mr-1" />
                Daire
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('villa')}
                className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center ${
                  propertyType === 'villa' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-test="property-type-villa"
                data-analytics-action="property-type-filter"
              >
                <Building className="w-4 h-4 mr-1" />
                Villa
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  )
}

export default SearchForm
