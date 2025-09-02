'use client'

import React, { useState } from 'react'
import { Filter, MapPin, Square, Bed, Bath } from 'lucide-react'
import { motion } from 'framer-motion'

interface FilterData {
  location: string
  priceMin: number
  priceMax: number
  areaMin: number
  areaMax: number
  rooms: number
  bathrooms: number
  propertyType: string
  buildingAge: number
  floor: number
  features: string[]
}

interface FilterMenuProps {
  onFilterChange?: (filters: FilterData) => void
  className?: string
  variant?: 'sidebar' | 'modal' | 'dropdown'
}

export function FilterMenu({ 
  onFilterChange, 
  className = '',
  variant = 'sidebar'
}: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterData>({
    location: '',
    priceMin: 0,
    priceMax: 10000000,
    areaMin: 0,
    areaMax: 1000,
    rooms: 0,
    bathrooms: 0,
    propertyType: '',
    buildingAge: 0,
    floor: 0,
    features: []
  })

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['location', 'price']))

  const handleFilterChange = (key: keyof FilterData, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const clearFilters = () => {
    const clearedFilters: FilterData = {
      location: '',
      priceMin: 0,
      priceMax: 10000000,
      areaMin: 0,
      areaMax: 1000,
      rooms: 0,
      bathrooms: 0,
      propertyType: '',
      buildingAge: 0,
      floor: 0,
      features: []
    }
    setFilters(clearedFilters)
    onFilterChange?.(clearedFilters)
  }

  const FilterSection = ({ title, icon: Icon, sectionKey, children }: {
    title: string
    icon: any
    sectionKey: string
    children: any
  }) => {
    const isExpanded = expandedSections.has(sectionKey)
    
    return (
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full text-left py-2"
          data-test={`filter-section-${sectionKey}`}
          data-analytics-action="filter-section-toggle"
        >
          <div className="flex items-center">
            <Icon className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-medium text-gray-900">{title}</span>
          </div>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  const renderContent = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtreler
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          data-test="clear-filters"
          data-analytics-action="clear-filters"
        >
          Temizle
        </button>
      </div>

      <div className="space-y-4">
        {/* Location Filter */}
        <FilterSection title="Konum" icon={MapPin} sectionKey="location">
          <input
            type="text"
            placeholder="Mahalle, ilçe, şehir..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            data-test="filter-location"
            data-analytics-action="filter-location-change"
          />
        </FilterSection>

        {/* Price Filter */}
        <FilterSection title="Fiyat" icon={MapPin} sectionKey="price">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', Number(e.target.value))}
                data-test="filter-price-min"
                data-analytics-action="filter-price-change"
              />
              <input
                type="number"
                placeholder="Max"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', Number(e.target.value))}
                data-test="filter-price-max"
                data-analytics-action="filter-price-change"
              />
            </div>
            <div className="text-xs text-gray-500">
              {filters.priceMin.toLocaleString('tr-TR')} - {filters.priceMax.toLocaleString('tr-TR')} ₺
            </div>
          </div>
        </FilterSection>

        {/* Area Filter */}
        <FilterSection title="Alan" icon={Square} sectionKey="area">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min m²"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.areaMin || ''}
                onChange={(e) => handleFilterChange('areaMin', Number(e.target.value))}
                data-test="filter-area-min"
                data-analytics-action="filter-area-change"
              />
              <input
                type="number"
                placeholder="Max m²"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.areaMax || ''}
                onChange={(e) => handleFilterChange('areaMax', Number(e.target.value))}
                data-test="filter-area-max"
                data-analytics-action="filter-area-change"
              />
            </div>
          </div>
        </FilterSection>

        {/* Rooms Filter */}
        <FilterSection title="Oda Sayısı" icon={Bed} sectionKey="rooms">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, '5+'].map((room) => (
              <button
                key={room}
                onClick={() => handleFilterChange('rooms', room === '5+' ? 5 : room)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.rooms === (room === '5+' ? 5 : room)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-test={`filter-rooms-${room}`}
                data-analytics-action="filter-rooms-change"
              >
                {room === '5+' ? '5+' : `${room}+1`}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Property Type Filter */}
        <FilterSection title="Mülk Tipi" icon={Bed} sectionKey="propertyType">
          <div className="space-y-2">
            {[
              { value: '', label: 'Tümü' },
              { value: 'daire', label: 'Daire' },
              { value: 'villa', label: 'Villa' },
              { value: 'müstakil', label: 'Müstakil Ev' },
              { value: 'arsa', label: 'Arsa' },
              { value: 'işyeri', label: 'İş Yeri' }
            ].map((type) => (
              <label key={type.value} className="flex items-center">
                <input
                  type="radio"
                  name="propertyType"
                  value={type.value}
                  checked={filters.propertyType === type.value}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                  data-test={`filter-property-type-${type.value}`}
                  data-analytics-action="filter-property-type-change"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => onFilterChange?.(filters)}
          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          data-test="apply-filters"
          data-analytics-action="apply-filters"
        >
          Filtreleri Uygula
        </button>
      </div>
    </div>
  )

  if (variant === 'modal') {
    return (
      <>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filtreler</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                {renderContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          data-test="filter-toggle"
          data-analytics-action="filter-toggle"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span>Filtreler</span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 z-10"
          >
            {renderContent()}
          </motion.div>
        )}
      </div>
    )
  }

  // Sidebar variant (default)
  return (
    <div className={`${className}`}>
      {renderContent()}
    </div>
  )
}

export default FilterMenu
