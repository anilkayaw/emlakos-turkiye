'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Home, 
  Users, 
  Star, 
  ChevronRight,
  Heart,
  Eye,
  TrendingUp,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { MapView } from '@/components/map/MapView'

// Mock data for recent listings
const recentListings = [
  {
    id: '1',
    title: 'Modern Daire - Beşiktaş',
    price: 2500000,
    type: 'Satılık',
    location: 'Beşiktaş, İstanbul',
    image: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYBEqYeg_H5qorOw2U=',
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
    image: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYBEqYeg_H5qorOw2U=',
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
    image: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYBEqYeg_H5qorOw2U=',
    rooms: 2,
    area: 85,
    isFavorite: false
  }
]

// Mock data for popular locations
const popularLocations = [
  { name: 'İstanbul - Kadıköy', image: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=', count: 1250 },
  { name: 'İzmir - Karşıyaka', image: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=', count: 890 },
  { name: 'Ankara - Çankaya', image: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=', count: 650 },
  { name: 'Bursa - Nilüfer', image: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=', count: 420 }
]

// Mock data for popular searches
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
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState([
    'Beşiktaş daire',
    'Kadıköy kiralık',
    'Sarıyer villa'
  ])
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('buy')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle search
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to search history
             if (!searchHistory.includes(query)) {
         setSearchHistory([query, ...searchHistory.slice(0, 2)])
       }
      setSearchQuery('')
      setShowSearchHistory(false)
      // Navigate to search results
      window.location.href = `/ilanlar?q=${encodeURIComponent(query)}`
    }
  }

  // Handle location service
  const handleLocationService = () => {
    setLocationLoading(true)
    
    if (navigator.geolocation) {
      // Konum izni iste
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Başarılı konum alındı
          const { latitude, longitude } = position.coords
          console.log('Kullanıcı konumu:', { latitude, longitude })
          
          // Konum bilgisini state'e kaydet
          setUserLocation({ latitude, longitude })
          setLocationLoading(false)
          
          // Konum modal'ını aç
          setShowLocationModal(true)
        },
        (error) => {
          // Konum hatası
          console.error('Konum alınamadı:', error)
          setLocationLoading(false)
          
          let errorMessage = 'Konum alınamadı.'
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarınızı kontrol edin.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Konum bilgisi mevcut değil.'
              break
            case error.TIMEOUT:
              errorMessage = 'Konum alımı zaman aşımına uğradı.'
              break
            default:
              errorMessage = 'Bilinmeyen konum hatası.'
          }
          alert(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      )
    } else {
      // Geolocation desteklenmiyor
      setLocationLoading(false)
      alert('Tarayıcınız konum servisini desteklemiyor.')
    }
  }

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    // In real app, make API call to toggle favorite
    console.log('Toggle favorite:', id)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation menus */}
            <div className="hidden lg:flex items-center space-x-8">
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
            </div>

            {/* Center - Logo */}
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

            {/* Right side - Auth buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/kayit" className="px-6 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                Kaydol
              </Link>
              <Link href="/giris" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Giriş Yap
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
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
              <Link href="/ilanlar?type=sale" className="block py-2 text-gray-700">Satın Alma</Link>
              <Link href="/ilanlar?type=rent" className="block py-2 text-gray-700">Kiralama</Link>
              <Link href="/kayit" className="block py-2 text-gray-700">Kaydol</Link>
              <Link href="/giris" className="block py-2 text-gray-700">Giriş Yap</Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
             style={{ backgroundImage: "url('https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=')" }} />
        
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
                onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
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
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
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
                  className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
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
                  <div className="h-48 bg-cover bg-center bg-no-repeat rounded-t-xl"
                       style={{ backgroundImage: `url('${listing.image}')` }}>
                  </div>
                  <button
                    onClick={() => toggleFavorite(listing.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
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
                      {listing.type === 'Kiralık' ? `${listing.price.toLocaleString('tr-TR')} ₺/ay` : `${listing.price.toLocaleString('tr-TR')} ₺`}
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

      {/* AI Budget Analysis Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Yapay Zeka ile Bütçenize Uygun Evleri Bulun
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Bütçeniz, yaşam tarzınız ve tercihlerinize göre en uygun evleri bulan yapay zeka destekli arama sistemi
              </p>
              <Link
                href="/ai-search"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg"
              >
                Başla
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
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

      {/* Explore Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Kiralıkları Keşfedin */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Kiralıkları Keşfedin
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Derinlemesine bir araştırma yapın ve sizin için en uygun olanı bulmak için kiralık evlere veya dairelere ve yerel bilgilere göz atın.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {popularLocations.slice(0, 4).map((location, index) => (
                                     <div key={index} className="relative group cursor-pointer">
                     <div className="h-32 bg-cover bg-center bg-no-repeat rounded-lg"
                          style={{ backgroundImage: `url('${location.image}')` }}>
                     </div>
                     <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg group-hover:bg-opacity-50 transition-all duration-300" />
                     <div className="absolute bottom-4 left-4 text-white">
                       <h4 className="font-semibold">{location.name}</h4>
                       <p className="text-sm opacity-90">{location.count} ilan</p>
                     </div>
                   </div>
                ))}
              </div>
            </motion.div>

            {/* Bir Mahalleye Göz Atın */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Bir Mahalleye Göz Atın
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                İstediğiniz bölgeyi keşfedin ve o çevredeki gayrimenkul fırsatlarını inceleyin.
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mahalle, ilçe veya şehir adı girin..."
                  className="w-full px-6 py-4 pl-16 pr-32 text-lg border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-500 focus:border-primary-500"
                />
                <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Keşfet
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Popüler Kiralık Aramaları',
                links: ['Yakınımdaki Kiralık Müstakil Evler', 'Kiralık Daire', 'Kiralık Villa', 'Günlük Kiralık', 'Öğrenci Evi']
              },
              {
                title: 'Kiralık Piyasalar',
                links: ['İstanbul Kiralıkları', 'Ankara Kiralıkları', 'İzmir Kiralıkları', 'Bursa Kiralıkları', 'Antalya Kiralıkları']
              },
              {
                title: 'emlakos Keşfedin',
                links: ['emlakos Tahminleri', 'Topluluk Site Haritası', 'Gayrimenkul Haberleri', 'Piyasa Analizleri', 'Uzman Görüşleri']
              },
              {
                title: 'Profesyoneller İçin',
                links: ['Popüler İlçeler', 'Kiralık Topluluklar', 'Emlakçı Rehberi', 'Pazarlama Araçları', 'Eğitim Programları']
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                   </svg>
                 </a>
                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                   </svg>
                 </a>
                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                   </svg>
                 </a>
                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                   </svg>
                 </a>
                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                   </svg>
                 </a>
               </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h4>
              <ul className="space-y-2">
                <li><Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="/iletisim" className="text-gray-300 hover:text-white transition-colors">İletişim</Link></li>
                <li><Link href="/kariyer" className="text-gray-300 hover:text-white transition-colors">Kariyer</Link></li>
                <li><Link href="/basin" className="text-gray-300 hover:text-white transition-colors">Basın</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2">
                <li><Link href="/kullanici-sozlesmesi" className="text-gray-300 hover:text-white transition-colors">Kullanıcı Sözleşmesi</Link></li>
                <li><Link href="/gizlilik-politikasi" className="text-gray-300 hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="/cerez-politikasi" className="text-gray-300 hover:text-white transition-colors">Çerez Politikası</Link></li>
                <li><Link href="/kvkk" className="text-gray-300 hover:text-white transition-colors">KVKK</Link></li>
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

      {/* Location Modal */}
      {showLocationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLocationModal(false)}
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
               onClick={(e) => e.stopPropagation()}
             >
                           <motion.div 
                 className="flex items-center justify-between mb-6"
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, ease: "easeOut" }}
               >
                 <motion.h3 
                   className="text-2xl font-bold text-gray-900"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                 >
                   Mevcut Konumunuzu Kullanın
                 </motion.h3>
                 <motion.button
                   onClick={() => setShowLocationModal(false)}
                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                   whileHover={{ scale: 1.1, rotate: 90 }}
                   whileTap={{ scale: 0.9 }}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </motion.button>
               </motion.div>
            
                         <motion.div 
               className="h-96 rounded-lg overflow-hidden border border-gray-200"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
             >
               <MapView />
             </motion.div>
            
                           <div className="mt-6 text-center">
                 {userLocation ? (
                   <>
                     <motion.div 
                       className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.5, ease: "easeOut" }}
                     >
                       <p className="text-green-800 font-medium mb-2">✅ Konum Başarıyla Alındı!</p>
                       <p className="text-green-700 text-sm">
                         Haritada konumunuz gösteriliyor
                       </p>
                     </motion.div>
                     <motion.button
                       onClick={() => {
                         setShowLocationModal(false)
                         window.location.href = `/harita?lat=${userLocation.latitude}&lng=${userLocation.longitude}&nearby=true`
                       }}
                       className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                     >
                       Haritayı Aç
                     </motion.button>
                   </>
                 ) : (
                   <>
                     <motion.p 
                       className="text-gray-600 mb-4"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.5 }}
                     >
                       Konum alınıyor... Lütfen bekleyin.
                     </motion.p>
                     <motion.div 
                       className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ duration: 0.5, ease: "easeOut" }}
                     />
                   </>
                 )}
               </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
