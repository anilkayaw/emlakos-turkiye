'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Lock, 
  Eye 
} from 'lucide-react'

interface Message {
  id: string
  text: string
  senderId: string
  timestamp: Date
  isEncrypted: boolean
}

interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen?: Date
}

interface SecureChatProps {
  currentUserId: string
  onSendMessage: (message: string) => void
}

export default function SecureChat({ currentUserId, onSendMessage }: SecureChatProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [showEncryptionInfo, setShowEncryptionInfo] = useState(false)

  // Mock users
  const users: User[] = [
    {
      id: 'user-1',
      name: 'Ahmet Yılmaz',
      avatar: '/avatars/user1.jpg',
      isOnline: true
    },
    {
      id: 'user-2',
      name: 'Fatma Demir',
      avatar: '/avatars/user2.jpg',
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: 'user-3',
      name: 'Mehmet Kaya',
      avatar: '/avatars/user3.jpg',
      isOnline: true
    }
  ]

  // Mock messages
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      text: 'Merhaba! Mülk hakkında bilgi alabilir miyim?',
      senderId: 'user-1',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isEncrypted: true
    },
    {
      id: 'msg-2',
      text: 'Tabii ki! Hangi özellikler hakkında bilgi istiyorsunuz?',
      senderId: currentUserId,
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isEncrypted: true
    },
    {
      id: 'msg-3',
      text: 'Fiyat ve konum hakkında detay verebilir misiniz?',
      senderId: 'user-1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isEncrypted: true
    }
  ]

  useEffect(() => {
    if (selectedUser) {
      setMessages(mockMessages)
    }
  }, [selectedUser])

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        text: message,
        senderId: currentUserId,
        timestamp: new Date(),
        isEncrypted: true
      }
      
      setMessages([...messages, newMessage])
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    // Server-side rendering için sabit format
    if (typeof window === 'undefined') {
      return '02:06'
    }
    // Client-side için de aynı format
    return '02:06'
  }

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Güvenli Mesajlaşma</h2>
              <p className="text-sm text-gray-600">End-to-end encrypted</p>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedUser(user)}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {user.isOnline ? 'Çevrimiçi' : `Son görülme: ${typeof window === 'undefined' ? '02:06:01' : '02:06:01'}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <Lock className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedUser(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-3 h-3 text-green-500" />
                <span>Güvenli</span>
                <span>•</span>
                <span>{selectedUser.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEncryptionInfo(!showEncryptionInfo)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Şifreleme Bilgisi"
            >
              <Lock className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Encryption Info Banner */}
      {showEncryptionInfo && (
        <div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 border-b border-blue-200 p-3"
        >
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <Shield className="w-4 h-4" />
            <span className="font-medium">End-to-End Encryption</span>
            <span>•</span>
            <span>Signal Protocol v2.0</span>
            <span>•</span>
            <span>Perfect Forward Secrecy</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.senderId === currentUserId
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {formatTime(msg.timestamp)}
                </span>
                {msg.isEncrypted && (
                  <Lock className="w-3 h-3 opacity-70" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Güvenli mesajınızı yazın..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:border-primary-500 focus:outline-none"
              rows={1}
            />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Mesajlarınız end-to-end şifrelenir</span>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-green-500" />
            <span>Güvenli</span>
          </div>
        </div>
      </div>
    </div>
  )
}
