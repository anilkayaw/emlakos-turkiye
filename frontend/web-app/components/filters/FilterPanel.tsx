import React from 'react'
import { X, MapPin, DollarSign, Square, Home, Calendar, Building2, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

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

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearFilters: () => void
  isRental?: boolean
  className?: string
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isRental = false,
  className = ''
}) => {
  const cities = [
    { value: '', label: 'Tüm Şehirler' },
    { value: 'istanbul', label: 'İstanbul' },
    { value: 'ankara', label: 'Ankara' },
    { value: 'izmir', label: 'İzmir' },
    { value: 'bursa', label: 'Bursa' },
    { value: 'antalya', label: 'Antalya' },
    { value: 'adana', label: 'Adana' }
  ]

  const districts = [
    { value: '', label: 'Tüm İlçeler' },
    { value: 'besiktas', label: 'Beşiktaş' },
    { value: 'kadikoy', label: 'Kadıköy' },
    { value: 'sisli', label: 'Şişli' },
    { value: 'beyoglu', label: 'Beyoğlu' },
    { value: 'uskudar', label: 'Üsküdar' },
    { value: 'fatih', label: 'Fatih' }
  ]

  const neighborhoods = [
    { value: '', label: 'Tüm Mahalleler' },
    { value: 'etiler', label: 'Etiler' },
    { value: 'bostanci', label: 'Bostancı' },
    { value: 'moda', label: 'Moda' },
    { value: 'nisantasi', label: 'Nişantaşı' },
    { value: 'galata', label: 'Galata' }
  ]

  const roomOptions = [
    { value: '1+1', label: '1+1' },
    { value: '2+1', label: '2+1' },
    { value: '3+1', label: '3+1' },
    { value: '4+1', label: '4+1' },
    { value: '5+', label: '5+ ve üzeri' }
  ]

  const buildingAgeOptions = [
    { value: '', label: 'Tümü' },
    { value: '0', label: 'Sıfır (0)' },
    { value: '1-5', label: '1-5 yaş' },
    { value: '6-10', label: '6-10 yaş' },
    { value: '11-20', label: '11-20 yaş' },
    { value: '20+', label: '20+ yaş' }
  ]

  const floorOptions = [
    { value: '', label: 'Tümü' },
    { value: 'ground', label: 'Giriş Katı' },
    { value: 'middle', label: 'Ara Kat' },
    { value: 'top', label: 'Üst Kat' },
    { value: 'villa', label: 'Villa Katı' }
  ]

  const featureOptions = [
    { value: 'balcony', label: 'Balkonlu' },
    { value: 'parent-bathroom', label: 'Ebeveyn Banyolu' },
    { value: 'site', label: 'Site İçerisinde' },
    { value: 'loan-eligible', label: 'Krediye Uygun' },
    { value: 'permit', label: 'İskanlı' }
  ]

  const rentalFeatureOptions = [
    { value: 'furnished', label: 'Eşyalı' },
    { value: 'unfurnished', label: 'Eşyasız' },
    { value: 'no-deposit', label: 'Depozitosuz' }
  ]

  const handleLocationChange = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      location: {
        ...filters.location,
        [field]: value
      }
    })
  }

  const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: value
      }
    })
  }

  const handleAreaRangeChange = (field: 'min' | 'max', value: number) => {
    onFilterChange({
      ...filters,
      areaRange: {
        ...filters.areaRange,
        [field]: value
      }
    })
  }

  const handleRoomCountChange = (value: string) => {
    const newRoomCount = filters.roomCount.includes(value)
      ? filters.roomCount.filter(room => room !== value)
      : [...filters.roomCount, value]
    
    onFilterChange({
      ...filters,
      roomCount: newRoomCount
    })
  }

  const handleFeatureChange = (value: string) => {
    const newFeatures = filters.features.includes(value)
      ? filters.features.filter(feature => feature !== value)
      : [...filters.features, value]
    
    onFilterChange({
      ...filters,
      features: newFeatures
    })
  }

  return (
    <Card className={`w-80 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Filtreler
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary-600 hover:text-primary-700"
          >
            Temizle
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Konum */}
        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <MapPin className="w-4 h-4 mr-2" />
            Konum
          </div>
          <Select
            options={cities}
            value={filters.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            placeholder="Şehir seçin"
          />
          <Select
            options={districts}
            value={filters.location.district}
            onChange={(e) => handleLocationChange('district', e.target.value)}
            placeholder="İlçe seçin"
          />
          <Select
            options={neighborhoods}
            value={filters.location.neighborhood}
            onChange={(e) => handleLocationChange('neighborhood', e.target.value)}
            placeholder="Mahalle seçin"
          />
        </div>

        {/* Fiyat Aralığı */}
        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <DollarSign className="w-4 h-4 mr-2" />
            Fiyat Aralığı
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min. fiyat"
              type="number"
              value={filters.priceRange.min || ''}
              onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
            />
            <Input
              placeholder="Max. fiyat"
              type="number"
              value={filters.priceRange.max || ''}
              onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Metrekare Aralığı */}
        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <Square className="w-4 h-4 mr-2" />
            Metrekare (Brüt)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min. m²"
              type="number"
              value={filters.areaRange.min || ''}
              onChange={(e) => handleAreaRangeChange('min', parseInt(e.target.value) || 0)}
            />
            <Input
              placeholder="Max. m²"
              type="number"
              value={filters.areaRange.max || ''}
              onChange={(e) => handleAreaRangeChange('max', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Oda Sayısı */}
        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <Home className="w-4 h-4 mr-2" />
            Oda Sayısı
          </div>
          <div className="space-y-2">
            {roomOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.roomCount.includes(option.value)}
                  onChange={() => handleRoomCountChange(option.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bina Yaşı */}
        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4 mr-2" />
            Bina Yaşı
          </div>
          <Select
            options={buildingAgeOptions}
            value={filters.buildingAge}
            onChange={(e) => onFilterChange({ ...filters, buildingAge: e.target.value })}
            placeholder="Bina yaşı seçin"
          />
        </div>

        {/* Bulunduğu Kat */}
        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <Building2 className="w-4 h-4 mr-2" />
            Bulunduğu Kat
          </div>
          <Select
            options={floorOptions}
            value={filters.floor}
            onChange={(e) => onFilterChange({ ...filters, floor: e.target.value })}
            placeholder="Kat seçin"
          />
        </div>

        {/* Diğer Özellikler */}
        <div className="space-y-3">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <Check className="w-4 h-4 mr-2" />
            Diğer Özellikler
          </div>
          <div className="space-y-2">
            {featureOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.features.includes(option.value)}
                  onChange={() => handleFeatureChange(option.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
            
            {/* Kiralık için ek özellikler */}
            {isRental && rentalFeatureOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.features.includes(option.value)}
                  onChange={() => handleFeatureChange(option.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
