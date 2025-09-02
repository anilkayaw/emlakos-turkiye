import { NextRequest, NextResponse } from 'next/server'

// Mock data for development
const mockProperties = [
  {
    id: 1,
    title: 'Modern Daire - Beşiktaş',
    price: 2500000,
    address: 'Beşiktaş, İstanbul',
    latitude: 41.0426,
    longitude: 29.0075,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=',
    area: 120,
    buildingAge: 5,
    floor: 3,
    totalFloors: 8,
    propertyType: 'daire',
    features: ['Balkon', 'Asansör', 'Güvenlik']
  },
  {
    id: 2,
    title: 'Lüks Villa - Sarıyer',
    price: 8500000,
    address: 'Sarıyer, İstanbul',
    latitude: 41.1067,
    longitude: 29.0255,
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=',
    area: 280,
    buildingAge: 2,
    propertyType: 'villa',
    features: ['Bahçe', 'Havuz', 'Garaj']
  },
  {
    id: 3,
    title: 'Kiralık Daire - Kadıköy',
    price: 8500,
    address: 'Kadıköy, İstanbul',
    latitude: 40.9906,
    longitude: 29.0255,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=',
    area: 85,
    buildingAge: 10,
    floor: 2,
    totalFloors: 5,
    propertyType: 'daire',
    features: ['Balkon', 'Güvenlik']
  },
  {
    id: 4,
    title: 'Satılık Daire - Şişli',
    price: 3200000,
    address: 'Şişli, İstanbul',
    latitude: 41.0603,
    longitude: 28.9877,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=',
    area: 140,
    buildingAge: 8,
    floor: 5,
    totalFloors: 12,
    propertyType: 'daire',
    features: ['Balkon', 'Asansör', 'Güvenlik', 'Otopark']
  },
  {
    id: 5,
    title: 'Kiralık Villa - Bebek',
    price: 15000,
    address: 'Bebek, İstanbul',
    latitude: 41.0777,
    longitude: 29.0433,
    bedrooms: 5,
    bathrooms: 4,
    imageUrl: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=',
    area: 350,
    buildingAge: 3,
    propertyType: 'villa',
    features: ['Bahçe', 'Havuz', 'Garaj', 'Deniz Manzarası']
  },
  {
    id: 6,
    title: 'Satılık Arsa - Üsküdar',
    price: 1200000,
    address: 'Üsküdar, İstanbul',
    latitude: 41.0214,
    longitude: 29.0048,
    bedrooms: 0,
    bathrooms: 0,
    imageUrl: 'https://media.istockphoto.com/id/165142855/photo/smiling-family-on-front-lawn-of-a-house.jpg?s=612x612&w=0&k=20&c=MvBypgiy_E_KDsP0PN05lr4awJYBEqYeg_H5qorOw2U=',
    area: 500,
    propertyType: 'arsa',
    features: ['İmar İzni', 'Yol Cephesi']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const listingType = searchParams.get('listingType') || 'sale'
    const ne_lat = parseFloat(searchParams.get('ne_lat') || '41.2')
    const ne_lng = parseFloat(searchParams.get('ne_lng') || '29.2')
    const sw_lat = parseFloat(searchParams.get('sw_lat') || '40.8')
    const sw_lng = parseFloat(searchParams.get('sw_lng') || '28.6')
    
    // Filter properties based on listing type and map bounds
    let filteredProperties = mockProperties.filter(property => {
      // Check if property is within map bounds
      const isWithinBounds = 
        property.latitude >= sw_lat && 
        property.latitude <= ne_lat && 
        property.longitude >= sw_lng && 
        property.longitude <= ne_lng
      
      if (!isWithinBounds) return false
      
      // Filter by listing type (sale vs rent)
      if (listingType === 'sale') {
        return property.price > 100000 // Sale properties are typically more expensive
      } else if (listingType === 'rent') {
        return property.price < 100000 // Rent properties are typically less expensive
      }
      
      return true
    })
    
    // Add listing type to each property
    filteredProperties = filteredProperties.map(property => ({
      ...property,
      listingType: listingType
    }))
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(filteredProperties, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
    
  } catch (error) {
    console.error('Error in properties API:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
