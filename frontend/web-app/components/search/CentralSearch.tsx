'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface SearchFilters {
  query: string
  transactionType: 'sale' | 'rent' | 'all'
  propertyType: string
  city: string
  district: string
  minPrice: string
  maxPrice: string
}

export default function CentralSearch() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('sale')
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    transactionType: 'sale',
    propertyType: '',
    city: '',
    district: '',
    minPrice: '',
    maxPrice: ''
  })

  const propertyTypes = [
    { value: '', label: 'Tümü' },
    { value: 'apartment', label: 'Daire' },
    { value: 'house', label: 'Ev' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Ofis' },
    { value: 'land', label: 'Arsa' },
    { value: 'commercial', label: 'Ticari' }
  ]

  const cities = [
    { value: '', label: 'Tüm Şehirler' },
    { value: 'istanbul', label: 'İstanbul' },
    { value: 'ankara', label: 'Ankara' },
    { value: 'izmir', label: 'İzmir' },
    { value: 'bursa', label: 'Bursa' },
    { value: 'antalya', label: 'Antalya' },
    { value: 'adana', label: 'Adana' }
  ]

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    
    if (filters.query) searchParams.set('q', filters.query)
    if (filters.propertyType) searchParams.set('type', filters.propertyType)
    if (filters.city) searchParams.set('city', filters.city)
    if (filters.district) searchParams.set('district', filters.district)
    if (filters.minPrice) searchParams.set('minPrice', filters.minPrice)
    if (filters.maxPrice) searchParams.set('maxPrice', filters.maxPrice)
    
    const path = activeTab === 'sale' ? '/satilik' : '/kiralik'
    const queryString = searchParams.toString()
    
    router.push(`${path}${queryString ? `?${queryString}` : ''}`)
  }

  const handleValuation = () => {
    router.push('/degerleme')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex mb-6">
        <button
          onClick={() => {
            setActiveTab('sale')
            setFilters(prev => ({ ...prev, transactionType: 'sale' }))
          }}
          className={`flex-1 py-3 px-6 text-center font-medium rounded-t-lg transition-colors ${
            activeTab === 'sale'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home className="w-5 h-5 mx-auto mb-1" />
          Satılık
        </button>
        <button
          onClick={() => {
            setActiveTab('rent')
            setFilters(prev => ({ ...prev, transactionType: 'rent' }))
          }}
          className={`flex-1 py-3 px-6 text-center font-medium rounded-t-lg transition-colors ${
            activeTab === 'rent'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home className="w-5 h-5 mx-auto mb-1" />
          Kiralık
        </button>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-large p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Location Search */}
          <div className="lg:col-span-2">
            <Input
              label="Konum"
              placeholder="Şehir, ilçe veya mahalle ara..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              leftIcon={<MapPin className="w-5 h-5" />}
            />
          </div>

          {/* Property Type */}
          <Select
            label="Mülk Tipi"
            options={propertyTypes}
            value={filters.propertyType}
            onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
            placeholder="Mülk tipi seçin"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* City */}
          <Select
            label="Şehir"
            options={cities}
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Şehir seçin"
          />

          {/* District */}
          <Input
            label="İlçe"
            placeholder="İlçe"
            value={filters.district}
            onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
          />

          {/* Min Price */}
          <Input
            label="Min. Fiyat"
            placeholder="Min. fiyat"
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
          />

          {/* Max Price */}
          <Input
            label="Max. Fiyat"
            placeholder="Max. fiyat"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSearch}
            size="lg"
            className="flex-1"
            leftIcon={<Search className="w-5 h-5" />}
          >
            {activeTab === 'sale' ? 'Satılık Ara' : 'Kiralık Ara'}
          </Button>
          
          {activeTab === 'sale' && (
            <Button
              onClick={handleValuation}
              variant="outline"
              size="lg"
              className="sm:w-auto"
            >
              Değerle
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
