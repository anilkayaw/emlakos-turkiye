'use client'

import React, { useState, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  Home, 
  Camera, 
  DollarSign,
  Eye,
  AlertCircle,
  Shield,
  FileText,
  Upload
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase'

interface PropertyFormData {
  // Step 1: EİDS Doğrulama
  address: string
  eidsNumber: string
  eidsVerified: boolean
  
  // Step 2: Mülk Detayları
  title: string
  description: string
  propertyType: string
  netSqm: number
  grossSqm: number
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
  
  // Step 3: Medya
  images: File[]
  
  // Step 4: Fiyatlandırma
  price: number
  currency: string
  isLoanEligible: boolean
  
  // Step 5: Önizleme
  contactInfo: {
    name: string
    phone: string
    email: string
  }
}

export default function IlanVerPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    address: '',
    eidsNumber: '',
    eidsVerified: false,
    title: '',
    description: '',
    propertyType: '',
    netSqm: 0,
    grossSqm: 0,
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
    images: [],
    price: 0,
    currency: 'TRY',
    isLoanEligible: false,
    contactInfo: {
      name: '',
      phone: '',
      email: ''
    }
  })

  const steps = [
    { id: 1, title: 'EİDS Doğrulama', icon: Shield, description: 'Taşınmaz bilgilerini doğrula' },
    { id: 2, title: 'Mülk Detayları', icon: Home, description: 'Mülk özelliklerini belirt' },
    { id: 3, title: 'Medya', icon: Camera, description: 'Fotoğrafları yükle' },
    { id: 4, title: 'Fiyatlandırma', icon: DollarSign, description: 'Fiyat bilgilerini gir' },
    { id: 5, title: 'Önizleme', icon: Eye, description: 'İlanı kontrol et ve yayınla' }
  ]

  const propertyTypes = [
    { value: 'apartment', label: 'Daire' },
    { value: 'house', label: 'Ev' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Ofis' },
    { value: 'land', label: 'Arsa' },
    { value: 'commercial', label: 'Ticari' }
  ]

  const heatingTypes = [
    { value: 'natural_gas', label: 'Doğalgaz' },
    { value: 'electric', label: 'Elektrik' },
    { value: 'coal', label: 'Kömür' },
    { value: 'solar', label: 'Güneş Enerjisi' }
  ]

  const currencies = [
    { value: 'TRY', label: 'Türk Lirası (₺)' },
    { value: 'USD', label: 'Amerikan Doları ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof PropertyFormData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.address.trim() !== '' && formData.eidsNumber.trim() !== ''
      case 2:
        return formData.title.trim() !== '' && 
               formData.propertyType !== '' && 
               formData.netSqm > 0 && 
               formData.roomCount > 0
      case 3:
        return formData.images.length > 0
      case 4:
        return formData.price > 0
      case 5:
        return formData.contactInfo.name.trim() !== '' && 
               formData.contactInfo.phone.trim() !== '' && 
               formData.contactInfo.email.trim() !== ''
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      // Upload images to Supabase Storage
      const imageUrls: string[] = []
      for (const image of formData.images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, image)
        
        if (error) throw error
        
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName)
        
        imageUrls.push(publicUrl)
      }

      // Create property listing
      const { data, error } = await supabase
        .from('listings')
        .insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          currency: formData.currency,
          property_type: formData.propertyType,
          transaction_type: 'sale',
          net_sqm: formData.netSqm,
          gross_sqm: formData.grossSqm,
          room_count: formData.roomCount,
          building_age: formData.buildingAge,
          floor: formData.floor,
          total_floors: formData.totalFloors,
          heating_type: formData.heatingType,
          furnished: formData.furnished,
          balcony: formData.balcony,
          elevator: formData.elevator,
          parking: formData.parking,
          security: formData.security,
          latitude: 0, // Will be updated with geocoding
          longitude: 0,
          city: 'istanbul', // Will be extracted from address
          district: '',
          neighborhood: '',
          address: formData.address,
          is_loan_eligible: formData.isLoanEligible,
          eids_verified: formData.eidsVerified,
          images: imageUrls,
          owner_id: 'current-user-id', // Will be replaced with actual user ID
          status: 'active'
        })

      if (error) throw error

      // Success - redirect to property page or dashboard
      alert('İlanınız başarıyla oluşturuldu!')
      
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                EİDS Doğrulama
              </h2>
              <p className="text-gray-600">
                Taşınmaz bilgilerinizi E-Devlet üzerinden doğrulayın
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Input
                    label="Taşınmaz Adresi"
                    placeholder="Tam adres bilgisini girin"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    leftIcon={<MapPin className="w-5 h-5" />}
                  />
                  
                  <Input
                    label="EİDS Taşınmaz Numarası"
                    placeholder="E-Devlet'ten alacağınız taşınmaz numarası"
                    value={formData.eidsNumber}
                    onChange={(e) => handleInputChange('eidsNumber', e.target.value)}
                    leftIcon={<FileText className="w-5 h-5" />}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          EİDS Doğrulama Nasıl Yapılır?
                        </h4>
                        <p className="text-sm text-blue-700">
                          E-Devlet kapısına giriş yaparak "Taşınmaz Sorgulama" hizmetinden 
                          taşınmaz numaranızı alabilirsiniz. Bu numara ilanınızın güvenilirliğini artırır.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="eidsVerified"
                      checked={formData.eidsVerified}
                      onChange={(e) => handleInputChange('eidsVerified', e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="eidsVerified" className="ml-2 text-sm text-gray-700">
                      EİDS bilgilerini doğruladım
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Home className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                Mülk Detayları
              </h2>
              <p className="text-gray-600">
                Mülkünüzün özelliklerini detaylı olarak belirtin
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="İlan Başlığı"
                      placeholder="Örn: Modern 3+1 Daire - Beşiktaş"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Açıklama
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      rows={4}
                      placeholder="Mülkünüz hakkında detaylı bilgi verin..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
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
                    label="Brüt Alan (m²)"
                    type="number"
                    value={formData.grossSqm}
                    onChange={(e) => handleInputChange('grossSqm', parseInt(e.target.value) || 0)}
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
                        { key: 'security', label: 'Güvenlik' }
                      ].map((feature) => (
                        <div key={feature.key} className="flex items-center">
                          <input
                            type="checkbox"
                            id={feature.key}
                            checked={formData[feature.key as keyof PropertyFormData] as boolean}
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
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Camera className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                Fotoğraf Yükleme
              </h2>
              <p className="text-gray-600">
                Mülkünüzün en iyi fotoğraflarını yükleyin
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Fotoğrafları Yükleyin
                    </h3>
                    <p className="text-gray-600 mb-4">
                      En az 5, en fazla 20 fotoğraf yükleyebilirsiniz
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 cursor-pointer"
                    >
                      Fotoğraf Seç
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                Fiyatlandırma
              </h2>
              <p className="text-gray-600">
                Mülkünüz için uygun fiyat belirleyin
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Satış Fiyatı"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  />

                  <Select
                    label="Para Birimi"
                    options={currencies}
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  />

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isLoanEligible"
                        checked={formData.isLoanEligible}
                        onChange={(e) => handleInputChange('isLoanEligible', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="isLoanEligible" className="ml-2 text-sm text-gray-700">
                        Krediye uygun
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Eye className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                Önizleme ve Yayınlama
              </h2>
              <p className="text-gray-600">
                İlanınızı kontrol edin ve yayınlayın
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>İlan Önizlemesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{formData.title}</h3>
                      <p className="text-gray-600">{formData.address}</p>
                    </div>
                    
                    <div className="text-2xl font-bold text-primary-600">
                      {formData.price.toLocaleString('tr-TR')} {formData.currency}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Net Alan: {formData.netSqm} m²</div>
                      <div>Oda: {formData.roomCount}+1</div>
                      <div>Bina Yaşı: {formData.buildingAge}</div>
                      <div>Kat: {formData.floor}/{formData.totalFloors}</div>
                    </div>
                    
                    <p className="text-gray-700">{formData.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="Ad Soyad"
                      value={formData.contactInfo.name}
                      onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                    />
                    <Input
                      label="Telefon"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                    />
                    <Input
                      label="E-posta"
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-neutral-dark">İlan Ver</h1>
            </div>
            <div className="text-sm text-gray-600">
              Adım {currentStep} / 5
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Önceki
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sonraki
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!validateStep(currentStep)}
              leftIcon={<CheckCircle className="w-4 h-4" />}
            >
              İlanı Yayınla
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
