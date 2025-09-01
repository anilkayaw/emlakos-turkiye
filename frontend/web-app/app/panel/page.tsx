'use client'

import { useState } from 'react'
// import { motion } from 'framer-motion'
import { 
  Home, 
  Heart, 
  Search, 
  Plus, 
  Settings, 
  Bell, 
  User, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Star,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

// Mock data for user dashboard
const mockUserData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@email.com',
  userType: 'kiracı',
  avatar: '/images/user-avatar.jpg',
  joinDate: '2024-01-15',
  stats: {
    totalViews: 1250,
    favoritesCount: 12,
    searchesCount: 8,
    messagesCount: 5
  }
}

const mockRecentSearches = [
  {
    id: '1',
    query: 'İstanbul Beşiktaş daire',
    filters: { type: 'daire', city: 'istanbul', price: '1000000-3000000' },
    results: 45,
    lastSearch: '2024-01-20'
  },
  {
    id: '2',
    query: 'Antalya villa havuzlu',
    filters: { type: 'villa', city: 'antalya', features: ['havuz'] },
    results: 23,
    lastSearch: '2024-01-18'
  }
]

const mockFavoriteListings = [
  {
    id: '1',
    title: 'Modern Daire - Beşiktaş',
    price: 2500000,
    location: 'Beşiktaş, İstanbul',
    image: '/images/listing1.jpg',
    addedDate: '2024-01-15',
    views: 1250
  },
  {
    id: '2',
    title: 'Lüks Villa - Antalya',
    price: 4500000,
    location: 'Konyaaltı, Antalya',
    image: '/images/listing2.jpg',
    addedDate: '2024-01-10',
    views: 890
  }
]

const mockRecentMessages = [
  {
    id: '1',
    from: 'Ayşe Demir',
    subject: 'Beşiktaş Dairesi Hakkında',
    preview: 'Merhaba, ilanınızla ilgili sorularım var...',
    time: '2 saat önce',
    unread: true
  },
  {
    id: '2',
    from: 'Mehmet Kaya',
    subject: 'Villa Görüntüleme Randevusu',
    preview: 'Villa görüntülemek için randevu almak istiyorum.',
    time: '1 gün önce',
    unread: false
  }
]

export default function PanelPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userData] = useState(mockUserData)
  const [recentSearches] = useState(mockRecentSearches)
  const [favoriteListings] = useState(mockFavoriteListings)
  const [recentMessages] = useState(mockRecentMessages)

  const formatPrice = (price: number) => {
    // Server-side rendering için sabit format
    if (typeof window === 'undefined') {
      return `${price.toLocaleString('tr-TR')} ₺`
    }
    // Client-side için de aynı format
    return `${price.toLocaleString('tr-TR')} ₺`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Home },
    { id: 'favorites', label: 'Favoriler', icon: Heart },
    { id: 'searches', label: 'Aramalar', icon: Search },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
    { id: 'settings', label: 'Ayarlar', icon: Settings }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Görüntüleme</p>
              <p className="text-2xl font-bold text-gray-900">{typeof window === 'undefined' ? '1,250' : userData.stats.totalViews.toLocaleString('tr-TR')}</p>
            </div>
          </div>
        </div>

        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Favori İlanlar</p>
              <p className="text-2xl font-bold text-gray-900">{userData.stats.favoritesCount}</p>
            </div>
          </div>
        </div>

        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kayıtlı Aramalar</p>
              <p className="text-2xl font-bold text-gray-900">{userData.stats.searchesCount}</p>
            </div>
          </div>
        </div>

        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Yeni Mesajlar</p>
              <p className="text-2xl font-bold text-gray-900">{userData.stats.messagesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Searches */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Son Aramalar</h3>
            <Link href="/panel/searches" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-3">
            {recentSearches.map((search, index) => (
              <div
                key={search.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{search.query}</p>
                  <p className="text-sm text-gray-600">{search.results} sonuç • {formatDate(search.lastSearch)}</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Son Mesajlar</h3>
            <Link href="/panel/messages" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((message, index) => (
              <div
                key={message.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  message.unread ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{message.from}</p>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.preview}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-2">
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/ilanlar"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Search className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">İlan Ara</span>
          </Link>
          <Link
            href="/panel/favorites"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Heart className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Favorilerim</span>
          </Link>
          <Link
            href="/panel/searches"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Filter className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Aramalarım</span>
          </Link>
          <Link
            href="/panel/settings"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-8 h-8 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Ayarlar</span>
          </Link>
        </div>
      </div>
    </div>
  )

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Favori İlanlarım</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Filter className="w-5 h-5" />
          </button>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Tarihe Göre</option>
            <option>Fiyata Göre</option>
            <option>Konuma Göre</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteListings.map((listing, index) => (
          <div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Resim</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{listing.location}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(listing.price)}
                </span>
                <div className="flex items-center text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm">{listing.views}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatDate(listing.addedDate)} tarihinde eklendi
                </span>
                <div className="flex space-x-2">
                  <Link
                    href={`/ilan/${listing.id}`}
                    className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
                  >
                    Görüntüle
                  </Link>
                  <button className="p-1 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSearches = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kayıtlı Aramalarım</h2>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4 mr-2 inline" />
          Yeni Arama Kaydet
        </button>
      </div>

      <div className="space-y-4">
        {recentSearches.map((search, index) => (
          <div
            key={search.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{search.query}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span>{search.results} sonuç bulundu</span>
                  <span>Son arama: {formatDate(search.lastSearch)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(search.filters).map(([key, value]) => (
                    <span key={key} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="p-2 text-primary-600 hover:text-primary-700">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mesajlarım</h2>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Tümünü Okundu İşaretle
          </button>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Tümü</option>
            <option>Okunmamış</option>
            <option>Okunmuş</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {recentMessages.map((message, index) => (
          <div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
              message.unread ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-900 mr-2">{message.from}</h3>
                  {message.unread && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Yeni
                    </span>
                  )}
                </div>
                <p className="text-lg font-medium text-gray-900 mb-1">{message.subject}</p>
                <p className="text-gray-600 mb-2">{message.preview}</p>
                <span className="text-sm text-gray-500">{message.time}</span>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors">
                  Yanıtla
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Hesap Ayarları</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
            <input
              type="text"
              value={userData.name.split(' ')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
            <input
              type="text"
              value={userData.name.split(' ')[1]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <input
              type="email"
              value={userData.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hesap Türü</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="kiracı">Kiracı</option>
              <option value="mülk_sahibi">Mülk Sahibi</option>
              <option value="emlak_danışmanı">Emlak Danışmanı</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Ayarları</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">E-posta Bildirimleri</p>
              <p className="text-sm text-gray-600">Yeni ilanlar ve mesajlar için e-posta al</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Bildirimleri</p>
              <p className="text-sm text-gray-600">Önemli güncellemeler için SMS al</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Pazarlama E-postaları</p>
              <p className="text-sm text-gray-600">Kampanya ve duyurular için e-posta al</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-primary-600" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-primary-600 hover:text-primary-700">
                <Home className="w-6 h-6 mr-2" />
                <span className="text-lg font-bold">EmlakOS Türkiye</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{userData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{userData.name}</h3>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'favorites' && renderFavorites()}
            {activeTab === 'searches' && renderSearches()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  )
}
