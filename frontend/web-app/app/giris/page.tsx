'use client'

import { useState } from 'react'
// // import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Home, Shield, Users } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  email: string
  password: string
}

interface Errors {
  [key: string]: string
}

export default function GirisPage() {
  const [formData, setFormData] = useState<any>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Errors = {}

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz'
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, make API call to login
      console.log('Login attempt:', formData)
      
      // Redirect to dashboard or home page
      // router.push('/panel')
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Giriş yapılırken bir hata oluştu' })
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Home,
      title: 'Binlerce İlan',
      description: 'Türkiye genelinde en güncel gayrimenkul ilanları'
    },
    {
      icon: Shield,
      title: 'Güvenli Platform',
      description: 'KVKK uyumlu, güvenli ve güvenilir hizmet'
    },
    {
      icon: Users,
      title: 'Uzman Danışmanlar',
      description: 'Deneyimli emlak danışmanları ile profesyonel hizmet'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
                <Home className="w-5 h-5" />
                <span className="font-medium">Ana Sayfaya Dön</span>
              </Link>
            </div>

            <div className="max-w-md">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                  Hoş Geldiniz
                </h1>
                <p className="text-secondary-600">
                  Hesabınıza giriş yaparak gayrimenkul dünyasına adım atın
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                        errors.email ? 'border-red-300 focus:ring-red-500' : 'border-secondary-300'
                      }`}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                        errors.password ? 'border-red-300 focus:ring-red-500' : 'border-secondary-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-600">Beni hatırla</span>
                  </label>
                  <Link
                    href="/sifremi-unuttum"
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Şifremi unuttum
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Giriş yapılıyor...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Giriş Yap</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>

                {/* General Error */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-secondary-600">
                    Hesabınız yok mu?{' '}
                    <Link
                      href="/kayit"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Hemen kayıt olun
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="flex-1 flex flex-col justify-center px-8 xl:px-12">
            <div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold mb-6">
                  EmlakOS Türkiye'ye Hoş Geldiniz
                </h2>
                <p className="text-lg text-primary-100 mb-8">
                  Türkiye'nin en güvenilir gayrimenkul platformunda hayalinizdeki evi bulun
                </p>

                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                        <p className="text-primary-100">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
