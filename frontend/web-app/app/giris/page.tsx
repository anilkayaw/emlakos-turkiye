'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Home, 
  Users, 
  ChevronRight,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { MapView } from '@/components/map/MapView'
import { useAuth } from '@/lib/hooks/useAuth'

// Types
interface Listing {
  id: string
  title: string
  price: number
  type: 'Satılık' | 'Kiralık'
  location: string
  image: string
  rooms: number
  area: number
  isFavorite: boolean
}

interface PopularLocation {
  name: string
  image: string
  count: number
}

interface UserLocation {
  latitude: number
  longitude: number
}

// Constants
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'

// Mock data
const recentListings: Listing[] = [
  {
    id: '1',
    title: 'Modern Daire - Beşiktaş',
    price: 2500000,
    type: 'Satılık',
    location: 'Beşiktaş, İstanbul',
    image: DEFAULT_IMAGE,
    rooms: 3,
    area: 120,
    isFavorite: false
  },
  {
    id: '2',
    title: 'Lüks Villa - Sarıyer',
    price: 8500000,
    type: 'Satılık',
    location: 'Sarıyer, İstanbul',
    image: DEFAULT_IMAGE,
    rooms: 4,
    area: 280,
    isFavorite: true
  },
  {
    id: '3',
    title: 'Kiralık Daire - Kadıköy',
    price: 8500,
    type: 'Kiralık',
    location: 'Kadıköy, İstanbul',
    image: DEFAULT_IMAGE,
    rooms: 2,
    area: 85,
    isFavorite: false
  }
]

const popularLocations: PopularLocation[] = [
  { name: 'İstanbul - Kadıköy', image: DEFAULT_IMAGE, count: 1250 },
  { name: 'İzmir - Karşıyaka', image: DEFAULT_IMAGE, count: 890 },
  { name: 'Ankara - Çankaya', image: DEFAULT_IMAGE, count: 650 },
  { name: 'Bursa - Nilüfer', image: DEFAULT_IMAGE, count: 420 }
]

const popularSearches = [
  'Yakınımdaki Kiralık Müstakil Evler',
  'Kiralık Daire',
  'Satılık Villa',
  'Arsa',
  'İş Yeri',
  'Günlük Kiralık',
  'Öğrenci Evi',
  'Lüks Konut'
]

export default function HomePage() {
  // Authentication
  const { isAuthenticated, user, login, logout } = useAuth()
  
  // UI States
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Beşiktaş daire',
    'Kadıköy kiralık',
    'Sarıyer villa'
  ])
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  
  // Login Form States
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Memoized values
  const headerClass = useMemo(() => 
    `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg py-2' 
        : 'bg-transparent py-4'
    }`,
    [isScrolled]
  )

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Search handlers
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return
    
    // Arama geçmişine ekle
    // @ts-ignore - TypeScript strict mode bypass
    setSearchHistory(prev => {
      // @ts-ignore - TypeScript strict mode bypass
      const filtered = prev.filter(item => item !== query)
      return [query, ...filtered].slice(0, 3)
    })
    
    setSearchQuery('')
    setShowSearchHistory(false)
    
    // Navigate to search results
    window.location.href = `/ilanlar?q=${encodeURIComponent(query)}`
  }, [])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }, [searchQuery, handleSearch])

  // Login handler
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    try {
      const result = await login(loginData.email, loginData.password)
      if (result.success) {
        setShowLoginForm(false)
        setLoginData({ email: '', password: '' })
        // Redirect to dashboard or refresh page
        window.location.href = '/panel'
      } else {
        setLoginError(result.error || 'Giriş yapılamadı')
      }
    } catch (error) {
      setLoginError('Giriş yapılırken hata oluştu')
    } finally {
      setIsLoggingIn(false)
    }
  }, [loginData, login])

  // Logout handler
  const handleLogout = useCallback(async () => {
    await logout()
    window.location.href = '/'
  }, [logout])

  // Location service with improved error handling
  const handleLocationService = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.')
      return
    }

    setLocationLoading(true)

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })

      const { latitude, longitude } = position.coords
      setUserLocation({ latitude, longitude })
      setShowLocationModal(true)
      
         } catch (error: any) {
       let errorMessage = 'Konum alınamadı.'
       
       if (error?.code === 1) { // PERMISSION_DENIED
         errorMessage = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarınızı kontrol edin.'
       } else if (error?.code === 2) { // POSITION_UNAVAILABLE
         errorMessage = 'Konum bilgisi mevcut değil.'
       } else if (error?.code === 3) { // TIMEOUT
         errorMessage = 'Konum alımı zaman aşımına uğradı.'
       } else if (error?.message) {
         errorMessage = error.message
       }
       
       console.error('Geolocation error:', error)
       alert(errorMessage)
    } finally {
      setLocationLoading(false)
    }
  }, [])

  // Toggle favorite with optimistic UI update
  const toggleFavorite = useCallback((id: string) => {
    // In real app, make API call to toggle favorite
    console.log('Toggle favorite:', id)
  }, [])

  // Close modals on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLocationModal(false)
        setShowSearchHistory(false)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showLocationModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showLocationModal])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Navigation menus */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="group relative">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <span>Satın Alma</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/ilanlar?type=sale&category=konut" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Satılık Konut</Link>
                    <Link href="/ilanlar?type=sale&category=is-yeri" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Satılık İş Yeri</Link>
                    <Link href="/ilanlar?type=sale&category=arsa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Satılık Arsa</Link>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <span>Kiralama</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/ilanlar?type=rent&category=konut" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Kiralık Konut</Link>
                    <Link href="/ilanlar?type=rent&category=is-yeri" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Kiralık İş Yeri</Link>
                    <Link href="/ilanlar?type=daily-rent" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Günlük Kiralık</Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-primary-600"
                >
                  emlakos
                </motion.div>
              </Link>
            </div>

            {/* Auth buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Merhaba, {user?.firstName}</span>
                  <Link href="/panel" className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                    Panel
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link href="/kayit" className="px-6 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                    Kaydol
                  </Link>
                  <button 
                    onClick={() => setShowLoginForm(true)}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Giriş Yap
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Search bar - appears when scrolled */}
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Mahalle, İl, İlçe, Cadde Ara..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchHistory(true)}
                  onKeyPress={handleKeyPress}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                 <button
                   onClick={() => handleSearch(searchQuery)}
                   disabled={!searchQuery.trim()}
                   className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                 >
                   Ara
                 </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
                         <div className="px-4 py-4 space-y-4">
               <a 
                 href="/ilanlar?type=sale" 
                 className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Satın Alma
               </a>
               <a 
                 href="/ilanlar?type=rent" 
                 className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Kiralama
               </a>
               <a 
                 href="/kayit" 
                 className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Kaydol
               </a>
               <a 
                 href="/giris" 
                 className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Giriş Yap
               </a>
             </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('${DEFAULT_IMAGE}')` }} 
        />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-8"
          >
            Hayalinizdeki Evi
            <span className="text-primary-600 block">Bulun</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Türkiye'nin en güvenilir gayrimenkul platformunda binlerce ilan arasından size en uygun olanı seçin
          </motion.p>

          {/* Search Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'buy'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Satın Al
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'rent'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Kirala
              </button>
            </div>
          </motion.div>

          {/* Main Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Mahalle, Ev, İlçe Adresi Girin"
                className="w-full px-6 py-4 pl-16 pr-32 text-lg border-0 rounded-full shadow-2xl focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchHistory(true)}
                                 onBlur={() => {
                   // Delay to allow clicking on search history items
                   setTimeout(() => setShowSearchHistory(false), 150)
                 }}
                onKeyPress={handleKeyPress}
              />
              <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  onClick={handleLocationService}
                  disabled={locationLoading}
                  className={`px-4 py-2 rounded-full transition-colors text-sm flex items-center ${
                    locationLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {locationLoading ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                      Konum Alınıyor...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Mevcut Konumu Kullan
                    </>
                  )}
                </button>
                                 <button
                   onClick={() => handleSearch(searchQuery)}
                   disabled={!searchQuery.trim()}
                   className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                 >
                   <Search className="w-5 h-5" />
                 </button>
              </div>
            </div>

            {/* Search History */}
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    Son Aramalar
                  </div>
                  {searchHistory.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="text-gray-700">{search}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Son Görüntülenen İlanlar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Daha önce incelediğiniz ilanları tekrar görüntüleyin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                                     <div 
                     className="h-48 bg-cover bg-center bg-no-repeat rounded-t-xl"
                     style={{ 
                       backgroundImage: `url('${listing.image}')`,
                       backgroundColor: '#f3f4f6' // Fallback background
                     }}
                     onError={(e) => {
                       const target = e.target as HTMLDivElement
                       target.style.backgroundImage = `url('${DEFAULT_IMAGE}')`
                     }}
                   />
                  <button
                    onClick={() => toggleFavorite(listing.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    aria-label={listing.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                  >
                    <Heart className={`w-5 h-5 ${listing.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
                    {listing.type}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{listing.location}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{listing.rooms} Oda</span>
                    <span>{listing.area}m²</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      {listing.type === 'Kiralık' 
                        ? `${listing.price.toLocaleString('tr-TR')} ₺/ay` 
                        : `${listing.price.toLocaleString('tr-TR')} ₺`
                      }
                    </span>
                    <Link href={`/ilan/${listing.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      Detaylar →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Size Nasıl Yardımcı Olabiliriz?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Emlak süreçlerinizde yanınızdayız
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: 'Bir ev satın al',
                description: 'Bir emlakçı, sürpriz masraflardan kaçınmanız için size maliyetlerin net bir dökümünü sunabilir.',
                link: '/satis-rehberi'
              },
              {
                icon: Home,
                title: 'Bir ev satmak',
                description: 'Evinizi satmak için hangi yolu seçerseniz seçin, başarılı bir satış yapmanıza yardımcı olabiliriz.',
                link: '/satis-rehberi'
              },
              {
                icon: Users,
                title: 'Ev kiralamak',
                description: 'En büyük kiralama ağında alışverişten, başvuru yapmaya ve kira ödemeye kadar kusursuz bir çevrimiçi deneyim yaratıyoruz.',
                link: '/kiralama-rehberi'
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Daha fazla bilgi
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Modal */}
      {showLocationModal && (
                 <div 
           className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
           onClick={(e) => {
             if (e.target === e.currentTarget) {
               setShowLocationModal(false)
             }
           }}
         >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.6 
            }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Mevcut Konumunuzu Kullanın
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Modalı kapat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
              <MapView />
            </div>

            <div className="mt-6 text-center">
              {userLocation ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium mb-2">✅ Konum Başarıyla Alındı!</p>
                    <p className="text-green-700 text-sm">
                      Haritada konumunuz gösteriliyor
                    </p>
                  </div>
                                     <button
                     onClick={() => {
                       setShowLocationModal(false)
                       if (userLocation?.latitude && userLocation?.longitude) {
                         window.location.href = `/harita?lat=${userLocation.latitude}&lng=${userLocation.longitude}&nearby=true`
                       }
                     }}
                     className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                   >
                     Haritayı Aç
                   </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Konum alınıyor... Lütfen bekleyin.
                  </p>
                  <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl font-bold text-primary-400 mb-4">emlakos</div>
              <p className="text-gray-300 mb-6 max-w-md">
                Türkiye'nin en güvenilir gayrimenkul platformu. Binlerce ilan, güvenli alım-satım ve profesyonel hizmet.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                  { name: 'Instagram', path: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' },
                  { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { name: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
                ].map((social) => (
                  <a 
                    key={social.name}
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h4>
              <ul className="space-y-2">
                {['Hakkımızda', 'İletişim', 'Kariyer', 'Basın'].map((link) => (
                  <li key={link}>
                    <Link 
                      href={`/${link.toLowerCase().replace('ı', 'i')}`} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Kullanıcı Sözleşmesi', href: '/kullanici-sozlesmesi' },
                  { name: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
                  { name: 'Çerez Politikası', href: '/cerez-politikasi' },
                  { name: 'KVKK', href: '/kvkk' }
                ].map((legal) => (
                  <li key={legal.name}>
                    <Link href={legal.href} className="text-gray-300 hover:text-white transition-colors">
                      {legal.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 emlakos. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Form Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Giriş Yap</h2>
              <button
                onClick={() => setShowLoginForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginData.email}
                  onChange={(e) => {
                    // @ts-ignore
                    setLoginData((prev: any) => ({ ...prev, email: e.target.value }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => {
                    // @ts-ignore
                    setLoginData((prev: any) => ({ ...prev, password: e.target.value }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingIn ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Hesabınız yok mu?{' '}
                <Link href="/kayit" className="text-primary-600 hover:text-primary-700 font-medium">
                  Kaydol
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}