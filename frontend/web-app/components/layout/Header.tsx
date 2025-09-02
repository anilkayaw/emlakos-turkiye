'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeaderProps {
  className?: string
  onListingTypeChange?: (type: 'sale' | 'rent') => void
  currentListingType?: 'sale' | 'rent'
}

export function Header({ 
  className = '', 
  onListingTypeChange,
  currentListingType = 'sale'
}: HeaderProps) {
  const [isBuyMenuOpen, setIsBuyMenuOpen] = useState(false)
  const [isRentMenuOpen, setIsRentMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleListingTypeChange = (type: 'sale' | 'rent') => {
    onListingTypeChange?.(type)
    setIsBuyMenuOpen(false)
    setIsRentMenuOpen(false)
  }

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Sol Taraf - Satın Alma ve Kiralama Menüleri */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Satın Alma Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsBuyMenuOpen(!isBuyMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                data-test="buy-menu-button"
                data-analytics-action="buy-menu-toggle"
              >
                <span>Satın Alma</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isBuyMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isBuyMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="py-2">
                    <Link 
                      href="/satilik?type=sale&category=konut" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('sale')}
                      data-test="buy-apartment-link"
                      data-analytics-action="buy-apartment-click"
                    >
                      Satılık Konut
                    </Link>
                    <Link 
                      href="/satilik?type=sale&category=is-yeri" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('sale')}
                      data-test="buy-commercial-link"
                      data-analytics-action="buy-commercial-click"
                    >
                      Satılık İş Yeri
                    </Link>
                    <Link 
                      href="/satilik?type=sale&category=arsa" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('sale')}
                      data-test="buy-land-link"
                      data-analytics-action="buy-land-click"
                    >
                      Satılık Arsa
                    </Link>
                    <Link 
                      href="/satilik?type=sale&category=villa" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('sale')}
                      data-test="buy-villa-link"
                      data-analytics-action="buy-villa-click"
                    >
                      Satılık Villa
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Kiralama Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsRentMenuOpen(!isRentMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                data-test="rent-menu-button"
                data-analytics-action="rent-menu-toggle"
              >
                <span>Kiralama</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isRentMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isRentMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="py-2">
                    <Link 
                      href="/kiralik?type=rent&category=konut" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('rent')}
                      data-test="rent-apartment-link"
                      data-analytics-action="rent-apartment-click"
                    >
                      Kiralık Konut
                    </Link>
                    <Link 
                      href="/kiralik?type=rent&category=is-yeri" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('rent')}
                      data-test="rent-commercial-link"
                      data-analytics-action="rent-commercial-click"
                    >
                      Kiralık İş Yeri
                    </Link>
                    <Link 
                      href="/kiralik?type=daily-rent" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('rent')}
                      data-test="daily-rent-link"
                      data-analytics-action="daily-rent-click"
                    >
                      Günlük Kiralık
                    </Link>
                    <Link 
                      href="/kiralik?type=rent&category=villa" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleListingTypeChange('rent')}
                      data-test="rent-villa-link"
                      data-analytics-action="rent-villa-click"
                    >
                      Kiralık Villa
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Orta Kısım - Logo */}
          <div className="flex-1 flex justify-center lg:justify-center">
            <Link 
              href="/" 
              className="flex items-center"
              data-test="logo-link"
              data-analytics-action="logo-click"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl lg:text-3xl font-bold text-primary-600"
              >
                emlakos
              </motion.div>
            </Link>
          </div>

          {/* Sağ Taraf - Kaydol ve Giriş Butonları */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/kayit" 
              className="px-6 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
              data-test="register-link"
              data-analytics-action="register-click"
            >
              Kaydol
            </Link>
            <Link 
              href="/giris" 
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              data-test="login-link"
              data-analytics-action="login-click"
            >
              Giriş Yap
            </Link>
          </div>

          {/* Mobil Menü Butonu */}
          <button 
            className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-test="mobile-menu-button"
            data-analytics-action="mobile-menu-toggle"
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

        {/* Mobil Menü */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobil Satın Alma Menüsü */}
              <div>
                <button
                  onClick={() => setIsBuyMenuOpen(!isBuyMenuOpen)}
                  className="flex items-center justify-between w-full text-left py-2 text-gray-700 font-medium"
                >
                  <span>Satın Alma</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isBuyMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isBuyMenuOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Link href="/satilik?type=sale&category=konut" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('sale')}>
                      Satılık Konut
                    </Link>
                    <Link href="/satilik?type=sale&category=is-yeri" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('sale')}>
                      Satılık İş Yeri
                    </Link>
                    <Link href="/satilik?type=sale&category=arsa" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('sale')}>
                      Satılık Arsa
                    </Link>
                    <Link href="/satilik?type=sale&category=villa" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('sale')}>
                      Satılık Villa
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobil Kiralama Menüsü */}
              <div>
                <button
                  onClick={() => setIsRentMenuOpen(!isRentMenuOpen)}
                  className="flex items-center justify-between w-full text-left py-2 text-gray-700 font-medium"
                >
                  <span>Kiralama</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isRentMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isRentMenuOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Link href="/kiralik?type=rent&category=konut" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('rent')}>
                      Kiralık Konut
                    </Link>
                    <Link href="/kiralik?type=rent&category=is-yeri" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('rent')}>
                      Kiralık İş Yeri
                    </Link>
                    <Link href="/kiralik?type=daily-rent" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('rent')}>
                      Günlük Kiralık
                    </Link>
                    <Link href="/kiralik?type=rent&category=villa" className="block py-1 text-sm text-gray-600" onClick={() => handleListingTypeChange('rent')}>
                      Kiralık Villa
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobil Auth Butonları */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/kayit" className="block py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Kaydol
                </Link>
                <Link href="/giris" className="block py-2 text-primary-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Giriş Yap
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header
