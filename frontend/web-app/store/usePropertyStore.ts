import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Property interface
export interface Property {
  id: number
  title: string
  price: number
  address: string
  latitude: number
  longitude: number
  bedrooms: number
  bathrooms: number
  imageUrl: string
  area?: number
  buildingAge?: number
  floor?: number
  totalFloors?: number
  propertyType?: string
  features?: string[]
}

// Map bounds interface
export interface MapBounds {
  ne_lat: number
  ne_lng: number
  sw_lat: number
  sw_lng: number
}

// Store state interface
interface PropertyState {
  // Listing type (sale or rent)
  listingType: 'sale' | 'rent'
  
  // Properties data
  properties: Property[]
  filteredProperties: Property[]
  selectedProperty: Property | null
  
  // Map state
  mapBounds: MapBounds | null
  mapCenter: { lat: number; lng: number }
  mapZoom: number
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Filters
  priceRange: { min: number; max: number }
  propertyTypes: string[]
  bedrooms: number[]
  bathrooms: number[]
  
  // Actions
  setListingType: (type: 'sale' | 'rent') => void
  setProperties: (properties: Property[]) => void
  setFilteredProperties: (properties: Property[]) => void
  setSelectedProperty: (property: Property | null) => void
  setMapBounds: (bounds: MapBounds) => void
  setMapCenter: (center: { lat: number; lng: number }) => void
  setMapZoom: (zoom: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Filter actions
  setPriceRange: (range: { min: number; max: number }) => void
  setPropertyTypes: (types: string[]) => void
  setBedrooms: (bedrooms: number[]) => void
  setBathrooms: (bathrooms: number[]) => void
  
  // Combined actions
  updateMapView: (bounds: MapBounds, center: { lat: number; lng: number }, zoom: number) => void
  applyFilters: () => void
  clearFilters: () => void
  
  // API actions
  fetchProperties: (bounds: MapBounds, listingType: 'sale' | 'rent') => Promise<void>
}

// Default map center (Istanbul)
const DEFAULT_CENTER = { lat: 41.0082, lng: 28.9784 }
const DEFAULT_ZOOM = 10

export const usePropertyStore = create<PropertyState>()(
  devtools(
    (set, get) => ({
      // Initial state
      listingType: 'sale',
      properties: [],
      filteredProperties: [],
      selectedProperty: null,
      mapBounds: null,
      mapCenter: DEFAULT_CENTER,
      mapZoom: DEFAULT_ZOOM,
      isLoading: false,
      error: null,
      priceRange: { min: 0, max: 10000000 },
      propertyTypes: [],
      bedrooms: [],
      bathrooms: [],

      // Basic setters
      setListingType: (type) => {
        set({ listingType: type })
        // Auto-fetch properties when listing type changes
        const { mapBounds, fetchProperties } = get()
        if (mapBounds) {
          fetchProperties(mapBounds, type)
        }
      },

      setProperties: (properties) => {
        set({ properties })
        // Auto-apply filters when properties change
        get().applyFilters()
      },

      setFilteredProperties: (properties) => set({ filteredProperties: properties }),

      setSelectedProperty: (property) => set({ selectedProperty: property }),

      setMapBounds: (bounds) => set({ mapBounds: bounds }),

      setMapCenter: (center) => set({ mapCenter: center }),

      setMapZoom: (zoom) => set({ mapZoom: zoom }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Filter setters
      setPriceRange: (range) => {
        set({ priceRange: range })
        get().applyFilters()
      },

      setPropertyTypes: (types) => {
        set({ propertyTypes: types })
        get().applyFilters()
      },

      setBedrooms: (bedrooms) => {
        set({ bedrooms })
        get().applyFilters()
      },

      setBathrooms: (bathrooms) => {
        set({ bathrooms })
        get().applyFilters()
      },

      // Combined actions
      updateMapView: (bounds, center, zoom) => {
        set({ mapBounds: bounds, mapCenter: center, mapZoom: zoom })
        // Auto-fetch properties when map view changes
        const { listingType, fetchProperties } = get()
        fetchProperties(bounds, listingType)
      },

      applyFilters: () => {
        const { properties, priceRange, propertyTypes, bedrooms, bathrooms } = get()
        
        let filtered = properties.filter(property => {
          // Price filter
          if (property.price < priceRange.min || property.price > priceRange.max) {
            return false
          }

          // Property type filter
          if (propertyTypes.length > 0 && property.propertyType && !propertyTypes.includes(property.propertyType)) {
            return false
          }

          // Bedrooms filter
          if (bedrooms.length > 0 && !bedrooms.includes(property.bedrooms)) {
            return false
          }

          // Bathrooms filter
          if (bathrooms.length > 0 && !bathrooms.includes(property.bathrooms)) {
            return false
          }

          return true
        })

        set({ filteredProperties: filtered })
      },

      clearFilters: () => {
        set({
          priceRange: { min: 0, max: 10000000 },
          propertyTypes: [],
          bedrooms: [],
          bathrooms: []
        })
        get().applyFilters()
      },

      // API action
      fetchProperties: async (bounds, listingType) => {
        const { setLoading, setError, setProperties } = get()
        
        setLoading(true)
        setError(null)

        try {
          // API endpoint URL
          const apiUrl = new URL('/api/properties', window.location.origin)
          
          // Add query parameters
          apiUrl.searchParams.append('listingType', listingType)
          apiUrl.searchParams.append('ne_lat', bounds.ne_lat.toString())
          apiUrl.searchParams.append('ne_lng', bounds.ne_lng.toString())
          apiUrl.searchParams.append('sw_lat', bounds.sw_lat.toString())
          apiUrl.searchParams.append('sw_lng', bounds.sw_lng.toString())

          const response = await fetch(apiUrl.toString())
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const properties: Property[] = await response.json()
          setProperties(properties)
          
        } catch (error) {
          console.error('Error fetching properties:', error)
          setError(error instanceof Error ? error.message : 'An error occurred while fetching properties')
          
          // Fallback to mock data for development
          const mockProperties: Property[] = [
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
            }
          ]
          
          setProperties(mockProperties)
        } finally {
          setLoading(false)
        }
      }
    }),
    {
      name: 'property-store', // unique name for devtools
    }
  )
)
