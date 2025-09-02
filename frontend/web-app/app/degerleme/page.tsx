'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PageBanner } from '@/components/layout/Banner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function DegerlemePage() {
  const [formData, setFormData] = useState({
    location: '',
    area: '',
    rooms: '',
    age: '',
    floor: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const calculateValuation = async () => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock result
      setResult({
        estimatedValue: {
          average: 2500000,
          min: 2200000,
          max: 2800000
        },
        confidence: 85
      })
    } catch (error) {
      console.error('Valuation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <PageBanner title="Gayrimenkul Değerleme" subtitle="Mülkünüzün güncel piyasa değerini öğrenin" />
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Değerleme Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e: any) => handleInputChange('location', e.target.value)}
                    placeholder="İl, İlçe, Mahalle"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alan (m²)
                  </label>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e: any) => handleInputChange('area', e.target.value)}
                    placeholder="120"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oda Sayısı
                  </label>
                  <Input
                    value={formData.rooms}
                    onChange={(e: any) => handleInputChange('rooms', e.target.value)}
                    placeholder="3+1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bina Yaşı
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e: any) => handleInputChange('age', e.target.value)}
                    placeholder="5"
                  />
                </div>
                
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kat
                  </label>
                  <Input
                    type="number"
                    value={formData.floor}
                    onChange={(e: any) => handleInputChange('floor', e.target.value)}
                    placeholder="8"
                  />
              </div>
                
                <Button
                  onClick={calculateValuation}
                  loading={loading}
                  size="lg"
                  className="w-full"
                >
                  Değerleme Yap
              </Button>
              </CardContent>
            </Card>
        </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
              <Card>
                <CardHeader>
                    <CardTitle>Tahmini Değer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      {formatPrice(result.estimatedValue.average)}
                    </div>
                    <div className="text-lg text-gray-600 mb-4">
                      {formatPrice(result.estimatedValue.min)} - {formatPrice(result.estimatedValue.max)}
                    </div>
                      <div className="text-sm text-gray-500">
                      %{result.confidence} güvenilirlik oranı
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Değerleme yapmak için formu doldurun
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}