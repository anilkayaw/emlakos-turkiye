'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, MapPin } from 'lucide-react'
import { PageBanner } from '@/components/layout/Banner'
import { SocialLogin } from '@/components/auth/SocialLogin'

export default function GirisPage() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
    apple: false
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login:', loginData)
    // Login logic here
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setSocialLoading({
      google: provider === 'google',
      facebook: provider === 'facebook',
      apple: provider === 'apple'
    })
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful social login
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        userType: 'buyer',
        avatar: '/images/default-avatar.jpg',
        provider: provider
      }))
      
        window.location.href = '/panel'
    } catch (error) {
      console.error(`${provider} login error:`, error)
    } finally {
      setSocialLoading({
        google: false,
        facebook: false,
        apple: false
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <PageBanner title="Giriş Yap" subtitle="Hesabınıza giriş yapın ve emlak dünyasına katılın" />
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Giriş Yap</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Giriş Yap
              </button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">veya</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <SocialLogin
              onGoogleLogin={() => handleSocialLogin('google')}
              onFacebookLogin={() => handleSocialLogin('facebook')}
              onAppleLogin={() => handleSocialLogin('apple')}
              loading={socialLoading}
            />

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Hesabınız yok mu?{' '}
                <Link href="/kayit" className="text-primary-600 hover:text-primary-700 font-medium">
                  Kaydol
                </Link>
              </p>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Neden EmlakOS?</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Güvenli ve hızlı işlemler</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Binlerce güncel ilan</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Profesyonel destek</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Mobil uyumlu tasarım</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Hızlı Erişim</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/ilanlar" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <Home className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">İlanları Gör</span>
                </Link>
                <Link href="/harita" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Haritada Ara</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
