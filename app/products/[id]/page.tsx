"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products" // Pastikan path ini benar sesuai lokasi data produk Anda
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, ChevronLeft, Minus, Plus, Share2 } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  // Mencari produk berdasarkan ID dari URL
  const product = products.find((p) => p.id === (params.id as string))

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
          <Link 
            href="/products" 
            className="text-amber-400 hover:text-amber-300 underline"
          >
            Kembali ke Produk
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    // Opsional: Tampilkan notifikasi atau feedback
    alert("Produk berhasil ditambahkan ke keranjang!")
  }

  const incrementQty = () => setQuantity((prev) => prev + 1)
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb / Back Button */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-amber-50/60 hover:text-amber-400 mb-8 transition"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Kembali
          </button>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-amber-900/20 shadow-xl relative group">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-amber-900/30 text-amber-400 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
                  {product.category}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-amber-50 mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-amber-400">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div className="prose prose-invert prose-amber mb-8 text-amber-50/80">
                <p>{product.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              {/* Action Area */}
              <div className="mt-auto bg-slate-900/50 p-6 rounded-xl border border-amber-900/20">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-slate-800 rounded-lg border border-amber-900/30 p-1 w-full sm:w-auto">
                    <button 
                      onClick={decrementQty}
                      className="p-3 hover:text-amber-400 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-amber-50 w-12 text-center">{quantity}</span>
                    <button 
                      onClick={incrementQty}
                      className="p-3 hover:text-amber-400 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Tambah ke Keranjang
                  </button>

                   <button className="p-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50/60 hover:text-amber-400 transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}