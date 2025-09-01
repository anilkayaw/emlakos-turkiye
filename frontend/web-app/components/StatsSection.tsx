
'use client'

// import { motion } from 'framer-motion'
import { Users, Home, TrendingUp, Award } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: '25,000+',
    label: 'Mutlu Müşteri',
    description: 'Platformumuzu tercih eden kullanıcı sayısı'
  },
  {
    icon: Home,
    number: '50,000+',
    label: 'Aktif İlan',
    description: 'Şu anda yayında olan gayrimenkul ilanı'
  },
  {
    icon: TrendingUp,
    number: '95%',
    label: 'Başarı Oranı',
    description: 'Müşteri memnuniyet oranı'
  },
  {
    icon: Award,
    number: '5+',
    label: 'Yıllık Deneyim',
    description: 'Sektörde hizmet verdiğimiz süre'
  }
]

export function StatsSection() {
  return (
    <section className="section-padding bg-gradient-primary text-white">
      <div className="container-max">
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            EmlakOS Türkiye'de Sayılarla Başarı
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Platformumuzun gücünü ve güvenilirliğini kanıtlayan istatistikler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <stat.icon className="w-10 h-10 text-accent-300" />
                </div>
              </div>

              <div className="mb-4">
                <div className="text-4xl md:text-5xl font-bold text-accent-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-2">
                  {stat.label}
                </div>
                <div className="text-primary-200 text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Achievement */}
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">
              🏆 Türkiye'nin En İyi Gayrimenkul Platformu
            </h3>
            <p className="text-lg text-primary-100 mb-6">
              2023 yılında sektör uzmanları tarafından "En İyi Kullanıcı Deneyimi" 
              kategorisinde ödüle layık görüldük.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-medium">
                En İyi UX/UI Tasarım
              </span>
              <span className="px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-medium">
                Mobil Uygulama Ödülü
              </span>
              <span className="px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-medium">
                Müşteri Memnuniyeti
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
