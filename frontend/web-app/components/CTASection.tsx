'use client'

import Link from 'next/link'
// import { motion } from 'framer-motion'
import { ArrowRight, Download, Smartphone } from 'lucide-react'

export function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-secondary-900 to-secondary-800 text-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hayalinizdeki Evi Bulmaya Hazır mısınız?
            </h2>
            
            <p className="text-lg text-secondary-300 mb-8 leading-relaxed">
              EmlakOS Türkiye ile ev arama sürecinizi kolaylaştırın. 
              Binlerce ilan arasından size en uygun olanı bulun, 
              güvenle alım-satım yapın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/ilanlar"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group"
              >
                Hemen Başla
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/kayit"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-secondary-900 transition-colors duration-200"
              >
                Ücretsiz Kayıt Ol
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-secondary-300">
                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                SSL Güvenli
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-300">
                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                KVKK Uyumlu
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-300">
                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                7/24 Destek
              </div>
            </div>
          </div>

          {/* Mobile App CTA */}
          <div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-6xl mb-6">📱</div>
              
              <h3 className="text-2xl font-bold mb-4">
                Mobil Uygulamamızı İndirin
              </h3>
              
              <p className="text-secondary-300 mb-6">
                EmlakOS Türkiye'yi her yerden kullanın. 
                iOS ve Android uygulamalarımız ile ev arama sürecinizi 
                mobilde de sürdürün.
              </p>

              <div className="space-y-4">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-3 w-full bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  App Store'dan İndir
                </Link>
                
                <Link
                  href="#"
                  className="flex items-center justify-center gap-3 w-full bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  Google Play'den İndir
                </Link>
              </div>

              <div className="mt-6 text-sm text-secondary-400">
                <p>QR kod ile hızlı erişim</p>
                <div className="w-24 h-24 mx-auto mt-2 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-2xl">📱</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Emlak Danışmanı mısınız?
            </h3>
            <p className="text-lg text-white/90 mb-6">
              Platformumuzda ilan yayınlayın, daha fazla müşteriye ulaşın.
            </p>
            <Link
              href="/danisman-kayit"
              className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
            >
              Danışman Olarak Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
