'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Building2,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmailVerification } from '@/components/auth/EmailVerification'
import { SocialLogin } from '@/components/auth/SocialLogin'

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  userType: 'buyer' | 'seller' | 'agent'
  agreeToTerms: boolean
  agreeToMarketing: boolean
}

interface RegisterErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  userType?: string
  agreeToTerms?: string
  general?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
    agreeToTerms: false,
    agreeToMarketing: false
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
    apple: false
  })

  const userTypes = [
    { value: 'buyer', label: 'Alıcı' },
    { value: 'seller', label: 'Satıcı' },
    { value: 'agent', label: 'Emlak Danışmanı' }
  ]

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev: RegisterFormData) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof RegisterErrors]) {
      setErrors((prev: RegisterErrors) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir'
    }

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefon numarası gereklidir'
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin'
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Kullanım şartlarını kabul etmelisiniz'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      // API call to register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Show email verification screen
        setShowEmailVerification(true)
      } else {
        setErrors({ general: data.message || 'Kayıt olurken bir hata oluştu.' })
      }
    } catch (error) {
      setErrors({ general: 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialRegister = async (provider: 'google' | 'facebook' | 'apple') => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }))
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful social registration
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        userType: 'buyer',
        avatar: '/images/default-avatar.jpg',
        provider: provider
      }))
      
      router.push('/panel')
    } catch (error) {
      console.error(`${provider} registration error:`, error)
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const handleEmailVerificationSuccess = () => {
    // Save user data and redirect
    localStorage.setItem('user', JSON.stringify({
      id: '1',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      userType: formData.userType,
      avatar: '/images/default-avatar.jpg'
    }))
    
    router.push('/panel')
  }

  const handleResendVerificationCode = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length < 6) return { strength: 'Zayıf', color: 'text-red-500' }
    if (password.length < 8) return { strength: 'Orta', color: 'text-yellow-500' }
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 'Güçlü', color: 'text-green-500' }
    }
    return { strength: 'Orta', color: 'text-yellow-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Show email verification screen
  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <EmailVerification
          email={formData.email}
          onVerificationSuccess={handleEmailVerificationSuccess}
          onBack={() => setShowEmailVerification(false)}
          onResendCode={handleResendVerificationCode}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">EmlakOS Türkiye</h1>
          <p className="text-gray-600 mt-2">Hesap oluşturun ve emlak dünyasına katılın</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Kayıt Ol
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700">{errors.general}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hesap Türü
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {userTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('userType', type.value)}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.userType === type.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {type.value === 'buyer' && <Home className="w-6 h-6" />}
                        {type.value === 'seller' && <Building2 className="w-6 h-6" />}
                        {type.value === 'agent' && <User className="w-6 h-6" />}
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.userType && (
                  <p className="mt-1 text-sm text-red-500">{errors.userType}</p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  placeholder="Adınız"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Soyad"
                  placeholder="Soyadınız"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.lastName}
                  required
                />
              </div>

              {/* Email */}
              <Input
                label="E-posta Adresi"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email}
                required
              />

              {/* Phone */}
              <Input
                label="Telefon Numarası"
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                leftIcon={<Phone className="w-5 h-5" />}
                error={errors.phone}
                required
              />

              {/* Password */}
              <div>
                <Input
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Güçlü bir şifre oluşturun"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  error={errors.password}
                  required
                />
                {formData.password && (
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Şifre gücü:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <Input
                label="Şifre Tekrarı"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.confirmPassword}
                required
              />

              {/* Terms and Marketing */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-700">
                    <Link href="/kullanim-sartlari" className="text-primary-600 hover:text-primary-700">
                      Kullanım Şartları
                    </Link>
                    {' '}ve{' '}
                    <Link href="/gizlilik-politikasi" className="text-primary-600 hover:text-primary-700">
                      Gizlilik Politikası
                    </Link>
                    'nı okudum ve kabul ediyorum.
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                )}

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToMarketing}
                    onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-700">
                    Kampanya ve duyurular hakkında e-posta almak istiyorum.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Hesap Oluştur
              </Button>
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

            {/* Social Register */}
            <SocialLogin
              onGoogleLogin={() => handleSocialRegister('google')}
              onFacebookLogin={() => handleSocialRegister('facebook')}
              onAppleLogin={() => handleSocialRegister('apple')}
              loading={socialLoading}
            />

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link 
                  href="/giris" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Giriş yapın
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Güvenli Kayıt</p>
              <p className="text-xs text-green-700">
                Bilgileriniz SSL ile şifrelenerek korunmaktadır. Hiçbir bilginiz üçüncü taraflarla paylaşılmaz.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}