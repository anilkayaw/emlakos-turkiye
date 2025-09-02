import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useLazyImage } from '@/lib/hooks/useLazyLoading'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  blurDataURL?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
  loading = 'lazy',
  decoding = 'async',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Use lazy loading unless priority is true
  const { ref, imageSrc, imageError, isVisible } = useLazyImage(src, {
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  })

  // Set current source based on priority or lazy loading
  useEffect(() => {
    if (priority) {
      setCurrentSrc(src)
    } else if (isVisible && imageSrc) {
      setCurrentSrc(imageSrc)
    }
  }, [priority, isVisible, imageSrc, src])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  // Generate responsive image sources
  const generateSrcSet = (baseSrc: string, widths: number[] = [320, 640, 768, 1024, 1280, 1536]) => {
    return widths
      .map(w => `${baseSrc}?w=${w}&q=${quality} ${w}w`)
      .join(', ')
  }

  // Generate WebP sources
  const generateWebPSrcSet = (baseSrc: string, widths: number[] = [320, 640, 768, 1024, 1280, 1536]) => {
    return widths
      .map(w => `${baseSrc}?w=${w}&q=${quality}&f=webp ${w}w`)
      .join(', ')
  }

  // Default placeholder
  const defaultPlaceholder = blurDataURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'

  // Error fallback
  const errorFallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='

  if (hasError || imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style,
        }}
      >
        <img
          src={errorFallback}
          alt="Image not found"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>
    )
  }

  const imageProps = {
    ref: priority ? imgRef : ref,
    alt,
    className: `transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    style: {
      ...style,
      ...(fill && { width: '100%', height: '100%' }),
    },
    onLoad: handleLoad,
    onError: handleError,
    loading: priority ? 'eager' : loading,
    decoding,
    ...(sizes && { sizes }),
  }

  // If we have a current source, render the optimized image
  if (currentSrc) {
    return (
      <picture>
        {/* WebP source for modern browsers */}
        <source
          srcSet={generateWebPSrcSet(currentSrc)}
          sizes={sizes}
          type="image/webp"
        />
        {/* Fallback for older browsers */}
        <img
          {...imageProps}
          src={currentSrc}
          srcSet={generateSrcSet(currentSrc)}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
        />
      </picture>
    )
  }

  // Show placeholder while loading
  return (
    <div
      ref={priority ? undefined : ref}
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style,
      }}
    >
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          className="w-full h-full object-cover opacity-50"
          style={{ filter: 'blur(5px)' }}
        />
      )}
    </div>
  )
}

// Hook for image preloading
export const useImagePreload = (src: string) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setHasError(true)
    
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { isLoaded, hasError }
}

// Component for image gallery with lazy loading
export const ImageGallery: React.FC<{
  images: string[]
  alt: string
  className?: string
  onImageClick?: (index: number) => void
}> = ({ images, alt, className = '', onImageClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleImageClick = useCallback((index: number) => {
    setSelectedIndex(index)
    onImageClick?.(index)
  }, [onImageClick])

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
      {images.map((src, index) => (
        <div
          key={index}
          className="aspect-square cursor-pointer overflow-hidden rounded-lg"
          onClick={() => handleImageClick(index)}
        >
          <OptimizedImage
            src={src}
            alt={`${alt} ${index + 1}`}
            fill
            className="hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  )
}

// Component for hero image with priority loading
export const HeroImage: React.FC<{
  src: string
  alt: string
  className?: string
  children?: React.ReactNode
}> = ({ src, alt, className = '', children }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

// Property-specific image components
export const PropertyImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    className={`rounded-lg ${props.className || ''}`}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
)

export const GalleryImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    className={`rounded-md ${props.className || ''}`}
    sizes="(max-width: 768px) 50vw, 25vw"
  />
)