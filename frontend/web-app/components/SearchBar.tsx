'use client'

import { useState } from 'react'
import { Search, MapPin, Home, Filter } from 'lucide-react'
import Link from 'next/link'

// Type definitions for better TypeScript support
interface SearchFormData {
  searchQuery: string
  propertyType: string
  city: string
  priceRange: string
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [city, setCity] = useState('')
  const [priceRange, setPriceRange] = useState('')

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Search logic will be implemented here
    console.log('Search:', { searchQuery, propertyType, city, priceRange })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, setter: (value: string) => void) => {
    setter(e.target.value)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Şehir, ilçe, mahalle veya proje adı..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Property Type */}
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <select
              value={propertyType}
              onChange={(e) => handleSelectChange(e, setPropertyType)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors duration-200 appearance-none bg-white"
            >
              <option value="">Mülk Tipi</option>
              <option value="daire">Daire</option>
              <option value="villa">Villa</option>
              <option value="dükkan">Dükkan</option>
              <option value="ofis">Ofis</option>
              <option value="arsa">Arsa</option>
            </select>
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <select
              value={city}
              onChange={(e) => handleSelectChange(e, setCity)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors duration-200 appearance-none bg-white"
            >
              <option value="">Şehir Seçin</option>
              <option value="istanbul">İstanbul</option>
              <option value="ankara">Ankara</option>
              <option value="izmir">İzmir</option>
              <option value="bursa">Bursa</option>
              <option value="antalya">Antalya</option>
              <option value="adana">Adana</option>
              <option value="konya">Konya</option>
              <option value="gaziantep">Gaziantep</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <select
              value={priceRange}
              onChange={(e) => handleSelectChange(e, setPriceRange)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors duration-200 appearance-none bg-white"
            >
              <option value="">Fiyat Aralığı</option>
              <option value="0-500000">0 - 500.000 TL</option>
              <option value="500000-1000000">500.000 - 1.000.000 TL</option>
              <option value="1000000-2000000">1.000.000 - 2.000.000 TL</option>
              <option value="2000000-5000000">2.000.000 - 5.000.000 TL</option>
              <option value="5000000+">5.000.000+ TL</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="btn-primary py-3 text-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            Ara
          </button>
        </div>

        {/* Quick Search Options */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Link
            href="/ilanlar?type=daire&city=istanbul"
            className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            İstanbul Daire
          </Link>
          <Link
            href="/ilanlar?type=villa&city=antalya"
            className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Antalya Villa
          </Link>
          <Link
            href="/ilanlar?type=dükkan&city=izmir"
            className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            İzmir Dükkan
          </Link>
          <Link
            href="/ilanlar?type=arsa&city=ankara"
            className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Ankara Arsa
          </Link>
        </div>
      </form>

      {/* Search Tips */}
      <div className="mt-6 text-center text-sm text-secondary-600">
        <p>
          💡 <strong>İpucu:</strong> Daha detaylı arama için{' '}
          <Link href="/gelismis-arama" className="text-primary-600 hover:underline font-medium">
            gelişmiş arama
          </Link>{' '}
          sayfasını kullanın
        </p>
      </div>
    </div>
  )
}
