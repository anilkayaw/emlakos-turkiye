import React, { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, 
  MessageSquare, 
  Heart, 
  Share2, 
  MapPin,
  Calendar,
  User,
  Mail,
  Star,
  Shield,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface PropertyContactPanelProps {
  property: {
    id: string
    title: string
    price: number
    currency: string
    type: 'Satılık' | 'Kiralık'
    location: {
      district: string
      neighborhood: string
      city: string
    }
    agent: {
      name: string
      phone: string
      email: string
      avatar: string
      rating: number
      verified: boolean
      agency: string
    }
    isVerified: boolean
    createdAt: string
  }
  onFavorite: (id: string) => void
  isFavorite: boolean
}

export const PropertyContactPanel: React.FC<PropertyContactPanelProps> = ({
  property,
  onFavorite,
  isFavorite
}) => {
  const [showPhone, setShowPhone] = useState(false)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [message, setMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [senderEmail, setSenderEmail] = useState('')

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'TRY') {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    }
    return `${price.toLocaleString()} ${currency}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${formatPrice(property.price, property.currency)}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message sending logic here
    console.log('Message sent:', {
      propertyId: property.id,
      message,
      sender: { name: senderName, phone: senderPhone, email: senderEmail }
    })
    setShowMessageForm(false)
    setMessage('')
    setSenderName('')
    setSenderPhone('')
    setSenderEmail('')
  }

  return (
    <div className="sticky top-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {formatPrice(property.price, property.currency)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>İlan Tarihi: {formatDate(property.createdAt)}</span>
              </div>
            </div>
            <button
              onClick={() => onFavorite(property.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contact Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowPhone(!showPhone)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              {showPhone ? property.agent.phone : 'Telefonu Göster'}
            </Button>

            <Button
              onClick={() => setShowMessageForm(!showMessageForm)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Mesaj Gönder
            </Button>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Paylaş
          </Button>

          {/* Agent Info */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={property.agent.avatar || '/images/default-avatar.jpg'}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{property.agent.name}</h4>
                  {property.agent.verified && (
                    <Shield className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{property.agent.agency}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{property.agent.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Verification */}
          {property.isVerified && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Doğrulanmış İlan</span>
            </div>
          )}

          {/* Location Info */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{property.location.neighborhood}, {property.location.district}</span>
          </div>
        </CardContent>
      </Card>

      {/* Message Form Modal */}
      {showMessageForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Mesaj Gönder</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Input
                placeholder="Adınız"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
              />
              <Input
                placeholder="Telefon Numaranız"
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                required
              />
              <Input
                placeholder="E-posta Adresiniz"
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
              />
              <textarea
                placeholder="Mesajınız..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                required
              />
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMessageForm(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button type="submit" className="flex-1">
                  Gönder
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
