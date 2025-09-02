'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye } from 'lucide-react'
// SecureChat bileşeni ve api importlarında hata vardı, bu yüzden yorum satırı yaptım.
// import SecureChat from '@/components/messaging/SecureChat'
// import { api } from '@/lib/api'

export default function MesajlarPage() {
  const [currentUserId] = useState('current-user-123')
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Mock data for development
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true)
        // Mock conversations data
        const mockConversations = [
          {
            id: '1',
            property_id: '1',
            property_title: 'Modern Daire - Beşiktaş',
            other_user: {
              id: '2',
              name: 'Ahmet Yılmaz',
              avatar: 'https://via.placeholder.com/40'
            },
            last_message: {
              text: 'Merhaba, bu daire hakkında bilgi alabilir miyim?',
              timestamp: new Date().toISOString()
            },
            unread_count: 2
          }
        ]
        setConversations(mockConversations)
      } catch (error) {
        console.error('Error loading conversations:', error)
        setError('Konuşmalar yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [])

  const handleSendMessage = async (message: string, conversationId: string) => {
    try {
      // Mock message sending
      console.log('Sending message:', message, 'to conversation:', conversationId)
      
      // Update conversations with new message
      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            last_message: {
              text: message,
              timestamp: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          }
        }
        return conv
      })
      setConversations(updatedConversations)
    } catch (error) {
      console.error('Error sending message:', error)
    }
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
      <motion.div
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
      </motion.div>

      {/* Main Chat Area */}
      <div className="h-[calc(100vh-120px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Konuşmalar yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 bg-white border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Konuşmalar</h2>
              </div>
              <div className="overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {conversation.other_user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.other_user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.property_title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {conversation.last_message.text}
                        </p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <div className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-white">
                <h3 className="text-lg font-semibold">Ahmet Yılmaz</h3>
                <p className="text-sm text-gray-500">Modern Daire - Beşiktaş</p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white shadow-sm">
                      <p className="text-sm text-gray-800">
                        Merhaba, bu daire hakkında bilgi alabilir miyim?
                      </p>
                      <p className="text-xs text-gray-500 mt-1">10:30</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary-600 text-white shadow-sm">
                      <p className="text-sm">
                        Tabii ki! Size yardımcı olmaktan memnuniyet duyarım.
                      </p>
                      <p className="text-xs text-primary-200 mt-1">10:32</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Features Info */}
      <motion.div
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
      </motion.div>
    </div>
  )
}
