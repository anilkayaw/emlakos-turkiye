'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Home, Users, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface BannerProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  backgroundImage?: string
  className?: string
  children?: React.ReactNode
}

export function Banner({ 
  title, 
  subtitle, 
  showSearch = false, 
  backgroundImage,
  className = '',
  children 
}: BannerProps) {
  const bannerStyle = backgroundImage 
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {}

  return (
    <section 
      className={`relative py-16 lg:py-24 ${backgroundImage ? 'text-white' : 'bg-gray-50'} ${className}`}
      style={bannerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Konum */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Konum ara..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Mülk Tipi */}
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white">
                      <option value="">Mülk Tipi</option>
                      <option value="apartment">Daire</option>
                      <option value="house">Ev</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">İş Yeri</option>
                      <option value="land">Arsa</option>
                    </select>
                  </div>
                  
                  {/* Fiyat Aralığı */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₺</span>
                    <input
                      type="text"
                      placeholder="Max Fiyat"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Arama Butonu */}
                  <button className="bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Ara</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {children}
        </motion.div>
      </div>
    </section>
  )
}

// Önceden tanımlanmış banner varyantları
export function HeroBanner() {
  return (
    <Banner
      title="Hayalinizdeki Evi Bulun"
      subtitle="Türkiye'nin en güvenilir gayrimenkul platformunda binlerce ilan arasından seçin"
      showSearch={true}
      backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    />
  )
}

export function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Banner
      title={title}
      subtitle={subtitle}
      className="bg-gradient-to-r from-primary-600 to-primary-800 text-white"
    />
  )
}

export function SearchBanner() {
  return (
    <Banner
      title="İlan Ara"
      subtitle="Aradığınız kriterlere uygun mülkleri bulun"
      showSearch={true}
      className="bg-gray-50"
    />
  )
}

export default Banner
