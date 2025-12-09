import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export default function Home() {
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-amber-900/20">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-block">
              <div className="h-32 w-32 rounded-2xl flex items-center justify-center mx-auto">
                <img
                  src="/logo.png"
                  alt="Modulab"
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 text-balance">Modulab</h1>
            <p className="text-amber-50/70 text-lg max-w-2xl mx-auto mb-8">Inovasi, Koneksi, Masa Depan</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold px-8 py-3 rounded-lg transition"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/20">
          <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">About Us</h2>
              <p className="text-amber-50/70 leading-relaxed">
                Modulab adalah destinasi terpercaya untuk komponen elektronik berkualitas tinggi dan kit pengembangan
                terukur. Kami menyediakan produk terbaik untuk maker, engineer, dan enthusiast yang ingin mewujudkan
                ide-ide inovatif mereka menjadi kenyataan.
              </p>
            </div>
            <div className="h-64 rounded-xl bg-gradient-to-br from-amber-900/20 to-slate-800 flex items-center justify-center">
              <img
                src="/electronics-sensors-kit.jpg"
                alt="Modulab"
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section  className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-3xl font-bold mb-2 text-center">Produk Unggulan Kami</h2>
            <p className="text-amber-50/60 text-center mb-12">Koleksi produk terpilih dengan kualitas terbaik</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-block text-amber-400 hover:text-amber-200 font-semibold transition"
              >
                Lihat Semua Produk →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
