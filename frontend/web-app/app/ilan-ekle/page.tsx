'use client'

import { useState } from 'react'
import { 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Plus,
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { apiClient as api } from '@/lib/api'
import type { PropertyFormData } from '@/types/api'

export default function IlanEklePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    currency: 'TRY',
    propertyType: 'apartment',
    transactionType: 'sale',
    location: {
      city: '',
      district: '',
      neighborhood: '',
      address: '',
      coordinates: [0, 0]
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      parking: 0,
      floor: 0,
      totalFloors: 0,
      age: 0,
      heating: 'natural_gas',
      furnished: false,
      balcony: false,
      elevator: false,
      security: false
    },
    images: []
  })

  const steps = [
    { id: 1, title: 'Temel Bilgiler', icon: Home },
    { id: 2, title: 'Konum', icon: MapPin },
    { id: 3, title: 'Özellikler', icon: Bed },
    { id: 4, title: 'Görseller', icon: Home },
    { id: 5, title: 'Özet', icon: CheckCircle }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    })
    
    // Kullanıcı yazmaya başladığında hatayı temizle
    if (Object.prototype.hasOwnProperty.call(errors, field)) {
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  const handleLocationChange = <K extends keyof PropertyFormData['location']>(field: K, value: PropertyFormData['location'][K]) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }))
  }

  const handleFeaturesChange = <K extends keyof PropertyFormData['features']>(field: K, value: PropertyFormData['features'][K]) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev: PropertyFormData) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Başlık gereklidir'
        if (!formData.description.trim()) newErrors.description = 'Açıklama gereklidir'
        if (formData.price <= 0) newErrors.price = 'Geçerli bir fiyat giriniz'
        break
      case 2:
        if (!formData.location.city) newErrors.city = 'Şehir seçiniz'
        if (!formData.location.district) newErrors.district = 'İlçe seçiniz'
        if (!formData.location.neighborhood) newErrors.neighborhood = 'Mahalle giriniz'
        break
      case 3:
        if (formData.features.bedrooms <= 0) newErrors.bedrooms = 'Yatak odası sayısı gereklidir'
        if (formData.features.bathrooms <= 0) newErrors.bathrooms = 'Banyo sayısı gereklidir'
        if (formData.features.area <= 0) newErrors.area = 'Alan bilgisi gereklidir'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 5))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      const response = await api.createProperty(formData)
      
      if (response.success) {
        setSuccess(true)
      } else {
        setErrors({ general: response.error || 'İlan oluşturulurken bir hata oluştu' })
      }
    } catch (error) {
      console.error('Error creating property:', error)
      setErrors({ general: 'İlan oluşturulurken bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İlan Başlığı *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Örn: Merkezi Konumda 3+1 Daire"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Açıklama *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Mülk hakkında detaylı bilgi veriniz..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fiyat *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', Number(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="2500000"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Para Birimi
          </label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="TRY">₺ (Türk Lirası)</option>
            <option value="USD">$ (Dolar)</option>
            <option value="EUR">€ (Euro)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İşlem Türü
          </label>
          <select
            value={formData.transactionType}
            onChange={(e) => handleInputChange('transactionType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="sale">Satılık</option>
            <option value="rent">Kiralık</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mülk Tipi
        </label>
        <select
          value={formData.propertyType}
          onChange={(e) => handleInputChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="apartment">Daire</option>
          <option value="house">Müstakil Ev</option>
          <option value="villa">Villa</option>
          <option value="office">Ofis</option>
          <option value="shop">Dükkan</option>
          <option value="land">Arsa</option>
        </select>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şehir *
          </label>
          <select
            value={formData.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.city ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Şehir Seçiniz</option>
            <option value="istanbul">İstanbul</option>
            <option value="ankara">Ankara</option>
            <option value="izmir">İzmir</option>
            <option value="bursa">Bursa</option>
            <option value="antalya">Antalya</option>
          </select>
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İlçe *
          </label>
          <input
            type="text"
            value={formData.location.district}
            onChange={(e) => handleLocationChange('district', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.district ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Örn: Beşiktaş"
          />
          {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mahalle *
        </label>
        <input
          type="text"
          value={formData.location.neighborhood}
          onChange={(e) => handleLocationChange('neighborhood', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.neighborhood ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Örn: Etiler"
        />
        {errors.neighborhood && <p className="mt-1 text-sm text-red-600">{errors.neighborhood}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adres
        </label>
        <textarea
          value={formData.location.address}
          onChange={(e) => handleLocationChange('address', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Detaylı adres bilgisi..."
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yatak Odası *
          </label>
          <input
            type="number"
            min="0"
            value={formData.features.bedrooms}
            onChange={(e) => handleFeaturesChange('bedrooms', Number(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.bedrooms ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banyo *
          </label>
          <input
            type="number"
            min="0"
            value={formData.features.bathrooms}
            onChange={(e) => handleFeaturesChange('bathrooms', Number(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.bathrooms ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alan (m²) *
          </label>
          <input
            type="number"
            min="0"
            value={formData.features.area}
            onChange={(e) => handleFeaturesChange('area', Number(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.area ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Otopark
          </label>
          <input
            type="number"
            min="0"
            value={formData.features.parking}
            onChange={(e) => handleFeaturesChange('parking', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kat
          </label>
          <input
            type="number"
            min="0"
            value={formData.features.floor}
            onChange={(e) => handleFeaturesChange('floor', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Toplam Kat
          </label>
          <input
            type="number"
            min="0"
            value={formData.features.totalFloors}
            onChange={(e) => handleFeaturesChange('totalFloors', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bina Yaşı
          </label>
          <input
            type="number"
            min="0"
            value={formData.features.age}
            onChange={(e) => handleFeaturesChange('age', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Isıtma Tipi
        </label>
        <select
          value={formData.features.heating}
          onChange={(e) => handleFeaturesChange('heating', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="natural_gas">Doğalgaz</option>
          <option value="electric">Elektrik</option>
          <option value="coal">Kömür</option>
          <option value="wood">Odun</option>
          <option value="solar">Güneş Enerjisi</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.features.furnished}
            onChange={(e) => handleFeaturesChange('furnished', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Eşyalı</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.features.balcony}
            onChange={(e) => handleFeaturesChange('balcony', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Balkon</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.features.elevator}
            onChange={(e) => handleFeaturesChange('elevator', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Asansör</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.features.security}
            onChange={(e) => handleFeaturesChange('security', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Güvenlik</span>
        </label>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mülk Görselleri
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Görselleri yüklemek için tıklayın
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                PNG, JPG, GIF dosyaları (Max 10MB)
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="sr-only"
            />
          </div>
        </div>
      </div>

      {formData.images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Yüklenen Görseller ({formData.images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">İlan Özeti</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">{formData.title}</h4>
            <p className="text-sm text-gray-600">{formData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Fiyat:</span>
              <p className="text-lg font-bold text-primary-600">
                {formData.price.toLocaleString('tr-TR')} {formData.currency}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">İşlem Türü:</span>
              <p className="text-sm text-gray-600">
                {formData.transactionType === 'sale' ? 'Satılık' : 'Kiralık'}
              </p>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700">Konum:</span>
            <p className="text-sm text-gray-600">
              {formData.location.neighborhood}, {formData.location.district}, {formData.location.city}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Yatak Odası:</span>
              <p className="text-sm text-gray-600">{formData.features.bedrooms}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Banyo:</span>
              <p className="text-sm text-gray-600">{formData.features.bathrooms}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Alan:</span>
              <p className="text-sm text-gray-600">{formData.features.area} m²</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700">Görseller:</span>
            <p className="text-sm text-gray-600">{formData.images.length} adet</p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}
    </div>
  )

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan Başarıyla Oluşturuldu!</h2>
          <p className="text-gray-600 mb-6">İlanınız onay sürecinden sonra yayınlanacaktır.</p>
          <div className="space-x-4">
            <Link
              href="/panel"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Panele Dön
            </Link>
            <Link
              href="/ilanlar"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İlanları Görüntüle
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/panel" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Panele Dön
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">İlan Ekle</h1>
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
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Geri
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              İleri
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  İlan Oluşturuluyor...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  İlanı Yayınla
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}