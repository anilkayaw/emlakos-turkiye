'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Share2, 
  Heart,
  Shield,
  Star,
  Calendar,
  MapPin,
  Home,
  Square,
  Building2,
  ThermometerSun,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PropertyGallery } from '@/components/property/PropertyGallery'
import { PropertyFeatures } from '@/components/property/PropertyFeatures'
import { PropertyContactPanel } from '@/components/property/PropertyContactPanel'
import { PropertyMap } from '@/components/property/PropertyMap'
import { SimilarProperties } from '@/components/property/SimilarProperties'
import { PropertyCardSkeleton } from '@/components/ui/Skeleton'

interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  type: 'Satılık' | 'Kiralık'
  location: {
    district: string
    neighborhood: string
    city: string
    address: string
    latitude: number
    longitude: number
  }
  images: string[]
  features: {
    rooms: string
    area: number
    buildingAge: number
    floor: number
    totalFloors: number
    heating: string
    parking: boolean
    balcony: boolean
    elevator: boolean
    furnished: boolean
    security: boolean
    pool: boolean
    garden: boolean
    seaView: boolean
    mountainView: boolean
    airConditioning: boolean
    internet: boolean
    satellite: boolean
    intercom: boolean
    camera: boolean
    alarm: boolean
    concierge: boolean
    gym: boolean
    spa: boolean
    meetingRoom: boolean
    childrenPlayground: boolean
    petFriendly: boolean
    smokingAllowed: boolean
  }
  agent: {
    name: string
    phone: string
    email: string
    avatar: string
    rating: number
    verified: boolean
    agency: string
  }
  createdAt: string
  isFeatured: boolean
  isVerified: boolean
  views: number
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  // Mock property data
  const mockProperty: Property = {
    id: params?.id as string,
    title: 'Modern 3+1 Daire - Beşiktaş Etiler',
    description: `Bu modern ve şık 3+1 daire, İstanbul'un en prestijli bölgelerinden biri olan Etiler'de yer almaktadır. 2019 yılında inşa edilmiş olan binada, 8. katta bulunan bu daire, şehrin panoramik manzarasını sunmaktadır.

Daire, modern yaşam standartlarına uygun olarak tasarlanmış olup, geniş ve ferah alanları ile dikkat çekmektedir. Salon, yemek alanı ve mutfak açık plan olarak düzenlenmiş, günlük yaşamı kolaylaştıracak şekilde tasarlanmıştır.

Özellikler:
• 3 yatak odası, 1 salon, 1 mutfak, 2 banyo
• Geniş balkon ve teras alanları
• Modern mutfak dolapları ve beyaz eşyalar
• Merkezi ısıtma sistemi
• Güvenlik sistemi ve kapıcı hizmeti
• Otopark imkanı
• Asansör
• Site içerisinde yeşil alanlar

Konum avantajları:
• Metro ve metrobüs duraklarına yürüme mesafesi
• Alışveriş merkezleri ve restoranlara yakın
• Okullar ve hastanelere kolay ulaşım
• Boğaz manzarası

Bu daire, hem yatırım hem de yaşam amaçlı kullanım için ideal bir seçenektir.`,
    price: 2500000,
    currency: 'TRY',
    type: 'Satılık',
    location: {
      district: 'Beşiktaş',
      neighborhood: 'Etiler',
      city: 'İstanbul',
      address: 'Etiler Mahallesi, Nispetiye Caddesi No: 123',
      latitude: 41.0766,
      longitude: 29.0234
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
    ],
    features: {
      rooms: '3+1',
      area: 120,
      buildingAge: 5,
      floor: 8,
      totalFloors: 12,
      heating: 'Merkezi',
      parking: true,
      balcony: true,
      elevator: true,
      furnished: false,
      security: true,
      pool: false,
      garden: true,
      seaView: false,
      mountainView: true,
      airConditioning: true,
      internet: true,
      satellite: true,
      intercom: true,
      camera: true,
      alarm: true,
      concierge: true,
      gym: false,
      spa: false,
      meetingRoom: false,
      childrenPlayground: true,
      petFriendly: true,
      smokingAllowed: false
    },
    agent: {
      name: 'Ahmet Yılmaz',
      phone: '+90 532 123 45 67',
      email: 'ahmet.yilmaz@emlakos.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      verified: true,
      agency: 'EmlakOS Türkiye'
    },
    createdAt: '2024-12-01T10:00:00Z',
    isFeatured: true,
    isVerified: true,
    views: 1247
  }

  useEffect(() => {
    loadProperty()
  }, [params?.id])

  const loadProperty = async () => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProperty(mockProperty)
      
    } catch (error) {
      console.error('Error loading property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = (id: string) => {
    setFavorites((prev: string[]) => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
            <div>
              <PropertyCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">İlan Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız ilan mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/">
            <Button>Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Geri Dön
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 line-clamp-1">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location.neighborhood}, {property.location.district}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(property.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{property.views} görüntülenme</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {property.isVerified && (
                <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Doğrulanmış</span>
                </div>
              )}
              <button
                onClick={() => handleFavorite(property.id)}
                className={`p-2 rounded-full transition-colors ${
                  favorites.includes(property.id) 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
              </button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Paylaş
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Açıklama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  {property.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <PropertyFeatures features={property.features} />

            {/* Map */}
            <PropertyMap location={property.location} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PropertyContactPanel
              property={property}
              onFavorite={handleFavorite}
              isFavorite={favorites.includes(property.id)}
            />
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-12">
          <SimilarProperties
            currentProperty={property}
            onFavorite={handleFavorite}
            favorites={favorites}
          />
        </div>
      </div>
    </div>
  )
}