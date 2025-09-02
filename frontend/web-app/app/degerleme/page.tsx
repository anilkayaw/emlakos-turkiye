'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Home, 
  Calculator, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { formatPrice } from '@/lib/utils'

interface ValuationFormData {
  address: string
  propertyType: string
  netSqm: number
  roomCount: number
  buildingAge: number
  floor: number
  totalFloors: number
  heatingType: string
  furnished: boolean
  balcony: boolean
  elevator: boolean
  parking: boolean
  security: boolean
  hasSeaView: boolean
  hasGarden: boolean
  hasPool: boolean
}

interface ValuationResult {
  estimatedValue: {
    min: number
    max: number
    average: number
  }
  confidence: number
  factors: {
    positive: string[]
    negative: string[]
  }
  marketTrend: 'rising' | 'stable' | 'falling'
  comparableProperties: Array<{
    address: string
    price: number
    area: number
    distance: number
  }>
}

export default function DegerlemePage() {
  const [step, setStep] = useState<'form' | 'result'>('form')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ValuationFormData>({
    address: '',
    propertyType: '',
    netSqm: 0,
    roomCount: 0,
    buildingAge: 0,
    floor: 0,
    totalFloors: 0,
    heatingType: '',
    furnished: false,
    balcony: false,
    elevator: false,
    parking: false,
    security: false,
    hasSeaView: false,
    hasGarden: false,
    hasPool: false
  })
  const [result, setResult] = useState<ValuationResult | null>(null)

  const propertyTypes = [
    { value: 'apartment', label: 'Daire' },
    { value: 'house', label: 'Ev' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Ofis' },
    { value: 'land', label: 'Arsa' }
  ]

  const heatingTypes = [
    { value: 'natural_gas', label: 'Doğalgaz' },
    { value: 'electric', label: 'Elektrik' },
    { value: 'coal', label: 'Kömür' },
    { value: 'solar', label: 'Güneş Enerjisi' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateValuation = async () => {
    try {
      setLoading(true)
      
      // Simulate API call - in real app, this would call the valuation service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock calculation based on form data
      const basePricePerSqm = getBasePricePerSqm(formData.propertyType, formData.address)
      let adjustedPrice = basePricePerSqm * formData.netSqm
      
      // Apply adjustments based on property features
      const adjustments = calculateAdjustments(formData)
      adjustedPrice *= adjustments
      
      // Add some randomness for min/max range
      const variance = 0.15 // 15% variance
      const minValue = Math.round(adjustedPrice * (1 - variance))
      const maxValue = Math.round(adjustedPrice * (1 + variance))
      const averageValue = Math.round((minValue + maxValue) / 2)
      
      const mockResult: ValuationResult = {
        estimatedValue: {
          min: minValue,
          max: maxValue,
          average: averageValue
        },
        confidence: 85,
        factors: {
          positive: getPositiveFactors(formData),
          negative: getNegativeFactors(formData)
        },
        marketTrend: 'rising',
        comparableProperties: getComparableProperties(formData)
      }
      
      setResult(mockResult)
      setStep('result')
      
    } catch (error) {
      console.error('Error calculating valuation:', error)
      alert('Değerleme hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const getBasePricePerSqm = (propertyType: string, address: string): number => {
    // Mock base prices per m² in TRY
    const basePrices: { [key: string]: number } = {
      'apartment': 15000,
      'house': 12000,
      'villa': 25000,
      'office': 18000,
      'land': 8000
    }
    
    // Location adjustments
    if (address.toLowerCase().includes('beşiktaş') || address.toLowerCase().includes('kadıköy')) {
      return basePrices[propertyType] * 1.5
    } else if (address.toLowerCase().includes('şişli') || address.toLowerCase().includes('beyoğlu')) {
      return basePrices[propertyType] * 1.3
    }
    
    return basePrices[propertyType] || 10000
  }

  const calculateAdjustments = (data: ValuationFormData): number => {
    let adjustment = 1.0
    
    // Age adjustment
    if (data.buildingAge < 5) adjustment += 0.1
    else if (data.buildingAge > 20) adjustment -= 0.15
    
    // Floor adjustment
    if (data.floor > 0 && data.floor <= 3) adjustment += 0.05
    else if (data.floor > 10) adjustment += 0.1
    
    // Features
    if (data.elevator) adjustment += 0.05
    if (data.parking) adjustment += 0.08
    if (data.balcony) adjustment += 0.03
    if (data.security) adjustment += 0.05
    if (data.hasSeaView) adjustment += 0.2
    if (data.hasGarden) adjustment += 0.1
    if (data.hasPool) adjustment += 0.15
    
    return Math.max(0.5, Math.min(2.0, adjustment)) // Clamp between 0.5x and 2.0x
  }

  const getPositiveFactors = (data: ValuationFormData): string[] => {
    const factors: string[] = []
    
    if (data.buildingAge < 5) factors.push('Yeni bina')
    if (data.elevator) factors.push('Asansörlü')
    if (data.parking) factors.push('Otoparklı')
    if (data.balcony) factors.push('Balkonlu')
    if (data.security) factors.push('Güvenlikli')
    if (data.hasSeaView) factors.push('Deniz manzaralı')
    if (data.hasGarden) factors.push('Bahçeli')
    if (data.hasPool) factors.push('Havuzlu')
    
    return factors
  }

  const getNegativeFactors = (data: ValuationFormData): string[] => {
    const factors: string[] = []
    
    if (data.buildingAge > 20) factors.push('Eski bina')
    if (!data.elevator && data.totalFloors > 3) factors.push('Asansörsüz')
    if (!data.parking) factors.push('Otoparksız')
    if (!data.balcony) factors.push('Balkonsuz')
    if (data.floor === 0) factors.push('Zemin kat')
    
    return factors
  }

  const getComparableProperties = (data: ValuationFormData) => {
    return [
      {
        address: 'Yakın konum - Benzer özellikler',
        price: Math.round(data.netSqm * 14000),
        area: data.netSqm + Math.floor(Math.random() * 20 - 10),
        distance: 0.5
      },
      {
        address: 'Aynı mahalle - Farklı özellikler',
        price: Math.round(data.netSqm * 16000),
        area: data.netSqm + Math.floor(Math.random() * 30 - 15),
        distance: 1.2
      },
      {
        address: 'Komşu bölge - Benzer mülk',
        price: Math.round(data.netSqm * 13000),
        area: data.netSqm + Math.floor(Math.random() * 25 - 12),
        distance: 2.1
      }
    ]
  }

  const resetForm = () => {
    setStep('form')
    setResult(null)
    setFormData({
      address: '',
      propertyType: '',
      netSqm: 0,
      roomCount: 0,
      buildingAge: 0,
      floor: 0,
      totalFloors: 0,
      heatingType: '',
      furnished: false,
      balcony: false,
      elevator: false,
      parking: false,
      security: false,
      hasSeaView: false,
      hasGarden: false,
      hasPool: false
    })
  }

  if (step === 'result' && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-soft">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark">Değerleme Sonucu</h1>
                <p className="text-gray-600 mt-1">{formData.address}</p>
              </div>
              <Button variant="outline" onClick={resetForm}>
                Yeni Değerleme
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Result */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-primary-500" />
                    Tahmini Değer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      {formatPrice(result.estimatedValue.average)}
                    </div>
                    <div className="text-lg text-gray-600 mb-4">
                      {formatPrice(result.estimatedValue.min)} - {formatPrice(result.estimatedValue.max)}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Shield className="w-4 h-4 mr-1" />
                      %{result.confidence} güvenilirlik oranı
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                    Piyasa Trendi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      result.marketTrend === 'rising' ? 'bg-green-500' :
                      result.marketTrend === 'stable' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">
                      {result.marketTrend === 'rising' ? 'Yükseliş Trendi' :
                       result.marketTrend === 'stable' ? 'Stabil Piyasa' : 'Düşüş Trendi'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Bu bölgede son 6 ayda ortalama %8 değer artışı gözlemlenmiştir.
                  </p>
                </CardContent>
              </Card>

              {/* Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Pozitif Faktörler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.factors.positive.map((factor, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Negatif Faktörler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.factors.negative.length > 0 ? (
                        result.factors.negative.map((factor, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                            {factor}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">Önemli negatif faktör bulunmuyor</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Comparable Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
                    Benzer İlanlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.comparableProperties.map((property, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="font-medium text-sm">{property.address}</div>
                        <div className="text-lg font-semibold text-primary-600">
                          {formatPrice(property.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.area} m² • {property.distance} km uzaklık
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">İlanınızı Yayınlayın</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Bu değerleme sonucuna göre ilanınızı yayınlayabilirsiniz.
                  </p>
                  <Button className="w-full">
                    İlan Ver
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">
              EmlakOS Değerlemesi
            </h1>
            <p className="text-gray-600">
              Mülkünüzün güncel piyasa değerini öğrenin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2 text-primary-500" />
              Mülk Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Adres"
                  placeholder="Tam adres bilgisini girin"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  leftIcon={<MapPin className="w-5 h-5" />}
                />
              </div>

              <Select
                label="Mülk Tipi"
                options={propertyTypes}
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
              />

              <Input
                label="Net Alan (m²)"
                type="number"
                value={formData.netSqm}
                onChange={(e) => handleInputChange('netSqm', parseInt(e.target.value) || 0)}
              />

              <Input
                label="Oda Sayısı"
                type="number"
                value={formData.roomCount}
                onChange={(e) => handleInputChange('roomCount', parseInt(e.target.value) || 0)}
              />

              <Input
                label="Bina Yaşı"
                type="number"
                value={formData.buildingAge}
                onChange={(e) => handleInputChange('buildingAge', parseInt(e.target.value) || 0)}
              />

              <Input
                label="Kat"
                type="number"
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', parseInt(e.target.value) || 0)}
              />

              <Input
                label="Toplam Kat"
                type="number"
                value={formData.totalFloors}
                onChange={(e) => handleInputChange('totalFloors', parseInt(e.target.value) || 0)}
              />

              <Select
                label="Isıtma Tipi"
                options={heatingTypes}
                value={formData.heatingType}
                onChange={(e) => handleInputChange('heatingType', e.target.value)}
              />

              <div className="md:col-span-2">
                <h4 className="font-medium text-neutral-dark mb-3">Özellikler</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'furnished', label: 'Eşyalı' },
                    { key: 'balcony', label: 'Balkon' },
                    { key: 'elevator', label: 'Asansör' },
                    { key: 'parking', label: 'Otopark' },
                    { key: 'security', label: 'Güvenlik' },
                    { key: 'hasSeaView', label: 'Deniz Manzarası' },
                    { key: 'hasGarden', label: 'Bahçe' },
                    { key: 'hasPool', label: 'Havuz' }
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={feature.key}
                        checked={formData[feature.key as keyof ValuationFormData] as boolean}
                        onChange={(e) => handleInputChange(feature.key, e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor={feature.key} className="ml-2 text-sm text-gray-700">
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={calculateValuation}
                loading={loading}
                size="lg"
                className="px-8"
                leftIcon={<Calculator className="w-5 h-5" />}
              >
                Değerleme Yap
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
