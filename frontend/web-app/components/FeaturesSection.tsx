'use client'

import Link from 'next/link'
import {
  Search,
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Smartphone
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Akıllı Arama',
    description: 'AI destekli öneriler ve gelişmiş filtreleme ile hayalinizdeki evi kolayca bulun.',
    color: 'primary'
  },
  {
    icon: Shield,
    title: 'Güvenli İşlemler',
    description: 'SSL şifreleme ve güvenli ödeme sistemleri ile güvenle alım-satım yapın.',
    color: 'success'
  },
  {
    icon: TrendingUp,
    title: 'DeğerTahmin AI',
    description: 'Yapay zeka destekli değerleme sistemi ile mülkünüzün gerçek değerini öğrenin.',
    color: 'accent'
  },
  {
    icon: Users,
    title: 'Uzman Desteği',
    description: 'Deneyimli emlak danışmanları ile profesyonel destek alın.',
    color: 'primary'
  },
  {
    icon: MapPin,
    title: 'Konum Analizi',
    description: 'Detaylı harita entegrasyonu ve çevre analizi ile en uygun lokasyonu seçin.',
    color: 'success',
    link: '/harita'
  },
  {
    icon: Smartphone,
    title: 'Dijital Sözleşme',
    description: 'E-imza ile hızlı ve güvenli sözleşme imzalayın.',
    color: 'accent'
  },
  {
    icon: Smartphone,
    title: 'Mobil Uyumlu',
    description: 'Tüm cihazlarda mükemmel deneyim için optimize edilmiş tasarım.',
    color: 'primary'
  },
  {
    icon: Smartphone,
    title: '7/24 Destek',
    description: 'Her zaman yanınızda olan müşteri hizmetleri ekibi.',
    color: 'success'
  }
]

export function FeaturesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Neden EmlakOS Türkiye?
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Platformumuz, modern teknoloji ve kullanıcı deneyimini bir araya getirerek
            gayrimenkul süreçlerinizi kolaylaştırır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className={`
                  w-16 h-16 mx-auto rounded-2xl flex items-center justify-center
                  bg-${feature.color}-100 text-${feature.color}-600
                  group-hover:bg-${feature.color}-200 transition-colors duration-200
                `}>
                  <feature.icon className="w-8 h-8" />
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                {feature.link ? (
                  <Link href={feature.link} className="hover:underline">
                    {feature.title}
                  </Link>
                ) : (
                  feature.title
                )}
              </h3>

              <p className="text-secondary-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
