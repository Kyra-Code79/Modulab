"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
// Tambahkan icon Check untuk feedback saat copy link
import { ShoppingCart, ChevronLeft, Minus, Plus, Share2, Check } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  // State untuk feedback tombol share
  const [isCopied, setIsCopied] = useState(false)

  const product = products.find((p) => p.id === (params.id as string))

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
          <button 
            onClick={() => router.push('/products')}
            className="text-amber-400 hover:text-amber-300 underline"
          >
            Kembali ke Produk
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    // Opsional: Bisa diganti dengan toast notification yang lebih bagus nanti
    alert(`${product.name} berhasil ditambahkan ke keranjang!`)
  }

  // Fungsi untuk menangani Share button
  const handleShare = async () => {
    // Coba gunakan native Web Share API (biasanya di mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Cek produk ${product.name} ini di Modulab!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share dibatalkan atau error:', err)
      }
    } else {
      // Fallback: Copy URL ke clipboard (biasanya desktop)
      try {
        await navigator.clipboard.writeText(window.location.href)
        setIsCopied(true)
        // Kembalikan icon share setelah 2 detik
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Gagal menyalin link:', err)
        alert('Gagal menyalin link. Silakan copy URL secara manual.')
      }
    }
  }

  const incrementQty = () => setQuantity((prev) => prev + 1)
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <Header />

      {/* Padding disesuaikan untuk mobile (py-6) dan desktop (md:py-8) */}
      <main className="flex-1 py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-sm text-amber-50/60 hover:text-amber-400 mb-6 md:mb-8 transition"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Kembali
          </button>

          {/* Grid gap disesuaikan untuk mobile (gap-8) dan desktop (md:gap-12) */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
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
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-amber-900/30 text-amber-400 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
                  {product.category}
                </span>
                {/* Ukuran font judul disesuaikan di mobile */}
                <h1 className="font-serif text-2xl md:text-4xl font-bold text-amber-50 mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-amber-400">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div className="prose prose-invert prose-amber mb-8 text-amber-50/80 text-sm md:text-base leading-relaxed">
                <p>{product.description}</p>
                <p className="hidden md:block">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam.
                </p>
              </div>

              {/* Action Area - Layout Diperbaiki untuk Mobile */}
              <div className="mt-auto bg-slate-900/50 p-4 md:p-6 rounded-xl border border-amber-900/20">
                {/* Layout Mobile: Flex Column (Quantity di atas, Tombol di bawah)
                  Layout Desktop (sm ke atas): Flex Row (Sejajar)
                */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  
                  {/* Quantity Selector - Full width di mobile */}
                  <div className="flex items-center justify-between bg-slate-800 rounded-lg border border-amber-900/30 p-1 w-full sm:w-auto">
                    <button 
                      onClick={decrementQty}
                      className="p-3 hover:text-amber-400 transition disabled:opacity-50"
                      disabled={quantity <= 1}
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

                  {/* Container Tombol Aksi - Row di mobile dan desktop */}
                  <div className="flex gap-3 w-full sm:w-auto flex-1">
                    {/* Add to Cart Button - Flex-1 agar mengisi ruang */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 px-4 md:px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 text-sm md:text-base"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="whitespace-nowrap">Tambah Keranjang</span>
                    </button>

                     {/* Share Button yang Berfungsi */}
                    <button 
                      onClick={handleShare}
                      className="relative p-3 md:px-4 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50/60 hover:text-amber-400 transition flex items-center justify-center group"
                      aria-label="Share Product"
                    >
                      {isCopied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Share2 className="w-5 h-5" />
                      )}
                      
                      {/* Tooltip sederhana saat di-hover di desktop */}
                      <span className="absolute bottom-full mb-2 hidden group-hover:md:block px-2 py-1 text-xs text-slate-950 bg-amber-400 rounded whitespace-nowrap">
                        {isCopied ? "Tersalin!" : "Bagikan"}
                      </span>
                    </button>
                  </div>
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