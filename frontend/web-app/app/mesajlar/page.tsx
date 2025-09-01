'use client'

import { useState } from 'react'
// import { motion } from 'framer-motion'
import { Shield, Lock, Eye } from 'lucide-react'
import SecureChat from '@/components/messaging/SecureChat'

export default function MesajlarPage() {
  const [currentUserId] = useState('current-user-123')

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message)
    // Backend'e mesaj gönderme logic'i burada implement edilecek
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Güvenli Mesajlaşma</h1>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Shield className="w-4 h-4" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>

            {/* Security Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="w-4 h-4 text-green-500" />
                <span>Signal Protocol v2.0</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="w-4 h-4 text-blue-500" />
                <span>KVKK Uyumlu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Güvenli Mesajlaşma Aktif
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-green-700">
                <span>•</span>
                <span>End-to-end encryption</span>
                <span>•</span>
                <span>Perfect Forward Secrecy</span>
                <span>•</span>
                <span>Signal Protocol</span>
              </div>
            </div>

            <button className="text-xs text-green-600 hover:text-green-800 underline">
              Güvenlik Detayları
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="h-[calc(100vh-120px)]">
        <SecureChat
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Security Features Info */}
      <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-2">🔐 Güvenlik Özellikleri</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• End-to-end encryption</li>
              <li>• Perfect Forward Secrecy</li>
              <li>• Signal Protocol v2.0</li>
              <li>• KVKK uyumlu</li>
            </ul>
            
            <div className="mt-3 flex items-center space-x-2 text-xs text-green-600">
              <Lock className="w-3 h-3" />
              <span>Mesajlarınız güvende</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
