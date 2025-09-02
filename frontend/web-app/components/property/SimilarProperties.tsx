import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PropertyCard } from './PropertyCard'

interface Property {
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
  images: string[]
  features: {
    rooms: string
    area: number
    buildingAge: number
    floor: number
    totalFloors: number
  }
  createdAt: string
  isFeatured?: boolean
  isVerified?: boolean
}

interface SimilarPropertiesProps {
  currentProperty: Property
  onFavorite: (id: string) => void
  favorites: string[]
}

export const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentProperty,
  onFavorite,
  favorites
}) => {
  // Mock similar properties data
  const similarProperties: Property[] = [
    {
      id: 'similar-1',
      title: 'Benzer 3+1 Daire - Beşiktaş',
      price: currentProperty.type === 'Satılık' ? 2400000 : 14000,
      currency: 'TRY',
      type: currentProperty.type,
      location: {
        district: 'Beşiktaş',
        neighborhood: 'Levent',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
      features: {
        rooms: '3+1',
        area: 115,
        buildingAge: 6,
        floor: 7,
        totalFloors: 10
      },
      createdAt: '2024-11-30T10:00:00Z',
      isFeatured: false,
      isVerified: true
    },
    {
      id: 'similar-2',
      title: 'Benzer 3+1 Daire - Beşiktaş',
      price: currentProperty.type === 'Satılık' ? 2600000 : 16000,
      currency: 'TRY',
      type: currentProperty.type,
      location: {
        district: 'Beşiktaş',
        neighborhood: 'Bebek',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'],
      features: {
        rooms: '3+1',
        area: 125,
        buildingAge: 4,
        floor: 5,
        totalFloors: 8
      },
      createdAt: '2024-11-28T15:30:00Z',
      isFeatured: true,
      isVerified: true
    },
    {
      id: 'similar-3',
      title: 'Benzer 3+1 Daire - Beşiktaş',
      price: currentProperty.type === 'Satılık' ? 2300000 : 13500,
      currency: 'TRY',
      type: currentProperty.type,
      location: {
        district: 'Beşiktaş',
        neighborhood: 'Ortaköy',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
      features: {
        rooms: '3+1',
        area: 110,
        buildingAge: 8,
        floor: 3,
        totalFloors: 6
      },
      createdAt: '2024-11-25T09:15:00Z',
      isFeatured: false,
      isVerified: true
    },
    {
      id: 'similar-4',
      title: 'Benzer 3+1 Daire - Beşiktaş',
      price: currentProperty.type === 'Satılık' ? 2700000 : 17000,
      currency: 'TRY',
      type: currentProperty.type,
      location: {
        district: 'Beşiktaş',
        neighborhood: 'Arnavutköy',
        city: 'İstanbul'
      },
      images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'],
      features: {
        rooms: '3+1',
        area: 130,
        buildingAge: 3,
        floor: 9,
        totalFloors: 12
      },
      createdAt: '2024-11-22T14:45:00Z',
      isFeatured: false,
      isVerified: true
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Benzer İlanlar</h2>
        <p className="text-gray-600">
          Aynı bölgede benzer özelliklerdeki diğer ilanlar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PropertyCard
              property={{
                id: property.id,
                title: property.title,
                price: property.price,
                type: property.type,
                location: `${property.location.neighborhood}, ${property.location.district}`,
                image: property.images[0] || '',
                rooms: parseInt(property.features.rooms.split('+')[0]),
                bathrooms: parseInt(property.features.rooms.split('+')[1]) || 1,
                area: property.features.area,
                isFavorite: favorites.includes(property.id),
                buildingAge: property.features.buildingAge,
                floor: property.features.floor,
                totalFloors: property.features.totalFloors
              }}
              onToggleFavorite={onFavorite}
            />
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link href={`/${currentProperty.type.toLowerCase()}`}>
          <button className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
            Tüm Benzer İlanları Gör
          </button>
        </Link>
      </div>
    </div>
  )
}
