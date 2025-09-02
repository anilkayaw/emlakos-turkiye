import React from 'react'
import { 
  Home, 
  Square, 
  Calendar, 
    Building2,
  ThermometerSun,
  Car, 
  Wifi, 
  Shield, 
  TreePine, 
  Waves,
  Sun,
  Snowflake,
  Zap,
  Droplets,
  Wind,
  Eye,
  Lock,
  Camera,
  Bell,
  Users,
  MapPin
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface PropertyFeaturesProps {
  features: {
    rooms: string
    area: number
    buildingAge: number
    floor: number
    totalFloors: number
    heating: string
    parking: boolean
    balcony: boolean
    elevator: boolean
    furnished: boolean
    security: boolean
    pool: boolean
    garden: boolean
    seaView: boolean
    mountainView: boolean
    airConditioning: boolean
    internet: boolean
    satellite: boolean
    intercom: boolean
    camera: boolean
    alarm: boolean
    concierge: boolean
    gym: boolean
    spa: boolean
    meetingRoom: boolean
    childrenPlayground: boolean
    petFriendly: boolean
    smokingAllowed: boolean
  }
}

export const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ features }) => {
  const basicFeatures = [
    {
      icon: Home,
      label: 'Oda Sayısı',
      value: features.rooms
    },
    {
      icon: Square,
      label: 'Brüt Alan',
      value: `${features.area} m²`
    },
    {
      icon: Calendar,
      label: 'Bina Yaşı',
      value: `${features.buildingAge} yaşında`
    },
    {
      icon: Building2,
      label: 'Kat',
      value: `${features.floor}/${features.totalFloors}`
    },
    {
      icon: ThermometerSun,
      label: 'Isıtma',
      value: features.heating
    }
  ]

  const amenities = [
    {
      icon: Car,
      label: 'Otopark',
      available: features.parking
    },
    {
      icon: TreePine,
      label: 'Balkon',
      available: features.balcony
    },
    {
      icon: Building2,
      label: 'Asansör',
      available: features.elevator
    },
    {
      icon: Home,
      label: 'Eşyalı',
      available: features.furnished
    },
    {
      icon: Shield,
      label: 'Güvenlik',
      available: features.security
    },
    {
      icon: Waves,
      label: 'Havuz',
      available: features.pool
    },
    {
      icon: TreePine,
      label: 'Bahçe',
      available: features.garden
    },
    {
      icon: Sun,
      label: 'Deniz Manzarası',
      available: features.seaView
    },
    {
      icon: Snowflake,
      label: 'Dağ Manzarası',
      available: features.mountainView
    },
    {
      icon: Zap,
      label: 'Klima',
      available: features.airConditioning
    },
    {
      icon: Wifi,
      label: 'İnternet',
      available: features.internet
    },
    {
      icon: Eye,
      label: 'Uydu',
      available: features.satellite
    },
    {
      icon: Bell,
      label: 'İnterkom',
      available: features.intercom
    },
    {
      icon: Camera,
      label: 'Güvenlik Kamerası',
      available: features.camera
    },
    {
      icon: Lock,
      label: 'Alarm',
      available: features.alarm
    },
    {
      icon: Users,
      label: 'Kapıcı',
      available: features.concierge
    },
    {
      icon: Zap,
      label: 'Spor Salonu',
      available: features.gym
    },
    {
      icon: Droplets,
      label: 'Spa',
      available: features.spa
    },
    {
      icon: Users,
      label: 'Toplantı Salonu',
      available: features.meetingRoom
    },
    {
      icon: TreePine,
      label: 'Çocuk Oyun Alanı',
      available: features.childrenPlayground
    },
    {
      icon: Wind,
      label: 'Evcil Hayvan',
      available: features.petFriendly
    },
    {
      icon: Wind,
      label: 'Sigara İçilebilir',
      available: features.smokingAllowed
    }
  ]

  const availableAmenities = amenities.filter(amenity => amenity.available)
  const unavailableAmenities = amenities.filter(amenity => !amenity.available)

  return (
    <div className="space-y-6">
      {/* Basic Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Temel Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {basicFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{feature.label}</p>
                  <p className="font-medium text-gray-900">{feature.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Amenities */}
      {availableAmenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Özellikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAmenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <amenity.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unavailable Amenities (if any) */}
      {unavailableAmenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Mevcut Olmayan Özellikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unavailableAmenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <amenity.icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
