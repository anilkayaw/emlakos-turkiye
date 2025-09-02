'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Heart, 
  Plus, 
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Bell,
  Shield,
  TrendingUp,
  BarChart,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PropertyCard } from '@/components/property/PropertyCard'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  userType: 'buyer' | 'seller' | 'agent'
  avatar: string
  joinDate: string
  verified: boolean
}

interface Property {
  id: string
  title: string
  price: number
  currency: string
  type: 'Satılık' | 'Kiralık'
  location: {
    district: string
    neighborhood: string
    city: string
  }
  images: string[]
  features: {
    rooms: string
    area: number
    buildingAge: number
    floor: number
    totalFloors: number
  }
  createdAt: string
  isFeatured?: boolean
  isVerified?: boolean
  views?: number
  status?: 'active' | 'pending' | 'sold' | 'rented'
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'favorites' | 'messages' | 'profile'>('overview')
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  // Mock data
  const mockUser: User = {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    phone: '+90 532 123 45 67',
    userType: 'seller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    joinDate: '2024-01-15T10:00:00Z',
    verified: true
  }

  const mockListings: Property[] = [
    {
      id: '1',
      title: 'Modern 3+1 Daire - Beşiktaş',
      price: 2500000,
      currency: 'TRY',
      type: 'Satılık',
      location: {
        district: 'Beşiktaş',
        neighborhood: 'Etiler',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
      features: {
        rooms: '3+1',
        area: 120,
        buildingAge: 5,
        floor: 8,
        totalFloors: 12
      },
      createdAt: '2024-12-01T10:00:00Z',
      isFeatured: true,
      isVerified: true,
      views: 1247,
      status: 'active'
    }
  ]

  const mockFavorites: Property[] = [
    {
      id: 'fav-1',
      title: 'Kiralık 2+1 Daire - Kadıköy',
      price: 8500,
      currency: 'TRY',
      type: 'Kiralık',
      location: {
        district: 'Kadıköy',
        neighborhood: 'Moda',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
      features: {
        rooms: '2+1',
        area: 85,
        buildingAge: 8,
        floor: 3,
        totalFloors: 6
      },
      createdAt: '2024-12-01T10:00:00Z',
      isFeatured: true,
      isVerified: true
    }
  ]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Check if user is logged in
      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/giris')
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUser(mockUser)
      
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
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

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'buyer': return 'Alıcı'
      case 'seller': return 'Satıcı'
      case 'agent': return 'Emlak Danışmanı'
      default: return 'Kullanıcı'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş Gerekli</h1>
          <p className="text-gray-600 mb-6">Bu sayfaya erişmek için giriş yapmalısınız.</p>
          <Link href="/giris">
            <Button>Giriş Yap</Button>
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
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">E</span>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Kullanıcı Paneli</h1>
                <p className="text-sm text-gray-600">Hoş geldiniz, {user.firstName}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-600">{getUserTypeLabel(user.userType)}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                    { id: 'listings', label: 'İlanlarım', icon: Home },
                    { id: 'favorites', label: 'Favorilerim', icon: Heart },
                    { id: 'messages', label: 'Mesajlarım', icon: MessageCircle },
                    { id: 'profile', label: 'Profil', icon: User }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Toplam İlan</p>
                          <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                        <div className="p-3 bg-primary-100 rounded-lg">
                          <Home className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Aktif İlan</p>
                          <p className="text-2xl font-bold text-gray-900">8</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Toplam Görüntülenme</p>
                          <p className="text-2xl font-bold text-gray-900">2,847</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Favori</p>
                          <p className="text-2xl font-bold text-gray-900">156</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                          <Heart className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Son Aktiviteler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockListings.map((listing) => (
                        <div key={listing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{listing.title}</h4>
                              <p className="text-sm text-gray-600">{listing.views} görüntülenme</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Aktif
                            </span>
                            <Link href={`/ilan/${listing.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">İlanlarım</h2>
                  <Link href="/ilan-ver">
                    <Button leftIcon={<Plus className="w-4 h-4" />}>
                      Yeni İlan Ver
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockListings.map((listing) => (
                    <div key={listing.id} className="relative">
                      <PropertyCard
                        property={{
                          id: listing.id,
                          title: listing.title,
                          price: listing.price,
                          type: listing.type,
                          location: `${listing.location.neighborhood}, ${listing.location.district}`,
                          image: listing.images[0] || '',
                          rooms: parseInt(listing.features.rooms.split('+')[0]),
                          bathrooms: parseInt(listing.features.rooms.split('+')[1]) || 1,
                          area: listing.features.area,
                          isFavorite: favorites.includes(listing.id),
                          buildingAge: listing.features.buildingAge,
                          floor: listing.features.floor,
                          totalFloors: listing.features.totalFloors
                        }}
                        onToggleFavorite={handleFavorite}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Favorilerim</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockFavorites.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={{
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        type: property.type,
                        location: `${property.location.neighborhood}, ${property.location.district}`,
                        image: property.images[0] || '',
                        rooms: parseInt(property.features.rooms.split('+')[0]),
                        bathrooms: parseInt(property.features.rooms.split('+')[1]) || 1,
                        area: property.features.area,
                        isFavorite: favorites.includes(property.id),
                        buildingAge: property.features.buildingAge,
                        floor: property.features.floor,
                        totalFloors: property.features.totalFloors
                      }}
                      onToggleFavorite={handleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Mesajlarım</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz mesajınız yok</h3>
                      <p className="text-gray-600">İlanlarınızla ilgili mesajlar burada görünecek.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-600">{getUserTypeLabel(user.userType)}</p>
                        {user.verified && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Doğrulanmış</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">E-posta</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Telefon</p>
                            <p className="font-medium text-gray-900">{user.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Üyelik Tarihi</p>
                            <p className="font-medium text-gray-900">{formatDate(user.joinDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
                        Profili Düzenle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
