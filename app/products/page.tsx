"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="border-b border-amber-900/20 py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="font-serif text-3xl font-bold mb-2">Produk</h1>
            <p className="text-amber-50/60">Jelajahi koleksi lengkap komponen elektronik kami</p>
          </div>
        </div>

        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl grid md:grid-cols-4 gap-8">
            {/* Sidebar - Filter */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold text-amber-50 mb-4">Kategori</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === null
                          ? "bg-amber-900/30 text-amber-200"
                          : "text-amber-50/60 hover:text-amber-50"
                      }`}
                    >
                      Semua Kategori
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedCategory === category
                            ? "bg-amber-900/30 text-amber-200"
                            : "text-amber-50/60 hover:text-amber-50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-amber-900/20 pt-6">
                  <h3 className="font-semibold text-amber-50 mb-4">Harga</h3>
                  <div className="space-y-2 text-sm text-amber-50/60">
                    <p>Harga: Rp. 10000 - Rp. 400000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
