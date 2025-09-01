import { MapPin, Bed, Bath, Square, Calendar, Phone, Heart, Share2 } from 'lucide-react'

// Static export için gerekli
export async function generateStaticParams() {
  // Mock data - gerçek uygulamada API'den gelecek
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  type: string
  location: string
  coordinates: [number, number]
  images: string[]
  features: {
    bedrooms: number
    bathrooms: number
    area: number
    parking: number
    floor: number
    age: number
  }
  owner: {
    name: string
    phone: string
    email: string
  }
  createdAt: string
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // Mock data - gerçek uygulamada API'den gelecek
  const property: Property = {
    id: params.id,
    title: "Merkezi Konumda Lüks 3+1 Daire",
    description: "Şehrin kalbinde, tüm ulaşım araçlarına yakın, modern yaşam alanı. Geniş balkon, güney cephe, güvenlikli site.",
    price: 2500000,
    currency: "TL",
    type: "Satılık",
    location: "Beşiktaş, İstanbul",
    coordinates: [41.0082, 28.9784],
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      parking: 1,
      floor: 5,
      age: 2
    },
    owner: {
      name: "Ahmet Yılmaz",
      phone: "+90 532 123 45 67",
      email: "ahmet@example.com"
    },
    createdAt: "2024-01-15"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Görseller */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🏠</div>
                  <p>İlan Görseli</p>
                </div>
              </div>
            </div>

            {/* Özellikler */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Özellikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Bed className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{property.features.bedrooms} Yatak Odası</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{property.features.bathrooms} Banyo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{property.features.area} m²</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{property.features.parking} Otopark</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{property.features.floor}. Kat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{property.features.age} Yaşında</span>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Açıklama</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            {/* Fiyat ve İletişim */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  {property.price.toLocaleString('tr-TR')} {property.currency}
                </div>
                <div className="text-sm text-gray-500 mt-1">{property.type}</div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Ara</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Mesaj Gönder
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">İlan Sahibi</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{property.owner.name}</p>
                  <p className="mt-1">{property.owner.phone}</p>
                </div>
              </div>
            </div>

            {/* Güvenlik Uyarısı */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Güvenlik Uyarısı</h3>
              <p className="text-sm text-yellow-700">
                EmlakOS Türkiye, güvenli alışveriş için ödeme işlemlerini platform üzerinden yapmanızı önerir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
