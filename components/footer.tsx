"use client"

import { MapPin, Instagram, MessageCircle } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="border-t border-amber-900/20 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-lg font-semibold text-amber-50 mb-4">Modulab</h3>
            <p className="text-amber-50/60 text-sm">Jl. Kebebasan Jaya No.01</p>
            <p className="text-amber-50/60 text-sm">Kota Medan, Sumatera Utara</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-50 mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-amber-50/60">
              <li>
                <a
                  href="https://shopee.co.id/modulab_indonesia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-amber-200 transition-colors text-sm"
                >
                  <img
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogospng.org%2Fdownload%2Fshopee%2Flogo-shopee-1024.png&f=1&nofb=1&ipt=47d854134a2e88985965bd614af9ce0004bb32916066910225c986154ed41c95"
                    alt="Shopee"
                    className="w-5 h-5 object-contain"
                  />
                  <span>Shopee | Modulab</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-50 mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-amber-50/60">
              <li>Email: info@modulab.com</li>
              <li>Telepon: +62 XXX XXX</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-50 mb-4">Lokasi Kami</h4>

            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-amber-900/30">
              <iframe
                title="Lokasi Politeknik Negeri Medan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.013511310821!2d98.65306037574644!3d3.562993496431332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d6e3d2b367%3A0xc5edba7e577329d2!2sPoliteknik%20Negeri%20Medan!5e0!3m2!1sid!2sid!4v1730971200000!5m2!1sid!2sid"
                width="400"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>

              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-200" />
                <span className="text-amber-50 text-sm">Politeknik Negeri Medan</span>
              </div>
            </div>
          </div>        
        </div>
        <div className="border-t border-amber-900/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-amber-50/60">&copy; 2025 Modulab. Semua hak dilindungi.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="https://www.instagram.com/habibisiregar79/" className="text-amber-50/60 hover:text-amber-200 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-amber-50/60 hover:text-amber-200 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
