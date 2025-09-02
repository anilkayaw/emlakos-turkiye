'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface EmailVerificationProps {
  email: string
  onVerificationSuccess: () => void
  onBack: () => void
  onResendCode: () => Promise<void>
}

export function EmailVerification({ 
  email, 
  onVerificationSuccess, 
  onBack, 
  onResendCode 
}: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 dakika
  const [canResend, setCanResend] = useState(false)

  // Geri sayım timer'ı
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      setError('Doğrulama kodu 6 haneli olmalıdır')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      // API call to verify code
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode
        })
      })

      const data = await response.json()

      if (data.success) {
        onVerificationSuccess()
      } else {
        setError(data.message || 'Doğrulama kodu hatalı')
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError('')

    try {
      await onResendCode()
      setTimeLeft(300)
      setCanResend(false)
      setVerificationCode('')
    } catch (error) {
      setError('Kod gönderilirken bir hata oluştu')
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <CardTitle>E-posta Doğrulama</CardTitle>
          <p className="text-gray-600 text-sm">
            <strong>{email}</strong> adresine gönderilen 6 haneli doğrulama kodunu girin
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Verification Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doğrulama Kodu
            </label>
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setVerificationCode(value)
                setError('')
              }}
              placeholder="123456"
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Timer */}
          {!canResend && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Yeni kod gönderebilmek için: <span className="font-mono text-primary-600">{formatTime(timeLeft)}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVerification}
              loading={isVerifying}
              disabled={verificationCode.length !== 6}
              className="w-full"
            >
              Doğrula
            </Button>

            {canResend && (
              <Button
                onClick={handleResendCode}
                loading={isResending}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Kodu Tekrar Gönder
              </Button>
            )}

            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              E-postanızı kontrol etmeyi unutmayın. Spam klasörüne de bakabilirsiniz.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default EmailVerification
