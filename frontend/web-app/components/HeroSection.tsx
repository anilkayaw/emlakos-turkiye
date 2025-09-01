'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, MapPin, TrendingUp, Shield } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Akıllı Arama',
    description: 'AI destekli öneriler ve gelişmiş filtreleme'
  },
  {
    icon: MapPin,
    title: 'Konum Analizi',
    description: 'Detaylı harita entegrasyonu ve çevre analizi'
  },
  {
    icon: TrendingUp,
    title: 'DeğerTahmin AI',
    description: 'Yapay zeka destekli değerleme sistemi'
  },
  {
    icon: Shield,
    title: 'Güvenli İşlemler',
    description: 'SSL şifreleme ve güvenli ödeme sistemleri'
  }
]

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container-max relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-[80vh] py-20">
          {/* Left Side - Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              EmlakOS
              <span className="block text-primary-200">Türkiye</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 max-w-2xl lg:mx-0 mx-auto text-primary-100"
            >
              Türkiye'nin en kapsamlı gayrimenkul platformu. 
              Hayalinizdeki evi bulun, güvenle alım-satım yapın.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                href="/ilanlar" 
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                İlanları Görüntüle
              </Link>
              <Link 
                href="/harita" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 transform hover:scale-105"
              >
                Haritada Ara
              </Link>
            </motion.div>
          </div>

          {/* Right Side - Features */}
          <div className="flex-1 mt-12 lg:mt-0">
            <div className="grid grid-cols-2 gap-6 max-w-md lg:ml-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                    <feature.icon className="w-8 h-8 text-primary-200" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-100 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
