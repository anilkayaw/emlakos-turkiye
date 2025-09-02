// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'buyer' | 'seller' | 'agent';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  location?: string;
  verified: boolean;
}

// Property Types
export interface PropertyLocation {
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  coordinates: [number, number];
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  floor: number;
  totalFloors: number;
  age: number;
  heating: 'natural_gas' | 'electric' | 'coal' | 'solar';
  furnished: boolean;
  balcony: boolean;
  elevator: boolean;
  security: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  type: 'apartment' | 'house' | 'villa' | 'office' | 'land' | 'commercial';
  transactionType: 'sale' | 'rent';
  location: PropertyLocation;
  features: PropertyFeatures;
  images: string[];
  owner: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  rating?: number;
}

// Form Types
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: Property['type'];
  transactionType: Property['transactionType'];
  location: PropertyLocation;
  features: PropertyFeatures;
  images: File[];
}

// API Response Types
export interface ListingsResponse {
  listings: Property[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FavoritesResponse {
  favorites: Property[];
  total: number;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: User['userType'];
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Search Types
export interface SearchFilters {
  query?: string;
  type?: Property['type'];
  transactionType?: Property['transactionType'];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  district?: string;
  features?: Partial<PropertyFeatures>;
}

export interface SearchResponse {
  properties: Property[];
  total: number;
  filters: SearchFilters;
  suggestions?: string[];
}
