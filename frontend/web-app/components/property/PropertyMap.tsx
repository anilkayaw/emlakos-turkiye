import React, { useEffect, useState } from 'react'
import { MapPin, Navigation, Car, Bus, Train, Plane } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface PropertyMapProps {
  location: {
    latitude: number
    longitude: number
    address: string
    district: string
    neighborhood: string
    city: string
  }
}

interface NearbyPlace {
  name: string
  type: 'school' | 'hospital' | 'shopping' | 'restaurant' | 'bank' | 'pharmacy'
  distance: number
  icon: React.ComponentType<any>
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ location }) => {
  const [mapLoaded, setMapLoaded] = useState(false)

  // Mock nearby places data
  const nearbyPlaces: NearbyPlace[] = [
    {
      name: 'Özel Etiler Koleji',
      type: 'school',
      distance: 0.3,
      icon: MapPin
    },
    {
      name: 'Acıbadem Hastanesi',
      type: 'hospital',
      distance: 0.8,
      icon: MapPin
    },
    {
      name: 'Akmerkez AVM',
      type: 'shopping',
      distance: 0.5,
      icon: MapPin
    },
    {
      name: 'Zorlu Center',
      type: 'shopping',
      distance: 1.2,
      icon: MapPin
    },
    {
      name: 'Garanti Bankası',
      type: 'bank',
      distance: 0.2,
      icon: MapPin
    },
    {
      name: 'Eczane',
      type: 'pharmacy',
      distance: 0.1,
      icon: MapPin
    }
  ]

  const transportationOptions = [
    {
      name: 'Metrobüs',
      distance: 0.4,
      icon: Bus,
      time: '5 dk yürüme'
    },
    {
      name: 'Metro',
      distance: 0.8,
      icon: Train,
      time: '10 dk yürüme'
    },
    {
      name: 'Havaalanı',
      distance: 25,
      icon: Plane,
      time: '45 dk araç'
    }
  ]

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'school':
        return '🏫'
      case 'hospital':
        return '🏥'
      case 'shopping':
        return '🛍️'
      case 'restaurant':
        return '🍽️'
      case 'bank':
        return '🏦'
      case 'pharmacy':
        return '💊'
      default:
        return '📍'
    }
  }

  const getPlaceTypeLabel = (type: string) => {
    switch (type) {
      case 'school':
        return 'Okul'
      case 'hospital':
        return 'Hastane'
      case 'shopping':
        return 'Alışveriş'
      case 'restaurant':
        return 'Restoran'
      case 'bank':
        return 'Banka'
      case 'pharmacy':
        return 'Eczane'
      default:
        return 'Yer'
    }
  }

  return (
    <div className="space-y-6">
      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Konum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{location.address}</p>
                <p className="text-sm text-gray-600">
                  {location.neighborhood}, {location.district}, {location.city}
                </p>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
              {!mapLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Harita yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  {/* Mock Map - In real implementation, you would use Google Maps or similar */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Konum</p>
                      <p className="text-sm text-gray-500">
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <Navigation className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <Car className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Map Actions */}
            <div className="flex space-x-3">
              <button className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                Yol Tarifi Al
              </button>
              <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Sokak Görünümü
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Places */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Yakın Yerler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyPlaces.map((place, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{getPlaceIcon(place.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{place.name}</p>
                  <p className="text-sm text-gray-600">{getPlaceTypeLabel(place.type)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{place.distance} km</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(place.distance * 12)} dk yürüme
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transportation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Ulaşım
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transportationOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <option.icon className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{option.name}</p>
                  <p className="text-sm text-gray-600">{option.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{option.distance} km</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
